/* Prodose research page, sensitivity analysis, held-out generalization, and the search-vs-baseline case study. */
(function () {
  const $ = (id) => document.getElementById(id);
  const { designs, byKey, rows, pct } = Bench;
  const label = (d) => `${d.letter} · ${d.short}`;

  // ================================================================== 1 · sensitivity (η²)
  (function () {
    const p3 = rows('P3', (r) => r.k === 'otc_ibuprofen'), p4 = rows('P4', (r) => r.k === 'otc_ibuprofen'), p5 = rows('P5', (r) => r.k === 'otc_ibuprofen'), p6 = rows('P6', (r) => r.k === 'otc_ibuprofen');
    const FACTORS = [
      { key: 'fill', label: 'Fill level (P4)', of: (d) => p4.filter((r) => r.d === d.key), group: (r) => r.fill },
      { key: 'x', label: 'Primary setting (P3)', of: (d) => p3.filter((r) => r.d === d.key), group: (r) => r.x },
      { key: 'y', label: 'Secondary setting (P3)', of: (d) => p3.filter((r) => r.d === d.key && r.y != null), group: (r) => r.y },
      { key: 'motor', label: 'Motor limit (P5)', of: (d) => p5.filter((r) => r.d === d.key), group: (r) => r.v },
      { key: 'motorStress', label: 'Motor limit, stress test (P6)', of: (d) => p6.filter((r) => r.d === d.key), group: (r) => r.v },
    ];
    const cells = designs.map((d) => FACTORS.map((f) => { const rs = f.of(d); if (rs.length < 6) return null; const e = Bench.etaSquared(rs, (r) => r.doseOK, f.group); return { v: e.eta2, text: Math.round(e.eta2 * 100) + '', tip: [['η² (variance explained)', pct(e.eta2, 1)], ['trials', e.n], ['levels', e.groups]] }; }));
    Charts.mount($('chSens'), {
      type: 'heat', title: 'Share of outcome variance explained by each factor (η²)', sub: 'computed from P3–P6, otc_ibuprofen only, so concepts are compared on the same pill', left: 130, maxCell: 130, cellH: 32, legendLabel: '0 → 100 % of variance explained',
      rows: designs.map((d) => ({ label: label(d) })), cols: FACTORS.map((f) => ({ label: f.label })), cells,
      table: { cols: ['Concept'].concat(FACTORS.map((f) => f.label)), rows: designs.map((d, i) => [label(d)].concat(cells[i].map((c) => (c ? pct(c.v, 1) : '– (not swept)')))) },
    });
    $('tblSens').innerHTML = `<caption>Reading it: a high η² for a factor means that sweeping it, alone, moves the dose-exact outcome a lot, so it's the parameter worth getting right first. A low η² means the sweep barely moved the outcome inside the range tested, which is itself informative (that knob is not where this concept's problem is).</caption>` + $('tblSens').innerHTML;
  })();

  // ================================================================== 2 · held-out generalization
  const CH = window.PRODOSE_CHALLENGE;
  if (!CH) {
    $('challengeSub').insertAdjacentHTML('afterend', '<div class="note bad">No data/challenge.js, run <code>node bench/challenge.js</code>.</div>');
  } else {
    const rate = (rs) => (rs.length ? rs.filter((r) => r.doseOK).length / rs.length : NaN);
    const p1 = rows('P1');
    const known = designs.map((d) => rate(p1.filter((r) => r.d === d.key)));
    const unseen = designs.map((d) => rate(CH.results.filter((r) => r.d === d.key)));
    Charts.mount($('chChallenge'), {
      type: 'heat', title: 'Dose-exact rate: known pills vs. never-seen geometry', sub: `known = P1 (8 real pills) · unseen = ${CH.meta.pills.length} challenge pills × ${CH.meta.seeds.length} seeds`, left: 130, maxCell: 130, cellH: 34, legendLabel: '0 → 100 % of doses exact',
      rows: designs.map((d) => ({ label: label(d) })), cols: [{ label: 'Known pills (P1)' }, { label: 'Unseen geometry (challenge)' }],
      cells: designs.map((d, i) => [{ v: known[i], text: pct(known[i]).replace('%', ''), tip: [['dose exact on known pills', pct(known[i])]] }, { v: unseen[i], text: pct(unseen[i]).replace('%', ''), tip: [['dose exact on unseen geometry', pct(unseen[i])], ['trials', CH.results.filter((r) => r.d === d.key).length]] }]),
      table: { cols: ['Concept', 'Known pills', 'Unseen geometry', 'Gap'], rows: designs.map((d, i) => [label(d), pct(known[i]), pct(unseen[i]), (isNaN(known[i] - unseen[i]) ? '–' : (known[i] >= unseen[i] ? '−' : '+') + pct(Math.abs(known[i] - unseen[i])))]) },
    });
    const byPill = designs.map((d) => CH.meta.pills.map((c) => rate(CH.results.filter((r) => r.d === d.key && r.pill === c.key))));
    $('tblChallenge').innerHTML = `<caption>Per-pill breakdown of the challenge set, the five pills, in order, are: ${CH.meta.pills.map((c) => c.label).join('; ')}.</caption><thead><tr><th>Concept</th>${CH.meta.pills.map((c) => `<th class="num">${c.label.split(' ').slice(-2).join(' ')}</th>`).join('')}<th class="num">Overall</th></tr></thead><tbody>${designs.map((d, i) => `<tr><td><span class="chip"><i style="background:${d.color}"></i>${label(d)}</span></td>${byPill[i].map((v) => `<td class="num">${isNaN(v) ? '–' : pct(v)}</td>`).join('')}<td class="num"><b>${pct(unseen[i])}</b></td></tr>`).join('')}</tbody>`;
    const worstDrop = designs.map((d, i) => ({ d, drop: known[i] - unseen[i] })).sort((a, b) => b.drop - a.drop)[0];
    if (worstDrop && worstDrop.drop > 0.15) $('challengeSub').insertAdjacentHTML('beforeend', ` <b>Largest gap:</b> ${label(worstDrop.d)} drops ${pct(worstDrop.drop)} on unseen geometry, its auto-sizing formula generalizes worse than the others tested here.`);
  }

  // ================================================================== 3 · optimizer case study
  const OPT = window.PRODOSE_OPTIMIZE;
  if (!OPT) {
    $('optSub').insertAdjacentHTML('afterend', '<div class="note bad">No data/optimize.js, run <code>node bench/optimize.js</code> (a few minutes).</div>');
  } else {
    const d = byKey[OPT.meta.target.design], pr = OPT.meta.pill;
    const b = OPT.baseline, o = OPT.best;
    $('optCards').innerHTML = `
      <div class="card"><div class="meta">Target</div><h3>${label(d)} on ${OPT.meta.target.preset.replace(/_/g, ' ')}</h3><p>Pill ${pr.L} × ${pr.W} mm. Baseline is the concept's own analytic pocket-sizing formula (<code>pocketAuto</code>). ${OPT.meta.nCandidates} random candidates were scored on ${OPT.meta.nSearchSeeds} search seeds; the best is re-scored below on ${OPT.meta.nHoldSeeds} seeds it never saw.</p></div>
      <div class="card"><div class="meta">Baseline (auto pocket)</div><h3>${pct(b.holdout.rate)} held-out</h3><p>search ${pct(b.search.rate)} · held-out ${pct(b.holdout.rate)} · jams ${b.holdout.jamRate.toFixed(2)}/dose · broken ${b.holdout.dmgRate.toFixed(2)}/dose</p></div>
      <div class="card"><div class="meta">Found optimum</div><h3>${pct(o.holdout.rate)} held-out</h3><p>pocket ${o.over.pocketLen} × ${o.over.pocketDepth} mm (${o.params.fl.toFixed(2)} × pill length, ${o.params.fd.toFixed(2)} × pill width) · search ${pct(o.search.rate)} · held-out ${pct(o.holdout.rate)} · jams ${o.holdout.jamRate.toFixed(2)}/dose · broken ${o.holdout.dmgRate.toFixed(2)}/dose</p></div>`;
    const gap = o.holdout.rate - b.holdout.rate;
    $('optCards').insertAdjacentHTML('beforeend', `<div class="card"><div class="meta">Result</div><h3>${gap >= 0 ? '+' : ''}${pct(gap, 0)} on held-out seeds</h3><p>${gap > 0.02 ? 'Search found a pocket size that outperforms the analytic baseline on the held-out seeds, which were not used to select the candidate.' : gap < -0.02 ? 'Search did not outperform the analytic baseline on the held-out seeds; the analytic formula performed similarly to the best candidate from the 26-candidate random search.' : 'Search and the analytic baseline land within noise of each other on held-out seeds.'}</p></div>`);
    Charts.mount($('chOptSearch'), {
      type: 'bars', title: 'Search candidates, ranked', sub: `dose-exact rate on the ${OPT.meta.nSearchSeeds} search seeds (not held-out), this is what the search saw`, domain: [0, 1], ticks: [0, 0.25, 0.5, 0.75, 1], fmtTick: (v) => pct(v), fmt: (v) => pct(v), metric: 'search rate', rowH: 22,
      items: OPT.candidates.slice(0, 14).map((c, i) => ({ key: 'c' + i, label: `${c.fl.toFixed(2)}× × ${c.fd.toFixed(2)}×`, value: c.searchRate, color: i === 0 ? 'var(--c3)' : 'var(--c1)', tip: [['pocket', `${c.fl.toFixed(2)} × pill length, ${c.fd.toFixed(2)} × pill width`], ['search dose-exact', pct(c.searchRate)], ['jam rate', c.jamRate.toFixed(2)], ['damage rate', c.dmgRate.toFixed(2)]] })),
      table: { cols: ['Pocket (× length, × width)', 'Search dose-exact', 'Jam rate', 'Damage rate'], rows: OPT.candidates.map((c) => [`${c.fl.toFixed(2)}× × ${c.fd.toFixed(2)}×`, pct(c.searchRate), c.jamRate.toFixed(2), c.dmgRate.toFixed(2)]) },
    });
    Charts.mount($('chOptHeat'), {
      type: 'bars', title: 'Baseline vs. optimum, both ways of scoring', sub: 'held-out bars are used for the final comparison; search-seed bars show the values used during candidate selection', domain: [0, 1], ticks: [0, 0.25, 0.5, 0.75, 1], fmtTick: (v) => pct(v), fmt: (v) => pct(v), metric: 'dose exact', rowH: 30,
      items: [
        { key: 'b1', label: 'Baseline, search seeds', value: b.search.rate, color: 'var(--c4)' },
        { key: 'b2', label: 'Baseline, held-out seeds', value: b.holdout.rate, color: 'var(--c2)' },
        { key: 'o1', label: 'Optimum, search seeds', value: o.search.rate, color: 'var(--c5)' },
        { key: 'o2', label: 'Optimum, held-out seeds', value: o.holdout.rate, color: 'var(--c3)' },
      ],
      table: { cols: ['', 'Dose exact'], rows: [['Baseline, search seeds', pct(b.search.rate)], ['Baseline, held-out seeds', pct(b.holdout.rate)], ['Optimum, search seeds', pct(o.search.rate)], ['Optimum, held-out seeds', pct(o.holdout.rate)]] },
    });
  }
})();
