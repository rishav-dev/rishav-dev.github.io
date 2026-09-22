/* Prodose research-page analysis, variance-based sensitivity (η²), Pareto fronts, and cluster-bootstrap intervals.
 * Runs entirely on trials already in data/bench.js: no new simulation. See research.html for what each answers. */
(function (G) {
  const Bench = G.Bench;

  // ---- η² (eta-squared): share of the variance in a 0/1 outcome explained by grouping trials by one factor.
  // This is the textbook one-way ANOVA effect size, computed directly (no library): SS_between / SS_total.
  // η² = 0 → the factor explains none of the variance (every group has the same rate); η² = 1 → it explains all of it.
  function etaSquared(rows, valueFn, groupFn) {
    const groups = new Map();
    for (const r of rows) { const g = groupFn(r); if (!groups.has(g)) groups.set(g, []); groups.get(g).push(valueFn(r)); }
    const all = rows.map(valueFn), n = all.length; if (!n) return { eta2: 0, n: 0, groups: 0 };
    const grand = all.reduce((s, v) => s + v, 0) / n;
    let ssTotal = 0; for (const v of all) ssTotal += (v - grand) ** 2;
    let ssBetween = 0; for (const vs of groups.values()) { const m = vs.reduce((s, v) => s + v, 0) / vs.length; ssBetween += vs.length * (m - grand) ** 2; }
    return { eta2: ssTotal > 0 ? ssBetween / ssTotal : 0, n, groups: groups.size };
  }
  Bench.etaSquared = etaSquared;

  // Sensitivity of dose-exact rate to a named factor, for one concept, using one protocol's rows.
  // groupFn maps a row to the factor's level (e.g. r => r.fill, or r => r.x for a P3 sweep's first swept axis).
  function sensitivity(rows, d, groupFn) {
    const rs = rows.filter((r) => r.d === d.key);
    return etaSquared(rs, (r) => r.doseOK, groupFn);
  }
  Bench.sensitivity = sensitivity;

  // ---- cluster bootstrap: resample TRIALS (not cycles) with replacement, so a trial with many metering cycles
  // doesn't get more "votes" than a trial with few, the correct unit of independence is the trial, not the cycle.
  function bootstrapRate(rows, numFn, denFn, iters, seed) {
    iters = iters || 1000;
    let a = (seed || 7) >>> 0; const rnd = () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
    const n = rows.length;
    const point = rows.reduce((s, r) => s + numFn(r), 0) / Math.max(1, rows.reduce((s, r) => s + denFn(r), 0));
    if (!n) return { p: 0, lo: 0, hi: 0, n: 0 };
    const samples = [];
    for (let it = 0; it < iters; it++) {
      let num = 0, den = 0;
      for (let i = 0; i < n; i++) { const r = rows[(rnd() * n) | 0]; num += numFn(r); den += denFn(r); }
      samples.push(den > 0 ? num / den : 0);
    }
    samples.sort((x, y) => x - y);
    const lo = samples[Math.floor(0.025 * iters)], hi = samples[Math.min(iters - 1, Math.floor(0.975 * iters))];
    return { p: point, lo, hi, n };
  }
  Bench.bootstrapRate = bootstrapRate;

  // ---- Pareto front over 2+ objectives, all "higher is better". Returns each point tagged { dominated: bool }.
  function paretoFront(points, dims) {
    return points.map((p) => {
      const dominated = points.some((q) => q !== p && dims.every((k) => q[k] >= p[k]) && dims.some((k) => q[k] > p[k]));
      return Object.assign({}, p, { dominated });
    });
  }
  Bench.paretoFront = paretoFront;
})(window);
