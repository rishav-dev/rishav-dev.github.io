/* Prodose chute & collection experiment, pills fall from the exit onto a ramp, slide into a tray and settle.
 * A stand-alone mini world (same engine, contact solver, pill model and damage rating as the machines) so free-fall height,
 * ramp angle / lining and tray lining / wall height can be swept. Reports impact speeds against each pill's drop rating,
 * bounce-out (pill leaves the tray) and transit time.
 *
 *   P.chute.trial(cfg, seed) → { vRamp, vTray, ratio, out, tSettle }       P.chute.batch(cfg, n, seed0) → summary */
(function (G) {
  const P = (G.Prodose = G.Prodose || {});
  const Matter = G.Matter || require('matter-js');
  const { Engine, Bodies, Body, Composite, Events } = Matter;
  const DEG = Math.PI / 180;

  // surface linings: friction μ and restitution e of the lining against pills
  P.LININGS = {
    steel: { label: 'Polished stainless', mu: 0.30, e: 0.30 },
    ptfe: { label: 'PTFE coating', mu: 0.10, e: 0.20 },
    pom: { label: 'POM (acetal)', mu: 0.22, e: 0.22 },
    silicone: { label: 'Silicone 40A', mu: 0.80, e: 0.04 },
    foam: { label: 'Soft foam liner', mu: 0.60, e: 0.02 },
  };

  function build(cfg, seed) {
    const engine = Engine.create({ positionIterations: 10, velocityIterations: 8 });
    engine.gravity.x = 0; engine.gravity.y = 1; engine.gravity.scale = P.G_MM_MS2;
    const CAT = P.internal.CAT, W = engine.world;
    const spec = P.normalizePill(cfg.pill), sc = { spec, localVerts: P.pillLocalVerts(spec), rand: P.rng(seed) };
    const th = cfg.angle * DEG, Lr = cfg.rampLen || 118 / Math.cos(33 * DEG), tk = 6;
    const wall = (cx, cy, w, h, ang, lin) => { const b = Bodies.rectangle(cx, cy, w, h, { isStatic: true, angle: ang || 0, friction: lin.mu, frictionStatic: lin.mu * 1.2, restitution: lin.e, collisionFilter: { category: CAT.WALL, mask: 0xffff } }); Composite.add(W, b); return b; };
    const ramp = P.LININGS[cfg.ramp || 'ptfe'], tray = P.LININGS[cfg.tray || 'steel'];
    // ramp: top surface starts at the origin and runs down-right
    const A = { x: -14, y: -14 * Math.tan(th) }, L2 = Lr + 14 / Math.cos(th);   // ramp reaches back to the guard wall
    const c = { x: A.x + (L2 / 2) * Math.cos(th) - (tk / 2) * Math.sin(th), y: A.y + (L2 / 2) * Math.sin(th) + (tk / 2) * Math.cos(th) };
    const rampB = wall(c.x, c.y, L2, tk, th, ramp);
    const xe = Lr * Math.cos(th), ye = Lr * Math.sin(th), yT = ye + (cfg.dropAfter != null ? cfg.dropAfter : 34), xl = xe - 8, xr = xl + (cfg.trayW || 116), wh = cfg.wallH || 36;
    const floorB = wall((xl + xr) / 2, yT + 4, xr - xl + 12, 8, 0, tray);
    wall(xl - 3, yT - wh / 2 + 2, 6, wh + 4, 0, tray); wall(xr + 3, yT - wh / 2 + 2, 6, wh + 4, 0, tray);
    wall(-16, -300, 6, 900, 0, ramp);                                    // guard wall behind the exit
    const jit = (sc.rand() - 0.5) * 3;
    const p = P.internal.makePill(sc, jit, -cfg.height - spec.W / 2, sc.rand() * Math.PI * 2, 1);
    Composite.add(W, p);
    const geo = { xl, xr, yT, wh, xe, ye, rampB, floorB };
    return { engine, p, spec, geo };
  }

  P.chute = {
    trial(cfg, seed) {
      const { engine, p, spec, geo } = build(cfg, seed || 1), mat = P.SHAPES[spec.shape];
      const vcrit = Math.sqrt(2 * 9810 * mat.hDrop * 1000);
      let vRamp = 0, vTray = 0, seenRamp = false, t = 0, tRamp = null, tTray = null, quiet = 0, vPrev = { x: 0, y: 0 };
      Events.on(engine, 'collisionStart', (ev) => {
        for (const pr of ev.pairs) {
          const a = pr.bodyA.parent, b = pr.bodyB.parent; if (a !== p && b !== p) continue;
          const other = a === p ? b : a, n = pr.collision.normal;
          const rv = Math.abs(vPrev.x * n.x + vPrev.y * n.y) * 60;   // approach speed against a static wall, mm/s (velocity from before the solver ran)
          if (other === geo.rampB && !seenRamp) { seenRamp = true; vRamp = rv; tRamp = t; }
          else if (other === geo.floorB) { if (tTray == null) tTray = t; vTray = Math.max(vTray, rv); }
        }
      });
      const T = 3000; let speedMax = 0;
      while (t < T) {
        vPrev = { x: p.velocity.x, y: p.velocity.y };
        Engine.update(engine, P.DT); t += P.DT;
        const sp = Math.hypot(p.velocity.x, p.velocity.y) * 60;
        if (t > 300 && sp < 6 && p.position.y > geo.yT - geo.wh) { if (++quiet > 60) break; } else quiet = 0;
        if (p.position.y > geo.yT + 300 || Math.abs(p.position.x) > 900) break;
      }
      const inside = p.position.x > geo.xl && p.position.x < geo.xr && p.position.y > geo.yT - geo.wh - 6 && p.position.y < geo.yT + 6;
      const onRamp = !inside && p.position.x < geo.xe - 4 && p.position.y < geo.ye + 8;
      return { vRamp: vRamp / 1000, vTray: vTray / 1000, ratioRamp: vRamp / vcrit, ratioTray: vTray / vcrit, out: inside ? 0 : 1, stuck: onRamp ? 1 : 0, tRamp, tTray, tEnd: t };
    },
    batch(cfg, n, seed0) {
      let out = 0, stuck = 0, rMax = 0, vR = 0, vT = 0, rSum = 0, tt = 0;
      for (let i = 0; i < n; i++) { const r = this.trial(cfg, (seed0 || 500) + i * 7); out += r.out; stuck += r.stuck; const rr = Math.max(r.ratioRamp, r.ratioTray); rMax = Math.max(rMax, rr); rSum += rr; vR += r.vRamp; vT += r.vTray; tt += r.tEnd; }
      return { n, out: out / n, stuck: stuck / n, ratioMax: rMax, ratioMean: rSum / n, vRamp: vR / n, vTray: vT / n, t: tt / n / 1000 };
    },
  };
})(typeof window !== 'undefined' ? window : globalThis);
