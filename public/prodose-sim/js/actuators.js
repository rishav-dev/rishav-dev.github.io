/* Prodose, force-limited dynamic actuators.
 *
 * Units are SI-consistent for the engine's (mm, ms, g) system:  1 g·mm/ms² = 1 N,  1 g·mm²/ms² = 1 mJ (N·mm).
 * An actuator is a real dynamic Matter body with mass / inertia. A PD controller with feed-forward drives it along its
 * reference trajectory but the force (or torque) is clamped to the motor's rating, so a pill trapped in the mechanism
 * physically stalls the motor: the load, the squeeze force on the pill and the stall time all come out of the dynamics.
 *
 *   SlideActuator   prismatic joint (rail along `dir`), Fmax in N
 *   RotorActuator   revolute joint (pin at `pivot`), Tmax in N·mm
 */
(function (G) {
  const P = (G.Prodose = G.Prodose || {});
  const Matter = G.Matter || require('matter-js');
  const { Body, Constraint, Composite } = Matter;
  const { clamp } = P;
  const GSCALE = P.G_MM_MS2;            // engine gravity, mm/ms²

  // Non-static building blocks for actuator bodies (static parts have infinite mass and cannot be re-massed).
  const { Bodies, Vertices } = Matter;
  P.dynRect = function (cx, cy, w, h, angle, label) {
    const b = Bodies.rectangle(cx, cy, w, h, { isStatic: false, angle: angle || 0, friction: 0.1, frictionStatic: 0.16, restitution: 0.05 });
    b.label = label || 'meter'; return b;
  };
  P.dynQuad = function (pts, label) {
    const cen = Vertices.centre(Vertices.create(pts.map((v) => ({ x: v.x, y: v.y })), null));
    const b = Bodies.fromVertices(cen.x, cen.y, [Vertices.clockwiseSort(pts.map((v) => ({ x: v.x, y: v.y })))], { isStatic: false, friction: 0.1, frictionStatic: 0.16, restitution: 0.05 });
    b.label = label || 'meter'; return b;
  };

  class Actuator {
    constructor(scene, parts, o) {
      this.scene = scene; o = o || {};
      this.mass = o.mass || 60;                       // g
      this.label = o.label || 'meter';
      this.Fmax = o.Fmax || 8;                        // N   (slide)   |   N·mm (rotor)
      this.zeta = o.zeta || 0.9; this.wn = o.wn || 0.4;    // closed-loop bandwidth (rad/ms) and damping ratio
      this.body = Body.create({ parts, isStatic: false, friction: 0.1, frictionStatic: 0.16, restitution: 0.05, frictionAir: 0 });
      this.body.label = this.label;
      Body.setMass(this.body, this.mass);
      if (o.inertia) Body.setInertia(this.body, o.inertia);
      this.c0 = { x: this.body.position.x, y: this.body.position.y };   // centroid in the authoring frame
      this.body.plugin.actuator = this;
      // Applied force == reported force. The drive is a PD servo with feed-forward, as stiff as the explicit 2 ms integrator
      // allows (wn*dt ~ 0.8); it saturates at the motor rating (current limit). Squeeze force on a pill = the applied force.
      this.lever = o.lever || 1;                      // mm: contact force (N) = torque (N·mm) / lever for rotors
      this.stallMs = 0; this.load = 0; this.peak = 0; this.stalled = false; this.energy = 0;
      this.cmdV = 0; this.F = 0;
      Composite.add(scene.world, this.body);
      scene.actuators = scene.actuators || []; scene.actuators.push(this);
    }
    forceN() { return this.load / this.lever; }        // squeeze force a pill would see at the contact (N)
    gcancel() { Body.applyForce(this.body, this.body.position, { x: 0, y: -this.mass * GSCALE }); }   // rails carry the weight
    // servo bookkeeping shared by both actuator types; F = applied force/torque, cmd = commanded speed
    watch(dt, F, cmd) {
      this.load = Math.abs(F);
      this.peak = Math.max(this.peak, this.load);
      const moving = Math.abs(cmd) > this.minCmd;
      if (moving && this.load > 0.9 * this.Fmax) this.stallMs += dt; else this.stallMs = Math.max(0, this.stallMs - 2 * dt);
      this.stalled = this.stallMs > (this.stallLimit || 30);
    }
    // re-home the reference after a stall / reversal so the lag does not wind up
    rehome() { this.stallMs = 0; this.stalled = false; }
  }

  // ---------------------------------------------------------------------------------------------------
  class SlideActuator extends Actuator {
    constructor(scene, parts, o) {
      super(scene, parts, o);
      this.dir = o.dir || { x: 1, y: 0 };
      this.nrm = { x: -this.dir.y, y: this.dir.x };
      this.origin = o.origin || { x: 0, y: 0 };        // authoring origin (world) at s = 0
      this.minCmd = o.minCmd || 20;                    // mm/s below which we don't call a stall
      this.stallLimit = o.stallLimit || 30;
      this.s0 = this.c0.x * this.dir.x + this.c0.y * this.dir.y;
      this.n0 = this.c0.x * this.nrm.x + this.c0.y * this.nrm.y;
      this.ref = 0; this.err = 0;
    }
    get s() { return this.body.position.x * this.dir.x + this.body.position.y * this.dir.y - this.s0; }   // displacement (mm)
    get v() { return (this.body.velocity.x * this.dir.x + this.body.velocity.y * this.dir.y) / 16.6667; } // mm/ms
    // drive towards s_ref with velocity / acceleration feed-forward (mm, mm/ms, mm/ms²)
    drive(dt, sRef, vRef, aRef) {
      const b = this.body, M = this.mass, wn = this.wn, kp = M * wn * wn, kd = 2 * this.zeta * M * wn;
      const s = this.s, v = this.v;
      let F = M * (aRef || 0) + kp * (sRef - s) + kd * (vRef - v);
      const raw = F; F = clamp(F, -this.Fmax, this.Fmax);
      // lateral + rotation lock (stiff, high-limit PD): the rail
      const n = b.position.x * this.nrm.x + b.position.y * this.nrm.y - this.n0;
      const vn = (b.velocity.x * this.nrm.x + b.velocity.y * this.nrm.y) / 16.6667;
      const kl = M * 0.9 * 0.9 * 0.02, cl = 2 * M * 0.9 * 0.14;
      const Fn = clamp(-M * 0.03 * n - M * 0.25 * vn, -60, 60);
      Body.applyForce(b, b.position, { x: F * this.dir.x + Fn * this.nrm.x, y: F * this.dir.y + Fn * this.nrm.y });
      this.gcancel();
      b.torque += clamp(-b.inertia * 0.0016 * (b.angle) - b.inertia * 0.04 * (b.angularVelocity / 16.6667), -400, 400);
      this.F = F; this.err = sRef - s;
      this.watch(dt, F, vRef * 1000);
      this.energy += Math.abs(F * v) * dt;            // mJ
    }
  }

  // ---------------------------------------------------------------------------------------------------
  class RotorActuator extends Actuator {
    constructor(scene, parts, o) {
      super(scene, parts, o);
      this.pivot = o.pivot || { x: 0, y: 0 };
      this.minCmd = o.minCmd || 0.26;                  // rad/s (~15 deg/s) below which we do not call a stall
      this.stallLimit = o.stallLimit || 40;
      // pin: body local point that must sit on the world pivot
      const pl = { x: this.pivot.x - this.c0.x, y: this.pivot.y - this.c0.y };
      this.pin = Constraint.create({ pointA: { x: this.pivot.x, y: this.pivot.y }, bodyB: this.body, pointB: pl, stiffness: 1, damping: 0.05, length: 0 });
      Composite.add(scene.world, this.pin);
      this.a0 = 0;
    }
    get angle() { return this.body.angle; }
    get w() { return this.body.angularVelocity / 16.6667; }   // rad/ms
    drive(dt, aRef, wRef, alphaRef) {
      const b = this.body, I = b.inertia, wn = this.wn, kp = I * wn * wn, kd = 2 * this.zeta * I * wn;
      let T = I * (alphaRef || 0) + kp * (aRef - b.angle) + kd * (wRef - this.w);
      const raw = T; T = clamp(T, -this.Fmax, this.Fmax);
      b.torque += T;
      this.F = T; this.err = aRef - b.angle;
      this.watch(dt, T, wRef * 1000);
      this.energy += Math.abs(T * this.w) * dt;
    }
  }

  P.SlideActuator = SlideActuator; P.RotorActuator = RotorActuator;
})(typeof window !== 'undefined' ? window : globalThis);
