/* Prodose simulation, physics core (Matter.js). Works in the browser and in Node (for headless tests).
 *
 *   Scene           engine + pills + bottle + one machine design, damage model, sensors, statistics
 *   WheelDesign     Design A: bottle inverted onto the top, slotted sorting wheel, scraper, trapdoor, funnel, tray
 *   ArmDesign       Design B: bottle docked from below (mouth up), sealed chamber, vacuum robot arm, funnel, tray
 *
 * Everything moving by machine (wheel, bottle flip, arm, gates) is *kinematic*: a static Matter body whose
 * pose is re-set every sub-step with velocity, so pills feel the true wall velocity but nothing can be pushed.
 * Because of that a pinched pill cannot stall the "motor", so a torque-limit / jam detector stops the wheel. */
(function (G) {
  const P = (G.Prodose = G.Prodose || {});
  const Matter = G.Matter || require('matter-js');
  const { Engine, Bodies, Body, Composite, Events, Vertices } = Matter;
  const { clamp, rot, ease, wrap2pi } = P;
  const DEG = Math.PI / 180;
  const CAT = { WALL: 1, PILL: 2, TOOL: 4, HELD: 8 };
  const MOVERS = { wheel: 1, tool: 1, meter: 1, belt: 1, vane: 1, disc: 1 }; // kinematic parts that can pinch a pill
  P.CAT = CAT;

  // =====================================================================================
  //  Pills
  // =====================================================================================
  P.normalizePill = function (s) {
    const shape = P.SHAPES[s.shape] ? s.shape : 'round';
    let L = clamp(+s.L || 8, 3, 32), W = clamp(+s.W || L, 2.5, 18);
    if (shape === 'round') W = L;
    if (W > L) { const t = W; W = L; L = t; }
    return { shape, L, W, color: s.color || 'white' };
  };

  P.pillArea = function (s) {
    if (s.shape === 'round') return Math.PI * (s.L / 2) * (s.L / 2);
    if (s.shape === 'capsule') return s.L * s.W - s.W * s.W * (1 - Math.PI / 4);
    if (s.shape === 'caplet') return s.L * s.W * 0.95;
    return (Math.PI / 4) * s.L * s.W * (s.shape === 'softgel' ? 1.08 : 1);
  };

  // Mean pill mass (mg) from the 2-D outline (out-of-plane depth ~ thickness) and material density; per-pill spread.
  P.pillMassMg = function (s, rand) {
    const dens = (P.SHAPES[s.shape] || P.SHAPES.round).density;   // g/cm^3
    const depth = s.shape === 'round' ? 0.5 * s.L : 0.85 * s.W;
    const mean = P.pillArea(s) * depth * dens;                      // mm^3 * g/cm^3 = mg
    const cv = { round: 0.03, oval: 0.03, caplet: 0.035, capsule: 0.07, softgel: 0.05 }[s.shape] || 0.04;
    if (!rand) return mean;
    const g = Math.sqrt(-2 * Math.log(Math.max(1e-9, rand()))) * Math.cos(2 * Math.PI * rand());
    return Math.max(mean * 0.5, mean * (1 + cv * g));
  };
  P.pillMeanMassMg = (s) => P.pillMassMg(s, null);
  // Fracture (crush) force in N: material rating at its reference size, scaled ~ W^1.5 (section area x lever) with size.
  P.pillCrushN = function (s) {
    const m = P.SHAPES[s.shape];
    return clamp(m.crushN * Math.pow(Math.max(s.W, 2) / m.ref, 1.5), 6, 400);
  };

  // Convex outline of a pill in its local frame (long axis = x). Used for physics, rendering and grip maths.
  P.pillLocalVerts = function (s) {
    const pts = [];
    if (s.shape === 'round') {
      const r = s.L / 2, n = 22;
      for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; pts.push({ x: r * Math.cos(a), y: r * Math.sin(a) }); }
    } else if (s.shape === 'capsule') {
      const r = s.W / 2, h = s.L / 2 - r, n = 9;
      for (let i = 0; i <= n; i++) { const a = -Math.PI / 2 + (i / n) * Math.PI; pts.push({ x: h + r * Math.cos(a), y: r * Math.sin(a) }); }
      for (let i = 0; i <= n; i++) { const a = Math.PI / 2 + (i / n) * Math.PI; pts.push({ x: -h + r * Math.cos(a), y: r * Math.sin(a) }); }
    } else if (s.shape === 'caplet') {
      const rc = Math.min(s.W * 0.34, s.L * 0.2), hx = s.L / 2 - rc, hy = s.W / 2 - rc, n = 4;
      const cs = [[hx, hy, 0], [-hx, hy, 90], [-hx, -hy, 180], [hx, -hy, 270]];
      for (const [cx, cy, a0] of cs) for (let i = 0; i <= n; i++) {
        const a = (a0 + (i / n) * 90) * DEG; pts.push({ x: cx + rc * Math.cos(a), y: cy + rc * Math.sin(a) });
      }
    } else {
      const e = s.shape === 'softgel' ? 2.6 : 2.0, n = 26;
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2, c = Math.cos(a), sn = Math.sin(a);
        pts.push({ x: (s.L / 2) * Math.sign(c) * Math.pow(Math.abs(c), 2 / e), y: (s.W / 2) * Math.sign(sn) * Math.pow(Math.abs(sn), 2 / e) });
      }
    }
    return pts;
  };

  function makePill(scene, x, y, angle, id) {
    const s = scene.spec, mat = P.SHAPES[s.shape];
    const opts = {
      angle, friction: mat.friction, frictionStatic: mat.friction * 0.8, restitution: mat.restitution, frictionAir: 0.0006,
      density: 0.0012, slop: 0.04,
      collisionFilter: { category: CAT.PILL, mask: CAT.WALL | CAT.PILL | CAT.TOOL },
    };
    let body;
    if (s.shape === 'round') body = Bodies.circle(x, y, s.L / 2, opts, 22);
    else {
      const v = Vertices.clockwiseSort(scene.localVerts.map((p) => ({ x: p.x, y: p.y })));
      body = Bodies.fromVertices(x, y, [v], opts);
    }
    body.label = 'pill';
    const massMg = P.pillMassMg(s, scene.rand);
    Body.setMass(body, massMg / 1000);            // real mass in grams -> forces come out in newtons (g·mm/ms² = N)
    body.plugin.pill = { mass: massMg, crushN: P.pillCrushN(s), peakF: 0, id, stress: 0, level: 0, zone: 'bottle', held: false, counted: false, pinchSteps: 0, impacts: 0, maxImpact: 0, fell: false };
    return body;
  }

  // =====================================================================================
  //  Kinematic rigs
  // =====================================================================================
  // A rigid group of static parts, authored in a local frame (origin 0,0 / angle 0) and posed every step.
  class Rig {
    constructor(parts, opts) {
      opts = opts || {};
      if (parts.length === 1) this.body = parts[0];
      else this.body = Body.create({ parts, isStatic: true, friction: SLICK[opts.label] ? 0.1 : 0.5, frictionStatic: SLICK[opts.label] ? 0.16 : 0.8, restitution: 0.08 });
      this.body.label = opts.label || 'wall';
      if (opts.friction != null) this.body.friction = opts.friction;
      if (opts.restitution != null) this.body.restitution = opts.restitution;
      this.c0 = { x: this.body.position.x, y: this.body.position.y };
      this.ox = 0; this.oy = 0; this.a = 0;
    }
    place(x, y, a) {
      this.ox = x; this.oy = y; this.a = a;
      Body.setAngle(this.body, a, true);
      const c = rot(this.c0, a);
      Body.setPosition(this.body, { x: x + c.x, y: y + c.y }, true);
    }
    // local -> world
    toWorld(p) { const r = rot(p, this.a); return { x: this.ox + r.x, y: this.oy + r.y }; }
    toLocal(p) { return rot({ x: p.x - this.ox, y: p.y - this.oy }, -this.a); }
  }

  const SLICK = { wheel: 1, housing: 1, gate: 1, shutter: 1, cap: 1, ramp: 1, chute: 1, meter: 1, base: 1, lane: 1, disc: 1 }; // polished / PTFE-coated metal parts
  function rectPart(cx, cy, w, h, angle, label) {
    const slick = SLICK[label];
    const b = Bodies.rectangle(cx, cy, w, h, { isStatic: true, angle: angle || 0, friction: slick ? 0.1 : 0.5, frictionStatic: slick ? 0.16 : 0.8, restitution: 0.08 });
    b.label = label || 'wall';
    return b;
  }

  function quadPart(pts, label) {
    const b = Bodies.fromVertices(0, 0, [Vertices.clockwiseSort(pts.map((v) => ({ x: v.x, y: v.y })))], { isStatic: true, friction: SLICK[label] ? 0.1 : 0.5, frictionStatic: SLICK[label] ? 0.16 : 0.8, restitution: 0.08 });
    // fromVertices re-centres on the centroid; move it back to where the points really are
    const cen = Vertices.centre(Vertices.create(pts.map((v) => ({ x: v.x, y: v.y }))));
    Body.setPosition(b, { x: cen.x, y: cen.y });
    b.label = label || 'wall';
    return b;
  }

  // Thick wall along p->q whose *inner* face is the line p-q, offset outward by the normal (nx,ny).
  function wallSeg(p, q, tk, nx, ny, label, ext) {
    const dx = q.x - p.x, dy = q.y - p.y, len = Math.hypot(dx, dy);
    if (len < 1e-6) return null;
    const cx = (p.x + q.x) / 2 + nx * tk / 2, cy = (p.y + q.y) / 2 + ny * tk / 2;
    return rectPart(cx, cy, len + (ext == null ? tk * 0.5 : ext), tk, Math.atan2(dy, dx), label);
  }

  // =====================================================================================
  //  Bottle
  // =====================================================================================
  P.bottleGeometry = function (b, cap) {
    const st = P.BOTTLES[b.style] || P.BOTTLES.vial;
    const t = 2.4;
    const D = clamp(b.D, 22, 100), H = clamp(b.H, 40, 230);
    const wi = D / 2 - t;
    const wn = clamp(b.mouth / 2, 5, wi);
    const hN = st.neck;
    let hS = (wi - wn) * st.slope * (st.dome ? 1 : 1);
    hS = Math.min(hS, H - hN - 20);
    if (hS < 0.5) hS = 0;
    const ch = Math.min(4, wi * 0.25);
    const pts = [{ x: wn, y: 0 }, { x: wn, y: hN }];
    if (hS > 0) {
      if (st.dome) for (let i = 1; i <= 7; i++) { const a = (i / 7) * Math.PI / 2; pts.push({ x: wn + (wi - wn) * Math.sin(a), y: hN + hS - hS * Math.cos(a) }); }
      else pts.push({ x: wi, y: hN + hS });
    } else if (wi > wn + 0.1) pts.push({ x: wi, y: hN });
    pts.push({ x: wi, y: H - ch }, { x: wi - ch, y: H }, { x: 0, y: H });
    // remove zero-length duplicates
    const clean = [pts[0]];
    for (let i = 1; i < pts.length; i++) if (Math.hypot(pts[i].x - clean[clean.length - 1].x, pts[i].y - clean[clean.length - 1].y) > 0.05) clean.push(pts[i]);
    return { style: st, styleKey: b.style, t, D, H, wi, wn, hN, hS, ch, pts: clean, hc: cap ? 14 : 0, color: b.color || st.color, mouth: wn * 2 };
  };

  P.halfWidthAt = function (geo, y) {
    if (y < 0) return geo.wn;
    const p = geo.pts;
    for (let i = 0; i < p.length - 1; i++) {
      const a = p[i], b = p[i + 1];
      if (y >= a.y - 1e-9 && y <= b.y + 1e-9) { const dy = b.y - a.y; return dy < 1e-9 ? Math.max(a.x, b.x) : a.x + ((b.x - a.x) * (y - a.y)) / dy; }
    }
    return 0;
  };

  function buildBottleRig(geo, sealedCap) {
    const parts = [], tk = 6;
    const right = geo.pts;
    for (let i = 0; i < right.length - 1; i++) {
      const p = right[i], q = right[i + 1];
      const dx = q.x - p.x, dy = q.y - p.y, l = Math.hypot(dx, dy);
      if (l < 1e-6) continue;
      const nx = dy / l, ny = -dx / l; // outward for the right side polyline (mouth -> base)
      const w = wallSeg(p, q, tk, nx, ny, 'bottle', 3);
      if (w) parts.push(w);
      const wl = wallSeg({ x: -p.x, y: p.y }, { x: -q.x, y: q.y }, tk, -nx, ny, 'bottle', 3);
      if (wl) parts.push(wl);
    }
    if (sealedCap && geo.hc > 0) {
      parts.push(rectPart(geo.wn + 2.5, -geo.hc / 2 + 0.5, 5, geo.hc + 1, 0, 'cap'));
      parts.push(rectPart(-geo.wn - 2.5, -geo.hc / 2 + 0.5, 5, geo.hc + 1, 0, 'cap'));
    }
    const rig = new Rig(parts, { label: 'bottle' });
    rig.geo = geo;
    return rig;
  }

  // =====================================================================================
  //  Scene
  // =====================================================================================
  class Scene {
    constructor(params) {
      this.params = params;
      const DES = (P.DESIGNS && P.DESIGNS[params.design]) || P.DESIGNS.wheel;
      this.design = DES.key; this.mount = DES.mount;           // mount: 'top' = inverted bottle, 'bottom' = docked from below
      this.spec = P.normalizePill(params.pill);
      this.localVerts = P.pillLocalVerts(this.spec);
      this.rand = P.rng(params.seed || 11);
      this.t = 0; this.step_n = 0;
      this.pills = []; this.events = []; this.eventSeq = 0;
      this.stats = { target: 0, dispensed: 0, collected: 0, misses: 0, doubles: 0, jams: 0, attempts: 0, damaged: 0, stressed: 0, spilled: 0, inBottle: 0, inMachine: 0, elapsed: 0, unreachable: 0 };
      this.status = 'Bottle on loading station';
      this.phase = 'station'; // station -> docking -> docked
      this.dockT = 0;
      this.paused = false;
      this.pinchNow = 0; this.pinchWheel = false; this.load = 0; this.pinchDepth = 0.9;

      this.engine = Engine.create({ positionIterations: 10, velocityIterations: 8, constraintIterations: 2 });
      this.engine.gravity.x = 0; this.engine.gravity.y = 1; this.engine.gravity.scale = P.G_MM_MS2;
      this.world = this.engine.world;
      this.dyn = [];

      const top = this.mount === 'top';
      const sealed = top ? params.cap !== false : true;
      this.geo = P.bottleGeometry(params.bottle, top && sealed);
      this.sealedCap = top ? sealed : true;
      this.bottle = buildBottleRig(this.geo, top && sealed);
      Composite.add(this.world, this.bottle.body);
      this.cycles = [];                       // one record per metering cycle (used by the test bench)
      this.scope = { t: [], b1: [], b2: [], m: [], v: [] }; // sensor waveforms, 1 kHz

      this.machine = new DES.cls(this);
      this.bottlePose(0);
      this.spawnPills();
      this.installEvents();
      this.settle(1.8);
      this.updateZones(true);
      this.compat = this.machine.compat();
    }

    log(msg, level) { this.events.push({ id: ++this.eventSeq, t: this.t, msg, level: level || 'info' }); if (this.events.length > 300) this.events.shift(); }

    // ---- population ---------------------------------------------------------------
    spawnPills() {
      const g = this.geo, s = this.spec, r = this.rand;
      const area = P.pillArea(s);
      const bodyArea = 2 * g.wi * (g.H - g.hN - g.hS - g.ch) + (g.wi + g.wn) * g.hS + 2 * g.wn * g.hN;
      const cap = Math.floor((0.58 * bodyArea) / area);
      const want = Math.max(1, Math.round((cap * clamp(this.params.fill, 5, 100)) / 100));
      const maxSim = 210;
      const n = Math.min(want, maxSim);
      this.fillReq = want; this.fillCap = cap;
      // Random sequential placement, each pill modelled as a capsule (segment + radius) so long pills pack sensibly.
      const rw = s.W / 2, half = Math.max(0, s.L / 2 - rw);
      const segDist = (a, b) => {
        const d1x = a.x1 - a.x0, d1y = a.y1 - a.y0, d2x = b.x1 - b.x0, d2y = b.y1 - b.y0;
        const rx = a.x0 - b.x0, ry = a.y0 - b.y0;
        const A = d1x * d1x + d1y * d1y, E = d2x * d2x + d2y * d2y, F = d2x * rx + d2y * ry;
        let S, T;
        if (A < 1e-9 && E < 1e-9) return Math.hypot(rx, ry);
        if (A < 1e-9) { S = 0; T = clamp(F / E, 0, 1); }
        else {
          const C = d1x * rx + d1y * ry;
          if (E < 1e-9) { T = 0; S = clamp(-C / A, 0, 1); }
          else {
            const B = d1x * d2x + d1y * d2y, den = A * E - B * B;
            S = den > 1e-9 ? clamp((B * F - C * E) / den, 0, 1) : 0;
            T = (B * S + F) / E;
            if (T < 0) { T = 0; S = clamp(-C / A, 0, 1); } else if (T > 1) { T = 1; S = clamp((B - C) / A, 0, 1); }
          }
        }
        return Math.hypot(rx + d1x * S - d2x * T, ry + d1y * S - d2y * T);
      };
      const placed = [];
      let attempts = 0;
      const yBottom = g.H - g.ch - rw - 0.3, yTop = g.hN + 1;
      let zoneTop = yBottom - (yBottom - yTop) * 0.55;
      while (placed.length < n && attempts < 14000) {
        attempts++;
        const y = zoneTop + r() * (yBottom - zoneTop);
        const a = r() * Math.PI, ca = Math.cos(a), sa = Math.sin(a);
        const ext = Math.abs(half * sa) + rw;              // vertical reach of the pill
        if (y - ext < g.hN + 0.5 || y + ext > g.H - g.ch) continue;
        const hwAt = Math.min(P.halfWidthAt(g, y - ext), P.halfWidthAt(g, y + ext), P.halfWidthAt(g, y)) - rw - 0.4;
        const reach = Math.abs(half * ca);
        if (hwAt - reach <= 0) continue;
        const x = (r() * 2 - 1) * (hwAt - reach);
        const cand = { x0: x - half * ca, y0: y - half * sa, x1: x + half * ca, y1: y + half * sa };
        let ok = true;
        for (const q of placed) { if (Math.abs(q.cy - y) > 2 * (half + rw) + 1) continue; if (segDist(cand, q.seg) < 2 * rw + 0.3) { ok = false; break; } }
        if (ok) placed.push({ x, y, a, cy: y, seg: cand });
        if (attempts % 900 === 0 && placed.length < n) zoneTop = Math.max(g.hN + 1, zoneTop - (yBottom - yTop) * 0.12);
      }
      placed.sort((a, b) => b.y - a.y);
      const bp = this.bottle;
      placed.forEach((q, i) => {
        const w = bp.toWorld({ x: q.x, y: q.y });
        this.pills.push(makePill(this, w.x, w.y, q.a, i + 1));
      });
      Composite.add(this.world, this.pills);
      this.stats.total = this.pills.length;
      if (this.pills.length < want) this.log(`Bottle holds ~${this.pills.length} pills of this size (requested ${want}).`, 'warn');
    }

    installEvents() {
      const scene = this;
      Events.on(this.engine, 'collisionStart', (ev) => {
        for (const pair of ev.pairs) {
          const a = pair.bodyA.parent, b = pair.bodyB.parent;
          const pa = a.plugin && a.plugin.pill, pb = b.plugin && b.plugin.pill;
          if (!pa && !pb) continue;
          const n = pair.collision.normal;
          const rv = Math.abs((b.velocity.x - a.velocity.x) * n.x + (b.velocity.y - a.velocity.y) * n.y) * 60; // mm/s
          if (pa) scene.impact(pa, rv, b.isStatic ? 1 : 0.55);
          if (pb) scene.impact(pb, rv, a.isStatic ? 1 : 0.55);
        }
      });
    }

    impact(p, speed, w) {
      const mat = P.SHAPES[this.spec.shape];
      const vcrit = Math.sqrt(2 * 9810 * mat.hDrop * 1000);   // mm/s reached when dropped from the rated height onto steel
      const r = (speed * w) / vcrit;
      if (speed > p.maxImpact) p.maxImpact = speed;
      if (r > 0.6) this.addStress(p, 1.2 * (r - 0.6) * (r - 0.6));
    }

    addStress(p, s) {
      if (!(s > 0)) return;
      const pl = p.stress, was = this.levelOf(pl);
      p.stress = pl + s;
      const now = this.levelOf(p.stress);
      p.level = now;
    }
    levelOf(s) { return s >= 1 ? 2 : s >= 0.5 ? 1 : 0; }

    // ---- kinematic bottle pose -----------------------------------------------------
    bottlePose(dt) {
      const pose = this.machine.bottlePoseAt(this.phase === 'station' ? 0 : this.phase === 'docked' ? 1 : this.dockU);
      this.bottle.place(pose.x + (this.phase === 'docked' ? this.agitDx || 0 : 0), pose.y, pose.a);
    }

    startDock() {
      if (this.phase !== 'station') return false;
      this.phase = 'docking'; this.dockT = 0; this.dockU = 0;
      const top = this.mount === 'top';
      this.status = top ? (this.sealedCap ? 'Flipping bottle (sealed adapter cap on)' : 'Flipping bottle, NO adapter cap') : 'Raising bottle into sealed dock';
      this.log(top
        ? (this.sealedCap ? 'Adapter cap screwed on, shutter closed. Flipping bottle onto the machine…' : 'No adapter cap! Flipping open bottle onto the machine…')
        : 'Bottle seated in bottom dock. Raising against the sealing collar…');
      return true;
    }

    // ---- stepping -----------------------------------------------------------------
    step(dt) {
      if (this.paused) return;
      dt = dt || P.DT;
      this.t += dt; this.step_n++;
      if (this.phase === 'docking') {
        this.dockT += dt;
        const dur = this.machine.dockDuration;
        this.dockU = clamp(this.dockT / dur, 0, 1);
        if (this.dockT >= dur) { this.phase = 'docked'; this.dockU = 1; this.machine.onDocked(); }
      }
      this.machine.control(dt);
      this.bottlePose(dt);
      Engine.update(this.engine, dt);
      this.analyze(dt);
      this.machine.sense(dt);
      if (this.step_n % 8 === 0) this.updateZones(false);
      if (this.machine.busy) this.stats.elapsed += dt;
    }

    settle(seconds) {
      const n = Math.round((seconds * 1000) / P.DT);
      for (let i = 0; i < n; i++) {
        this.machine.control(P.DT);
        this.bottlePose(P.DT);
        Engine.update(this.engine, P.DT);
      }
      for (const b of this.pills) { b.plugin.pill.stress = 0; b.plugin.pill.level = 0; b.plugin.pill.maxImpact = 0; }
      this.t = 0; this.step_n = 0;
    }

    // Contact analysis: crush / pinch detection between pills and moving hard parts.
    analyze(dt) {
      const list = this.engine.pairs.list;
      const touched = [];
      for (let i = 0; i < list.length; i++) {
        const pair = list[i];
        if (!pair.isActive) continue;
        const a = pair.bodyA.parent, b = pair.bodyB.parent;
        let pill = null, wall = null;
        // a 'wall' is anything a pill can be squeezed against: static geometry OR a force-limited actuator body (dynamic, but driven)
        const wallish = (x) => x.isStatic || !!(x.plugin && x.plugin.actuator);
        if (a.plugin.pill && !a.isStatic && wallish(b)) { pill = a; wall = b; }
        else if (b.plugin.pill && !b.isStatic && wallish(a)) { pill = b; wall = a; }
        else continue;
        const info = pill.plugin.pill;
        if (!info._c) { info._c = []; touched.push(pill); }
        const sup = (pair.contacts && pair.contacts[0] && pair.contacts[0].vertex) || (pair.collision.supports && pair.collision.supports[0]);
        // Matter's own contact normal, flipped so it points from the wall into the pill
        let nx = pair.collision.normal.x, ny = pair.collision.normal.y;
        if (sup && nx * (pill.position.x - sup.x) + ny * (pill.position.y - sup.y) < 0) { nx = -nx; ny = -ny; }
        info._c.push({ d: pair.collision.depth, nx, ny, label: wall.label, act: wall.plugin && wall.plugin.actuator });
      }
      const mat = P.SHAPES[this.spec.shape];
      let worst = 0, worstWheel = false, anyLabels = null, anyDepth = 0;
      for (const pill of touched) {
        const info = pill.plugin.pill, cs = info._c; info._c = null;
        let best = 0, wheelInvolved = false, bestLabels = null, bestF = 0, bestAct = false;
        for (let i = 0; i < cs.length; i++) for (let j = i + 1; j < cs.length; j++) {
          if (cs[i].nx * cs[j].nx + cs[i].ny * cs[j].ny < -0.7) {
            const sum = cs[i].d + cs[j].d;
            if (sum > best) { best = sum; wheelInvolved = !!(MOVERS[cs[i].label] || MOVERS[cs[j].label]); bestLabels = [cs[i].label, cs[j].label]; bestF = Math.max(cs[i].act ? cs[i].act.forceN() : 0, cs[j].act ? cs[j].act.forceN() : 0); bestAct = !!(cs[i].act || cs[j].act); }
          }
        }
        if (best > 0.12 && bestLabels) { anyLabels = bestLabels; if (best > anyDepth) anyDepth = best; }
        if (bestAct && best > 0.005) {
          // squeezed between a force-limited actuator and another surface: the squeeze force IS the servo load (N); fracture ~ (F / crush)^3 over time.
          // No overlap depth needed, a rigid contact solver holds the pill with almost no interpenetration.
          info.peakF = Math.max(info.peakF, bestF);
          info.stress += Math.pow(bestF / info.crushN, 3) * dt / 40;
          info.level = this.levelOf(info.stress);
        }
        if (best > this.pinchDepth) {
          info.pinchSteps++;
          if (best > worst) { worst = best; worstWheel = wheelInvolved; this.pinchLabels = bestLabels; }
          if (bestAct) { /* force-limited: accounted above */ } else if (bestLabels && (bestLabels[0] === 'belt' || bestLabels[1] === 'belt')) {
            // belt / spring-loaded singulating roller: friction drive, nip force = spring rate (0.5 N/mm) × interference, capped at 3 N
            const Fn = Math.min(3, 0.5 * best);
            info.peakF = Math.max(info.peakF, Fn); info.stress += Math.pow(Fn / info.crushN, 3) * dt / 40;
          } else if (wheelInvolved) info.stress += ((best - 0.35) * dt) / (260 * mat.fragile);   // legacy kinematic mover (wheel)
          // static-vs-static squeeze has no force source: no damage
          info.level = this.levelOf(info.stress);
        } else info.pinchSteps = Math.max(0, info.pinchSteps - 2);
        if (info.pinchSteps > this.jamSteps(info) || best > 2.0) { this.pinchWheel = this.pinchWheel || wheelInvolved; }
      }
      this.pinchNow = worst; this.pinchAnyLabels = anyLabels; this.pinchAnyDepth = anyDepth;
    }
    jamSteps() { return 8; }

    updateZones(force) {
      const st = this.stats;
      let inB = 0, inM = 0, dmg = 0, str = 0, col = 0, spilled = 0;
      for (const b of this.pills) {
        const info = b.plugin.pill;
        let zone;
        if (info.held) zone = 'held';
        else {
          const l = this.bottle.toLocal(b.position);
          const g = this.geo;
          if (l.y > -g.hc - 1 && l.y < g.H + 1 && Math.abs(l.x) <= P.halfWidthAt(g, l.y) + 1 && this.bottleContains(l)) zone = 'bottle';
          else zone = this.machine.zoneOf(b.position);
        }
        info.zone = zone;
        if (zone === 'bottle') inB++;
        else if (zone === 'tray') col++;
        else if (zone === 'spilled') spilled++;
        else inM++;
        if (info.level === 2) dmg++; else if (info.level === 1) str++;
      }
      st.inBottle = inB; st.inMachine = inM; st.collected = col; st.spilled = spilled; st.damaged = dmg; st.stressed = str;
      if (spilled > (this._lastSpilled || 0)) {
        this.log(`${spilled - (this._lastSpilled || 0)} pill(s) escaped onto the machine/table!`, 'bad');
      }
      this._lastSpilled = spilled;
      if (dmg > (this._lastDmg || 0)) this.log(`Pill damaged (${dmg} total), crushed / chipped.`, 'bad');
      this._lastDmg = dmg;
    }
    bottleContains(l) { return true; }

    dispense(n) { return this.machine.startDispense(n); }
    reset() { /* handled by rebuilding the scene in the UI layer */ }
    takeTray() {
      // remove every pill lying in the tray from the world (patient takes the dose)
      const gone = [];
      for (const b of this.pills) if (b.plugin.pill.zone === 'tray') gone.push(b);
      for (const b of gone) { Composite.remove(this.world, b); const i = this.pills.indexOf(b); if (i >= 0) this.pills.splice(i, 1); }
      this.stats.dispensedTotalTaken = (this.stats.dispensedTotalTaken || 0) + gone.length;
      this.log(`Dose removed from tray (${gone.length} pill${gone.length === 1 ? '' : 's'}).`, 'ok');
      this.stats.collected = 0;
      return gone.length;
    }
  }

  // =====================================================================================
  //  Design A, inverted bottle + multi-size sorting wheel
  // =====================================================================================
  class WheelDesign {
    constructor(scene) {
      this.scene = scene; this.kind = 'wheel';
      const prm = scene.params, sp = scene.spec, g = scene.geo;
      this.R = 72; this.N = 10; this.tk = 6;
      // scraper clearance: auto-tuned to the pill (thin pills need a tighter blade), or set by hand
      this.autoScraper = prm.scraper == null || prm.scraper === 'auto';
      this.scraper = this.autoScraper ? clamp(sp.W * 0.25 + 0.2, 1.3, 2.0) : clamp(+prm.scraper, 0.4, 3.5);
      this.Rh = this.R + this.scraper;
      // ---- ten slot-size settings (slot width); a floor shim sets the depth so exactly one pill lies in it
      this.sizeW = (s) => P.SLOT_WIDTHS[s - 1];
      this.autoSize = this.N;
      for (let s = 1; s <= this.N; s++) if (this.sizeW(s) >= sp.L + 0.8) { this.autoSize = s; break; }
      const manual = prm.pocket && prm.pocket !== 'auto' ? clamp(parseInt(prm.pocket, 10), 1, this.N) : null;
      this.size = manual != null ? manual : this.autoSize;
      this.manual = manual != null;
      this.slot = { w: this.sizeW(this.size), d: clamp(sp.W + 1.8, 3.6, 22) }; // floor shim: one pill lies in the slot
      this.pockets = [];
      for (let k = 0; k < this.N; k++) this.pockets.push({ k, w: this.slot.w, d: this.slot.d, a: (k * 360) / this.N * DEG });

      // ---- hopper / feed geometry
      this.wn = g.wn;
      this.hw = Math.min(this.slot.w / 2 + (prm._feedExtra != null ? prm._feedExtra : (sp.L / sp.W < 1.3 ? 1.3 : 3.0)), g.wn); // single-file feed: opening only just wider than the slot
      const hw = this.hw;
      // V-shaped funnel straight down to the wheel: the leaning walls make an obtuse corner with the rim,
      // so a pill squeezed against the scraper is pushed up and out instead of wedging.
      const yh0 = -Math.sqrt((this.R + this.scraper) * (this.R + this.scraper) - hw * hw);
      this.yF = yh0;
      const fh = Math.abs(hw - g.wn) / Math.tan(24 * DEG);
      this.yFt = yh0 - fh;
      this.roofY = this.yFt - 16;
      this.cap = scene.sealedCap && g.hc > 0;
      this.gw = this.slot.w / 2 + 3;
      this.gapHalf = Math.asin(this.gw / this.Rh);
      this.omega = clamp(prm.wheelSpeed || 220, 40, 420) * DEG;
      this.vibe = prm.vibe !== false;

      this.statics = [];
      this.buildStatics();
      this.buildWheel();
      this.buildBottleStation();
      this.buildBoundary();

      this.step0 = -Math.PI / 2 - this.pockets[0].a; // wheel angle with slot 0 at the fill position
      this.idx = 0; this.phi = new P.Mover(this.step0);
      this.gateOpen = false; this.gateAnim = 0;
      this.state = 'idle'; this.busy = false;
      this.remaining = 0; this.job = 0; this.consec = 0; this.tState = 0; this.jamRetries = 0; this.primeLeft = 0; this.primed = false; this.slow = 0;
      this.shutterOpen = false; this.shutterAnim = 0;
      this.dockDuration = 3600;
      this.sensorBlocked = false; this.sensorCount = 0; this.dropStartCount = 0; this.clearFor = 0;
      this.jamFlash = 0; this._tgt = null;
      Body.setAngle(this.rotor.body, this.phi.pos, false); this.rotor.body.angularVelocity = 0;
    }

    compat() {
      const sp = this.scene.spec, g = this.scene.geo, sl = this.slot;
      const out = [];
      const clearance = sl.w - sp.L;
      let fit = 'good';
      if (clearance < 0.5) fit = 'tight';
      if (sl.w >= 1.6 * sp.L) fit = 'roomy';                                // squeezed pairs / tilted pills can slip through
      if (sl.w >= 2 * sp.L - 0.5 || sl.d >= 2 * sp.W - 0.3) fit = 'double'; // two pills side by side, or stacked
      out.push({ k: 'Slot size', v: `setting ${this.size}/10 (${sl.w.toFixed(1)} × ${sl.d.toFixed(1)} mm)${this.manual ? ' · manual' : ' · auto'}`, ok: true });
      out.push({ k: 'Slot fit', v: fit === 'good' ? `pill ${sp.L.toFixed(1)} × ${sp.W.toFixed(1)} mm, snug, one at a time` : fit === 'tight' ? 'pill is longer than the slot, will not seat' : fit === 'roomy' ? 'slot is roomy, pills can slip through in pairs' : 'slot fits two pills, double-pick risk', ok: fit === 'good' });
      const neckRatio = g.mouth / Math.max(sp.W, 1);
      out.push({ k: 'Neck clearance', v: `${neckRatio.toFixed(1)}× pill width`, ok: neckRatio >= 1.5 });
      const open = 2 * this.hw;
      out.push({ k: 'Feed opening', v: open >= sp.L * 1.05 ? `${open.toFixed(1)} mm, pills can lie flat over the slot` : `${open.toFixed(1)} mm is narrower than the ${sp.L.toFixed(1)} mm pill, it must enter end-first (jam risk)`, ok: open >= sp.L * 1.05 });
      if (sp.W < 4) out.push({ k: 'Tiny pill', v: 'below ~4 mm the scraper gap and slot walls are hard to hold, expect jams', ok: false });
      out.push({ k: 'Scraper gap', v: `${this.scraper.toFixed(1)} mm${this.autoScraper ? ' · auto' : ' · manual'}`, ok: this.scraper > 0.55 && this.scraper < Math.max(1.0, sp.W * 0.45) });
      out.push({ k: 'Wheel drive', v: `${this.motorT.toFixed(0)} N·mm torque limit = ${(this.motorT / (this.R * 0.9)).toFixed(1)} N at the rim (pill crush ${P.pillCrushN(sp).toFixed(0)} N)`, ok: this.motorT / (this.R * 0.9) < 0.5 * P.pillCrushN(sp) });
      return out;
    }

    // ---------------------------------------------------------------------------------
    addStatic(b, label) { if (label) b.label = label; this.statics.push(b); Composite.add(this.scene.world, b); return b; }

    buildStatics() {
      const R = this.R, Rh = this.Rh, tk = this.tk, hw = this.hw, wn = this.wn, C = { x: 0, y: 0 };
      const scene = this.scene, world = scene.world;
      const parts = [];
      // chute + funnel + hopper walls (right side then mirrored)
      const yh = -Math.sqrt(Rh * Rh - hw * hw);
      const rp = [{ x: wn, y: this.roofY }, { x: wn, y: this.yFt }];
      rp.push({ x: hw, y: yh + 1 });
      for (let i = 0; i < rp.length - 1; i++) {
        const p = rp[i], q = rp[i + 1];
        const dx = q.x - p.x, dy = q.y - p.y, l = Math.hypot(dx, dy);
        if (l < 1e-6) continue;
        const nx = dy / l, ny = -dx / l;
        const w = wallSeg(p, q, tk, nx, ny, 'housing', 3); if (w) parts.push(w);
        const wl = wallSeg({ x: -p.x, y: p.y }, { x: -q.x, y: q.y }, tk, -nx, ny, 'housing', 3); if (wl) parts.push(wl);
      }
      this.hopperRP = rp;
      // housing arcs
      const arc = (a0, a1, label, list) => {
        const n = Math.max(1, Math.ceil(Math.abs(a1 - a0) / (6 * DEG)));
        for (let i = 0; i < n; i++) {
          const t0 = a0 + ((a1 - a0) * i) / n, t1 = a0 + ((a1 - a0) * (i + 1)) / n, tm = (t0 + t1) / 2;
          const chord = 2 * Rh * Math.sin((t1 - t0) / 2);
          const c = { x: C.x + (Rh + tk / 2) * Math.cos(tm), y: C.y + (Rh + tk / 2) * Math.sin(tm) };
          list.push(rectPart(c.x, c.y, chord + 0.8, tk, tm + Math.PI / 2, label));
        }
      };
      const aR = -Math.PI / 2 + Math.asin(hw / Rh), aL = (3 * Math.PI) / 2 - Math.asin(hw / Rh);
      this.aR = aR; this.aL = aL;
      const eA = Math.PI / 2 - this.gapHalf, eB = Math.PI / 2 + this.gapHalf;
      const hopperRig = new Rig(parts, { label: 'housing' });
      hopperRig.place(0, 0, 0);
      this.hopper = hopperRig; Composite.add(world, hopperRig.body);
      const arcParts = [];
      arc(aR, eA, 'housing', arcParts); arc(eB, aL, 'housing', arcParts);
      const rigH = new Rig(arcParts, { label: 'housing' });
      rigH.place(0, 0, 0);
      this.housing = rigH; Composite.add(world, rigH.body);
      // trapdoor
      const gp = []; arc(eA, eB, 'gate', gp);
      this.gate = new Rig(gp, { label: 'gate' }); this.gate.place(0, 0, 0);
      Composite.add(world, this.gate.body);
      // roof plates (machine top) with the feed opening; top surface at roofY
      const roofL = -(1.6 * scene.geo.D + 80), roofR = scene.geo.D / 2 + 46;
      this.addStatic(rectPart((roofL + (-wn - 5)) / 2, this.roofY + 4, (-wn - 5) - roofL, 8, 0, 'roof'));
      this.addStatic(rectPart(((wn + 5) + roofR) / 2, this.roofY + 4, roofR - (wn + 5), 8, 0, 'roof'));
      this.roofL = roofL; this.roofR = roofR;
      // sensor beam and exit chute -> ramp -> tray
      const yBeam = Rh + tk + 7;
      this.yBeam = yBeam;
      const gw = this.gw;
      this.beam = { y: yBeam, y2: yBeam + 7, x0: -gw, x1: gw }; this.landings = [];
      const rampX0 = -gw - 10, rampY0 = yBeam + 30, ang = 33 * DEG, run = 118;
      const rampX1 = rampX0 + run, rampY1 = rampY0 + Math.tan(ang) * run;
      this.ramp = { x0: rampX0, y0: rampY0, x1: rampX1, y1: rampY1 };
      const rn = { x: -Math.sin(ang), y: -Math.cos(ang) };
      this.addStatic(wallSeg({ x: rampX0, y: rampY0 }, { x: rampX1, y: rampY1 }, 6, -rn.x, -rn.y, 'ramp', 4));
      this.addStatic(rectPart(rampX0 - 3, (Rh + tk + rampY0) / 2 + 2, 6, rampY0 - (Rh + tk) + 12, 0, 'chute'));
      const xTl = rampX1 - 8, xTr = xTl + 116, yT = rampY1 + 34, wallH = 36;
      this.tray = { xl: xTl, xr: xTr, yFloor: yT, wall: wallH };
      this.addStatic(rectPart((xTl + xTr) / 2, yT + 4, xTr - xTl + 12, 8, 0, 'tray'));
      this.addStatic(rectPart(xTl - 3, yT - wallH / 2 + 2, 6, wallH + 4, 0, 'tray'));
      this.addStatic(rectPart(xTr + 3, yT - wallH / 2 + 2, 6, wallH + 4, 0, 'tray'));
    }

    buildWheel() {
      const R = this.R, parts = [], tw = 4.5;
      const P_ = this.pockets;
      for (let k = 0; k < this.N; k++) {
        const pk = P_[k], u = { x: Math.cos(pk.a), y: Math.sin(pk.a) }, t = { x: -u.y, y: u.x };
        const rf = R - pk.d;
        const rho_top = Math.sqrt(R * R - (pk.w / 2) * (pk.w / 2));
        const at = (rho, s) => ({ x: u.x * rho + t.x * s, y: u.y * rho + t.y * s });
        const fc = at(rf - 3, 0);
        parts.push(P.dynRect(fc.x, fc.y, pk.w + 2 * tw, 6, pk.a + Math.PI / 2, 'wheel'));
        for (const sg of [-1, 1]) {
          // convex quad whose top edge lies exactly on the rim circle (nothing may stand proud of the rim)
          const rhoOut = Math.sqrt(R * R - (pk.w / 2 + tw) * (pk.w / 2 + tw));
          const q = [at(rf - 5, sg * pk.w / 2), at(rho_top, sg * pk.w / 2), at(rhoOut, sg * (pk.w / 2 + tw)), at(rf - 5, sg * (pk.w / 2 + tw))];
          parts.push(P.dynQuad(q, 'wheel'));
        }
        const nx = P_[(k + 1) % this.N];
        // rim pieces start inside the slot wall's thickness so they never narrow the slot mouth
        const a0 = pk.a + Math.asin((pk.w / 2 + tw - 1.2) / R), a1 = nx.a + (k === this.N - 1 ? 2 * Math.PI : 0) - Math.asin((nx.w / 2 + tw - 1.2) / R);
        if (a1 > a0) {
          const n = Math.max(1, Math.ceil((a1 - a0) / (6 * DEG)));
          for (let i = 0; i < n; i++) {
            const t0 = a0 + ((a1 - a0) * i) / n, t1 = a0 + ((a1 - a0) * (i + 1)) / n, tm = (t0 + t1) / 2;
            const chord = 2 * R * Math.sin((t1 - t0) / 2);
            const c = { x: (R - 2.5) * Math.cos(tm), y: (R - 2.5) * Math.sin(tm) };
            parts.push(P.dynRect(c.x, c.y, chord + 0.8, 5, tm + Math.PI / 2, 'wheel'));
          }
        }
      }
      const hub = Bodies.circle(0, 0, R - 24, { isStatic: false }); hub.label = 'wheel';
      parts.push(hub);
      // torque-limited rotor pinned at the wheel centre; motor sized in N·mm (contact force at the rim = T / (0.9 R))
      this.motorT = clamp(this.scene.params.motorT || 300, 30, 900);
      this.rotor = new P.RotorActuator(this.scene, parts, { mass: 20, Fmax: this.motorT, lever: R * 0.9, pivot: { x: 0, y: 0 }, label: 'wheel', minCmd: 0.4, stallLimit: 45 });
      const rt = this.rotor;
      this.wheel = { body: rt.body, get a() { return rt.angle; } };
    }

    buildBottleStation() {
      const g = this.scene.geo;
      this.stationPose = { x: Math.min(-(g.D * 0.5 + this.hw + 60), -(g.D / 2 + 30)), y: this.roofY - g.H, a: 0 };
      this.dockPose = { x: 0, y: this.roofY - g.hc, a: Math.PI };
      if (this.cap) {
        const sh = rectPart(0, -g.hc + 2, g.wn * 2 + 4, 3, 0, 'shutter');
        this.shutter = new Rig([sh], { label: 'shutter' });
        Composite.add(this.scene.world, this.shutter.body);
      }
    }

    buildBoundary() {
      const tray = this.tray;
      const floorY = tray.yFloor + 120;
      const x0 = Math.min(this.roofL - 80, -400), x1 = Math.max(tray.xr + 200, 400);
      this.addStatic(rectPart((x0 + x1) / 2, floorY + 10, x1 - x0, 20, 0, 'table'));
      this.addStatic(rectPart(x0 - 10, 0, 20, 2200, 0, 'table'));
      this.addStatic(rectPart(x1 + 10, 0, 20, 2200, 0, 'table'));
      this.floorY = floorY;
    }

    bounds() {
      const g = this.scene.geo, t = this.tray;
      const top = this.roofY - g.H - g.hc - 40;
      return { x0: this.stationPose.x - g.D / 2 - 40, y0: top, x1: t.xr + 60, y1: t.yFloor + 60 };
    }

    // Two moves, like a person would do it: 1) turn the bottle upside-down where it stands, 2) carry it onto the inlet.
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
      if (this.state !== 'idle' && this.state !== 'done' && this.state !== 'error') return false;
      this.remaining = n; this.job = n; this.consec = 0; this.jamRetries = 0;
      s.stats.target = (s.stats.target || 0) + n;
      s.stats.jobStart = s.stats.dispensed;
      s.stats.elapsed = 0;
      this.busy = true;
      const go = () => {
        this.primeLeft = this.primed ? 0 : this.N / 2;
        // let the first pills arrive in the funnel and seat before the wheel starts to turn
        if (this.primeLeft > 0) { this.state = 'shake'; this.shakeMs = 1100; } else this.state = 'step';
        this._tgt = null; this.tState = 0;
        s.status = `Dispensing ${n}…`;
        s.log(`Dispense request: ${n} pill${n === 1 ? '' : 's'} (slot size ${this.size}/10).${this.primeLeft ? ' Priming the wheel…' : ''}`, 'info');
      };
      if (s.phase === 'station') { s.startDock(); this.pendingStart = () => { this.pendingStart = null; go(); }; }
      else if (s.phase === 'docking') this.pendingStart = () => { this.pendingStart = null; go(); };
      else go();
      return true;
    }

    control(dt) {
      const s = this.scene, sec = dt / 1000;
      // ---- hopper / bottle agitator: tiny lateral vibration that breaks pill arches while dispensing
      this.agitT = (this.agitT || 0) + sec;
      const agitOn = this.vibe && this.busy && s.phase === 'docked' && this.state !== 'idle';
      this.agit = agitOn ? (this.state === 'agitate' ? 1.3 : 0.9) * Math.sin(this.agitT * 2 * Math.PI * (this.state === 'agitate' ? 32 : 26)) : 0;
      this.hopper.place(this.agit, 0, 0);
      s.agitDx = this.agit;
      // ---- shutter valve
      if (this.shutter) {
        this.shutterAnim = clamp(this.shutterAnim + (this.shutterOpen ? 1 : -1) * sec / 0.35, 0, 1);
        this.shutter.body.collisionFilter.mask = this.shutterAnim > 0.5 ? 0 : 0xffff;
        const b = s.bottle, off = this.shutterAnim * (s.geo.wn * 2 + 8);
        const w = b.toWorld({ x: off, y: 0 }); // rig frame == bottle frame
        this.shutter.place(w.x, w.y, b.a);
      }
      // ---- trapdoor
      this.gateAnim = clamp(this.gateAnim + (this.gateOpen ? 1 : -1) * sec / 0.12, 0, 1);
      this.gate.body.collisionFilter.mask = this.gateAnim > 0.6 ? 0 : 0xffff;
      // ---- controller
      this.tState += dt;
      const om = this.omega * (this.slow > 0 ? 0.6 : 1), acc = 2600 * DEG, stepA = (2 * Math.PI) / this.N;
      let jig = 0;
      switch (this.state) {
        case 'step': {
          if (this._tgt == null) this._tgt = this.step0 + (this.idx + 1) * stepA;
          this.phi.step(this._tgt, om, acc, dt);
          if (this.phi.arrived(this._tgt) && Math.abs(this.rotor.err) < 0.012) {
            this._tgt = null; this.idx++; this.tState = 0; this.clearFor = 0; if (this.slow > 0) this.slow--;
            if (this.primeLeft > 0) {
              this.primeLeft--; if (this.primeLeft === 0) this.primed = true;
              this.state = 'shake'; this.shakeMs = 620;
            } else { this.state = 'dwell'; this.gateOpen = true; this.dropStartCount = this.sensorCount; }
          }
          break;
        }
        case 'dwell': {
          // release window: wheel stands still, trapdoor open, the slot at the bottom drops its pill
          const got = this.sensorCount - this.dropStartCount;
          this.clearFor = this.sensorBlocked ? 0 : this.clearFor + dt;
          if ((got > 0 && this.tState > 220 && this.clearFor > 140) || this.tState > 750) this.finishDrop(got);
          break;
        }
        case 'shake': {
          // vibration assist seats a pill in the slot that is now under the hopper
          if (this.vibe || this.consec >= 2) {
            const amp = (this.consec >= 3 ? 8 : 2.6) * DEG;
            jig = amp * Math.sin((this.tState / 1000) * 2 * Math.PI * 6);
          }
          if (this.tState >= this.shakeMs) { this.state = 'step'; this.tState = 0; }
          break;
        }
        case 'unjam': {
          // back off to the last aligned slot position (slot under the hopper), then shake hard to re-seat the pills
          if (this._ujTarget == null) this._ujTarget = this.step0 + (this.idx - (this.jamRetries >= 4 && this.jamRetries % 2 === 0 ? 1 : 0)) * stepA;
          this.phi.step(this._ujTarget, om * 0.7, acc, dt);
          if (this.phi.arrived(this._ujTarget) && Math.abs(this.rotor.err) < 0.02) { this._ujTarget = null; this._tgt = null; this.state = 'agitate'; this.tState = 0; }
          break;
        }
        case 'agitate': {
          const k = this.jamRetries; // vary the shake each retry so the same jammed arrangement is not reproduced
          jig = (2.6 + 0.7 * (k % 4)) * DEG * Math.sin((this.tState / 1000) * 2 * Math.PI * (5 + 1.5 * (k % 3))) * Math.min(1, this.tState / 150);
          if (this.tState >= 1000) { this.state = 'step'; this.tState = 0; this._tgt = null; this.slow = 3; }
          break;
        }
        default: break;
      }
      this.rotor.drive(dt, this.phi.pos + jig, this.phi.vel / 1000, 0);
      // torque limit: the motor is at its current limit and the wheel is not following -> a pill is jammed
      if ((this.state === 'step' || this.state === 'shake') && this.rotor.stalled) this.onJam();
      s.pinchWheel = false;
      this.jamFlash = Math.max(0, this.jamFlash - dt);
    }

    onJam() {
      const s = this.scene;
      s.stats.jams++; this.jamRetries++; this.jamFlash = 900;
      s.log(`⚠ Wheel torque spike, pill pinched at the scraper. Reversing to clear (${this.jamRetries}).`, 'bad');
      this.phi.pos = this.rotor.angle; this.phi.vel = 0; this.rotor.rehome(); this.gateOpen = false;
      for (const b of s.pills) b.plugin.pill.pinchSteps = 0;
      if (this.jamRetries > 16) { this.fail('Persistent jam, pill size / scraper clearance mismatch. Stopped.'); return; }
      this.state = 'unjam'; this.tState = 0; this._ujTarget = null; this._tgt = null;
    }

    finishDrop(got) {
      const s = this.scene;
      this.gateOpen = false; s.stats.attempts++;
      s.cycles.push({ t: s.t, got, kind: got === 0 ? 'miss' : got === 1 ? 'ok' : 'double' });
      if (got === 0) {
        this.consec++; s.stats.misses++;
        s.log(`Empty slot at the exit (miss #${this.consec}).`, 'warn');
        if (s.stats.inBottle + this.inHopperCount() === 0) { this.fail('Bottle is empty.'); return; }
        if (this.consec >= 10) { this.fail('No pill detected after 10 slots, slot too small for this pill, or pills bridged over the feed.'); return; }
      } else {
        this.consec = 0; this.jamRetries = 0;
        if (got > 1) { s.stats.doubles++; s.log(`Double dispense! ${got} pills released from one slot (slot too big for this pill).`, 'bad'); }
        else s.log(`Pill ${s.stats.dispensed - (s.stats.jobStart || 0)}/${this.job} dispensed.`, 'ok');
        this.remaining -= got;
      }
      if (this.remaining <= 0) { this.state = 'done'; this.busy = false; s.status = 'Dose complete'; s.log(`Dose complete: ${s.stats.dispensed - (s.stats.jobStart || 0)} of ${this.job} pills.`, 'ok'); }
      else { this.state = 'shake'; this.shakeMs = 300 + 250 * Math.min(this.consec, 4); this.tState = 0; this._tgt = null; }
    }

    inHopperCount() { let n = 0; for (const b of this.scene.pills) if (b.plugin.pill.zone === 'machine') n++; return n; }

    fail(msg) { this.state = 'error'; this.busy = false; this.gateOpen = false; this.scene.status = 'Error, ' + msg; this.scene.log(msg, 'bad'); }

    sense(dt) {
      const s = this.scene;
      // Dispense / jam sensor: a laser beam across the exit chute; a pill whose centre crosses it counts once.
      let blocked = false;
      for (const b of s.pills) {
        const info = b.plugin.pill;
        if (info.held) continue;
        const x = b.position.x, y = b.position.y;
        if (Math.abs(x) > this.gw + 4) continue;
        const bb = b.bounds;
        if (bb.min.y <= this.yBeam && bb.max.y >= this.yBeam) blocked = true;
        if (!info.counted && y > this.yBeam && y < this.yBeam + 40) { info.counted = true; this.sensorCount++; s.stats.dispensed++; }
      }
      this.sensorBlocked = blocked;
      if (s.step_n % 2 === 0 && P.sampleSignals) P.sampleSignals.call(this, dt * 2);
    }

    zoneOf(p) {
      const t = this.tray, x = p.x, y = p.y;
      if (x > t.xl && x < t.xr + 4 && y > t.yFloor - t.wall - 2 && y < t.yFloor + 6) return 'tray';
      if (Math.abs(x) < Math.max(this.hw, this.wn) + 8 && y > this.roofY - 6 && y < this.Rh + this.tk) return 'machine';
      if (y >= this.Rh - 2 && y < t.yFloor + 6 && x > -this.gw - 16 && x < t.xr + 6) return 'chute';
      if (Math.hypot(x, y) < this.Rh + 3) return 'machine';
      return 'spilled';
    }
  }

  // =====================================================================================
  //  Design B, bottle docked from below, vacuum robot arm
  // =====================================================================================
  class ArmDesign {
    constructor(scene) {
      this.scene = scene; this.kind = 'arm';
      const prm = scene.params, sp = scene.spec, g = scene.geo;
      this.tk = 6;
      this.wn = g.wn;
      this.Hc = 110; this.Jy = -this.Hc + 12; this.dy = -this.Jy; // pivot above the mouth plane
      this.Wo = Math.max(20, Math.max(sp.L, sp.W) + 12);
      this.xo = Math.max(g.wn + 14, g.D / 2 + 10) + this.Wo / 2;
      this.Lc = Math.max(g.D / 2 + 12, g.wn + 34, 46);
      this.xEnd = this.xo + this.Wo / 2 + 22;
      // gripper cup: as big as the neck and pill allow
      this.cupR = clamp(Math.min(sp.W * 0.36, (g.wn * 2 - 6) / 2 * 0.5), 1.6, 6);
      this.alphaMax = 62 * DEG;
      this.speed = clamp(prm.armSpeed || 1, 0.4, 2.5);
      this.statics = [];
      this.buildStatics();
      this.buildArm();
      this.dockOffset = 120;
      this.dockDuration = 2200;
      this.alpha = new P.Mover(0); this.s = new P.Mover(-40); this.jx = new P.Mover(0); this.rcm = true; this.rotGrip = 0;
      this.state = 'idle'; this.busy = false; this.gateOpen = false; this.gateAnim = 0;
      this.held = null; this.tState = 0; this.job = 0; this.remaining = 0; this.target = null; this.gripFails = 0;
      this.sensorBlocked = false; this.sensorCount = 0; this.scanAngle = 0; this.tipWorld = { x: 0, y: 0 };
      this.sLift = -(Math.max(sp.L, sp.W) + 10);
      this.s.pos = this.sLift;
      this.vacKPa = clamp(prm.vacuum || 25, 5, 60);          // gauge vacuum at the cup (kPa)
      this.vacSig = 0; this.holdCap = 0; this.holdSat = 0; this.tipV = { x: 0, y: 0 }; this.tipPrev = null;
      this.armPose();
    }

    compat() {
      const sp = this.scene.spec, g = this.scene.geo;
      const out = [];
      out.push({ k: 'Gripper cup', v: `Ø ${(this.cupR * 2).toFixed(1)} mm vacuum tip`, ok: this.cupR * 2 <= sp.W * 0.9 });
      { const F0 = this.vacKPa * 1e3 * Math.PI * this.cupR * this.cupR * 1e-6, w = P.pillMeanMassMg(sp) * 1e-6 * 9.81;
        out.push({ k: 'Suction', v: `−${this.vacKPa.toFixed(0)} kPa × ${(Math.PI * this.cupR * this.cupR).toFixed(1)} mm² = ${F0.toFixed(2)} N hold (${(F0 / w).toFixed(0)}× pill weight)`, ok: F0 / w > 15 }); }
      const clr = g.mouth - this.cupR * 2 - 4;
      out.push({ k: 'Neck clearance', v: `${g.mouth.toFixed(0)} mm mouth · ${clr.toFixed(0)} mm spare around tool`, ok: clr > 4 });
      out.push({ k: 'Outlet', v: `${this.Wo.toFixed(0)} mm wide (pill ${Math.max(sp.L, sp.W).toFixed(0)} mm)`, ok: true });
      out.push({ k: 'Max tool tilt', v: `${(this.alphaMax / DEG).toFixed(0)}° about the mouth`, ok: true });
      return out;
    }

    addStatic(b, label) { if (label) b.label = label; this.statics.push(b); Composite.add(this.scene.world, b); return b; }

    buildStatics() {
      const g = this.scene.geo, wn = this.wn, tk = this.tk, Lc = this.Lc, xo = this.xo, Wo = this.Wo, Hc = this.Hc;
      // chamber floor plates (top surface at y=-6.. plate occupies y in [-6,0])
      const plate = (x0, x1, label) => this.addStatic(rectPart((x0 + x1) / 2, -3, x1 - x0, 6, 0, label || 'chamber'));
      plate(-Lc, -wn); plate(wn, xo - Wo / 2);
      plate(xo + Wo / 2, this.xEnd);
      // outlet flap
      this.gate = new Rig([rectPart(xo, -3, Wo, 6, 0, 'gate')], { label: 'gate' });
      this.gate.place(0, 0, 0);
      Composite.add(this.scene.world, this.gate.body);
      // walls & ceiling
      this.addStatic(rectPart(-Lc - 3, -Hc / 2, 6, Hc + 8, 0, 'chamber'));
      this.addStatic(rectPart(this.xEnd + 3, -Hc / 2, 6, Hc + 8, 0, 'chamber'));
      this.addStatic(rectPart((this.xEnd - Lc) / 2, -Hc - 3, this.xEnd + Lc + 12, 6, 0, 'chamber'));
      // outlet shaft, ramp, tray
      const ang = 33 * DEG, rampX0 = xo - Wo / 2, rampY0 = 44, run = 118;
      const rampX1 = rampX0 + run, rampY1 = rampY0 + Math.tan(ang) * run;
      this.ramp = { x0: rampX0, y0: rampY0, x1: rampX1, y1: rampY1 };
      const rn = { x: -Math.sin(ang), y: -Math.cos(ang) };
      this.addStatic(wallSeg({ x: rampX0, y: rampY0 }, { x: rampX1, y: rampY1 }, 6, -rn.x, -rn.y, 'ramp', 4));
      // left shaft wall (inner face at outlet left edge)
      this.addStatic(rectPart(rampX0 - 3, rampY0 / 2 + 1, 6, rampY0 + 6, 0, 'chute'));
      // right shaft wall stops above ramp so pills can roll out
      const yRt = rampY0 + Math.tan(ang) * Wo;
      const hgt = Math.max(2, yRt - (Math.max(this.scene.spec.L, this.scene.spec.W) + 8));
      this.addStatic(rectPart(xo + Wo / 2 + 3, hgt / 2, 6, hgt, 0, 'chute'));
      const xTl = rampX1 - 8, xTr = xTl + 116, yT = rampY1 + 34, wallH = 36;
      this.tray = { xl: xTl, xr: xTr, yFloor: yT, wall: wallH };
      this.addStatic(rectPart((xTl + xTr) / 2, yT + 4, xTr - xTl + 12, 8, 0, 'tray'));
      this.addStatic(rectPart(xTl - 3, yT - wallH / 2 + 2, 6, wallH + 4, 0, 'tray'));
      this.addStatic(rectPart(xTr + 3, yT - wallH / 2 + 2, 6, wallH + 4, 0, 'tray'));
      this.yBeam = 14;
      this.beam = { y: 14, y2: 21, x0: xo - Wo / 2, x1: xo + Wo / 2 }; this.landings = [];
      // table
      const floorY = Math.max(yT, g.H + 30) + 100;
      const x0 = -Lc - 400, x1 = xTr + 300;
      this.addStatic(rectPart((x0 + x1) / 2, floorY + 10, x1 - x0, 20, 0, 'table'));
      this.addStatic(rectPart(x0 - 10, 0, 20, 2200, 0, 'table'));
      this.addStatic(rectPart(x1 + 10, 0, 20, 2200, 0, 'table'));
      this.floorY = floorY;
    }

    buildArm() {
      const cupR = this.cupR;
      const shaft = rectPart(0, -110 - 3, 4.2, 220, 0, 'tool');
      const cup = rectPart(0, -1.6, cupR * 2, 3.2, 0, 'tool');
      this.arm = new Rig([shaft, cup], { label: 'tool', friction: 0.6 });
      Composite.add(this.scene.world, this.arm.body);
      for (const b of [this.arm.body]) b.collisionFilter.category = CAT.TOOL;
    }

    bounds() {
      const g = this.scene.geo, t = this.tray;
      return { x0: -this.Lc - 30, y0: -this.Hc - 50, x1: t.xr + 50, y1: Math.max(g.H + this.dockOffset + 14, t.yFloor + 40) };
    }

    bottlePoseAt(u) { return { x: 0, y: this.dockOffset * (1 - ease(u)), a: 0 }; }

    onDocked() {
      const s = this.scene;
      s.log('Bottle sealed against dock collar (airtight). Arm ready.', 'ok');
      s.status = 'Docked & sealed, arm ready';
      this.pendingStart && this.pendingStart();
    }

    startDispense(n) {
      const s = this.scene;
      if (this.state !== 'idle' && this.state !== 'done' && this.state !== 'error') return false;
      this.remaining = n; this.job = n; this.gripFails = 0;
      s.stats.target = (s.stats.target || 0) + n; s.stats.jobStart = s.stats.dispensed; s.stats.elapsed = 0;
      this.busy = true;
      const go = () => { this.state = 'scan'; this.tState = 0; s.status = `Dispensing ${n}…`; s.log(`Dispense request: ${n} pill${n === 1 ? '' : 's'}. Vision scan…`, 'info'); };
      if (s.phase === 'station') { s.startDock(); this.pendingStart = () => { this.pendingStart = null; go(); }; }
      else if (s.phase === 'docking') this.pendingStart = () => { this.pendingStart = null; go(); };
      else go();
      return true;
    }

    // tip position from the three axes
    tip() {
      const a = this.alpha.pos, len = this.dy / Math.cos(a) + this.s.pos;
      const jx = this.rcm ? -this.dy * Math.tan(a) : this.jx.pos;
      return { x: jx + len * Math.sin(a), y: this.Jy + len * Math.cos(a), jx, len };
    }

    armPose() {
      const t = this.tip();
      this.tipWorld = t; this.shaftAngle = -this.alpha.pos;
      this.arm.place(t.x, t.y, -this.alpha.pos);
    }

    supportExtent(body, dx, dy) {
      // distance from pill centre to its surface in direction (dx,dy) (unit)
      let m = 0;
      const v = body.vertices, p = body.position;
      for (let i = 0; i < v.length; i++) { const d = (v[i].x - p.x) * dx + (v[i].y - p.y) * dy; if (d > m) m = d; }
      return m;
    }

    segDist(ax, ay, bx, by, px, py) {
      const dx = bx - ax, dy = by - ay, l2 = dx * dx + dy * dy;
      let t = l2 < 1e-9 ? 0 : ((px - ax) * dx + (py - ay) * dy) / l2; t = clamp(t, 0, 1);
      return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
    }
    segSegDist(a, b, c, d) {
      // minimal distance between two segments (2-D); 0 if they cross
      const ccw = (p, q, r) => (r.y - p.y) * (q.x - p.x) - (q.y - p.y) * (r.x - p.x);
      if (ccw(a, c, d) * ccw(b, c, d) < 0 && ccw(a, b, c) * ccw(a, b, d) < 0) return 0;
      return Math.min(this.segDist(a.x, a.y, b.x, b.y, c.x, c.y), this.segDist(a.x, a.y, b.x, b.y, d.x, d.y), this.segDist(c.x, c.y, d.x, d.y, a.x, a.y), this.segDist(c.x, c.y, d.x, d.y, b.x, b.y));
    }

    // Vision: choose the exposed, reachable pill nearest the mouth.
    chooseTarget() {
      const s = this.scene, g = s.geo, cands = [];
      const inB = s.pills.filter((b) => b.plugin.pill.zone === 'bottle' && !b.plugin.pill.held);
      const walls = [];
      for (let i = 0; i < g.pts.length - 1; i++) {
        walls.push([g.pts[i], g.pts[i + 1]]);
        walls.push([{ x: -g.pts[i].x, y: g.pts[i].y }, { x: -g.pts[i + 1].x, y: g.pts[i + 1].y }]);
      }
      let unreach = 0;
      for (const p of inB) {
        const info = p.plugin.pill;
        if (info.skipUntil && info.skipUntil > s.t) continue;
        const px = p.position.x, py = p.position.y - s.bottle.oy;
        const dist = Math.hypot(px, py);
        if (dist < 1) continue;
        const ux = px / dist, uy = py / dist;
        const alpha = Math.atan2(px, py);
        if (Math.abs(alpha) > this.alphaMax) { unreach++; continue; }
        const ext = this.supportExtent(p, ux, uy);
        const st = dist - ext;
        const A = { x: -ux * 6, y: -uy * 6 }, B = { x: ux * st, y: uy * st };
        let ok = true;
        const margin = Math.max(2.4, this.cupR + 0.3);
        for (const w of walls) { if (this.segSegDist(A, B, w[0], w[1]) < margin) { ok = false; break; } }
        if (!ok) { unreach++; continue; }
        for (const q of inB) {
          if (q === p) continue;
          const d = this.segDist(A.x, A.y, B.x, B.y, q.position.x, q.position.y - s.bottle.oy);
          if (d < s.spec.W * 0.5 + this.cupR * 0.7) { ok = false; break; }
        }
        if (!ok) continue;
        cands.push({ p, st, alpha, ext });
      }
      s.stats.unreachable = unreach;
      cands.sort((a, b) => a.st - b.st || Math.abs(a.alpha) - Math.abs(b.alpha));
      return cands[0] || null;
    }

    // ---- suction grip ------------------------------------------------------------------------------------------
    // The pill stays a dynamic body. Vacuum acts as a force-limited attachment: a critically damped spring-damper pulls the
    // pill onto the cup, but the force cannot exceed  F_cap = ΔP · A_cup · seal.  If the pill snags (bottle neck, neighbours)
    // and the required force exceeds F_cap the seal breaks and the pill drops, no teleporting, no magic hold.
    suctionCap(p, tilt) {
      const sp = this.scene.spec, A = Math.PI * this.cupR * this.cupR, F0 = this.vacKPa * 1e3 * A * 1e-6;   // N
      const r = sp.W / 2, leak = sp.shape === 'round' ? r - Math.sqrt(Math.max(0, r * r - this.cupR * this.cupR)) : 0.05 * Math.tan(Math.min(tilt, 80 * DEG));
      let seal = clamp(1 - tilt / (60 * DEG), 0, 1) * (leak < 0.4 ? 1 : 0.35);
      if (this.cupR * 2 > sp.W * 1.05) seal *= 0.15;          // cup overhangs the pill face: air leaks past the rim
      return { F0, seal, cap: F0 * seal, leak };
    }

    hold(p, cap) {
      const info = p.plugin.pill;
      info.held = true;
      p.collisionFilter.mask = CAT.WALL | CAT.PILL;           // rides on the cup: no contact with the tool itself
      this.held = p; this.holdCap = cap; this.holdSat = 0;
      let rel = p.angle - this.shaftAngle;
      rel = ((rel + Math.PI / 2) % Math.PI + Math.PI) % Math.PI - Math.PI / 2; // (-pi/2, pi/2]
      this.rel = rel; this.relTarget = rel >= 0 ? Math.PI / 2 : -Math.PI / 2;
    }

    release() {
      const p = this.held; if (!p) return;
      p.collisionFilter.mask = CAT.WALL | CAT.PILL | CAT.TOOL;
      p.plugin.pill.held = false; p.plugin.pill.counted = false;
      this.held = null; this.vacSig = 0; this.holdCap = 0;
    }

    dropHeld(why) {
      const s = this.scene, p = this.held; if (!p) return;
      this.release();
      s.stats.misses++; this.gripFails++; s.cycles.push({ t: s.t, got: 0, kind: 'miss' });
      s.log(`Pill dropped: ${why}.`, 'bad');
      if (this.gripFails > 10) { this.fail('Too many failed picks.'); return; }
      this.state = 'retract'; this.tState = 0;
    }

    // called every physics step while a pill is on the cup
    poseHeld(dt) {
      const p = this.held; if (!p) return;
      const s = this.scene, t = this.tipWorld, sa = this.shaftAngle, m = p.mass;
      const dx = Math.sin(this.alpha.pos), dy = Math.cos(this.alpha.pos);
      const k = Math.min(1, dt / 350);
      this.rel += (this.relTarget - this.rel) * (this.rotGrip ? k : 0);       // wrist rolls the pill end-on while lifting
      const ang = sa + this.rel;
      // target: pill face on the cup, centre a support-extent beyond the tip along the shaft
      let ext = 0; const v = p.vertices, pc = p.position;
      for (let i = 0; i < v.length; i++) { const d = (v[i].x - pc.x) * -dx + (v[i].y - pc.y) * -dy; if (d > ext) ext = d; }
      const tx = t.x + dx * ext, ty = t.y + dy * ext;
      const wn = 0.12, z = 1.0;                                             // rad/ms, damping ratio (20 ms settling)
      const vpx = p.velocity.x * 60 / 1000, vpy = p.velocity.y * 60 / 1000;  // mm/ms
      let Fx = m * (wn * wn * (tx - pc.x) + 2 * z * wn * (this.tipV.x - vpx));
      let Fy = m * (wn * wn * (ty - pc.y) + 2 * z * wn * (this.tipV.y - vpy)) - m * P.G_MM_MS2;   // gravity feed-forward
      const Fm = Math.hypot(Fx, Fy), cap = this.holdCap;
      if (Fm > cap) { Fx *= cap / Fm; Fy *= cap / Fm; this.holdSat += dt; } else this.holdSat = Math.max(0, this.holdSat - dt);
      Body.applyForce(p, pc, { x: Fx, y: Fy });
      // wrist / cup alignment torque, limited by the lever the seal ring gives (N·mm)
      let da = ang - p.angle; da = Math.atan2(Math.sin(da), Math.cos(da));
      const wr = 0.08, Tq = clamp(p.inertia * (wr * wr * da - 2 * wr * (p.angularVelocity / 16.6667)), -0.6 * cap * this.cupR, 0.6 * cap * this.cupR);
      p.torque += Tq;
      this.vacSig = clamp(1 - this.holdSat / 60, 0, 1) * (cap > 0 ? Math.min(1, Fm / cap * 0.5 + 0.5) : 0);
      if (this.holdSat > 60) this.dropHeld(`snagged, needed ${Fm.toFixed(2)} N, vacuum holds ${cap.toFixed(2)} N`);
    }

    control(dt) {
      const s = this.scene, sec = dt / 1000, sp = this.speed;
      // bottle-relative mouth is at world (0,0) once docked
      this.gateAnim = clamp(this.gateAnim + (this.gateOpen ? 1 : -1) * sec / 0.12, 0, 1);
      this.gate.body.collisionFilter.mask = this.gateAnim > 0.6 ? 0 : 0xffff;
      this.tState += dt;
      const aV = 95 * DEG * sp, aA = 500 * DEG * sp * sp, sV = 170 * sp, sA = 700 * sp * sp, xV = 210 * sp, xA = 900 * sp * sp;
      const mouth = { x: 0, y: 0 };
      switch (this.state) {
        case 'scan': {
          this.scanAngle = (this.tState / 900) * Math.PI;
          if (this.tState > 900) {
            const c = this.chooseTarget();
            if (!c) {
              if (s.stats.inBottle === 0) this.fail('Bottle is empty.');
              else this.fail(`No reachable pill left (${s.stats.inBottle} remain in the bottle corners / under the shoulder).`);
              break;
            }
            this.target = c; this.state = 'aim'; this.tState = 0;
            s.log(`Vision: target pill #${c.p.plugin.pill.id} at ${(c.alpha / DEG).toFixed(0)}°, ${c.st.toFixed(0)} mm below mouth.`, 'info');
          }
          break;
        }
        case 'aim': {
          const a = this.target.alpha;
          this.rcm = true;
          const done = this.alpha.step(a, aV, aA, dt);
          this.s.step(this.sLift, sV, sA, dt);
          if (this.alpha.arrived(a) && this.s.arrived(this.sLift)) { this.state = 'descend'; this.tState = 0; }
          break;
        }
        case 'descend': {
          const p = this.target.p;
          const px = p.position.x, py = p.position.y - s.bottle.oy, dist = Math.hypot(px, py) || 1;
          const ux = px / dist, uy = py / dist;
          // servo the aim onto the pill (it may have been nudged) and the depth onto its surface
          const aT = Math.atan2(px, py);
          this.alpha.step(aT, aV, aA * 2, dt);
          const ext = this.supportExtent(p, ux, uy);
          const sT = dist - ext + 0.25;
          const near = sT - this.s.pos;
          const v = near < 14 ? 38 * sp : sV;
          this.s.step(sT, v, sA, dt);
          if (Math.abs(sT - this.s.pos) < 0.35 && Math.abs(this.alpha.pos - aT) < 0.01) { this.state = 'seal'; this.tState = 0; }
          else if (this.tState > 9000) { this.gripFail('approach timeout'); }
          break;
        }
        case 'seal': {
          if (this.tState > 220) {
            // vacuum builds: hold force = ΔP · A · seal quality (surface tilt, cup edge curvature, cup vs pill face)
            const p = this.target.p;
            const dx = Math.sin(this.alpha.pos), dy = Math.cos(this.alpha.pos);
            const tilt = this.surfaceTilt(p, dx, dy);
            const sc = this.suctionCap(p, tilt), w = (p.mass / 1000) * 9.81;
            if (sc.cap < 3 * w) { this.gripFail(`vacuum seal failed (surface tilted ${(tilt / DEG).toFixed(0)}°, holds only ${(sc.cap / w).toFixed(1)}× weight)`); }
            else {
              this.hold(p, sc.cap); this.rotGrip = 0; this.state = 'lift'; this.tState = 0;
              s.stats.attempts++; s.log(`Vacuum on: pill #${p.plugin.pill.id} gripped (${sc.cap.toFixed(2)} N = ${(sc.cap / w).toFixed(0)}× its weight).`, 'info');
            }
          }
          break;
        }
        case 'lift': {
          this.rotGrip = 1;
          this.s.step(this.sLift - 2 * this.heldExt(), sV, sA, dt);
          if (this.s.arrived(this.sLift - 2 * this.heldExt())) { this.state = 'turn'; this.tState = 0; }
          break;
        }
        case 'turn': {
          this.alpha.step(0, aV, aA, dt);
          if (this.alpha.arrived(0)) { this.rcm = false; this.jx.pos = 0; this.jx.vel = 0; this.state = 'transfer'; this.tState = 0; }
          break;
        }
        case 'transfer': {
          this.jx.step(this.xo, xV, xA, dt);
          if (this.jx.arrived(this.xo)) { this.state = 'release'; this.tState = 0; this.gateOpen = true; this.sensorBase = this.sensorCount; }
          break;
        }
        case 'release': {
          if (this.tState > 130 && this.held) { this.release(); }
          if (!this.held) {
            const got = this.sensorCount - this.sensorBase;
            if ((got > 0 && this.tState > 420 && !this.sensorBlocked) || this.tState > 1600) {
              this.gateOpen = false;
              s.cycles.push({ t: s.t, got, kind: got === 0 ? 'miss' : got === 1 ? 'ok' : 'double' });
              if (got > 1) s.stats.doubles++;
              if (got > 0) { this.remaining -= got; s.log(`Pill ${s.stats.dispensed - (s.stats.jobStart || 0)}/${this.job} dispensed.`, 'ok'); }
              else { s.stats.misses++; s.log('Released pill did not pass the outlet sensor.', 'warn'); }
              this.state = 'return'; this.tState = 0;
            }
          }
          break;
        }
        case 'return': {
          this.jx.step(0, xV, xA, dt);
          if (this.jx.arrived(0)) {
            this.rcm = true; this.alpha.pos = 0; this.alpha.vel = 0;
            if (this.remaining <= 0) { this.state = 'done'; this.busy = false; s.status = 'Dose complete'; s.log(`Dose complete: ${s.stats.dispensed - (s.stats.jobStart || 0)} of ${this.job} pills.`, 'ok'); }
            else { this.state = 'scan'; this.tState = 0; }
          }
          break;
        }
        case 'retract': {
          this.s.step(this.sLift, sV, sA, dt);
          if (this.s.arrived(this.sLift)) { this.state = 'scan'; this.tState = 0; }
          break;
        }
        default: break;
      }
      const tp = this.tipPrev; this.armPose();
      const tw = this.tipWorld;
      this.tipV = tp ? { x: (tw.x - tp.x) / dt, y: (tw.y - tp.y) / dt } : { x: 0, y: 0 };
      this.tipPrev = { x: tw.x, y: tw.y };
      if (this.held) this.poseHeld(dt);
    }

    heldExt() { return this.held ? this.supportExtent(this.held, 0, 1) : 6; }

    surfaceTilt(p, dx, dy) {
      // angle between the shaft direction and the outward surface normal at the point the cup touches
      const v = p.vertices, pc = p.position; let best = -1, bi = 0;
      for (let i = 0; i < v.length; i++) { const d = (v[i].x - pc.x) * -dx + (v[i].y - pc.y) * -dy; if (d > best) { best = d; bi = i; } }
      const a = v[(bi + v.length - 1) % v.length], b = v[bi], c = v[(bi + 1) % v.length];
      const n1 = { x: -(b.y - a.y), y: b.x - a.x }, n2 = { x: -(c.y - b.y), y: c.x - b.x };
      const norm = (n) => { const l = Math.hypot(n.x, n.y) || 1; return { x: n.x / l, y: n.y / l }; };
      let n = norm({ x: norm(n1).x + norm(n2).x, y: norm(n1).y + norm(n2).y });
      // pick the outward sense (pointing from centre towards the vertex)
      if (n.x * (b.x - pc.x) + n.y * (b.y - pc.y) < 0) n = { x: -n.x, y: -n.y };
      const dot = clamp(n.x * -dx + n.y * -dy, -1, 1);
      return Math.acos(dot);
    }

    gripFail(why) {
      const s = this.scene;
      this.gripFails++; s.stats.misses++; s.cycles.push({ t: s.t, got: 0, kind: 'miss' });
      s.log(`Pick failed: ${why}. Retrying with another pill.`, 'warn');
      if (this.target) this.target.p.plugin.pill.skipUntil = s.t + 5000;
      if (this.gripFails > 10) { this.fail('Too many failed picks.'); return; }
      this.state = 'retract'; this.tState = 0;
    }

    fail(msg) { this.state = 'error'; this.busy = false; this.gateOpen = false; this.scene.status = 'Error, ' + msg; this.scene.log(msg, 'bad'); }

    sense(dt) {
      const s = this.scene;
      let blocked = false;
      const x0 = this.xo - this.Wo / 2, x1 = this.xo + this.Wo / 2;
      for (const b of s.pills) {
        const info = b.plugin.pill;
        if (info.held) continue;
        const x = b.position.x, y = b.position.y;
        if (x < x0 - 4 || x > x1 + 4) continue;
        const bb = b.bounds;
        if (bb.min.y <= this.yBeam && bb.max.y >= this.yBeam) blocked = true;
        if (!info.counted && y > this.yBeam && y < this.yBeam + 40 && x > x0 && x < x1) { info.counted = true; this.sensorCount++; s.stats.dispensed++; }
      }
      this.sensorBlocked = blocked;
      if (s.step_n % 2 === 0 && P.sampleSignals) P.sampleSignals.call(this, dt * 2);
    }

    zoneOf(p) {
      const t = this.tray, x = p.x, y = p.y;
      if (x > t.xl && x < t.xr + 4 && y > t.yFloor - t.wall - 2 && y < t.yFloor + 6) return 'tray';
      if (x > -this.Lc - 6 && x < this.xEnd + 6 && y > -this.Hc - 6 && y < 8) return 'machine';
      if (y >= 0 && y < t.yFloor + 6 && x > this.xo - this.Wo / 2 - 8 && x < t.xr + 6) return 'chute';
      return 'spilled';
    }
  }

  P.Scene = Scene;
  P.WheelDesign = WheelDesign; P.ArmDesign = ArmDesign;
  // building blocks shared with the other concept files (concepts.js)
  P.internal = { Rig, rectPart, wallSeg, quadPart, buildBottleRig, CAT, MOVERS, SLICK, makePill };
  // Design registry: every concept registers itself here (key, mount, class, display metadata).
  P.DESIGNS = P.DESIGNS || {};
  P.DESIGNS.wheel = { key: 'wheel', mount: 'top', cls: WheelDesign, order: 1, name: 'Slotted sorting wheel', short: 'Wheel', family: 'Rotary pocket' };
  P.DESIGNS.arm = { key: 'arm', mount: 'bottom', cls: ArmDesign, order: 2, name: 'Vacuum pick arm', short: 'Arm', family: 'Pick and place' };
})(typeof window !== 'undefined' ? window : globalThis);
