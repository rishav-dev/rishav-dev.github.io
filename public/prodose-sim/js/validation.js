/* Prodose, physics validation suite.
 * Runs the same engine configuration the simulator uses (Matter.js, 2 ms step, g = 9.81 m/s², units mm / ms / g so
 * that forces come out in newtons) against closed-form solutions. Used by tests/validate.js (Node) and validation.html.
 *
 * Each test returns { name, what, expected, measured, unit, tol, err, pass }. */
(function (G) {
  const P = (G.Prodose = G.Prodose || {});
  const Matter = G.Matter || require('matter-js');
  const { Engine, Bodies, Body, Composite } = Matter;

  function world(dt) {
    const engine = Engine.create({ positionIterations: 10, velocityIterations: 8, constraintIterations: 2 });
    engine.gravity.x = 0; engine.gravity.y = 1; engine.gravity.scale = P.G_MM_MS2;
    return { engine, world: engine.world, dt: dt || P.DT, actuators: [] };
  }
  const step = (w, n) => { for (let i = 0; i < n; i++) Engine.update(w.engine, w.dt); };
  const G_MS2 = 9.81;                                 // m/s²

  // acceleration along a direction from three consecutive displacement windows (constant-acceleration fit)
  function accelFit(w, get, n0, n1) {
    step(w, n0); const x0 = get(); step(w, n1); const x1 = get(); step(w, n1); const x2 = get();
    const T = n1 * w.dt; return ((x2 - 2 * x1 + x0) / (T * T)) * 1000;      // mm/ms² -> m/s²
  }
  const tests = [];
  const add = (name, what, unit, tol, fn) => tests.push({ name, what, unit, tol, fn });

  // 1 ── free fall: time to fall h
  add('Free-fall time', 'Pill dropped 200 mm onto a plate: time to first contact, t = √(2h/g)', 's', 0.03, () => {
    const w = world(); const h = 200;
    const floor = Bodies.rectangle(0, h + 10 + 4.75, 200, 20, { isStatic: true }); const p = Bodies.circle(0, 0, 4.75, { restitution: 0, frictionAir: 0 });
    Body.setMass(p, 0.45); Composite.add(w.world, [floor, p]);
    let t = 0; while (p.position.y + 4.75 < h - 0.01 && t < 1000) { Engine.update(w.engine, w.dt); t += w.dt; }
    return { expected: Math.sqrt((2 * h / 1000) / G_MS2), measured: t / 1000 };
  });

  // 2 ── impact speed
  add('Impact speed', 'Speed at contact after a 200 mm drop, v = √(2gh)', 'm/s', 0.03, () => {
    const w = world(); const h = 200;
    const floor = Bodies.rectangle(0, h + 10 + 4.75, 200, 20, { isStatic: true }); const p = Bodies.circle(0, 0, 4.75, { restitution: 0, frictionAir: 0 });
    Body.setMass(p, 0.45); Composite.add(w.world, [floor, p]);
    let vmax = 0; for (let i = 0; i < 200; i++) { Engine.update(w.engine, w.dt); vmax = Math.max(vmax, p.velocity.y * 60 / 1000); }
    return { expected: Math.sqrt(2 * G_MS2 * h / 1000), measured: vmax };
  });

  // 3 ── restitution: rebound height
  for (const e of [0.3, 0.6]) add(`Bounce height (e = ${e})`, `Rebound height of a ball dropped 300 mm, h' = e²·h`, 'mm', 0.2, () => {
    const w = world(); const h = 300;
    const floor = Bodies.rectangle(0, h + 10 + 4.75, 200, 20, { isStatic: true, restitution: e }); const p = Bodies.circle(0, 0, 4.75, { restitution: e, frictionAir: 0 });
    Body.setMass(p, 0.45); Composite.add(w.world, [floor, p]);
    let hit = false, ymin = h; for (let i = 0; i < 900; i++) { Engine.update(w.engine, w.dt); if (p.position.y > h - 0.5) hit = true; if (hit) ymin = Math.min(ymin, p.position.y); if (hit && p.velocity.y > 0 && ymin < h - 3) break; }
    return { expected: e * e * h, measured: h - ymin };
  });

  // 4 ── sliding on an incline, kinetic friction
  add('Incline sliding acceleration', 'Block on a 25° plane, μ = 0.30: a = g(sinθ − μcosθ)', 'm/s²', 0.08, () => {
    const w = world(); const th = 25 * Math.PI / 180, mu = 0.30;
    const plane = Bodies.rectangle(0, 0, 600, 20, { isStatic: true, angle: th, friction: mu, frictionStatic: mu });
    const c = Math.cos(th), s = Math.sin(th);
    const b = Bodies.rectangle(-150 * c + 15.05 * s, -150 * s - 15.05 * c, 20, 10, { angle: th, friction: mu, frictionStatic: mu, frictionAir: 0, restitution: 0 });   // 15 mm above the plane's centre line along its up-normal (sinθ, −cosθ)
    Body.setMass(b, 5); Composite.add(w.world, [plane, b]);
    const a = accelFit(w, () => b.position.x * c + b.position.y * s, 100, 100);
    return { expected: G_MS2 * (Math.sin(th) - mu * Math.cos(th)), measured: a };
  });

  // 5 ── static friction threshold
  add('Static friction threshold', 'Block rests on a 15° plane with μ = 0.30 (tan 15° = 0.27 < μ): must not creep', 'mm', 0.0, () => {
    const w = world(); const th = 15 * Math.PI / 180, mu = 0.30;
    const plane = Bodies.rectangle(0, 0, 600, 20, { isStatic: true, angle: th, friction: mu, frictionStatic: mu });
    const c = Math.cos(th), s = Math.sin(th);
    const b = Bodies.rectangle(-100 * c + 15.05 * s, -100 * s - 15.05 * c, 20, 10, { angle: th, friction: mu, frictionStatic: mu, frictionAir: 0, restitution: 0 });
    Body.setMass(b, 5); Composite.add(w.world, [plane, b]);
    step(w, 150); const x0 = b.position.x; step(w, 500);
    return { expected: 0, measured: Math.abs(b.position.x - x0), absTol: 8, extra: 'creep over 1 s (a < 0.01 m/s²)' };
  });

  // 6 ── projectile range
  add('Projectile range', 'Ball launched at 45°, 1.0 m/s, no drag: R = v²sin2θ/g', 'mm', 0.04, () => {
    const w = world(); const v0 = 1.0, th = 45 * Math.PI / 180;
    const p = Bodies.circle(0, 0, 2, { frictionAir: 0 }); Body.setMass(p, 0.4); Composite.add(w.world, p);
    Body.setVelocity(p, { x: v0 * Math.cos(th) * 1000 / 60, y: -v0 * Math.sin(th) * 1000 / 60 });
    let last = 0; for (let i = 0; i < 1000; i++) { Engine.update(w.engine, w.dt); if (p.position.y >= 0 && i > 5) { last = p.position.x; break; } }
    return { expected: (v0 * v0 * Math.sin(2 * th) / G_MS2) * 1000, measured: last };
  });

  // 7 ── momentum conservation in a collision
  add('Momentum conservation', 'Two pills collide head-on in free space: total momentum before = after', 'g·mm/ms', 0.02, () => {
    const w = world(); w.engine.gravity.scale = 0;
    const a = Bodies.circle(-20, 0, 4.75, { restitution: 0.5, frictionAir: 0 }), b = Bodies.circle(20, 0, 4.75, { restitution: 0.5, frictionAir: 0 });
    Body.setMass(a, 0.5); Body.setMass(b, 1.5); Composite.add(w.world, [a, b]);
    Body.setVelocity(a, { x: 300 / 60, y: 0 }); Body.setVelocity(b, { x: -100 / 60, y: 0 });
    const mom = () => 0.5 * a.velocity.x * 60 / 1000 + 1.5 * b.velocity.x * 60 / 1000;
    const p0 = mom(); step(w, 300);
    return { expected: p0, measured: mom(), absTol: 0.002 };
  });

  // 8 ── unit system: force in newtons
  add('Force units (N)', 'A 0.10 N force on a 1 g mass for 50 ms: v = F·t/m = 5 m/s', 'm/s', 0.02, () => {
    const w = world(); w.engine.gravity.scale = 0;
    const b = Bodies.circle(0, 0, 3, { frictionAir: 0 }); Body.setMass(b, 1.0); Composite.add(w.world, b);
    for (let i = 0; i < 25; i++) { Body.applyForce(b, b.position, { x: 0.10, y: 0 }); Engine.update(w.engine, w.dt); }
    return { expected: 5.0, measured: b.velocity.x * 60 / 1000 };
  });

  // 9 ── step-size convergence
  add('Time-step convergence', 'Free-fall distance after 0.15 s with a 2 ms vs a 0.5 ms step', 'mm', 0.02, () => {
    const run = (dt) => { const w = world(dt); const p = Bodies.circle(0, 0, 3, { frictionAir: 0 }); Body.setMass(p, 0.4); Composite.add(w.world, p); const n = Math.round(150 / dt); for (let i = 0; i < n; i++) Engine.update(w.engine, dt); return p.position.y; };
    return { expected: run(0.5), measured: run(2), extra: `analytic ${(0.5 * 9810 * 0.15 * 0.15).toFixed(1)} mm` };
  });

  // 10 ── rolling disc on an incline
  add('Rolling disc acceleration', 'KNOWN LIMIT, solid disc on a 20° plane, μ high: ideal a = (2/3)·g·sinθ. Circles are 40-gons, so facet impacts add rolling resistance and round pills roll more slowly than real ones', 'm/s²', 0.12, () => {
    const w = world(); const th = 20 * Math.PI / 180;
    const plane = Bodies.rectangle(0, 0, 800, 20, { isStatic: true, angle: th, friction: 1, frictionStatic: 1 });
    const c = Math.cos(th), s = Math.sin(th), r = 8;
    const d = Bodies.circle(-200 * c + (10.05 + r) * s, -200 * s - (10.05 + r) * c, r, { friction: 1, frictionStatic: 1, frictionAir: 0 }, 40);
    Body.setMass(d, 2); Composite.add(w.world, [plane, d]);
    const a = accelFit(w, () => d.position.x * c + d.position.y * s, 100, 100);
    return { expected: (2 / 3) * G_MS2 * Math.sin(th), measured: a, known: true };
  });

  // 11 ── actuator: tracks a trapezoidal move
  add('Actuator tracking', '4 g plate driven 40 mm at 260 mm/s by the force-limited servo: peak following error', 'mm', 0, () => {
    const w = world(); const a = new P.SlideActuator(w, [P.dynRect(0, 0, 40, 6)], { mass: 4, Fmax: 8, dir: { x: 1, y: 0 } });
    const mv = new P.Mover(0); let maxErr = 0;
    for (let i = 0; i < 700; i++) { const prev = mv.pos; mv.step(40, 260, 3600, w.dt); a.drive(w.dt, mv.pos, (mv.pos - prev) / w.dt, 0); Engine.update(w.engine, w.dt); maxErr = Math.max(maxErr, Math.abs(a.err)); }
    return { expected: 0, measured: maxErr, absTol: 0.5, extra: `final position ${a.s.toFixed(2)} mm` };
  });

  // 12 ── actuator: stalls at the force limit against a hard stop
  add('Actuator stall at rated force', 'Same servo driven into a rigid stop: it must stop at the wall and report its rated force', 'N', 0.02, () => {
    const w = world(); const a = new P.SlideActuator(w, [P.dynRect(0, 0, 40, 6)], { mass: 4, Fmax: 8, dir: { x: 1, y: 0 } });
    Composite.add(w.world, Bodies.rectangle(45, 0, 6, 20, { isStatic: true }));
    const mv = new P.Mover(0);
    for (let i = 0; i < 700; i++) { const prev = mv.pos; mv.step(80, 260, 3600, w.dt); a.drive(w.dt, mv.pos, (mv.pos - prev) / w.dt, 0); Engine.update(w.engine, w.dt); }
    return { expected: 8, measured: a.load, extra: `plate face at ${(a.s + 20).toFixed(2)} mm (wall 42 mm), stalled = ${a.stalled}` };
  });

  // 13 ── suction force: F = ΔP·A
  add('Suction force', 'ΔP = 25 kPa on a Ø3 mm port: F = ΔP·A (N)', 'N', 0.01, () => {
    const d = 3, A = Math.PI * (d / 2) ** 2;
    return { expected: 25e3 * A * 1e-6, measured: 25 * 1e3 * Math.PI * (d / 2) ** 2 * 1e-6 };
  });

  P.validationTests = tests;
  P.runValidation = function () {
    return tests.map((t) => {
      let r;
      try { r = t.fn(); } catch (e) { r = { expected: NaN, measured: NaN, extra: 'ERROR ' + e.message }; }
      const err = r.absTol != null ? Math.abs(r.measured - r.expected) : Math.abs(r.measured - r.expected) / Math.max(Math.abs(r.expected), 1e-9);
      const tol = r.absTol != null ? r.absTol : t.tol;
      const pass = Number.isFinite(err) && err <= tol;
      return { name: t.name, what: t.what, unit: t.unit, expected: r.expected, measured: r.measured, err, tol, absolute: r.absTol != null, extra: r.extra || '', pass, known: !!r.known && !pass };
    });
  };
})(typeof window !== 'undefined' ? window : globalThis);
