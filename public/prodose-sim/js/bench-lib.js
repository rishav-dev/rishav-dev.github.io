/* Prodose bench analysis, turns the raw trial records in data/bench.js into the numbers the pages show.
 * Definitions (see the "How we measure" panel on the bench page):
 *   cycle          one metering event (a slot / pocket / pick / beam pulse) with a ground-truth pill count from the physics engine
 *   single-pill    cycles that delivered exactly one pill        multiples  ≥ 2 pills in one cycle        miss  0 pills
 *   dose-exact     the requested dose arrived in the tray: exact count, nothing spilled, nothing damaged
 *   damage         pill whose accumulated crush / impact stress reached its rating (breaks, chips)          */
(function (G) {
  const C = G.Charts;
  const B = G.PRODOSE_BENCH || { meta: { designs: [], presets: [], sizes: [] }, results: [] };
  const LETTER = { wheel: 'A', arm: 'B', shuttle: 'C', lane: 'D', belt: 'E', vacdisc: 'F' };
  const designs = B.meta.designs.map((d, i) => Object.assign({ letter: LETTER[d.key] || '?', color: `var(--c${i + 1})`, slot: i + 1 }, d));
  const byKey = Object.fromEntries(designs.map((d) => [d.key, d]));
  const mean = (a) => (a.length ? a.reduce((s, v) => s + v, 0) / a.length : NaN);
  const sd = (a) => { if (a.length < 2) return NaN; const m = mean(a); return Math.sqrt(a.reduce((s, v) => s + (v - m) ** 2, 0) / (a.length - 1)); };

  const rows = (p, pred) => B.results.filter((r) => r.p === p && (!pred || pred(r)));

  function agg(rs) {
    const n = rs.length, sum = (k) => rs.reduce((s, r) => s + (r[k] || 0), 0);
    const cyc = sum('ok') + sum('miss') + sum('multi'), ok = sum('ok'), miss = sum('miss'), multi = sum('multi');
    const dose = rs.filter((r) => r.doseOK).length, dispensed = Math.max(1, sum('dispensed'));
    const done = rs.filter((r) => r.state === 'done' && r.firstS != null && r.dispensed > 1);
    const tpp = done.map((r) => (r.simS - r.firstS) / Math.max(1, r.dispensed - 1));
    return {
      n, cyc, ok, miss, multi, dose,
      single: C.wilson(ok, cyc), multiRate: C.wilson(multi, cyc), missRate: C.wilson(miss, cyc), doseRate: C.wilson(dose, n),
      jamsPerDose: sum('jam') / (n || 1), dmgPer100: (100 * sum('dmg')) / dispensed, strPer100: (100 * sum('str')) / dispensed, spill: sum('spill'),
      errors: rs.filter((r) => r.state !== 'done').length,
      secPerPill: mean(tpp), secPerPillSD: sd(tpp), cv: sd(tpp) / mean(tpp),
      squeeze: Math.max(0, ...rs.map((r) => r.peakSqueeze || 0)), impact: Math.max(0, ...rs.map((r) => r.impact || 0)), load: Math.max(0, ...rs.map((r) => r.load || 0)),
    };
  }
  const groupBy = (rs, fn) => { const m = new Map(); for (const r of rs) { const k = fn(r); if (!m.has(k)) m.set(k, []); m.get(k).push(r); } return m; };
  const pct = (v, d) => (100 * v).toFixed(d == null ? 0 : d) + '%';
  const ci = (w) => `${pct(w.p, 0)} (${pct(w.lo, 0)}–${pct(w.hi, 0)})`;

  G.Bench = { data: B, meta: B.meta, designs, byKey, rows, agg, groupBy, pct, ci, mean, sd, LETTER };
})(window);
