/* Prodose, additional singulation concepts.
 *
 *   InvertedBase    shared machinery for every top-mounted (inverted bottle) concept: funnel, sealed adapter cap + dock,
 *                   hopper agitator, exit chute / ramp / collection tray, break-beam sensors, load cell, job bookkeeping
 *   ShuttleDesign   C · reciprocating slide with a continuously adjustable metering pocket
 *   LaneDesign      D · gravity-fed single-file lane + clamp-pad escapement + trapdoor chamber
 *   BeltDesign      E · closed-loop speed-up belts + optical counting (no mechanical metering)
 *   VacDiscDesign   F · vacuum metering disc (seed-meter style) with knock-off singulator and pressure feedback
 *
 * Every class follows the same interface as WheelDesign / ArmDesign in physics.js, so the Scene, renderer, bench and UI
 * treat all concepts identically. Units: mm, ms, y axis down. */
(function (G) {
  const P = (G.Prodose = G.Prodose || {});
  const Matter = G.Matter || require('matter-js');
  const { Bodies, Body, Composite, Vertices } = Matter;
  const { clamp, rot, ease, wrap2pi } = P;
  const { Rig, rectPart, wallSeg, quadPart, CAT } = P.internal;
  const DEG = Math.PI / 180;

  // Length (in x) of the chord a convex body cuts from the horizontal line y = yy, clipped to [x0,x1].
  function chordAt(body, yy, x0, x1) {
    const v = body.vertices; let lo = Infinity, hi = -Infinity;
    for (let i = 0; i < v.length; i++) {
      const a = v[i], b = v[(i + 1) % v.length];
      if ((a.y - yy) * (b.y - yy) > 0) continue;
      if (a.y === b.y) { lo = Math.min(lo, a.x, b.x); hi = Math.max(hi, a.x, b.x); continue; }
      const x = a.x + ((yy - a.y) * (b.x - a.x)) / (b.y - a.y);
      lo = Math.min(lo, x); hi = Math.max(hi, x);
    }
    if (hi < lo) return 0;
    return Math.max(0, Math.min(hi, x1) - Math.max(lo, x0));
  }
  P.chordAt = chordAt;

  // Shared by every design: 1 kHz-ish break-beam chords (two beams), tray load cell with impact ringing, vacuum signal.
  P.sampleSignals = function (dtMs) {
      const s = this.scene, bm = this.beam, sc = s.scope, w = bm.x1 - bm.x0;
      let c1 = 0, c2 = 0, mass = 0;
      for (const b of s.pills) {
        const info = b.plugin.pill;
        if (info.zone === 'tray') { mass += info.mass; if (!info.landed) { info.landed = true; this.landings.push({ t: s.t, a: info.mass * (0.35 + Math.min(1.2, Math.hypot(b.velocity.x, b.velocity.y) * 60 / 2500)) }); } }
        if (info.held) continue;
        const bb = b.bounds;
        if (bb.max.x < bm.x0 || bb.min.x > bm.x1) continue;
        if (bb.min.y <= bm.y && bb.max.y >= bm.y) c1 += chordAt(b, bm.y, bm.x0, bm.x1);
        if (bb.min.y <= bm.y2 && bb.max.y >= bm.y2) c2 += chordAt(b, bm.y2, bm.x0, bm.x1);
      }
      // load cell: static mass + damped ringing after each landing + electronic noise
      let ring = 0;
      for (let i = this.landings.length - 1; i >= 0; i--) {
        const dtl = (s.t - this.landings[i].t) / 1000;
        if (dtl > 0.5) { this.landings.splice(i, 1); continue; }
        ring += this.landings[i].a * Math.exp(-dtl / 0.05) * Math.cos(2 * Math.PI * 28 * dtl);
      }
      const noise = (s.rand() + s.rand() + s.rand() - 1.5) * 2 * 12;      // 12 mg rms electronic noise
      sc.t.push(s.t); sc.b1.push(Math.min(1, c1 / w)); sc.b2.push(Math.min(1, c2 / w)); sc.m.push(mass + ring + noise); sc.v.push(this.vacSig || 0);
      if (sc.t.length > 4200) { for (const k of ['t', 'b1', 'b2', 'm', 'v']) sc[k].splice(0, 1200); }
  };

  // =====================================================================================================
  //  Shared base for top-mounted concepts
  // =====================================================================================================
  class InvertedBase {
    constructor(scene) {
      this.scene = scene; this.kind = 'inverted';
      this.statics = []; this.zones = [];
      this.state = 'idle'; this.busy = false;
      this.remaining = 0; this.job = 0; this.consec = 0; this.jamRetries = 0; this.tState = 0;
      this.shutterOpen = false; this.shutterAnim = 0; this.agit = 0; this.agitT = 0;
      this.sensorBlocked = false; this.sensorCount = 0; this.clearFor = 0; this.dropStartCount = 0;
      this.jamFlash = 0; this.tray = null;
      this.mSig = 0; this.landings = []; this.dockDuration = 3600;
    }

    addStatic(b, label) { if (label) b.label = label; this.statics.push(b); Composite.add(this.scene.world, b); return b; }

    // ---- feed: bottle neck -> V funnel -> outlet corners `left` / `right` (world points of the lowest inner wall ends) ----
    initFeed(o) {
      const s = this.scene, g = s.geo, tk = 6, wn = g.wn;
      this.wn = wn; this.tk = tk;
      const L = o.left, R = o.right;
      const runL = Math.abs(-wn - L.x), runR = Math.abs(wn - R.x);
      const fh = Math.max(6, Math.max(runL, runR) / Math.tan((o.angle || 14) * DEG));
      const yMin = Math.min(L.y, R.y);
      this.yFt = yMin - fh; this.roofY = this.yFt - 16;
      this.cap = s.sealedCap && g.hc > 0;
      const parts = [];
      const lp = [{ x: -wn, y: this.roofY }, { x: -wn, y: this.yFt }, { x: L.x, y: L.y }];
      const rp = [{ x: wn, y: this.roofY }, { x: wn, y: this.yFt }, { x: R.x, y: R.y }];
      for (let i = 0; i < 2; i++) {
        let a = rp[i], b = rp[i + 1], dx = b.x - a.x, dy = b.y - a.y, l = Math.hypot(dx, dy);
        if (l > 1e-6) { const w = wallSeg(a, b, tk, dy / l, -dx / l, 'housing', 3); if (w) parts.push(w); }
        a = lp[i]; b = lp[i + 1]; dx = b.x - a.x; dy = b.y - a.y; l = Math.hypot(dx, dy);
        if (l > 1e-6) { const w = wallSeg(a, b, tk, -dy / l, dx / l, 'housing', 3); if (w) parts.push(w); }
      }
      this.funnelL = lp; this.funnelR = rp;
      this.hopper = new Rig(parts, { label: 'housing' }); this.hopper.place(0, 0, 0);
      Composite.add(s.world, this.hopper.body);
      // machine roof with the feed opening
      const roofL = -(1.6 * g.D + 80), roofR = g.D / 2 + 46;
      this.addStatic(rectPart((roofL + (-wn - 5)) / 2, this.roofY + 4, (-wn - 5) - roofL, 8, 0, 'roof'));
      this.addStatic(rectPart(((wn + 5) + roofR) / 2, this.roofY + 4, roofR - (wn + 5), 8, 0, 'roof'));
      this.roofL = roofL; this.roofR = roofR;
      // bottle station (upright, on the roof) and dock pose (inverted over the inlet)
      const hw = Math.max(Math.abs(L.x), Math.abs(R.x), wn);
      this.stationPose = { x: Math.min(-(g.D * 0.5 + hw + 60), -(g.D / 2 + 30)), y: this.roofY - g.H, a: 0 };
      this.dockPose = { x: 0, y: this.roofY - g.hc, a: Math.PI };
      if (this.cap) {
        this.shutter = new Rig([rectPart(0, -g.hc + 2, wn * 2 + 4, 3, 0, 'shutter')], { label: 'shutter' });
        Composite.add(s.world, this.shutter.body);
      }
      this.vibe = s.params.vibe !== false;
    }

    // ---- exit: guard wall, sloped ramp (33 deg) and open tray; beam sensors just under the metering exit ----
    buildOutput(o) {
      const s = this.scene, tk = 6, ex = o.ex, ey = o.ey, half = o.half;
      const yBeam = ey + 9;
      this.beam = { y: yBeam, y2: yBeam + 7, x0: ex - half, x1: ex + half + 45 };   // the light barrier spans the whole chute width
      this.exit = { x: ex, y: ey, half };
      const rampX0 = ex - half - 10, rampY0 = yBeam + 30, ang = 33 * DEG, run = 118;
      const rampX1 = rampX0 + run, rampY1 = rampY0 + Math.tan(ang) * run;
      this.ramp = { x0: rampX0, y0: rampY0, x1: rampX1, y1: rampY1 };
      const rn = { x: -Math.sin(ang), y: -Math.cos(ang) };
      this.addStatic(wallSeg({ x: rampX0, y: rampY0 }, { x: rampX1, y: rampY1 }, 6, -rn.x, -rn.y, 'ramp', 4));
      this.addStatic(rectPart(rampX0 - 3, (ey + rampY0) / 2 + 2, 6, rampY0 - ey + 12, 0, 'chute'));
      const xTl = rampX1 - 8, xTr = xTl + 116, yT = rampY1 + 34, wallH = 36;
      this.tray = { xl: xTl, xr: xTr, yFloor: yT, wall: wallH };
      this.addStatic(rectPart((xTl + xTr) / 2, yT + 4, xTr - xTl + 12, 8, 0, 'tray'));
      this.addStatic(rectPart(xTl - 3, yT - wallH / 2 + 2, 6, wallH + 4, 0, 'tray'));
      this.addStatic(rectPart(xTr + 3, yT - wallH / 2 + 2, 6, wallH + 4, 0, 'tray'));
      const floorY = yT + 120;
      const x0 = Math.min(this.roofL - 80, -400), x1 = Math.max(xTr + 200, 500);
      this.addStatic(rectPart((x0 + x1) / 2, floorY + 10, x1 - x0, 20, 0, 'table'));
      this.addStatic(rectPart(x0 - 10, 0, 20, 2200, 0, 'table'));
      this.addStatic(rectPart(x1 + 10, 0, 20, 2200, 0, 'table'));
      this.floorY = floorY;
      this.chuteX0 = rampX0 - 8;
    }

    bounds() {
      const g = this.scene.geo, t = this.tray;
      return { x0: this.stationPose.x - g.D / 2 - 40, y0: this.roofY - g.H - g.hc - 40, x1: t.xr + 60, y1: t.yFloor + 60 };
    }

    // Two moves, like a person would do it: turn the bottle upside-down where it stands, then carry it onto the inlet.
    bottlePoseAt(u) {
      const a = this.stationPose, b = this.dockPose, uf = 0.45;
      if (u < uf) return { x: a.x, y: a.y, a: Math.PI * ease(u / uf) };
      const e = ease((u - uf) / (1 - uf));
      return { x: a.x + (b.x - a.x) * e, y: a.y + (b.y - a.y) * e, a: Math.PI };
    }

    onDocked() {
      const s = this.scene;
      if (this.cap) { s.log('Bottle docked; airtight interface sealed. Opening shutter valve.', 'ok'); this.shutterOpen = true; }
      else s.log('Bottle docked (open, not airtight).', 'warn');
      s.status = 'Docked, feeding hopper';
      this.pendingStart && this.pendingStart();
    }

    startDispense(n) {
      const s = this.scene;
      if (!(this.state === 'idle' || this.state === 'done' || this.state === 'error')) return false;
      this.remaining = n; this.job = n; this.consec = 0; this.jamRetries = 0;
      s.stats.target = (s.stats.target || 0) + n; s.stats.jobStart = s.stats.dispensed; s.stats.elapsed = 0;
      this.busy = true;
      const go = () => { s.status = `Dispensing ${n}…`; s.log(`Dispense request: ${n} pill${n === 1 ? '' : 's'}.`, 'info'); this.beginJob(); };
      if (s.phase === 'station') { s.startDock(); this.pendingStart = () => { this.pendingStart = null; go(); }; }
      else if (s.phase === 'docking') this.pendingStart = () => { this.pendingStart = null; go(); };
      else go();
      return true;
    }
    beginJob() { this.state = 'fill'; this.tState = 0; }

    // ---- per-step shared control: hopper/bottle agitation + shutter valve ----
    controlBase(dt, boost) {
      const s = this.scene, sec = dt / 1000;
      this.agitT += sec;
      const on = this.vibe && this.busy && s.phase === 'docked' && this.state !== 'idle';
      this.agit = on ? (boost ? 1.3 : 0.9) * Math.sin(this.agitT * 2 * Math.PI * (boost ? 32 : 26)) : 0;
      this.hopper.place(this.agit, 0, 0, on);
      s.agitDx = this.agit;
      if (this.shutter) {
        this.shutterAnim = clamp(this.shutterAnim + (this.shutterOpen ? 1 : -1) * sec / 0.35, 0, 1);
        this.shutter.body.collisionFilter.mask = this.shutterAnim > 0.5 ? 0 : 0xffff;
        const b = s.bottle, off = this.shutterAnim * (s.geo.wn * 2 + 8);
        const w = b.toWorld({ x: off, y: 0 });
        this.shutter.place(w.x, w.y, b.a);
      }
      this.jamFlash = Math.max(0, this.jamFlash - dt);
    }

    hopperCount() { let n = 0; for (const b of this.scene.pills) if (b.plugin.pill.zone === 'machine') n++; return n; }

    // ---- bookkeeping shared by all metering concepts ----
    evalDrop(got, what) {
      const s = this.scene; s.stats.attempts++;
      let kind;
      if (got === 0) { kind = 'miss'; this.consec++; s.stats.misses++; s.log(`Empty ${what || 'pocket'} at the exit (miss #${this.consec}).`, 'warn'); }
      else {
        this.consec = 0; this.jamRetries = 0;
        if (got > 1) { kind = 'double'; s.stats.doubles++; s.log(`Double dispense! ${got} pills released together.`, 'bad'); }
        else { kind = 'ok'; s.log(`Pill ${s.stats.dispensed - (s.stats.jobStart || 0)}/${this.job} dispensed.`, 'ok'); }
        this.remaining -= got;
      }
      s.cycles.push({ t: s.t, got, kind });
      return kind;
    }
    jobDone() {
      const s = this.scene;
      if (this.remaining > 0) return false;
      this.state = 'done'; this.busy = false; s.status = 'Dose complete';
      s.log(`Dose complete: ${s.stats.dispensed - (s.stats.jobStart || 0)} of ${this.job} pills.`, 'ok');
      return true;
    }
    noteJam(retryLimit) {
      const s = this.scene;
      s.stats.jams++; this.jamRetries++; this.jamFlash = 900;
      s.log(`⚠ Actuator torque spike, pill pinched (${this.jamRetries}). Backing off and re-seating.`, 'bad');
      for (const b of s.pills) b.plugin.pill.pinchSteps = 0;
      if (this.jamRetries > (retryLimit || 14)) { this.fail('Persistent jam, mechanism cannot clear this pill. Stopped.'); return false; }
      return true;
    }
    fail(msg) { this.state = 'error'; this.busy = false; this.scene.status = 'Error, ' + msg; this.scene.log(msg, 'bad'); }

    // ---- sensing: ground-truth pill count at the beam, sampled waveforms and the tray load cell ----
    sense(dt) {
      const s = this.scene, bm = this.beam; if (!bm) return;
      let blocked = false;
      for (const b of s.pills) {
        const info = b.plugin.pill;
        if (info.held) continue;
        const x = b.position.x, y = b.position.y;
        if (x < bm.x0 - 6 || x > bm.x1 + 6) continue;
        const bb = b.bounds;
        if (bb.min.y <= bm.y && bb.max.y >= bm.y) blocked = true;
        if (!info.counted && y > bm.y && y < bm.y + 40 && x > bm.x0 && x < bm.x1) { info.counted = true; info.tCount = s.t; this.sensorCount++; s.stats.dispensed++; }
      }
      this.sensorBlocked = blocked;
      if (s.step_n % 2 === 0) this.sample(dt * 2);
    }
    sample(dtMs) { return P.sampleSignals.call(this, dtMs); }

    zoneOf(p) {
      const t = this.tray, x = p.x, y = p.y;
      if (x > t.xl && x < t.xr + 4 && y > t.yFloor - t.wall - 2 && y < t.yFloor + 6) return 'tray';
      for (const z of this.zones) if (x > z.x0 && x < z.x1 && y > z.y0 && y < z.y1) return 'machine';
      if (Math.abs(x) < Math.max(this.wn, 20) + 8 && y > this.roofY - 6 && y < this.yFt + 8) return 'machine';
      if (y >= this.exit.y - 4 && y < t.yFloor + 6 && x > this.chuteX0 && x < t.xr + 6) return 'chute';
      return 'spilled';
    }

    // bodies the generic renderer draws (moving rigs are drawn from their live vertices)
    drawBodies() { return this.statics; }
  }
  P.InvertedBase = InvertedBase;

  // funnel opening corners helper: outlet gap = pill-size dependent lip clearance
  function lipGap(sp, prm) {
    const auto = prm.scraper == null || prm.scraper === 'auto';
    return auto ? clamp(sp.W * 0.22 + 0.1, 0.95, 2.0) : clamp(+prm.scraper, 0.4, 3.5);
  }
  // height of a single-layer lane / channel: lets the pill lie flat, never lets two stack, never lets a long pill stand
  function laneHeight(sp) {
    let h = sp.W * 1.3 + 0.5;
    const hi = Math.min(2 * sp.W - 0.4, sp.L / sp.W > 1.4 ? sp.L - 0.6 : 1e9);
    return clamp(h, sp.W + 0.8, Math.max(sp.W + 0.9, hi));
  }
  P.laneHeight = laneHeight;


  // Spring-loaded silicone wiper lip: a chamfered blade that yields upward (up to `max` mm) when a pill is pinched
  // under it, then springs back. Kinematic model of a compliant element (the concept statement's "compliant" wiper).
  class Lip {
    constructor(scene, side, xEdge, yBottom, len, max, label) {
      this.scene = scene; this.side = side; this.max = max; this.lift = 0; this.target = 0; this.idle = 0;
      this.xEdge = xEdge; this.yBottom = yBottom; this.len = len;
      // chamfered blade, local origin at the wall's inner face: it runs outward under the funnel wall, only the
      // chamfered edge (leaning away from the pill, an obtuse corner) is exposed
      const s = side;                                   // +1: right wall, blade runs to +x; -1: mirror
      const pts = [{ x: 0, y: 0 }, { x: s * len, y: 0 }, { x: s * len, y: -3.2 }, { x: s * 2.4, y: -3.2 }];
      this.rig = new Rig([quadPart(pts, 'lip')], { label: 'lip' });
      Composite.add(scene.world, this.rig.body);
      this.update(0, false);
    }
    update(dt, pinching) {
      if (pinching) { this.target = this.max; this.idle = 0; }
      else { this.idle += dt; if (this.idle > 90) this.target = 0; }
      const rate = (this.target > this.lift ? 320 : 18) * dt / 1000;
      this.lift = this.target > this.lift ? Math.min(this.target, this.lift + rate) : Math.max(this.target, this.lift - rate);
      this.rig.place(this.xEdge, this.yBottom - this.lift, 0);
    }
  }
  P.Lip = Lip;

  // =====================================================================================================
  //  C · Shuttle slide with adjustable pocket
  // =====================================================================================================
  class ShuttleDesign extends InvertedBase {
    constructor(scene) {
      super(scene);
      const prm = scene.params, sp = scene.spec, g = scene.geo;
      this.gap = lipGap(sp, prm);
      // ---- metering pocket: length (in the slide direction), depth (slide-plate thickness), width (out of plane)
      this.autoPocket = prm.pocketAuto !== false;
      // Round pills interlock diagonally when two share a roomy pocket, so they get little lateral slack; long pills
      // lie flat and need slack to seat.
      const round = sp.L / sp.W < 1.3;
      const autoLen = round ? sp.L + 0.9 + 0.02 * sp.L : Math.max(sp.L + 1.6, sp.L * 1.06 + 0.8);
      const autoDepth = clamp(Math.min(sp.W + (round ? 1.4 : 1.8), 2 * sp.W - 0.4), 3, 26);
      this.Lp = this.autoPocket ? autoLen : clamp(+prm.pocketLen || autoLen, 3, 40);
      this.dp = this.autoPocket ? autoDepth : clamp(+prm.pocketDepth || autoDepth, 2, 28);
      this.wpocket = sp.W + 1.6;                       // out-of-plane width (reported / checked, not visible in the slice)
      // height two pills occupy when stacked in the pocket (diagonal interlock for round pills), minus the pocket depth
      const slack0 = Math.max(0, Math.min(this.Lp - sp.L, sp.W * 0.95));
      this.stackH = round ? sp.W + Math.sqrt(Math.max(0, sp.W * sp.W - slack0 * slack0)) : 2 * sp.W;
      this.stackProtrusion = this.stackH - this.dp;
      this.compliant = prm.compliantLip !== false && sp.W >= 7;   // a yielding lip only helps pills thick enough to leave room to yield
      this.ow = this.Lp / 2 + (sp.L / sp.W < 1.3 ? 1.0 : 3.0);   // single-file opening for round pills, roomier for long ones
      this.stroke = Math.max(32, this.Lp + 16);
      this.speed = clamp((prm.shuttleSpeed || 260), 60, 600);
      const S = this.stroke, ow = this.ow, Lp = this.Lp, dp = this.dp, gap = this.gap;
      // funnel walls stop 3 mm above the wiper lips so the lips have room to yield
      // yield travel is capped so a pill stacked on the seated one (protruding 2W - depth) can never squeeze under the lip
      const lipMax = this.compliant ? Math.max(0, Math.min(clamp(sp.W * 0.3, 0.8, 2.0), this.stackProtrusion - 0.15 * sp.W - gap - 0.3)) : 0, wy = -gap - (this.compliant ? 3.2 : 0);
      this.initFeed({ left: { x: -ow, y: wy }, right: { x: ow, y: wy } });
      if (this.compliant) {
        this.lipR = new Lip(scene, +1, ow, -gap, 8, lipMax, 'lipR');
        this.lipL = new Lip(scene, -1, -ow, -gap, 8, lipMax, 'lipL');
      }
      // ---- slide plate: two blocks either side of the pocket, one kinematic rig
      const Lh = Lp + 1.6; this.Lh = Lh;
      const xl = -(ow + S + 30), xr = S + Lh / 2 + 30;
      this.plateX = { xl, xr };
      const left = P.dynRect((xl - Lp / 2) / 2, dp / 2, -Lp / 2 - xl, dp, 0, 'meter');
      const right = P.dynRect((Lp / 2 + xr) / 2, dp / 2, xr - Lp / 2, dp, 0, 'meter');
      // moving mass is limited to a few grams: the position-based contact solver is only well conditioned up to ~10:1
      // mass ratios against a 0.5 g pill. The servo's force limit is what bounds the squeeze force.
      this.motorF = clamp(prm.motorF || 0.25 * P.pillCrushN(sp), 1.5, 80);   // current limit: 25 % of the pill's crush strength unless set
      this.act = new P.SlideActuator(scene, [left, right], { mass: 4, Fmax: this.motorF, dir: { x: 1, y: 0 }, label: 'meter' });
      this.plate = { body: this.act.body };
      // ---- fixed base plate with the exit hole (pocket floor while the pocket is under the hopper)
      const bx0 = xl - 12, bx1 = xr + S + 30;
      this.addStatic(rectPart((bx0 + S - Lh / 2) / 2, dp + 4, S - Lh / 2 - bx0, 8, 0, 'base'));
      this.addStatic(rectPart((S + Lh / 2 + bx1) / 2, dp + 4, bx1 - S - Lh / 2, 8, 0, 'base'));
      this.buildOutput({ ex: S, ey: dp + 8, half: Lh / 2 + 1 });
      this.zones.push({ x0: xl - 8, x1: bx1, y0: this.roofY - 4, y1: dp + 8 });
      this.pos = new P.Mover(0); this.slow = 0; this.jig = 0;
    }

    compat() {
      const sp = this.scene.spec, g = this.scene.geo, out = [];
      const passes = this.stackProtrusion <= this.gap + (this.lipR ? this.lipR.max : 0) + 0.2;
      const fit = this.Lp >= sp.L + 0.6 ? (this.Lp < 2 * sp.L - 0.5 && !passes ? 'good' : 'double') : 'tight';
      out.push({ k: 'Pocket (adjustable)', v: `${this.Lp.toFixed(1)} long × ${this.dp.toFixed(1)} deep × ${this.wpocket.toFixed(1)} wide mm${this.autoPocket ? ' · auto' : ' · manual'}`, ok: true });
      out.push({ k: 'Pocket fit', v: fit === 'good' ? `pill ${sp.L.toFixed(1)} × ${sp.W.toFixed(1)} mm, one pill; a stacked 2nd pill protrudes ${this.stackProtrusion.toFixed(1)} mm > lip` : fit === 'tight' ? 'pocket shorter than the pill, will not seat' : 'a stacked 2nd pill can slip under the lip, double-pick risk', ok: fit === 'good' });
      out.push({ k: 'Neck clearance', v: `${(g.mouth / Math.max(sp.W, 1)).toFixed(1)}× pill width`, ok: g.mouth / sp.W >= 1.5 });
      out.push({ k: 'Wiper lip', v: `${this.gap.toFixed(1)} mm gap · ${this.compliant ? 'compliant (yields 3 mm)' : 'rigid'}`, ok: this.gap > 0.55 && this.gap < Math.max(1.0, sp.W * 0.45) });
      out.push({ k: 'Drive', v: `${this.stroke.toFixed(0)} mm stroke at ${this.speed.toFixed(0)} mm/s · ${this.motorF.toFixed(0)} N current limit`, ok: true });
      return out;
    }

    control(dt) {
      const s = this.scene, act = this.act, sp = s.spec;
      this.controlBase(dt, this.state === 'unjam' || this.state === 'reseat');
      this.tState += dt;
      let jig = 0, jigV = 0;
      const vmax = this.speed * (this.slow > 0 ? 0.6 : 1), acc = 3600;
      const osc = (amp, f, ramp) => { const w = 2 * Math.PI * f / 1000, ph = this.tState * w; jig = amp * Math.sin(ph) * ramp; jigV = amp * w * Math.cos(ph) * ramp; };
      switch (this.state) {
        case 'fill': {
          if (this.vibe) osc(clamp(0.11 * sp.W, 0.3, 0.6), 22, 1);
          if (this.tState >= this.fillMs()) { this.state = 'stroke'; this.tState = 0; this.dropStartCount = this.sensorCount; }
          break;
        }
        case 'stroke': {
          this.pos.step(this.stroke, vmax, acc, dt);
          if (this.pos.arrived(this.stroke) && Math.abs(act.err) < 1.0) { this.state = 'release'; this.tState = 0; this.clearFor = 0; if (this.slow > 0) this.slow--; }
          break;
        }
        case 'release': {
          if (this.tState < 400) osc(0.7, 24, 1);
          const got = this.sensorCount - this.dropStartCount;
          this.clearFor = this.sensorBlocked ? 0 : this.clearFor + dt;
          if ((got > 0 && this.tState > 150 && this.clearFor > 130) || this.tState > 700) { this.evalDrop(got, 'pocket'); this.state = 'return'; this.tState = 0; this.lastGot = got; }
          break;
        }
        case 'return': {
          this.pos.step(0, vmax, acc, dt);
          if (this.pos.arrived(0) && Math.abs(act.err) < 1.0) {
            if (this.lastGot === 0 && s.stats.inBottle + this.hopperCount() === 0) { this.fail('Bottle is empty.'); break; }
            if (this.consec >= 10) { this.fail('No pill for 10 cycles, pocket too small for this pill, or pills bridged over the outlet.'); break; }
            if (!this.jobDone()) { this.state = 'fill'; this.tState = 0; }
          }
          break;
        }
        case 'unjam': {           // servo current limit tripped: back off to the fill position, then shake to re-seat
          this.pos.step(0, vmax * 0.7, acc, dt);
          if (this.pos.arrived(0) && Math.abs(act.err) < 1.0) { this.state = 'reseat'; this.tState = 0; }
          break;
        }
        case 'reseat': {
          const k = this.jamRetries;
          osc(0.8 + 0.3 * (k % 4), 18 + 3 * (k % 3), Math.min(1, this.tState / 150));
          if (this.tState >= 1000) { this.state = 'fill'; this.tState = 0; this.slow = 2; }
          break;
        }
        default: break;
      }
      const prev = this._prevRef == null ? this.pos.pos : this._prevRef, ref = this.pos.pos + jig;
      act.drive(dt, ref, this.pos.vel / 1000 + jigV, 0);
      this._prevRef = this.pos.pos;
      // compliant wiper lips yield while a pill is pinched under one (and the drive is working against it)
      let pinching = false;
      const lb = s.pinchAnyLabels || [];
      const lip = lb.includes('lipR') ? this.lipR : lb.includes('lipL') ? this.lipL : null;
      if (this.compliant && lip && act.load > 0.12 * act.Fmax && (this.state === 'stroke' || this.state === 'return' || this.state === 'fill')) { pinching = true; this.lipYield = (this.lipYield || 0) + 1; }
      if (this.compliant) { this.lipR.update(dt, pinching); this.lipL.update(dt, pinching); }
      // real stall: the motor is at its current limit and the plate is not following the reference
      if (act.stalled && (this.state === 'stroke' || this.state === 'return' || this.state === 'fill')) {
        if (this.noteJam()) { this.pos.pos = act.s; this.pos.vel = 0; act.rehome(); this.state = 'unjam'; this.tState = 0; }
      }
      s.pinchWheel = false;
    }
    fillMs() { return 850 + 250 * Math.min(this.consec, 5); }
    beginJob() { this.state = 'fill'; this.tState = 0; }

    drawBodies() { const b = [...this.statics, this.plate.body, this.hopper.body]; if (this.compliant) b.push(this.lipR.rig.body, this.lipL.rig.body); return b; }
  }


  // =====================================================================================================
  //  D · Gravity lane + clamp-pad escapement + trapdoor chamber
  // =====================================================================================================
  class LaneDesign extends InvertedBase {
    constructor(scene) {
      super(scene);
      const prm = scene.params, sp = scene.spec, g = scene.geo;
      const round = sp.L / sp.W < 1.3;
      this.beta = clamp((prm.laneAngle || 24), 8, 36) * DEG;
      this.h = laneHeight(sp);                                   // channel height (single layer, pill lies flat)
      this.Lc = (prm.chamberAuto === false && prm.chamberLen) ? clamp(+prm.chamberLen, 3, 40) : sp.L + 1.6;   // trapdoor chamber (adjustable)
      this.ol = round ? sp.L * 1.35 + 1.6 : sp.L + 6;            // opening along the lane under the funnel
      this.nq = 4;                                               // pills that queue in the lane
      this.uEnd = this.ol + Math.max(50, this.nq * (sp.L + 1));
      this.motorF = clamp(prm.motorF || 0.25 * P.pillCrushN(sp), 1.5, 60);
      const b = this.beta, ol = this.ol, h = this.h, Lc = this.Lc, uEnd = this.uEnd;
      const d = { x: Math.cos(b), y: Math.sin(b) }, n = { x: Math.sin(b), y: -Math.cos(b) };
      this.d = d; this.n = n;
      const O = { x: -(ol / 2) * d.x - (h / 2) * n.x, y: -(ol / 2) * d.y - (h / 2) * n.y };
      this.O = O;
      const W = (u, v) => ({ x: O.x + u * d.x + v * n.x, y: O.y + u * d.y + v * n.y });
      this.W = W;
      const lr = (u0, u1, v0, v1, label) => rectPart(O.x + ((u0 + u1) / 2) * d.x + ((v0 + v1) / 2) * n.x, O.y + ((u0 + u1) / 2) * d.y + ((v0 + v1) / 2) * n.y, u1 - u0, v1 - v0, b, label);
      // funnel: left wall lands on the floor, right wall's foot is the ceiling lip (h above the floor)
      const FL = W(0, 0), CR = W(ol, h);
      this.initFeed({ left: { x: FL.x, y: FL.y }, right: { x: CR.x, y: CR.y } });
      // lane floor (up to the chamber), ceiling, end wall
      const um = (-14 + uEnd - Lc) / 2;
      this.floorRig = new Rig([lr(-14, um + 0.5, -6, 0, 'lane'), lr(um - 0.5, uEnd - Lc, -6, 0, 'lane')], { label: 'lane' }); this.floorRig.place(0, 0, 0);
      Composite.add(scene.world, this.floorRig.body); this.floorAmp = 0;
      // clamp pad: a rubber-faced foot that presses the SECOND pill of the queue against the floor (like a pharmacy counter's
      // escapement). It never has to find the gap between two touching pills, and it clamps with a fraction of a newton.
      this.padW = clamp(1.0 * sp.L, 3, 16);
      const uP = uEnd - Lc - this.padW / 2 - 0.3; this.uP = uP;    // directly upstream of the chamber: clamps whichever pill is first in the queue
      this.addStatic(lr(ol - 3, uP - this.padW / 2 - 0.7, h, h + 6, 'lane'));
      this.addStatic(lr(uP + this.padW / 2 + 0.7, uEnd + 2, h, h + 6, 'lane'));
      this.addStatic(lr(uEnd, uEnd + 6, 0, h + 6, 'lane'));
      // trapdoor flap: rotor hinged at the downhill end of the chamber
      const Pf = W(uEnd, 0); this.Pf = Pf;                    // hinge under the end wall: the flap swings away from the pill
      const flap = P.dynRect(O.x + (uEnd - Lc / 2) * d.x - 2 * n.x, O.y + (uEnd - Lc / 2) * d.y - 2 * n.y, Lc, 4, b, 'gate');
      this.flap = new P.RotorActuator(scene, [flap], { mass: 1.2, Fmax: clamp(0.25 * P.pillCrushN(sp) * (Lc / 2), 12, 140), lever: Lc / 2, pivot: { x: Pf.x, y: Pf.y }, label: 'gate' });
      this.flapMv = new P.Mover(0); this.flapOpen = -84 * DEG;
      // pad drive: slide actuator down through the ceiling slot; it stops 0.3 mm into the pill, so the clamp force is just the servo stiffness
      const tip0 = h + 6.6, Hw = 5, vT = sp.W - 0.4;   // servo target 0.4 mm into the pill: F = k·err ≈ 0.1 N clamp
      const q = [W(uP - this.padW / 2, tip0), W(uP + this.padW / 2, tip0), W(uP + this.padW / 2, tip0 + Hw), W(uP - this.padW / 2, tip0 + Hw)];
      const padBody = P.dynQuad(q, 'meter'); padBody.friction = 0.8; padBody.frictionStatic = 1.0;
      this.wedge = new P.SlideActuator(scene, [padBody], { mass: 1.5, Fmax: this.motorF, dir: { x: -n.x, y: -n.y }, label: 'meter', minCmd: 15, stallLimit: 35 });
      this.wedgeT = tip0 - vT; this.wedgeMv = new P.Mover(0);
      // exit chute below the chamber
      const Ec = W(uEnd - Lc / 2, 0);
      this.buildOutput({ ex: Ec.x, ey: Ec.y + 12, half: Lc / 2 + 5 });
      this.zones.push({ x0: O.x - 12, x1: W(uEnd + 8, 0).x + 8, y0: this.roofY - 4, y1: Ec.y + 12 });
    }

    compat() {
      const sp = this.scene.spec, g = this.scene.geo, out = [];
      out.push({ k: 'Lane channel', v: `${this.h.toFixed(1)} mm high (pill ${sp.W.toFixed(1)} mm) at ${(this.beta / DEG).toFixed(0)}°, single layer, lies flat`, ok: this.h < 2 * sp.W && this.h >= sp.W + 0.5 });
      out.push({ k: 'Escapement chamber', v: `${this.Lc.toFixed(1)} mm (adjustable: flap length; clamp pad ${this.padW.toFixed(1)} mm wide)`, ok: this.Lc >= sp.L + 0.4 && this.Lc < 2 * sp.L });
      out.push({ k: 'Feed opening', v: `${this.ol.toFixed(1)} mm along the lane`, ok: true });
      out.push({ k: 'Neck clearance', v: `${(g.mouth / Math.max(sp.W, 1)).toFixed(1)}× pill width`, ok: g.mouth / sp.W >= 1.5 });
      out.push({ k: 'Clamp pad drive', v: `${this.motorF.toFixed(0)} N current limit, ${this.wedgeT.toFixed(0)} mm stroke, clamps the queue's first pill with ≈ 0.1 N (≪ crush strength)`, ok: true });
      return out;
    }

    control(dt) {
      const s = this.scene, W = this.wedge, F = this.flap;
      this.controlBase(dt, this.state === 'unjam');
      this.tState += dt;
      const vW = 260, aW = 5000, wF = 7, aF = 60;
      switch (this.state) {
        case 'fill': {          // queue settles against the end wall
          if (this.tState >= (this.consec ? 900 : 1200)) { this.state = 'separate'; this.tState = 0; }
          break;
        }
        case 'separate': {      // wedge drops between chamber pill and the queue
          this.wedgeMv.step(this.wedgeT, vW, aW, dt);
          if (this.wedgeMv.arrived(this.wedgeT) && Math.abs(W.err) < 1.4) { this.state = 'open'; this.tState = 0; this.clearFor = 0; this.dropStartCount = this.sensorCount; }
          break;
        }
        case 'open': {
          const open = this.tState > 60;
          this.flapMv.step(open ? this.flapOpen : 0, wF, aF, dt);
          const got = this.sensorCount - this.dropStartCount;
          this.clearFor = this.sensorBlocked ? 0 : this.clearFor + dt;
          if ((got > 0 && this.tState > 300 && this.clearFor > 140) || this.tState > 900) { this.evalDrop(got, 'chamber'); this.lastGot = got; this.state = 'close'; this.tState = 0; }
          break;
        }
        case 'close': {
          this.flapMv.step(0, wF, aF, dt);
          if (this.flapMv.arrived(0) && this.tState > 120) { this.state = 'raise'; this.tState = 0; }
          break;
        }
        case 'raise': {         // wedge lifts, the queue advances one pill by gravity
          this.wedgeMv.step(0, vW, aW, dt);
          if (this.wedgeMv.arrived(0) && Math.abs(W.err) < 0.8 && this.tState > 450) {
            if (this.lastGot === 0 && s.stats.inBottle + this.hopperCount() === 0) { this.fail('Bottle is empty.'); break; }
            if (this.consec >= 10) { this.fail('No pill for 10 cycles, lane starved or a pill is stuck at the lip.'); break; }
            if (!this.jobDone()) { this.state = 'fill'; this.tState = 0; }
          }
          break;
        }
        case 'unjam': {         // wedge blocked: retract and shake the hopper, then retry
          this.wedgeMv.step(0, vW * 0.7, aW, dt);
          if (this.wedgeMv.arrived(0) && Math.abs(W.err) < 0.8 && this.tState > 1000) { this.state = 'fill'; this.tState = 0; }
          break;
        }
        default: break;
      }
      // floor vibration (along the lane, with a small normal component) tumbles upright pills and keeps the queue moving
      const vib = this.vibe && this.busy && s.phase === 'docked' && (this.state === 'fill' || this.state === 'unjam' || this.state === 'raise');
      this.floorT = (this.floorT || 0) + dt / 1000;
      const fa = vib ? (this.state === 'unjam' ? 1.4 : 0.8) : 0, ph = this.floorT * 2 * Math.PI * 34;
      this.floorRig.place(this.d.x * fa * Math.sin(ph) + this.n.x * 0.5 * fa * Math.sin(ph + 1.2), this.d.y * fa * Math.sin(ph) + this.n.y * 0.5 * fa * Math.sin(ph + 1.2), 0);
      W.drive(dt, this.wedgeMv.pos, this.wedgeMv.vel / 1000, 0);
      F.drive(dt, this.flapMv.pos, this.flapMv.vel / 1000, 0);
      if (W.stalled && (this.state === 'separate')) {
        if (this.noteJam()) { this.wedgeMv.pos = W.s; this.wedgeMv.vel = 0; W.rehome(); this.state = 'unjam'; this.tState = 0; }
      }
      s.pinchWheel = false;
    }
    drawBodies() { return [...this.statics, this.hopper.body, this.wedge.body, this.flap.body, this.floorRig.body]; }
  }
  P.LaneDesign = LaneDesign;
  P.DESIGNS.lane = { key: 'lane', mount: 'top', cls: LaneDesign, order: 4, name: 'Gravity lane + clamp-pad escapement', short: 'Lane', family: 'Single-file queue' };


  // =====================================================================================================
  //  E · Closed-loop belts: metered feed belt + faster spacing belt + optical counting (no mechanical metering)
  // =====================================================================================================
  class BeltDesign extends InvertedBase {
    constructor(scene) {
      super(scene);
      const prm = scene.params, sp = scene.spec, g = scene.geo;
      const round = sp.L / sp.W < 1.3;
      this.h = laneHeight(sp);                                   // lip height above the belt: one layer only
      this.gapL = clamp(sp.W * 0.22 + 0.1, 0.95, 2.0);
      this.ow = (round ? sp.L * 1.35 + 1.6 : sp.L + 6) / 2;
      this.v1 = clamp(prm.beltV1 || 20, 5, 80);                  // mm/s  feed belt
      this.ratio = clamp(prm.beltRatio || 5, 1.5, 12);           // spacing belt speed ratio
      this.v2 = this.v1 * this.ratio;
      this.sensing = prm.beltSensing || 'width';                 // 'edge' (naive) | 'width' (pulse-width classifier)
      const ow = this.ow, h = this.h;
      // right side: counter-rotating singulating roller instead of a fixed lip (sweeps stacked pills back to the hopper)
      this.rR = 6.5; this.rollerV = 70;                       // roller radius (mm) and surface speed (mm/s)
      const rc = { x: ow + 1.0, y: -h - this.rR };
      this.initFeed({ left: { x: -ow, y: -this.gapL }, right: { x: rc.x + 2.5, y: rc.y - 1 } });
      this.roller = Matter.Bodies.circle(rc.x, rc.y, this.rR, { isStatic: true, friction: 0.9, frictionStatic: 1.0, restitution: 0.05 }, 24);
      this.roller.label = 'belt'; this.addStatic(this.roller); this.rollerC = rc;
      const xa = -(ow + 24), xb = 96, xc = 97.2, xd = 172;
      const mk = (x0, x1, label) => { const b = rectPart((x0 + x1) / 2, 4, x1 - x0, 8, 0, label); b.friction = 0.9; b.frictionStatic = 1.0; return b; };
      this.belt1 = this.addStatic(mk(xa, xb, 'belt')); this.belt2 = this.addStatic(mk(xc, xd, 'belt'));
      this.beltX = { xa, xb, xc, xd };
      this.mv1 = new P.Mover(0); this.speedCmd = 0; this.phase1 = 0; this.phase2 = 0;
      this.buildOutput({ ex: xd + 8, ey: 8, half: 10 });
      this.zones.push({ x0: xa - 6, x1: xd + 16, y0: this.roofY - 4, y1: 9 });
      this.inPulse = false; this.pulseStart = 0; this.pulses = []; this.estCount = 0; this.lastPulseT = 0;
      // counting light barrier at the END of the slow feed belt (before the fast spacing belt): a pill blocks it for L / v1 seconds,
      // so touching pills give pulses twice as long, width is easy to classify. Pills already counted keep flowing out on the fast belt.
      this.sensX = xb - 0.5; this.feedBeam = { x: this.sensX, y0: -h, y1: 0 };
      this.speedCmd2 = 0; this.mv2 = new P.Mover(0); this.feedBlocked = false; this.pulseTruth = 0; this.flushT = 0;
    }

    compat() {
      const sp = this.scene.spec, g = this.scene.geo, out = [];
      out.push({ k: 'Feed belt', v: `${this.v1.toFixed(0)} mm/s under a ${this.h.toFixed(1)} mm lip (single layer)`, ok: this.h < 2 * sp.W });
      out.push({ k: 'Spacing belt', v: `${this.v2.toFixed(0)} mm/s (${this.ratio.toFixed(1)}×) opens a ${((this.ratio - 1) * sp.L).toFixed(0)} mm gap between pills`, ok: this.ratio >= 3 });
      out.push({ k: 'Counting', v: this.sensing === 'width' ? `barrier at the feed-belt end + belt encoder (pulse length ÷ pill length) (1 pill = ${this.scene.spec.L.toFixed(1)} mm of belt travel)` : 'single barrier, edge counting (naive: touching pills read as one)', ok: this.sensing === 'width' });
      out.push({ k: 'Neck clearance', v: `${(g.mouth / Math.max(sp.W, 1)).toFixed(1)}× pill width`, ok: g.mouth / sp.W >= 1.5 });
      return out;
    }

    beginJob() { this.state = 'run'; this.tState = 0; this.startTruth = this.sensorCount; this.estCount = 0; this.inPulse = false; this.lastPulseT = this.scene.t; this.stallCount = 0; }

    // Light barrier at the end of the feed belt. The controller reads the belt encoder: while the barrier is blocked, every
    // L mm of belt travel is one pill length, so a packed stream of touching pills is counted ON THE FLY and the belt can be
    // stopped exactly after the k-th pill has passed. 'edge' mode (naive) counts one pill per blocked interval instead.
    watchFeed(dt) {
      const s = this.scene, sp = s.spec, pt = { x: this.sensX, y: -sp.W * 0.5 }, pHi = { x: this.sensX, y: -(this.h - 0.5) };
      let blocked = false, hi = false;
      for (const b of s.pills) {
        const bb = b.bounds; if (bb.min.x > pt.x || bb.max.x < pt.x) continue;
        if (bb.min.y <= pHi.y && bb.max.y >= pHi.y && Matter.Vertices.contains(b.vertices, pHi)) hi = true;
        if (bb.min.y > pt.y || bb.max.y < pt.y) continue;
        if (Matter.Vertices.contains(b.vertices, pt)) blocked = true;
        const info = b.plugin.pill;
        if (!info.fcount && b.position.x > pt.x && b.position.y < 2) { info.fcount = true; this.pulseTruth++; }
      }
      this.feedBlocked = blocked;
      if (this.inPulse && hi) this.sawHi = true;
      if (blocked && !this.inPulse && this.state !== 'stop') { this.inPulse = true; this.pulsePh0 = this.phase1; this.pulseStart = s.t; this.pulseTruth = 0; this.sawHi = hi; this.liveEst = 0; }
      else if (this.inPulse) {
        const dist = Math.max(0, this.phase1 - this.pulsePh0);
        this.liveEst = this.sensing === 'width' ? Math.floor((dist + 1.0) / sp.L) : 0;
        if (!blocked) this.endPulse(dist);
      }
    }
    endPulseLive() {           // dose reached in the middle of a packed stream: close the pulse with the pills that have fully passed
      const s = this.scene; this.inPulse = false;
      const truth = this.pulseTruth, est = this.liveEst;
      this.estCount += est; this.lastPulseT = s.t; this.pulses.push({ t: s.t, dist: -1, est, truth });
      s.stats.attempts++; s.cycles.push({ t: s.t, got: truth, kind: truth === 1 ? 'ok' : truth === 0 ? 'miss' : 'double' });
      if (truth > 1) s.stats.doubles++;
      s.log(`Feed barrier: dose reached mid-stream → belt stopped after ${est} pill${est === 1 ? '' : 's'} (truth ${truth}). ${this.estCount}/${this.job}.`, est === truth ? 'info' : 'warn');
    }
    endPulse(dist) {
      const s = this.scene, sp = s.spec; this.inPulse = false;
      const truth = this.pulseTruth;
      let est = this.sensing === 'width' ? Math.max(1, Math.round(dist / sp.L)) : 1;
      if (this.sensing === 'width' && this.sawHi && est === 1) est = 2;      // upper barrier tripped: a second pill rides over the first
      this.estCount += est; this.lastPulseT = s.t;
      this.pulses.push({ t: s.t, dist, est, truth });
      s.stats.attempts++;
      s.cycles.push({ t: s.t, got: truth, kind: truth === 1 ? 'ok' : truth === 0 ? 'miss' : 'double' });
      if (truth > 1) s.stats.doubles++;
      s.log(`Feed barrier: ${dist.toFixed(1)} mm of belt travel (1 pill = ${sp.L.toFixed(1)} mm) → counted ${est}, truth ${truth}. ${this.estCount}/${this.job}.`, est === truth ? 'info' : 'warn');
    }

    control(dt) {
      const s = this.scene;
      this.controlBase(dt, this.state === 'agitate');
      this.tState += dt;
      switch (this.state) {
        case 'run': {
          this.speedCmd = 1; this.speedCmd2 = 1;
          if (this.estCount + (this.inPulse ? this.liveEst : 0) >= this.job) { if (this.inPulse) { this.endPulseLive(); } this.state = 'stop'; this.tState = 0; }
          else if (s.t - this.lastPulseT > 6500 && this.tState > 6500) {
            this.stallCount++;
            if (s.stats.inBottle + this.hopperCount() === 0) { this.fail('Bottle is empty.'); break; }
            if (this.stallCount > 3) { this.fail('No pill for 6 s, bridged over the lip.'); break; }
            s.stats.jams++; this.state = 'agitate'; this.tState = 0; s.log('No pulse for 6 s, reversing the feed belt and shaking the hopper.', 'warn');
          }
          break;
        }
        case 'agitate': {
          this.speedCmd = this.tState < 700 ? -1 : 0; this.speedCmd2 = 0;
          if (this.tState > 1400) { this.state = 'run'; this.tState = 0; this.lastPulseT = s.t; }
          break;
        }
        case 'stop': {          // count reached: the feed belt stops; the fast belt keeps running to flush counted pills to the chute
          this.speedCmd = 0; this.speedCmd2 = this.tState < 2600 ? 1 : 0;
          if (this.tState > 3200) {
            const truth = this.sensorCount - this.startTruth;
            if (truth > this.job) s.log(`Over-dispensed: ${truth} pills for a ${this.job}-pill dose (counted ${this.estCount}).`, 'bad');
            else if (truth < this.job) { s.stats.misses += this.job - truth; s.log(`Under-dispensed: ${truth} pills for a ${this.job}-pill dose (counted ${this.estCount}).`, 'bad'); }
            this.remaining = 0; this.jobDone();
          }
          break;
        }
        default: break;
      }
      // belt surface velocities: the belts are static geometry with an imposed surface velocity (friction transport)
      // servo drive: gentle start, dynamic brake to standstill within one control step (encoder-controlled stop)
      if (this.speedCmd === 0) { this.mv1.pos = 0; this.mv1.vel = 0; } else this.mv1.step(this.speedCmd, 1.6, 14, dt);
      if (this.speedCmd2 === 0) { this.mv2.pos = 0; this.mv2.vel = 0; } else this.mv2.step(this.speedCmd2, 1.6, 14, dt);
      const f = this.mv1.pos, sec = dt / 1000;
      const v1 = this.v1 * f, v2 = this.v2 * this.mv2.pos;
      this.belt1.positionPrev.x = this.belt1.position.x - v1 * sec; this.belt2.positionPrev.x = this.belt2.position.x - v2 * sec;
      this.phase1 += v1 * sec; this.phase2 += v2 * sec;
      // roller spins (surface moves back towards the hopper) whenever the feed belt runs forward
      const wr = (f > 0.05 ? this.rollerV / this.rR : 0) * sec;      // rad per step, clockwise (+)
      this.roller.anglePrev = this.roller.angle - wr; this.rollerPhase = (this.rollerPhase || 0) + wr;
      this.watchFeed(dt);
      s.pinchWheel = false;
    }
    drawBodies() { return [...this.statics, this.hopper.body]; }
  }
  P.BeltDesign = BeltDesign;
  P.DESIGNS.belt = { key: 'belt', mount: 'top', cls: BeltDesign, order: 5, name: 'Closed-loop belts + optical count', short: 'Belt', family: 'Sensor-gated feed' };


  // =====================================================================================================
  //  F · Vacuum metering disc (precision-seeder style): suction ports, knock-off singulator, pressure feedback
  // =====================================================================================================
  class VacDiscDesign extends InvertedBase {
    constructor(scene) {
      super(scene);
      const prm = scene.params, sp = scene.spec, g = scene.geo;
      this.Rd = 50; this.N = 15; this.dA = (2 * Math.PI) / this.N;
      this.vacKPa = clamp(prm.vacuum || 25, 5, 60);                     // gauge vacuum, kPa
      this.dPort = clamp(prm.portDia || sp.W * 0.45, 1.2, 6);           // suction port diameter (mm), auto from the pill
      this.gs = sp.W * 1.25 + 0.6;                                      // singulator gap over the disc rim
      this.omega = clamp(prm.discSpeed || 70, 20, 240) * DEG;           // rad/s
      const Rd = this.Rd, gs = this.gs, ow = Math.max(g.wn + 1, sp.L * 0.9 + 22);   // trough half-width: wide enough that pills never bridge the opening left of the wedge
      // trough geometry (disc centre C to the right of the funnel axis)
      const aS = 217 * DEG;                                             // singulator angle
      const yTop = -(Rd + gs) * Math.sin(aS - Math.PI);                 // (negative: above centre)
      const Rtip = { x: (Rd + gs) * Math.cos(aS), y: (Rd + gs) * Math.sin(aS) };
      const Cx = ow - Rtip.x - 3, Cy = 0; this.C = { x: Cx, y: Cy };
      const pol = (r, a) => ({ x: Cx + r * Math.cos(a), y: Cy + r * Math.sin(a) });
      const tip = pol(Rd + gs, aS);
      this.initFeed({ left: { x: -ow, y: tip.y - 9 }, right: { x: tip.x - 3.5, y: tip.y - 9 } });   // right wall foot stays clear of the singulator gap
      // trough: left wall down to the floor, floor up to the rim
      const yf = Cy + 26; this.yf = yf;
      const xFloorEnd = Cx - Math.sqrt(Rd * Rd - (yf - Cy) * (yf - Cy)) - 1.4;
      // floor slopes down towards the rim so gravity presses the pile onto the disc (as a tilted seed-meter plate does)
      const yHigh = yf - 24, fp = { x: -ow, y: yHigh }, fq = { x: xFloorEnd, y: yf };
      this.addStatic(rectPart(-ow - 3, (tip.y - 9 + yHigh) / 2 + 1, 6, yHigh - (tip.y - 9) + 6, 0, 'housing'));
      { const dx = fq.x - fp.x, dy = fq.y - fp.y, l = Math.hypot(dx, dy); this.addStatic(wallSeg(fp, fq, 7, -dy / l, dx / l, 'housing', 0)); }
      // singulator wedge (ramp that pushes a stacked pill back into the pile) then the housing arc over the rim
      const wedge = [pol(Rd + gs + 9, 203 * DEG), pol(Rd + gs + 0.2, 218 * DEG), pol(Rd + gs + 5.5, 218 * DEG), pol(Rd + gs + 13, 203 * DEG)];
      this.addStatic(quadPart(wedge, 'housing'));
      const arcParts = []; const a0 = 218 * DEG, a1 = 336 * DEG, tk = 5, Rh = Rd + gs;
      const nseg = Math.ceil((a1 - a0) / (6 * DEG));
      for (let i = 0; i < nseg; i++) {
        const t0 = a0 + ((a1 - a0) * i) / nseg, t1 = a0 + ((a1 - a0) * (i + 1)) / nseg, tm = (t0 + t1) / 2;
        const ch = 2 * Rh * Math.sin((t1 - t0) / 2), c = pol(Rh + tk / 2, tm);
        arcParts.push(rectPart(c.x, c.y, ch + 0.8, tk, tm + Math.PI / 2, 'housing'));
      }
      this.arc = new Rig(arcParts, { label: 'housing' }); this.arc.place(0, 0, 0); Composite.add(scene.world, this.arc.body);
      // the disc: a torque-limited rotor, pinned at C
      this.motorT = clamp(prm.motorT || 260, 30, 900);
      const disc = Matter.Bodies.circle(Cx, Cy, Rd, { isStatic: false, friction: 0.1, frictionStatic: 0.16, restitution: 0.02 }, 40);
      disc.label = 'disc';
      this.rotor = new P.RotorActuator(scene, [disc], { mass: 12, Fmax: this.motorT, lever: Rd * 0.95, pivot: { x: Cx, y: Cy }, label: 'disc', minCmd: 0.4, stallLimit: 60 });
      this.rotMv = new P.Mover(0);
      // exit chute at the right of the disc (release near 3 o'clock, the rim then moves straight down)
      this.buildOutput({ ex: Cx + Rd + 26, ey: Cy + 34, half: 20 });
      this.beam.x0 = Cx + Rd - 8;                                   // the light barrier covers the whole fall path
      this.zones.push({ x0: -ow - 10, x1: Cx + Rd + 14, y0: this.roofY - 4, y1: Cy + Rd + 8 });
      this.portHold = new Array(this.N).fill(0); this.att = new Array(this.N).fill(null); this.picks = 0; this.emptyPasses = 0; this.vacOn = false;
      this.vacSig = 0; this.aRelease = 350 * DEG; this.aOn = 138 * DEG;
      this.lastRelIdx = -1; this.revT = 0; this.portF = new Array(this.N).fill(0);
      this.inPulse = false; this.pulseTruth0 = 0;
    }

    compat() {
      const sp = this.scene.spec, g = this.scene.geo, out = [];
      const Aport = Math.PI * (this.dPort / 2) ** 2, Fs = this.vacKPa * 1e3 * Aport * 1e-6;
      const massN = P.pillMeanMassMg(sp) * 1e-6 * 9.81;
      out.push({ k: 'Suction port', v: `Ø ${this.dPort.toFixed(1)} mm at −${this.vacKPa.toFixed(0)} kPa → ${Fs.toFixed(2)} N hold (${(Fs / massN).toFixed(0)}× pill weight)`, ok: Fs / massN > 15 });
      const r = sp.W / 2, leak = sp.shape === 'round' ? r - Math.sqrt(Math.max(0, r * r - (this.dPort / 2) ** 2)) : 0.05;
      out.push({ k: 'Seal', v: `${leak.toFixed(2)} mm edge gap on the pill face`, ok: leak < 0.4 });
      out.push({ k: 'Singulator gap', v: `${this.gs.toFixed(1)} mm (held pill ${sp.W.toFixed(1)} mm, stacked pill rejected)`, ok: this.gs < 1.8 * sp.W });
      out.push({ k: 'Neck clearance', v: `${(g.mouth / Math.max(sp.W, 1)).toFixed(1)}× pill width`, ok: g.mouth / sp.W >= 1.5 });
      out.push({ k: 'Disc drive', v: `${(this.omega / DEG).toFixed(0)}°/s, ${this.motorT.toFixed(0)} N·mm torque limit`, ok: true });
      return out;
    }

    // one metering cycle per beam pulse: how many pills (ground truth) passed the barrier during it
    watchPulses() {
      const s = this.scene, sc = s.scope, n = sc.t.length; if (!n) return;
      const b = sc.b1[n - 1];
      if (!this.inPulse && b > 0.03) { this.inPulse = true; this.pulseTruth0 = this.sensorCount; }
      else if (this.inPulse && b < 0.015) {
        this.inPulse = false; const truth = this.sensorCount - this.pulseTruth0;
        s.stats.attempts++; s.cycles.push({ t: s.t, got: truth, kind: truth === 1 ? 'ok' : truth === 0 ? 'miss' : 'double' });
        if (truth > 1) { s.stats.doubles++; s.log(`Double release: ${truth} pills passed the beam together.`, 'bad'); }
      }
    }

    beginJob() { this.state = 'run'; this.tState = 0; this.vacOn = true; this.revT = 0; this.startTruth = this.sensorCount; this.noPickRev = 0; }

    // suction: a pressure force on the pill sitting on an active port. A port that has captured a pill keeps it (the cup
    // seals against the pill face) until the vacuum is cut, so pills do not hop from port to port.
    portForce(k, b, px, py, nx, ny, F0, sp, capF) {
      const v = b.vertices; let dmin = 1e9, vi = 0;
      for (let i = 0; i < v.length; i++) { const d = Math.hypot(v[i].x - px, v[i].y - py); if (d < dmin) { dmin = d; vi = i; } }
      if (dmin > 4.0) return null;
      let sx = v[vi].x - b.position.x, sy = v[vi].y - b.position.y; const sl = Math.hypot(sx, sy) || 1; sx /= sl; sy /= sl;
      const tilt = Math.acos(clamp(-(sx * nx + sy * ny), -1, 1));
      const r = sp.W / 2, leak = sp.shape === 'round' ? r - Math.sqrt(Math.max(0, r * r - (this.dPort / 2) ** 2)) : 0.05 * Math.tan(tilt);
      const seal = clamp(1 - tilt / (60 * DEG), 0, 1) * (leak < 0.4 ? 1 : 0.35);
      const dn = Math.max(0, (v[vi].x - px) * nx + (v[vi].y - py) * ny);
      const F = Math.min(F0 * seal / (1 + (dn / 0.8) * (dn / 0.8)), capF);
      return { F, vx: v[vi].x, vy: v[vi].y, dn, tilt, dmin };
    }
    applySuction() {
      const s = this.scene, C = this.C, Rd = this.Rd, phi = this.rotor.angle, sp = s.spec;
      const Aport = Math.PI * (this.dPort / 2) ** 2, F0 = this.vacKPa * 1e3 * Aport * 1e-6;   // N
      const near = [];
      for (const b of s.pills) { const dx = b.position.x - C.x, dy = b.position.y - C.y; const r = Math.hypot(dx, dy); if (r < Rd + Math.max(sp.L, sp.W) + 3 && r > Rd - 6 && !b.isStatic) near.push(b); }
      const claimed = new Set(this.att.filter(Boolean));
      for (let k = 0; k < this.N; k++) {
        const th = phi + k * this.dA, a = wrap2pi(th - this.aOn);
        const active = this.vacOn && a < wrap2pi(this.aRelease - this.aOn);
        this.portF[k] = 0;
        if (!active) { if (this.att[k]) { claimed.delete(this.att[k]); this.att[k] = null; } this.portHold[k] = 0; continue; }
        const nx = Math.cos(th), ny = Math.sin(th), px = C.x + Rd * nx, py = C.y + Rd * ny;
        let hit = null, body = this.att[k];
        if (body) {                                       // already holding: keep it unless the seal is lost
          const capF = 10 * (body.mass / 1000) * 9.81;
          hit = this.portForce(k, body, px, py, nx, ny, F0, sp, capF);
          if (!hit || hit.tilt > 65 * DEG || hit.dn > 2.5) { claimed.delete(body); this.att[k] = null; body = null; hit = null; }
        }
        if (!body) {
          let best = null;
          for (const b of near) {
            if (claimed.has(b)) continue;
            const dx = b.position.x - px, dy = b.position.y - py;
            if (dx * dx + dy * dy > (Math.max(sp.L, sp.W) / 2 + 4) ** 2) continue;
            const h = this.portForce(k, b, px, py, nx, ny, F0, sp, 10 * (b.mass / 1000) * 9.81);
            if (h && h.dmin < 3 && (!best || h.F > best.h.F)) best = { b, h };
          }
          if (best && best.h.F > 0.35 * 10 * (best.b.mass / 1000) * 9.81 && best.h.dn < 1.3) { body = best.b; hit = best.h; this.att[k] = body; claimed.add(body); this.picks++; }
        }
        if (body && hit) {
          const capF = 10 * (body.mass / 1000) * 9.81;
          const nxv = nx, nyv = ny;
          let ex = px - hit.vx, ey = py - hit.vy; const en = ex * nxv + ey * nyv; ex -= en * nxv; ey -= en * nyv;   // lateral offset
          const kt = Math.max(hit.F, 0.5 * capF) / 1.0;
          const Ftx = clamp(ex * kt, -0.9 * capF, 0.9 * capF), Fty = clamp(ey * kt, -0.9 * capF, 0.9 * capF);
          const vn = (body.velocity.x * nxv + body.velocity.y * nyv) * 60 / 1000;                                  // mm/ms
          const Fd = clamp(-vn * body.mass * 0.7, -0.8 * capF, 0.8 * capF);
          const Fn = Math.max(hit.F, 0.6 * capF);
          Body.applyForce(body, { x: hit.vx, y: hit.vy }, { x: -nxv * Fn + Ftx + nxv * Fd, y: -nyv * Fn + Fty + nyv * Fd });
          this.portF[k] = Fn; this.portHold[k] = Fn / Math.min(F0, capF);
        } else this.portHold[k] = 0;
      }
    }

    control(dt) {
      const s = this.scene, R = this.rotor;
      this.controlBase(dt, this.state === 'unjam');
      this.tState += dt;
      let target = 0;
      switch (this.state) {
        case 'run': {
          target = 1;
          this.revT += dt;
          const got = this.sensorCount - this.startTruth;
          if (got > 0 && got !== this.lastGot) { this.lastGot = got; this.revT = 0; this.noPickRev = 0; }
          this.remaining = this.job - got;
          if (this.remaining <= 0) { this.state = 'stop'; this.tState = 0; }
          else if (this.revT > (2 * Math.PI / this.omega) * 1000 * 1.6) {
            this.noPickRev++; this.revT = 0; s.stats.misses++; s.cycles.push({ t: s.t, got: 0, kind: 'miss' });
            s.log(`No pill released for a full revolution (${this.noPickRev}).`, 'warn');
            if (s.stats.inBottle + this.hopperCount() === 0) { this.fail('Bottle is empty.'); }
            else if (this.noPickRev >= 3) this.fail('No pill picked up in 3 revolutions, pile bridged, or port too small / vacuum too weak for this pill.');
          }
          break;
        }
        case 'stop': {
          target = 0;
          if (this.tState > 700) {
            const truth = this.sensorCount - this.startTruth;
            if (truth !== this.job) s.log(`Dose count ${truth} vs ${this.job}.`, 'warn');
            this.remaining = 0; this.jobDone();
          }
          break;
        }
        case 'unjam': {     // torque limit hit: back the disc off, shake, retry
          target = -0.7;
          if (this.tState > 500) { this.state = 'run'; this.tState = 0; this.revT = 0; }
          break;
        }
        default: break;
      }
      this.rotMv.step(this.rotMv.pos + (target ? target * this.omega * dt / 1000 : 0) * 1, Math.abs(this.omega) * 1.05, 20, dt);
      // reference: integrate the commanded speed (with a soft ramp so the drive is never asked for a step)
      this.cmdW = (this.cmdW || 0) + clamp(target * this.omega - (this.cmdW || 0), -14 * dt / 1000, 14 * dt / 1000);
      this.refA = (this.refA == null ? R.angle : this.refA) + this.cmdW * dt / 1000;
      R.drive(dt, this.refA, this.cmdW / 1000, 0);
      this.applySuction(); this.watchPulses();
      if (R.stalled && this.state === 'run') { if (this.noteJam()) { this.refA = R.angle; this.cmdW = 0; R.rehome(); this.state = 'unjam'; this.tState = 0; } }
      // vacuum pressure signal: fraction of active ports that are sealed by a pill
      let act = 0, sealed = 0;
      for (let k = 0; k < this.N; k++) { const a = wrap2pi(R.angle + k * this.dA - this.aOn); if (a < wrap2pi(this.aRelease - this.aOn)) { act++; if (this.portHold[k] > 0.5) sealed++; } }
      this.vacSig = act ? sealed / act : 0;
      s.pinchWheel = false;
    }
    drawBodies() { return [...this.statics, this.hopper.body, this.arc.body, this.rotor.body]; }
  }
  P.VacDiscDesign = VacDiscDesign;
  P.DESIGNS.vacdisc = { key: 'vacdisc', mount: 'top', cls: VacDiscDesign, order: 6, name: 'Vacuum metering disc', short: 'Vac disc', family: 'Suction singulation' };

  // =====================================================================================================
  //  G · Adjustable wire-cone + laser gate. A compound cone (two independently adjustable taper stages, "waist" being
  //  the control point between them) narrows down to a straight pipe whose diameter is set, from a pre-scan of the
  //  pill, to fit the pill's WIDTH but not its LENGTH. A non-round pill can only pass the pipe standing on end: the
  //  cone is a continuously-adjustable coin-tube. Two force-limited valves sit in the pipe: an upper RETENTION PIN
  //  that admits one pill at a time into a short vestibule, and a lower GATE that releases the vestibule downward,
  //  timed by a local light barrier that follows the pill's actual leading/trailing edge rather than a fixed dwell.
  //  The pin exists because the simulation surfaced a real limitation of a single reactive gate: pills queued
  //  touching in free fall clear a point sensor with a sub-2 ms gap, faster than any force-limited actuator can
  //  react, so a lone gate lets two or three through before it can close. The pin turns that into a non-issue: it
  //  only ever has to let ONE pill's leading edge start crossing before shutting behind it (a rising-edge trigger,
  //  not a clearance wait), so the gate downstream only ever sees one candidate.
  //  In this 2-D cross-section the wire bundle is drawn as a slotted cone shell; the physics (taper angle, pipe
  //  clearance, valve force limits, contact/damage model) are identical to every other concept on this site.
  // =====================================================================================================
  class ConeGateDesign extends InvertedBase {
    constructor(scene) {
      super(scene);
      const prm = scene.params, sp = scene.spec, g = scene.geo;
      const round = sp.L / sp.W < 1.3;
      // ---- pipe: sized so a pill standing on end just clears it, but a pill lying flat cannot fit through sideways.
      // Round pills have no "lying flat" failure mode (every rotation looks the same end-on), so the cap on pipe width
      // relative to length is skipped for them, they queue by diameter alone, exactly like coins in a tube.
      const clearance = clamp(sp.W * 0.08 + 0.45, 0.5, 1.7);
      const minPipe = sp.W + clearance, maxPipe = round ? minPipe + 7 : Math.max(minPipe + 0.6, sp.L - 1.3);
      this.autoPipe = prm.pipeAuto !== false;
      const autoPipeW = clamp(minPipe + (maxPipe - minPipe) * 0.18, minPipe, maxPipe);
      this.pipeW = this.autoPipe ? autoPipeW : clamp(+prm.pipeDia || autoPipeW, minPipe * 0.75, maxPipe * 1.4);
      this.forcesVertical = !round && this.pipeW < sp.L - 0.3;
      // ---- waist: the cone's second control point, between the bottle-neck-width rim and the pipe
      this.autoWaist = prm.waistAuto !== false;
      // wide enough for one pill to rock/tumble into a vertical orientation, but deliberately kept under 2x the pipe
      // width so a second pill's width can never bridge across it beside the first, that trade (room to reorient,
      // not room to arch) is what the vibrated throat below is for.
      const autoWaistW = round ? clamp(this.pipeW + Math.max(sp.W * 0.7, 3.2), this.pipeW + 2.4, g.wn * 1.6) : clamp(this.pipeW * 1.7, this.pipeW + 3.5, this.pipeW * 2 - 1.5);
      this.waistW = this.autoWaist ? autoWaistW : clamp(+prm.waistDia || autoWaistW, this.pipeW + 1.5, g.wn * 2.2);
      const pipeHalf = this.pipeW / 2, waistHalf = this.waistW / 2, tk = 6, barThick = 4.2;
      // ---- stage 1 (rim -> waist): reuses the shared funnel/dock/sealed-cap machinery, angle-limited (<=14 deg from
      // vertical) to the same anti-arching rule every other funnel on this site uses.
      const wy = -(sp.W * 0.15);
      this.initFeed({ left: { x: -waistHalf, y: wy }, right: { x: waistHalf, y: wy } });
      // ---- anti-arch drive: the two sides of the feed cone are separate wire groups, driven in antiphase (±1 mm at
      // 50 Hz, about 10 g, an ordinary electromagnetic feeder drive) so the gap an arch has to span pulses open and
      // shut. A shared side-to-side shake moves both walls together and never changes that gap, so a two-pill arch
      // resting on both walls rides it out. Rocking the whole funnel would also break it, but swings the end sealed
      // to the bottle by several millimetres, which a seal can't take.
      Composite.remove(scene.world, this.hopper.body);
      const side = (pts, sgn) => {
        const parts = [];
        for (let i = 0; i < 2; i++) {
          const a = pts[i], b = pts[i + 1], dx = b.x - a.x, dy = b.y - a.y, l = Math.hypot(dx, dy);
          if (l > 1e-6) { const w = wallSeg(a, b, 6, (sgn * dy) / l, (-sgn * dx) / l, 'housing', 3); if (w) parts.push(w); }
        }
        const r = new Rig(parts, { label: 'housing' }); r.place(0, 0, 0); Composite.add(scene.world, r.body); return r;
      };
      const hL = side(this.funnelL, -1), hR = side(this.funnelR, 1), self = this;
      this.feedSides = [hL, hR];
      this.pulseAmp = prm.pulseAmp != null ? +prm.pulseAmp : 1.0; this.pulseHz = prm.pulseHz != null ? +prm.pulseHz : 50;
      this.hopper = {
        body: hL.body,
        place(x, y, a, on) {
          const d = on ? self.pulseAmp * Math.sin(self.agitT * 2 * Math.PI * self.pulseHz) : 0;
          hL.place(x - d, y, 0); hR.place(x + d, y, 0);
        },
      };
      const yWaist = wy;   // the feed funnel's outlet (its corner points above); yFt is the TOP of that funnel's taper
      // ---- stage 2 (waist -> pipe top): a second, shallower taper down to the pipe. A non-round pill does most of
      // its tumbling-into-vertical here, so, like the hopper above it, this throat gets the vibration assist too
      // (the entry pipe and valves below stay still; shaking the precision section would only hurt them).
      const run2 = waistHalf - pipeHalf, taperAngle2 = (round ? 14 : 10) * DEG, h2 = Math.max(4, run2 / Math.tan(taperAngle2));
      const yPipeTop = yWaist + h2;
      const rp2 = [{ x: waistHalf, y: yWaist }, { x: pipeHalf, y: yPipeTop }], lp2 = [{ x: -waistHalf, y: yWaist }, { x: -pipeHalf, y: yPipeTop }];
      const throatParts = [];
      { const w = wallSeg(rp2[0], rp2[1], tk, (rp2[1].y - rp2[0].y) / h2, -(rp2[1].x - rp2[0].x) / h2, 'housing', 3); if (w) throatParts.push(w); }
      { const w = wallSeg(lp2[0], lp2[1], tk, -(lp2[1].y - lp2[0].y) / h2, (lp2[1].x - lp2[0].x) / h2, 'housing', 3); if (w) throatParts.push(w); }
      this.throat = new Rig(throatParts, { label: 'housing' }); this.throat.place(0, 0, 0);
      Composite.add(scene.world, this.throat.body);
      // ---- pipe layout: entry run (lets the taper's orientation-forcing finish) -> retention pin -> vestibule
      // (sized for exactly one pill) -> gate -> short stub -> exit. Every straight run's walls are built in pieces
      // with a `barThick` gap left at each valve's height, so the valve bar itself is the only thing that can block.
      this.motorF = clamp(prm.motorF || 0.25 * P.pillCrushN(sp), 1.5, 70);
      const entryLen = clamp(round ? sp.W * 1.8 + 5 : sp.L * 1.15 + 6, 10, 55);
      const yPin = yPipeTop + entryLen;
      // Pin-to-gate distance, centre to centre; the clear height a pill gets is this minus one bar thickness. For
      // small pills the floor is 1.85×L rather than a flat 10 mm, measured on the bench, that cuts mini-tablet double
      // counts ~6× for more pin jams.
      const vestibuleLen = clamp(sp.L + 3, Math.min(sp.L * 1.85, 10), 50);
      this.gateY = yPin + vestibuleLen;
      const yPipeBottom = this.gateY + Math.max(8, sp.W * 0.6);
      const runs = [[yPipeTop, yPin - barThick / 2], [yPin + barThick / 2, this.gateY - barThick / 2], [this.gateY + barThick / 2, yPipeBottom]];
      // pad only the outer ends (top of the first run, bottom of the last) to butt cleanly against the taper /
      // exit, every boundary touching a valve stays exact, or the pad would eat straight into that valve's gap
      runs.forEach(([y0, y1], idx) => {
        if (y1 - y0 < 1) return;
        const padTop = idx === 0 ? 3 : 0, padBot = idx === runs.length - 1 ? 3 : 0;
        const yy0 = y0 - padTop, yy1 = y1 + padBot, cy = (yy0 + yy1) / 2, h = yy1 - yy0;
        this.addStatic(rectPart(pipeHalf + tk / 2, cy, tk, h, 0, 'housing'));
        this.addStatic(rectPart(-pipeHalf - tk / 2, cy, tk, h, 0, 'housing'));
      });
      // ---- the two valves: identical force-limited sliding bars, one at the pin, one at the gate
      const barLen = 2 * pipeHalf + 9, stroke = pipeHalf + barLen / 2 + 3;
      this.valveStroke = stroke; this.valveSpeed = clamp(prm.gateSpeed || 320, 80, 600);
      const mkValve = (y, label) => {
        const bar = P.dynRect(stroke, y, barLen, barThick, 0, label);
        const act = new P.SlideActuator(scene, [bar], { mass: 1.1, Fmax: this.motorF, dir: { x: 1, y: 0 }, label, minCmd: 15, stallLimit: 30 });
        return { act, mv: new P.Mover(0), y };
      };
      this.pin = mkValve(yPin, 'gate'); this.gate = mkValve(this.gateY, 'gate');
      this.buildOutput({ ex: 0, ey: yPipeBottom, half: pipeHalf + 5 });
      // the gate opens by sliding sideways, and a light enough pill resting against it can get dragged along by
      // that motion instead of dropping straight down, a small horizontal kick that, for a small/light pill, is
      // enough to carry it past the ramp's own guard wall before it ever falls into the wall's height. Extend that
      // guard wall up past the gate itself so a sideways-kicked pill hits it before it can clear over the top.
      { const y0 = this.gateY - 15, y1 = yPipeBottom - 4; this.addStatic(rectPart(-pipeHalf - 15 - 3, (y0 + y1) / 2, 6, y1 - y0, 0, 'chute')); }
      this.zones.push({ x0: -waistHalf - 30, x1: waistHalf + 30, y0: this.roofY - 4, y1: yPipeBottom + 20 });
      this.pinSeenT = null; this.jamValve = null;
    }

    compat() {
      const sp = this.scene.spec, g = this.scene.geo, round = sp.L / sp.W < 1.3, out = [];
      out.push({ k: 'Pipe (pre-scanned, adjustable)', v: round ? `Ø ${this.pipeW.toFixed(1)} mm, round pill, queues by diameter alone` : `${this.pipeW.toFixed(1)} mm, between width ${sp.W.toFixed(1)} and length ${sp.L.toFixed(1)} mm, forces the pill onto its end`, ok: this.pipeW >= sp.W + 0.3 && (round || this.pipeW < sp.L - 0.2) });
      out.push({ k: 'Waist (2nd taper control point)', v: `${this.waistW.toFixed(1)} mm, second-stage taper down to the pipe`, ok: this.waistW > this.pipeW });
      out.push({ k: 'Vertical singulation', v: round ? 'not needed, round pill has no lying-flat failure mode' : (this.forcesVertical ? 'pipe narrower than the pill: it cannot pass lying down' : 'pipe not narrow enough, a pill could still pass lying flat'), ok: round || this.forcesVertical });
      out.push({ k: 'Neck clearance', v: `${(g.mouth / Math.max(sp.W, 1)).toFixed(1)}× pill width`, ok: g.mouth / sp.W >= 1.5 });
      out.push({ k: 'Retention pin + gate', v: `${this.motorF.toFixed(0)} N current limit each, ${this.valveStroke.toFixed(0)} mm stroke at ${this.valveSpeed.toFixed(0)} mm/s, pin admits one pill into the vestibule, gate releases it, both timed by local light barriers`, ok: true });
      return out;
    }

    // local edge-detection at a valve's height: is a pill's silhouette currently crossing that line?
    lineBlocked(y) {
      const s = this.scene, x0 = -this.pipeW / 2 - 1.5, x1 = this.pipeW / 2 + 1.5;
      for (const b of s.pills) {
        const info = b.plugin.pill; if (info.held) continue;
        const bb = b.bounds;
        if (bb.min.y > y || bb.max.y < y || bb.max.x < x0 || bb.min.x > x1) continue;
        if (chordAt(b, y, x0, x1) > 0.25) return true;
      }
      return false;
    }

    beginJob() { this.state = 'admit'; this.tState = 0; }

    driveValve(v, target, dt) {
      v.mv.step(target, this.valveSpeed, 6000, dt);
      v.act.drive(dt, v.mv.pos, v.mv.vel / 1000, 0);
    }

    control(dt) {
      const s = this.scene, Pn = this.pin.act, Gt = this.gate.act;
      this.controlBase(dt, this.state === 'unjam');
      this.throat.place(this.agit * 0.7, 0, 0);
      this.tState += dt;
      switch (this.state) {
        case 'admit': {
          // pin open, gate closed. The instant a pill's leading edge is seen at the pin (a RISING-edge trigger, not
          // a clearance wait, a healthy queue keeps the line blocked forever as the next pill arrives) the pin
          // starts closing behind it, it only ever needs to let one pill start in.
          if (this.lineBlocked(this.pin.y) && this.tState > 40) { this.state = 'seat'; this.tState = 0; }
          else if (this.tState > 900) {                          // nothing reached the pin: bottle empty, or bridged above
            if (s.stats.inBottle + this.hopperCount() === 0) { this.fail('Bottle is empty.'); break; }
            this.consec++; s.stats.misses++; s.stats.attempts++; s.cycles.push({ t: s.t, got: 0, kind: 'miss' });
            s.log(`Empty pipe, no pill reached the retention pin (miss #${this.consec}).`, 'warn');
            if (this.consec >= 10) { this.fail('No pill for 10 cycles, pipe too narrow for this pill, or it is bridging at the waist.'); break; }
            this.tState = 0;
          }
          break;
        }
        case 'seat': {           // pin closing behind the admitted pill; let it settle onto the (closed) gate
          if (this.pin.mv.arrived(-this.valveStroke) && Math.abs(Pn.err) < 0.8 && this.tState > 140) {
            this.state = 'release'; this.tState = 0; this.pinSeenT = null; this.dropStartCount = this.sensorCount;
          } else if (this.tState > 2200 && this.noteJam()) {   // stuck well past any real closing time, even if the servo never crossed the stall threshold
            this.pin.mv.pos = Pn.s; this.pin.mv.vel = 0; Pn.rehome(); this.jamValve = 'pin'; this.state = 'unjam'; this.tState = 0;
          }
          break;
        }
        case 'release': {        // gate open; the vestibule holds exactly one pill now, so a clean clearance read is reliable
          const blocked = this.lineBlocked(this.gateY);
          if (blocked) this.gateSeenT = this.tState;
          const cleared = this.gateSeenT != null && this.tState - this.gateSeenT > 1;
          if (cleared || this.tState > 700) { this.state = 'close'; this.tState = 0; this.gateSeenT = null; }
          break;
        }
        case 'close': {
          if (this.gate.mv.arrived(-this.valveStroke) && Math.abs(Gt.err) < 0.8 && this.tState > 60) {
            const got = this.sensorCount - this.dropStartCount;
            this.evalDrop(got, 'pipe');
            if (!this.jobDone()) { this.state = 'admit'; this.tState = 0; }
          } else if (this.tState > 2200 && this.noteJam()) {
            this.gate.mv.pos = Gt.s; this.gate.mv.vel = 0; Gt.rehome(); this.jamValve = 'gate'; this.state = 'unjam'; this.tState = 0;
          }
          break;
        }
        case 'unjam': {          // ONLY the valve that actually jammed backs off, the other stays shut, or the pin
          // and gate opening together would punch a clear, uncounted path straight through the machine.
          const v = this.jamValve === 'gate' ? this.gate : this.pin, act = this.jamValve === 'gate' ? Gt : Pn;
          if (v.mv.arrived(0) && Math.abs(act.err) < 0.8 && this.tState > 900) { this.state = 'admit'; this.tState = 0; this.jamValve = null; }
          break;
        }
        default: break;
      }
      const pinJamOpen = this.state === 'unjam' && this.jamValve === 'pin';
      const gateJamOpen = this.state === 'unjam' && this.jamValve === 'gate';
      const pinTarget = (this.state === 'admit' || pinJamOpen) ? 0 : -this.valveStroke;
      const gateTarget = (this.state === 'release' || gateJamOpen) ? 0 : -this.valveStroke;
      this.driveValve(this.pin, pinTarget, dt);
      this.driveValve(this.gate, gateTarget, dt);
      if (Pn.stalled && this.state === 'seat') {
        if (this.noteJam()) { this.pin.mv.pos = Pn.s; this.pin.mv.vel = 0; Pn.rehome(); this.jamValve = 'pin'; this.state = 'unjam'; this.tState = 0; }
      } else if (Gt.stalled && this.state === 'close') {
        if (this.noteJam()) { this.gate.mv.pos = Gt.s; this.gate.mv.vel = 0; Gt.rehome(); this.jamValve = 'gate'; this.state = 'unjam'; this.tState = 0; }
      }
      s.pinchWheel = false;
    }
    drawBodies() { return [...this.statics, ...this.feedSides.map((r) => r.body), this.throat.body, this.pin.act.body, this.gate.act.body]; }
  }
  P.ConeGateDesign = ConeGateDesign;
  P.DESIGNS.cone = { key: 'cone', mount: 'top', cls: ConeGateDesign, order: 7, name: 'Adjustable wire-cone + laser gate', short: 'Cone gate', family: 'Reconfigurable singulation' };

  // =====================================================================================================
  //  H · Vacuum-lip airlock (held-pill escapement). A slow feed belt carries a single layer of pills (the same belt and
  //  counter-rotating singulating roller as concept E) across a short fixed land to a rounded lip. Two small suction
  //  ports are the only "gates", and neither one moves:
  //    port A, on the lip's nose, catches the lead pill as it tips over the edge and holds it there, just past the
  //            edge, where it physically blocks the pill behind it (a ceiling stops that one climbing over);
  //    port B, in the land just behind, then catches that next pill where it has come to rest against the held one.
  //  Release A and the held pill drops alone while B keeps the next one; A re-arms as soon as that pill has cleared it.
  //  Release B and the belt brings the next pill up to A. Like an airlock, the lip is only ever open while one held pill
  //  leaves, so the singulation never depends on anything outrunning a falling pill, and no part ever closes on a pill:
  //  suction holds, it does not squeeze.
  // =====================================================================================================
  class HeldPillDesign extends InvertedBase {
    constructor(scene) {
      super(scene);
      const prm = scene.params, sp = scene.spec, g = scene.geo;
      const round = sp.L / sp.W < 1.3, size = Math.max(sp.L, sp.W), r = sp.W / 2;
      this.h = laneHeight(sp);                                          // single-layer clearance under the roller and the ceiling
      this.gapL = clamp(sp.W * 0.22 + 0.1, 0.95, 2.0);
      this.ow = (round ? sp.L * 1.35 + 1.6 : sp.L + 6) / 2;
      this.v1 = clamp(prm.holdV1 || 16, 4, 60);                         // mm/s feed belt
      this.stallMs = prm.stallMs != null ? +prm.stallMs : 4000;         // no pill at the lip this long: jog the belt to break a bridge
      this.Rn = clamp(sp.W * 0.45, 1.5, 4.5);                           // lip nose radius
      this.phiA = (prm.portAngle != null ? +prm.portAngle : 40) * DEG;  // port A, round the nose from the top
      this.dPort = clamp(prm.portDia || sp.W * 0.45, 1.2, 6);          // suction ports: auto from the pill width, as concept F
      this.vacKPa = clamp(prm.vacuum || 25, 5, 60);
      this.rampDeg = prm.lipRamp != null ? +prm.lipRamp : 0;           // land from the belt to the nose: flat (an uphill ramp is optional)
      const ow = this.ow, h = this.h, Rn = this.Rn, beta = this.rampDeg * DEG;
      // ---- feed: funnel over the belt, singulating roller at the funnel's downstream foot (as concept E)
      this.rR = 6.5; this.rollerV = 70;
      const rc = { x: ow + 1.0, y: -h - this.rR };
      this.initFeed({ left: { x: -ow, y: -this.gapL }, right: { x: rc.x + 2.5, y: rc.y - 1 } });
      this.roller = Matter.Bodies.circle(rc.x, rc.y, this.rR, { isStatic: true, friction: 0.9, frictionStatic: 1.0, restitution: 0.05 }, 24);
      this.roller.label = 'belt'; this.addStatic(this.roller); this.rollerC = rc;
      const xa = -(ow + 24), xb = rc.x + this.rR + (prm.queueMm != null ? +prm.queueMm : clamp(1.6 * size, 12, 45));
      const belt = rectPart((xa + xb) / 2, 4, xb - xa, 8, 0, 'belt'); belt.friction = 0.9; belt.frictionStatic = 1.0;
      this.belt = this.addStatic(belt); this.beltX = { xa, xb };
      // ---- lip geometry. Land direction t (toward the lip), outward normal nr.
      const t = { x: Math.cos(beta), y: -Math.sin(beta) }, nr = { x: -Math.sin(beta), y: -Math.cos(beta) };
      const nA = { x: Math.sin(this.phiA), y: -Math.cos(this.phiA) };
      // where the next pill comes to rest against a pill held on port A (its front end, treated as a W-diameter round end),
      // and so where port B goes: under that front end, on the land (the land is lengthened if B would fall on the belt)
      const placeB = (land) => {
        const x0 = xb + 0.4, P0 = { x: x0, y: 0 }, crest = { x: x0 + land * t.x, y: land * t.y };
        const cx = crest.x, cy = crest.y + Rn;
        const A = { x: cx + Rn * nA.x, y: cy + Rn * nA.y }, C1 = { x: A.x + r * nA.x, y: A.y + r * nA.y };
        const D = { x: P0.x + r * nr.x - C1.x, y: P0.y + r * nr.y - C1.y }, dt = D.x * t.x + D.y * t.y;
        const s = -dt - Math.sqrt(Math.max(0, dt * dt - (D.x * D.x + D.y * D.y - 4 * r * r)));
        return { x0, crest, cx, cy, A, s, sB: s - clamp(+prm.portBBack || 0, 0, 30) };
      };
      let land = clamp(0.5 * sp.W + 2, 3, 20), geo = placeB(land);
      if (geo.sB < 1.5) { land += 1.5 - geo.sB; geo = placeB(land); }
      const { x0, crest, cx, cy, A } = geo, rise = -crest.y;
      this.addStatic(quadPart([{ x: x0, y: 0 }, crest, { x: crest.x, y: 8 }, { x: x0, y: 8 }], 'lane'));
      const nose = [];
      for (let i = 0; i <= 8; i++) { const a = (i / 8) * Math.PI / 2; nose.push({ x: cx + Rn * Math.sin(a), y: cy - Rn * Math.cos(a) }); }
      nose.push({ x: cx + Rn, y: 8 }, { x: cx, y: 8 });
      this.addStatic(quadPart(nose, 'lane'));
      const B = { x: x0 + geo.sB * t.x, y: geo.sB * t.y };
      this.ports = [
        { key: 'A', pos: A, n: nA, att: null, hold: 0, on: false, grab: false },
        { key: 'B', pos: B, n: nr, att: null, hold: 0, on: false, grab: false },
      ];
      this.port = A; this.portN = nA; this.nose = { cx, cy, x0 }; this.land = land;
      // ceiling: level over the belt, then parallel to the ramp and on past the nose, one pill-layer (h) above the surface
      const cL0 = Math.max(rc.x + this.rR + 3, x0 - size - 4), cEnd = cx + Rn + sp.W * 0.9;
      this.addStatic(rectPart((cL0 + x0) / 2, -h - 2.5, x0 - cL0 + 0.5, 5, 0, 'lane'));
      { const p = { x: x0 + h * nr.x, y: h * nr.y }, q = { x: cEnd + h * nr.x, y: -rise - (cEnd - crest.x) * Math.tan(beta) + h * nr.y };
        const w = wallSeg(p, q, 5, nr.x, nr.y, 'lane', 1); if (w) this.addStatic(w); }
      this.mv1 = new P.Mover(0); this.speedCmd = 0; this.phase1 = 0;
      this.buildOutput({ ex: cx + Rn + sp.W * 0.5, ey: 8 + 4, half: Rn + sp.W * 0.5 + 6 });
      this.zones.push({ x0: xa - 6, x1: cEnd + 8, y0: this.roofY - 4, y1: 12 });
      this.vacSig = 0; this.portHold = 0;
    }

    compat() {
      const sp = this.scene.spec, g = this.scene.geo, out = [];
      const Aport = Math.PI * (this.dPort / 2) ** 2, Fs = this.vacKPa * 1e3 * Aport * 1e-6, wN = P.pillMeanMassMg(sp) * 1e-6 * 9.81;
      out.push({ k: 'Feed belt', v: `${this.v1.toFixed(0)} mm/s under a ${this.h.toFixed(1)} mm roller gap (single layer)`, ok: this.h < 2 * sp.W });
      out.push({ k: 'Suction ports (2, fixed)', v: `Ø ${this.dPort.toFixed(1)} mm at −${this.vacKPa.toFixed(0)} kPa → ${Fs.toFixed(2)} N each (${(Fs / wN).toFixed(0)}× pill weight)`, ok: Fs / wN > 15 });
      out.push({ k: 'Lip', v: `${this.land.toFixed(1)} mm land${this.rampDeg ? ` at ${this.rampDeg.toFixed(0)}°` : ''}, ${this.Rn.toFixed(1)} mm nose, port A ${(this.phiA / DEG).toFixed(0)}° round it, port B ${(this.land - (this.ports[1].pos.x - this.nose.x0)).toFixed(1)} mm behind the crest`, ok: true });
      out.push({ k: 'Neck clearance', v: `${(g.mouth / Math.max(sp.W, 1)).toFixed(1)}× pill width`, ok: g.mouth / sp.W >= 1.5 });
      out.push({ k: 'Pinch points', v: 'none, lip and ports are fixed; only the belt moves (friction drive)', ok: true });
      return out;
    }

    // Suction on one fixed port. Pick-up uses the vacuum disc's (concept F) pressure-force / seal-quality test; once a pill
    // is sealed on the port it is held by a seat model: the pressure force pulls it in, the seal lip resists sliding up to
    // (seal friction x suction force) and rolling up to (suction force x port radius), to roll off, a sealed pill has to
    // pivot about the port's rim against the pressure. Past either limit it slips. (F never needed the seat model: its
    // pills ride the moving rim. A pill held on a fixed port would otherwise just roll away.)
    portStep(pt, other) {
      const s = this.scene, sp = s.spec;
      if (!pt.on) { pt.att = null; pt.hold = 0; return; }
      const Aport = Math.PI * (this.dPort / 2) ** 2, F0 = this.vacKPa * 1e3 * Aport * 1e-6;
      const px = pt.pos.x, py = pt.pos.y, nx = pt.n.x, ny = pt.n.y;
      if (!pt.att && pt.grab) {
        const pf = P.VacDiscDesign.prototype.portForce;
        let best = null;
        for (const b of s.pills) {
          if (b === other.att || (pt.key === 'A' && b === this.dropBody && !this.farFromA(b))) continue;
          const dx = b.position.x - px, dy = b.position.y - py;
          if (dx * dx + dy * dy > (Math.max(sp.L, sp.W) / 2 + 4) ** 2) continue;
          const hh = pf.call(this, 0, b, px, py, nx, ny, F0, sp, 10 * (b.mass / 1000) * 9.81);
          if (hh && hh.dmin < 3 && (!best || hh.F > best.h.F)) best = { b, h: hh };
        }
        if (best) {
          const b = best.b, hh = best.h, capF = 10 * (b.mass / 1000) * 9.81;
          if (hh.F > 0.35 * capF && hh.dn < 0.6) { pt.att = b; pt.attLocal = rot({ x: px - b.position.x, y: py - b.position.y }, -b.angle); pt.attAng = b.angle; }
          // not yet sealed: the inflow through a sub-millimetre gap draws it in only weakly (<= its own weight)
          else if (hh.dn < 0.8) { const fa = Math.min(hh.F, 0.1 * capF); Body.applyForce(b, { x: hh.vx, y: hh.vy }, { x: -nx * fa, y: -ny * fa }); }
        }
      }
      const body = pt.att;
      if (!body) { pt.hold = 0; return; }
      const capF = 10 * (body.mass / 1000) * 9.81, Fs = Math.min(F0, capF);      // site-wide cap: 10x pill weight
      const rr = rot(pt.attLocal, body.angle), c = { x: body.position.x + rr.x, y: body.position.y + rr.y };
      const w = body.angularVelocity / 16.6667, vc = { x: body.velocity.x / 16.6667 - w * rr.y, y: body.velocity.y / 16.6667 + w * rr.x };
      const e = { x: px - c.x, y: py - c.y };
      if (Math.hypot(e.x, e.y) > 1.5) { pt.att = null; pt.hold = 0; return; }   // slipped off
      const m = body.mass, wn = 0.35, k = m * wn * wn, cd = 2 * m * wn;
      const en = e.x * nx + e.y * ny, vn = vc.x * nx + vc.y * ny;
      let tx = k * (e.x - en * nx) - cd * (vc.x - vn * nx), ty = k * (e.y - en * ny) - cd * (vc.y - vn * ny);
      const tm = Math.hypot(tx, ty), tmax = 0.6 * Fs;                 // seal-lip friction
      if (tm > tmax) { tx *= tmax / tm; ty *= tmax / tm; }
      const fn = -Fs + clamp(-cd * vn, -Fs, Fs);                      // pressure force into the port, plus seat damping
      Body.applyForce(body, c, { x: tx + nx * fn, y: ty + ny * fn });
      const I = body.inertia, Tmax = Fs * this.dPort / 2;
      body.torque += clamp(-I * wn * wn * (body.angle - pt.attAng) - 2 * I * wn * w, -Tmax, Tmax);
      pt.hold = 1;
    }

    farFromA(b) { const A = this.ports[0].pos, sp = this.scene.spec; return Math.hypot(b.position.x - A.x, b.position.y - A.y) > Math.max(sp.L, sp.W) / 2 + 5; }
    beginJob() { this.cycleStart = this.sensorCount; this.nextCycle(); this.lastEventT = this.scene.t; this.stallCount = 0; }
    // cycleStart only moves when a cycle is evaluated, so a pill that falls between cycles is charged to the next one
    nextCycle() { this.state = 'feed'; this.tState = 0; }

    control(dt) {
      const s = this.scene, [A, B] = this.ports;
      this.controlBase(dt, this.state === 'agitate');
      this.tState += dt;
      switch (this.state) {
        case 'feed': {                                               // belt forward until port A holds the lead pill
          this.speedCmd = 1; A.on = true; A.grab = true; B.on = false; B.grab = false;
          const fell = this.sensorCount > this.cycleStart;           // one went over without being held: count it, carry on
          if (A.hold > 0.5) { this.state = 'grabB'; this.tState = 0; this.lastEventT = s.t; }
          else if (fell) { this.state = 'drop'; this.tState = 0; this.clearFor = 0; this.lastEventT = s.t; }
          else if (s.t - this.lastEventT > this.stallMs) {
            this.stallCount++;
            if (s.stats.inBottle + this.hopperCount() === 0) { this.fail('Bottle is empty.'); break; }
            if (this.stallCount > 6) { this.fail('No pill reached the lip after six de-bridging attempts, bridged over the roller.'); break; }
            s.stats.jams++; this.state = 'agitate'; this.tState = 0; s.log('No pill at the lip, jogging the belt and shaking the hopper to break the bridge.', 'warn');
          }
          break;
        }
        case 'grabB': {                                              // belt stops; port B catches the pill resting against the held one
          this.speedCmd = 0; A.grab = false; B.on = true; B.grab = true;
          if (A.hold < 0.5) { this.state = 'feed'; this.tState = 0; break; }   // it slipped before settling: A re-seats it
          if (B.hold > 0.5 || this.tState > 250) { B.grab = false; this.state = 'drop'; this.tState = 0; this.clearFor = 0; }
          break;
        }
        case 'drop': {                                               // release A: the held pill falls alone; B still holds the next
          this.speedCmd = 0; B.grab = false;
          if (this.tState <= dt) { this.dropBody = A.att; A.on = false; A.grab = false; }
          else if (!A.on && (!this.dropBody || this.farFromA(this.dropBody) || this.tState > 250)) { A.on = true; A.grab = true; }   // re-arm: the lip is only open while the pill leaves
          const got = this.sensorCount - this.cycleStart;
          this.clearFor = this.sensorBlocked ? 0 : this.clearFor + dt;
          if ((got > 0 && this.clearFor > 150 && this.tState > 200) || this.tState > 900) {
            this.evalDrop(got, 'lip'); this.cycleStart = this.sensorCount; this.lastEventT = s.t;
            if (!this.jobDone()) { this.state = 'handoff'; this.tState = 0; }
          }
          break;
        }
        case 'handoff': {                                            // release B; the belt will bring that pill up to A
          this.speedCmd = 0; B.on = false; A.on = true; A.grab = true;
          if (A.hold > 0.5) { this.state = 'grabB'; this.tState = 0; break; }   // A already caught the next one
          if (this.tState > 60) this.nextCycle();
          break;
        }
        case 'agitate': {                                            // jog the belt back and forth under the arch while the hopper shakes hard
          const ph = Math.floor(this.tState / 300) % 2;
          this.speedCmd = this.tState < 1500 ? (ph ? 1.5 : -1) : 0; A.on = true; A.grab = true; B.on = false;
          if (this.tState > 1700) { this.nextCycle(); this.lastEventT = s.t; }
          break;
        }
        default: {                                                   // idle / done: port B keeps the next pill until the next dose (a sealed port
          const done = this.state === 'done';                        // draws no air, so a small vacuum reservoir holds it with the pump off),
          A.on = done; A.grab = done; B.on = done; B.grab = false;    // and the lip stays armed, so anything that creeps over is caught, not dropped
          this.speedCmd = 0;
          break;
        }
      }
      // belt: static geometry with an imposed surface velocity (friction transport), servo ramp, encoder-controlled stop
      if (this.speedCmd === 0) { this.mv1.pos = 0; this.mv1.vel = 0; } else this.mv1.step(this.speedCmd, 1.6, 14, dt);
      const sec = dt / 1000, v1 = this.v1 * this.mv1.pos;
      this.belt.positionPrev.x = this.belt.position.x - v1 * sec;
      this.phase1 += v1 * sec;
      // roller surface moves back toward the hopper while the belt feeds, stripping any second layer (as concept E)
      const wr = (this.mv1.pos > 0.05 ? this.rollerV / this.rR : 0) * sec;
      this.roller.anglePrev = this.roller.angle - wr; this.rollerPhase = (this.rollerPhase || 0) + wr;
      this.portStep(A, B); this.portStep(B, A);
      this.att = A.att; this.portHold = A.hold; this.vacSig = clamp(A.hold * 0.6 + B.hold * 0.4, 0, 1);
      s.pinchWheel = false;
    }
    drawBodies() { return [...this.statics, this.hopper.body]; }
  }
  P.HeldPillDesign = HeldPillDesign;
  P.DESIGNS.hold = { key: 'hold', mount: 'top', cls: HeldPillDesign, order: 8, name: 'Vacuum-lip airlock (held-pill escapement)', short: 'Vacuum lip', family: 'Held-pill airlock' };

  // =====================================================================================================
  //  register
  // =====================================================================================================
  P.ShuttleDesign = ShuttleDesign;
  P.DESIGNS.shuttle = { key: 'shuttle', mount: 'top', cls: ShuttleDesign, order: 3, name: 'Adjustable shuttle slide', short: 'Shuttle', family: 'Linear pocket' };
})(typeof window !== 'undefined' ? window : globalThis);
