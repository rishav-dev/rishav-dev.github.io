/* Prodose, one dispensing trial (fresh bottle, one dose request, run to completion) with full metrics.
 * Shared by the node bench (bench/lib.js) and the live bench on the website, so both run the identical code path. */
(function (G) {
  const P = (G.Prodose = G.Prodose || {});
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  // A sensible stock bottle for an arbitrary pill size (used by the size sweep).
  P.bottleFor = function (pill) {
    const mouth = clamp(Math.max(1.5 * pill.W + 8, pill.L * 1.05 + 6, 22), 22, 45);
    const D = clamp(mouth + 12, 30, 62);
    return { style: 'vial', D: Math.round(D), H: Math.round(clamp(D * 2.2, 62, 112)), mouth: Math.round(Math.min(mouth, D - 6)), color: 'amber' };
  };

  P.specToParams = function (spec) {
    let pill, bottle, fill;
    if (spec.preset) { const pr = P.PRESETS[spec.preset]; pill = { shape: pr.shape, L: pr.L, W: pr.W, color: pr.color }; bottle = Object.assign({}, pr.bottle); fill = pr.fill; }
    else { pill = Object.assign({}, spec.pill); bottle = spec.bottle || P.bottleFor(pill); fill = spec.fill != null ? spec.fill : 60; }
    if (spec.fill != null) fill = spec.fill;
    return Object.assign({ design: spec.design, seed: spec.seed || 11, pill, bottle, fill, pocket: 'auto', scraper: 'auto', wheelSpeed: 220, vibe: true, cap: true, armSpeed: 1 }, spec.over || {});
  };

  // Creates a trial you can advance in slices (live UI) or run to the end (node): { step(maxMs) → done?, result() }
  P.startTrial = function (spec) {
    const now = () => (typeof performance !== 'undefined' ? performance.now() : Date.now());
    const t0 = now();
    const params = P.specToParams(spec), count = spec.count || 5, maxMs = (spec.maxSec || 90) * 1000;
    const sc = new P.Scene(params);
    sc.dispense(count);
    let firstMs = null, settle = -1, over = false;
    const finished = () => sc.machine.state === 'done' || sc.machine.state === 'error' || sc.t >= maxMs;
    return {
      scene: sc,
      step(budgetMs) {
        const tEnd = now() + (budgetMs || 1e9);
        while (now() < tEnd) {
          if (!over) {
            sc.step(P.DT);
            if (firstMs == null && sc.stats.dispensed > 0) firstMs = sc.t;
            if (finished()) { over = true; settle = 500; }
          } else if (settle-- > 0) sc.step(P.DT); else return true;    // let the last pills settle in the tray
        }
        return false;
      },
      result() {
        sc.updateZones(true);
        const st = sc.stats;
        let ok = 0, miss = 0, multi = 0, seq = '';
        for (const c of sc.cycles) { if (c.kind === 'ok') { ok++; seq += 'o'; } else if (c.kind === 'miss') { miss++; seq += 'm'; } else { multi++; seq += 'd'; } }
        let peakSqueeze = 0, impact = 0; const vcrit = Math.sqrt(2 * 9810 * P.SHAPES[sc.spec.shape].hDrop * 1000);
        for (const b of sc.pills) { const i = b.plugin.pill; peakSqueeze = Math.max(peakSqueeze, i.peakF / i.crushN); impact = Math.max(impact, i.maxImpact / vcrit); }
        let load = 0, energy = 0;
        for (const a of sc.actuators || []) { load = Math.max(load, a.peak / a.Fmax); energy += a.energy; }
        const done = sc.machine.state === 'done';
        return {
          state: sc.machine.state, status: done ? '' : sc.status, doseOK: done && st.collected === count && st.dispensed >= count && st.spilled === 0 && st.damaged === 0 ? 1 : 0,
          count, collected: st.collected, dispensed: st.dispensed, cyc: sc.cycles.length, ok, miss, multi, seq,
          jam: st.jams, dmg: st.damaged, str: st.stressed, spill: st.spilled,
          simS: +(sc.t / 1000).toFixed(2), firstS: firstMs == null ? null : +(firstMs / 1000).toFixed(2),
          peakSqueeze: +peakSqueeze.toFixed(3), impact: +impact.toFixed(3), load: +load.toFixed(3), energyMJ: +energy.toFixed(0),
          wallS: +((now() - t0) / 1000).toFixed(2), pills: sc.pills.length,
        };
      },
    };
  };
  P.runTrial = function (spec) { const t = P.startTrial(spec); t.step(0); while (!t.step(1e9)); return t.result(); };
})(typeof window !== 'undefined' ? window : globalThis);
