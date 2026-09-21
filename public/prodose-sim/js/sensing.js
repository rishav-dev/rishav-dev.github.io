/* Prodose sensing rig, drop tests with the real physics, and the six confirmation methods evaluated on the recorded waveforms.
 * Shared by bench/sensing.js (Monte-Carlo, node) and sensors.html (live drop test in the browser).
 *
 * Pills are teleported just above the exit light barrier in one of several release patterns and fall under gravity at a
 * 0.5 ms physics step. Recorded per trial:
 *   • beam 1 / beam 2 (7 mm apart): UNION of the pills' shadows along the barrier line (a photodiode array, not a sum)
 *   • the tray load cell: settled mass + landing ring-down + electronic noise (12 mg rms)
 * Methods:
 *   M1 single break-beam, edge count · M2 single beam, pulse width · M3 light curtain, shadow area
 *   M4 dual beam, speed-corrected length · M5 tray load cell · M6 fused (M3 ∧ M4 ∧ M5 must agree, else flagged) */
(function (G) {
  const P = (G.Prodose = G.Prodose || {});
  const Matter = G.Matter || require('matter-js');
  const { Body } = Matter;
  const PATTERNS = ['side-by-side', 'stacked', 'staggered', 'sequential', 'sequential-tight'];
const rng = (s) => { let a = s >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };
const gauss = (r) => { let u = 0; for (let i = 0; i < 6; i++) u += r(); return (u - 3) * Math.SQRT2; };   // ~N(0,1)

// union length of the intervals in which the pills' polygons cover the horizontal line y = yy, clipped to [x0, x1]
function shadow(bodies, yy, x0, x1) {
  const iv = [];
  for (const b of bodies) {
    const v = b.vertices; let lo = Infinity, hi = -Infinity;
    for (let i = 0; i < v.length; i++) {
      const a = v[i], c = v[(i + 1) % v.length];
      if ((a.y - yy) * (c.y - yy) > 0) continue;
      if (a.y === c.y) { lo = Math.min(lo, a.x, c.x); hi = Math.max(hi, a.x, c.x); continue; }
      const x = a.x + ((yy - a.y) * (c.x - a.x)) / (c.y - a.y); lo = Math.min(lo, x); hi = Math.max(hi, x);
    }
    if (hi > lo) iv.push([Math.max(lo, x0), Math.min(hi, x1)]);
  }
  iv.sort((p, q) => p[0] - q[0]); let tot = 0, cur = null;
  for (const [a, b] of iv) { if (b <= a) continue; if (!cur) cur = [a, b]; else if (a <= cur[1]) cur[1] = Math.max(cur[1], b); else { tot += cur[1] - cur[0]; cur = [a, b]; } }
  if (cur) tot += cur[1] - cur[0];
  return tot;
}

function trial(preset, n, pattern, seed, keep) {
  const R = rng(seed);
  const sc = new P.Scene(P.specToParams({ design: 'shuttle', preset, seed, count: 1, fill: 25 }));
  const m = sc.machine, bm = m.beam, sp = sc.spec, L = sp.L, W = sp.W;
  // release pattern: every pill starts on the chute axis just above barrier 1
  // clear the metering mechanism away: only the exit chute, ramp, tray and barriers matter for confirmation
  for (const b of [m.plate && m.plate.body, m.hopper && m.hopper.body, m.lipR && m.lipR.rig.body, m.lipL && m.lipL.rig.body]) if (b) Matter.Composite.remove(sc.world, b);
  for (const b of m.statics) if (b.label === 'base' || b.label === 'roof') Matter.Composite.remove(sc.world, b);
  const cx = m.exit.x, y0 = bm.y - 26 - W;
  const pills = sc.pills.slice(0, n);
  const place = (b, x, y, ang) => { Body.setPosition(b, { x, y }); Body.setAngle(b, ang); Body.setVelocity(b, { x: 0, y: 0 }); Body.setAngularVelocity(b, 0); b.plugin.pill.zone = 'chute'; };
  const jit = () => (R() - 0.5) * 1.0;
  if (n >= 1) {
    const ang0 = () => (sp.shape === 'round' ? 0 : (R() < 0.5 ? 0 : Math.PI) + (R() - 0.5) * 0.5);
    for (let i = 0; i < n; i++) {
      let x = cx + jit(), y = y0, ang = ang0();
      if (i > 0) {
        if (pattern === 'side-by-side') { x = cx + i * (L + 0.4) - ((n - 1) * (L + 0.4)) / 2 + jit(); y = y0 + jit(); }
        else if (pattern === 'stacked') { y = y0 - i * (W + 0.3); x = cx + jit(); }
        else if (pattern === 'staggered') { x = cx + (i % 2 ? 1 : -1) * L * 0.45 * (0.5 + R()); y = y0 - i * W * (0.4 + 0.5 * R()); }
        else if (pattern === 'sequential') { y = y0 - i * (W + 8 + R() * 3 * L); x = cx + jit() * 2; }
        else { y = y0 - i * (W + 1 + R() * 3); x = cx + jit(); }                   // sequential-tight: nearly touching in time
      }
      place(pills[i], x, y, ang);
    }
  }
  for (const b of sc.pills.slice(n)) { /* the rest stay in the bottle, far from the barrier */ }
  // the beam crossing is resolved at a 0.5 ms physics step (well below the shortest pulse); afterwards the step relaxes to 2 ms
  const dt = 0.5, TFINE = 260, T = 1700, lc = [], b1 = [], b2 = [];
  let land = [], t = 0, nextLc = 0;
  while (t < T) {
    const h = t < TFINE ? dt : 2;
    sc.step(h); t += h;
    if (t <= TFINE) { if (n > 0) { b1.push(shadow(pills, bm.y, bm.x0, bm.x1)); b2.push(shadow(pills, bm.y2, bm.x0, bm.x1)); } else { b1.push(0); b2.push(0); } }
    if (t >= nextLc) {           // load cell at 250 Hz
      nextLc += 4; sc.updateZones(true);
      let mass = 0;
      for (const b of pills) { const i = b.plugin.pill; if (i.zone === 'tray') { mass += i.mass; if (!i.landed) { i.landed = true; land.push({ t, a: i.mass * (0.35 + Math.min(1.2, Math.hypot(b.velocity.x, b.velocity.y) * 60 / 2500)) }); } } }
      let ring = 0; for (const l of land) { const d = (t - l.t) / 1000; if (d > 0) ring += l.a * Math.exp(-d / 0.05) * Math.cos(2 * Math.PI * 28 * d); }
      lc.push(mass + ring + gauss(R) * 12);
    }
  }
  return { n, pattern, seed, dt, b1, b2, lc, L, W, mass: P.pillMeanMassMg(sp), pills: keep ? pills.map((b) => ({ x: b.position.x, y: b.position.y })) : null };
}

// ---- feature extraction & the six classifiers -------------------------------------------------------
function pulses(sig, thr, dt) { const out = []; let s = -1; for (let i = 0; i < sig.length; i++) { if (sig[i] > thr && s < 0) s = i; else if (sig[i] <= thr && s >= 0) { out.push([s * dt, i * dt, s, i]); s = -1; } } if (s >= 0) out.push([s * dt, sig.length * dt, s, sig.length]); return out; }
function features(tr) {
  const dt = tr.dt, thr = 0.3;
  const p1 = pulses(tr.b1, thr, dt), p2 = pulses(tr.b2, thr, dt);
  const area1 = tr.b1.reduce((a, v) => a + v, 0) * dt;                   // mm·ms
  const wid1 = p1.length ? p1.reduce((a, p) => a + (p[1] - p[0]), 0) : 0;      // total blocked time
  // fall speed from the two barriers: delay between the first rising edges (barriers 7 mm apart)
  let speed = null; if (p1.length && p2.length) { const d = p2[0][0] - p1[0][0]; if (d > 0.3) speed = 7 / d; }
  const span1 = p1.length ? p1[p1.length - 1][1] - p1[0][0] : 0;         // start of first pulse → end of last
  // settled load-cell mass: mean of the last 200 ms of the 250 Hz trace
  const tail = tr.lc.slice(-50); const mass = tail.reduce((a, v) => a + v, 0) / (tail.length || 1);
  return { p1, p2, area1, wid1, speed, span1, mass, peak: Math.max(0, ...tr.b1) };
}


  // ---- calibrate on single pills (what a commissioning routine would do), then classify
  function calibrate(preset, n, seed0) {
    const cal = { area: [], wid: [], len: [] };
    for (let i = 0; i < (n || 24); i++) {
      const f = features(trial(preset, 1, 'sequential', (seed0 || 9000) + i * 13 + 1));
      if (f.p1.length) { cal.area.push(f.area1); cal.wid.push(f.wid1); if (f.speed) cal.len.push(f.speed * f.wid1); }
    }
    const mean = (a) => a.reduce((s, v) => s + v, 0) / (a.length || 1);
    return { area: mean(cal.area), wid: mean(cal.wid), len: mean(cal.len) || 0 };
  }
  function estimate(f, C, nominal) {
    const est = {
      M1: f.p1.length,
      M2: f.p1.reduce((acc, p) => acc + Math.max(1, Math.round((p[1] - p[0]) / C.wid)), 0),
      M3: f.p1.length === 0 ? 0 : Math.max(1, Math.round(f.area1 / C.area)),
      M4: f.p1.length === 0 ? 0 : (f.speed && C.len ? Math.max(1, Math.round((f.speed * f.span1) / C.len)) : f.p1.length),
      M5: Math.max(0, Math.round(f.mass / nominal)),
    };
    est.M6 = (est.M3 === est.M4 && est.M4 === est.M5) ? est.M3 : -1;              // −1 = disagreement: flagged, not confirmed
    return est;
  }
  P.sensing = { PATTERNS, trial, features, calibrate, estimate, shadow, pulses };
})(typeof window !== 'undefined' ? window : globalThis);
