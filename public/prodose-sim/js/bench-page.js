/* Prodose bench page, charts and tables built from data/bench.js, plus the live in-browser bench. */
(function () {
  const $ = (id) => document.getElementById(id);
  const { designs, byKey, rows, agg, groupBy, pct, ci, meta } = Bench;
  const P = window.Prodose;
  const label = (d) => `${d.letter} · ${d.short}`;
  const STATUS = { good: 'var(--good)', serious: 'var(--serious)', warning: 'var(--warning)', critical: 'var(--critical)' };

  $('metaChip').textContent = `${meta.trials} simulated trials`;
  $('genDate').textContent = meta.generated; $('nodeVer').textContent = meta.node;
  if (!Bench.data.results.length) { document.querySelector('main').insertAdjacentHTML('afterbegin', '<div class="note bad">No bench data found, run <code>node bench/run.js</code> to generate data/bench.js.</div>'); }

  // ---------------------------------------------------------------- 1 · headline
  const p1 = rows('P1'), seeds1 = new Set(p1.map((r) => r.s)).size; $('p1seeds').textContent = seeds1;
  const perD = designs.map((d) => ({ d, a: agg(p1.filter((r) => r.d === d.key)) }));
  const tipFor = (d, a) => [['single-pill', ci(a.single), d.color], ['multiples', pct(a.multiRate.p, 1)], ['misses', pct(a.missRate.p, 1)], ['dose exact', ci(a.doseRate)], ['metering cycles', a.cyc], ['trials', a.n]];

  Charts.mount($('chSingle'), {
    type: 'bars', title: 'Single-pill success', sub: 'cycles delivering exactly one pill · 95 % interval', domain: [0, 1], ticks: [0, 0.25, 0.5, 0.75, 1], fmtTick: (v) => pct(v), fmt: (v) => pct(v), metric: 'single-pill', ref: { value: 0.95, label: 'goal 95 %' },
    items: perD.map(({ d, a }) => ({ key: d.key, label: label(d), value: a.single.p, lo: a.single.lo, hi: a.single.hi, color: d.color, tip: tipFor(d, a) })),
    table: { cols: ['Concept', 'Single-pill', 'Lower 95 %', 'Upper 95 %', 'Cycles'], rows: perD.map(({ d, a }) => [label(d) + ' ' + d.short, pct(a.single.p, 1), pct(a.single.lo, 1), pct(a.single.hi, 1), a.cyc]) },
  });
  Charts.mount($('chDose'), {
    type: 'bars', title: 'Dose exact', sub: 'whole dose delivered, none spilled or broken · 95 % interval', domain: [0, 1], ticks: [0, 0.25, 0.5, 0.75, 1], fmtTick: (v) => pct(v), fmt: (v) => pct(v), metric: 'dose exact', ref: { value: 0.95, label: 'goal 95 %' },
    items: perD.map(({ d, a }) => ({ key: d.key, label: label(d), value: a.doseRate.p, lo: a.doseRate.lo, hi: a.doseRate.hi, color: d.color, tip: tipFor(d, a) })),
    table: { cols: ['Concept', 'Dose exact', 'Lower 95 %', 'Upper 95 %', 'Trials'], rows: perD.map(({ d, a }) => [label(d) + ' ' + d.short, pct(a.doseRate.p, 1), pct(a.doseRate.lo, 1), pct(a.doseRate.hi, 1), a.n]) },
  });
  Charts.mount($('chOutcome'), {
    type: 'stack', title: 'What happens in a metering cycle', sub: 'share of cycles (sorted by concept, not by score)',
    parts: [{ key: 'ok', label: 'One pill', icon: '✓', color: STATUS.good, ink: '#0b0b0b' }, { key: 'multi', label: 'Multiple pills', icon: '×2', color: STATUS.serious, ink: '#0b0b0b' }, { key: 'miss', label: 'Empty / failed pick', icon: '∅', color: STATUS.warning, ink: '#0b0b0b' }],
    items: perD.map(({ d, a }) => ({ label: label(d), total: a.cyc, vals: { ok: a.ok, multi: a.multi, miss: a.miss } })),
    table: { cols: ['Concept', 'One pill', 'Multiple', 'Empty', 'Cycles'], rows: perD.map(({ d, a }) => [label(d) + ' ' + d.short, a.ok, a.multi, a.miss, a.cyc]) },
  });

  const t = $('tblSummary');
  t.innerHTML = `<caption>Pooled over all 8 pills and every seed. “s / pill” is steady-state time per pill after the first; “timing CV” is its spread between runs (repeatability).</caption>
    <thead><tr><th>Concept</th><th class="num">Single-pill</th><th class="num">Multiples</th><th class="num">Misses</th><th class="num">Dose exact</th><th class="num">Jams / dose</th><th class="num">Damaged / 100</th><th class="num">Stressed / 100</th><th class="num">s / pill</th><th class="num">Timing CV</th><th class="num">Stopped on error</th></tr></thead>
    <tbody>${perD.map(({ d, a }) => `<tr><td><span class="chip"><i style="background:${d.color}"></i>${label(d)}</span> ${d.name}</td><td class="num">${ci(a.single)}</td><td class="num">${pct(a.multiRate.p, 1)}</td><td class="num">${pct(a.missRate.p, 1)}</td><td class="num">${ci(a.doseRate)}</td><td class="num">${a.jamsPerDose.toFixed(2)}</td><td class="num">${a.dmgPer100.toFixed(1)}</td><td class="num">${a.strPer100.toFixed(1)}</td><td class="num">${isNaN(a.secPerPill) ? '–' : a.secPerPill.toFixed(1)}</td><td class="num">${isNaN(a.cv) ? '–' : pct(a.cv, 0)}</td><td class="num">${a.errors} / ${a.n}</td></tr>`).join('')}</tbody>`;

  // ---------------------------------------------------------------- 2 · by pill
  const presets = meta.presets;
  Charts.mount($('chPill'), {
    type: 'heat', title: 'Dose-exact rate by concept and product', sub: `${seeds1} bottle fills per cell`, left: 130, maxCell: 74, cellH: 34, legendLabel: '0 → 100 % of doses exact',
    rows: designs.map((d) => ({ label: label(d) })),
    cols: presets.map((p) => ({ label: p.label.replace(/^(OTC|Rx|Supp) · /, '').replace(/ \(.*\)/, '').slice(0, 14) })),
    cells: designs.map((d) => presets.map((p) => {
      const rs = p1.filter((r) => r.d === d.key && r.k === p.key); if (!rs.length) return null; const a = agg(rs);
      return { v: a.doseRate.p, text: pct(a.doseRate.p), tip: [['dose exact', `${a.dose} / ${a.n}`], ['single-pill', pct(a.single.p, 0)], ['multiples', pct(a.multiRate.p, 0)], ['jams', a.jamsPerDose.toFixed(2) + ' / dose'], ['damaged / 100', a.dmgPer100.toFixed(1)]] };
    })),
    table: { cols: ['Concept'].concat(presets.map((p) => p.label)), rows: designs.map((d) => [label(d)].concat(presets.map((p) => { const rs = p1.filter((r) => r.d === d.key && r.k === p.key); return rs.length ? pct(agg(rs).doseRate.p) : '–'; }))) },
  });

  // ---------------------------------------------------------------- 3 · size range
  const p2 = rows('P2'), sizes = meta.sizes, FAM = { round: 'Round Ø mm', caplet: 'Caplet length', capsule: 'Capsule length', softgel: 'Softgel length' };
  const famOrder = ['round', 'caplet', 'capsule', 'softgel'];
  const sizeRate = (d, z) => { const rs = p2.filter((r) => r.d === d.key && r.fam === z.fam && r.L === z.L); return rs.length ? agg(rs) : null; };
  Charts.mount($('chRange'), {
    type: 'heat', title: 'Dose-exact rate across pill sizes (auto-tuned)', sub: 'each cell: 2 seeds × dose of 4', left: 100, maxCell: 40, cellH: 30, legendLabel: '0 → 100 % of doses exact',
    colGroups: famOrder.map((f) => ({ label: FAM[f], n: sizes.filter((z) => z.fam === f).length })),
    cols: sizes.map((z) => ({ label: String(z.L) })),
    rows: designs.map((d) => ({ label: label(d) })),
    cells: designs.map((d) => sizes.map((z) => { const a = sizeRate(d, z); return a ? { v: a.doseRate.p, text: Math.round(a.doseRate.p * 100) + '', tip: [['pill', `${z.L} × ${z.W} mm ${z.fam}`], ['dose exact', `${a.dose} / ${a.n}`], ['multiples', pct(a.multiRate.p, 0)], ['misses', pct(a.missRate.p, 0)]] } : null; })),
    table: { cols: ['Concept'].concat(sizes.map((z) => `${z.fam} ${z.L}`)), rows: designs.map((d) => [label(d)].concat(sizes.map((z) => { const a = sizeRate(d, z); return a ? pct(a.doseRate.p) : '–'; }))) },
  });
  const rt = $('tblRange');
  const rangeOf = (d, f) => {
    const zs = sizes.filter((z) => z.fam === f), ok = zs.map((z) => { const a = sizeRate(d, z); return a && a.doseRate.p >= 0.9; });
    if (!ok.some(Boolean)) return { txt: 'none', n: 0, of: zs.length, best: null };
    // longest contiguous run of passing sizes
    let best = [0, -1], s = -1; ok.forEach((v, i) => { if (v && s < 0) s = i; if ((!v || i === ok.length - 1) && s >= 0) { const e = v ? i : i - 1; if (e - s > best[1] - best[0]) best = [s, e]; s = -1; } });
    const a = zs[best[0]], b = zs[best[1]], unit = f === 'round' ? 'Ø ' : 'L ';
    return { txt: a.L === b.L ? `${unit}${a.L} mm` : `${unit}${a.L}–${b.L} mm`, n: ok.filter(Boolean).length, of: zs.length };
  };
  rt.innerHTML = `<caption>Longest contiguous run of sizes with ≥ 90 % of doses exact, and how many of the swept sizes pass in total.</caption><thead><tr><th>Concept</th>${famOrder.map((f) => `<th>${FAM[f]}</th>`).join('')}</tr></thead><tbody>${designs.map((d) => `<tr><td><span class="chip"><i style="background:${d.color}"></i>${label(d)}</span></td>${famOrder.map((f) => { const r = rangeOf(d, f); return `<td>${r.txt} <span style="color:var(--muted)">(${r.n}/${r.of})</span></td>`; }).join('')}</tr>`).join('')}</tbody>`;
  Bench.rangeOf = rangeOf;

  // ---------------------------------------------------------------- 4 · adjustment sweeps
  const p3 = rows('P3');
  const PILLNAME = { otc_ibuprofen: 'Ibuprofen Ø 9.5 mm', apap_caplet: 'Caplet 17 × 7 mm' };
  const sortedUniq = (a) => [...new Set(a)].sort((x, y) => (typeof x === 'number' ? x - y : String(x).localeCompare(String(y))));
  function sweep(d, k, opt) {
    const rs = p3.filter((r) => r.d === d && r.k === k && r.name === opt.name); if (!rs.length) return null;
    const xs = sortedUniq(rs.map((r) => r.x)), ys = opt.oneRow ? [null] : sortedUniq(rs.map((r) => r.y));
    return {
      rows: ys.map((y) => ({ label: opt.oneRow ? opt.oneRow : opt.fmtY(y) })), cols: xs.map((x) => ({ label: opt.fmtX ? opt.fmtX(x) : String(x) })),
      cells: ys.map((y) => xs.map((x) => { const g = rs.filter((r) => r.x === x && (opt.oneRow || r.y === y)); if (!g.length) return null; const a = agg(g); return { v: a.doseRate.p, text: Math.round(a.doseRate.p * 100) + '', tip: [['dose exact', `${a.dose} / ${a.n}`], ['single-pill', pct(a.single.p, 0)], ['multiples', pct(a.multiRate.p, 0)], ['misses', pct(a.missRate.p, 0)], ['jams', a.jamsPerDose.toFixed(1)]] }; })),
      table: { cols: [opt.corner || ''].concat(xs.map(String)), rows: ys.map((y) => [opt.oneRow ? opt.oneRow : opt.fmtY(y)].concat(xs.map((x) => { const g = rs.filter((r) => r.x === x && (opt.oneRow || r.y === y)); return g.length ? pct(agg(g).doseRate.p) : '–'; }))) },
    };
  }
  const ADJ = {
    wheel: { title: 'A · Wheel, slot-size setting', note: 'The wheel has 10 slot sizes (4.8 → 32 mm). For any pill only one or two neighbouring settings work: too small jams or misses, too large lets two pills into a slot. Auto-selection picks the working one.', maps: [['otc_ibuprofen', 'slot setting', { oneRow: 'Ibuprofen Ø 9.5', corner: 'setting', fmtX: (x) => x }], ['apap_caplet', 'slot setting', { oneRow: 'Caplet 17 × 7', corner: 'setting', fmtX: (x) => x }]] },
    arm: { title: 'B · Arm, vacuum × arm speed', note: 'Suction is a force-limited attachment (ΔP × cup area). Too little vacuum and the pill is not held against the arm’s acceleration or snags on the neck; speed matters only when the margin is thin.', maps: [['otc_ibuprofen', 'vacuum', { corner: 'kPa \\ speed', fmtX: (x) => x + ' kPa', fmtY: (y) => '×' + y }]] },
    shuttle: { title: 'C · Shuttle, pocket length × depth', note: 'Adjustable pocket for a fixed pill. The good region is a band: shorter than the pill → will not seat; deeper than about one pill → a second pill stacks in and passes the wiper; much longer → two side by side.', maps: [['otc_ibuprofen', 'pocket', { corner: 'depth \\ length', fmtX: (x) => x + ' mm', fmtY: (y) => y + ' mm' }], ['apap_caplet', 'pocket', { corner: 'depth \\ length', fmtX: (x) => x + ' mm', fmtY: (y) => y + ' mm' }]] },
    lane: { title: 'D · Lane, slope × chamber length', note: 'Slope has to beat static friction (about 15°) but not be so steep that pills bounce and roll past the pad; the trapdoor chamber must hold exactly one pill.', maps: [['otc_ibuprofen', 'lane', { corner: 'chamber \\ slope', fmtX: (x) => x + '°', fmtY: (y) => y + ' mm' }]] },
    belt: { title: 'E · Belts, spacing ratio × counting method', note: 'The counting method decides whether touching pills are told apart; the spacing ratio only helps if pills separate at all.', maps: [['otc_ibuprofen', 'belt', { corner: 'count \\ ratio', fmtX: (x) => '×' + x, fmtY: (y) => (y === 'width' ? 'length-aware' : 'edge count') }]] },
    vacdisc: { title: 'F · Vacuum disc, vacuum × port diameter', note: 'A larger port or stronger vacuum raises the hold force but also lets the wedge fail to strip a second pill. The working window is bounded on both sides.', maps: [['otc_ibuprofen', 'vacuum', { corner: 'port \\ vacuum', fmtX: (x) => x + ' kPa', fmtY: (y) => 'Ø ' + y + ' mm' }]] },
  };
  const adjTabs = $('adjTabs'), adjPanel = $('adjPanel'); let adjCharts = [];
  designs.forEach((d, i) => { const b = document.createElement('button'); b.type = 'button'; b.setAttribute('role', 'tab'); b.id = 'adj-' + d.key; b.dataset.tab = d.key; b.setAttribute('aria-selected', i === 0); b.setAttribute('aria-controls', 'adjPanel'); b.textContent = label(d); adjTabs.appendChild(b); });
  adjPanel.setAttribute('role', 'tabpanel'); adjPanel.setAttribute('aria-labelledby', 'adj-wheel');
  function showAdj(key) {
    const a = ADJ[key]; adjPanel.innerHTML = `<p class="sub" style="margin-top:0"><b>${a.title}.</b> ${a.note}</p><div class="grid2" id="adjGrid"></div>`; adjCharts = [];
    const grid = $('adjGrid');
    for (const [k, name, opt] of a.maps) {
      const o = Object.assign({ name }, opt), sw = sweep(key, k, o); if (!sw) continue;
      const host = document.createElement('div'); grid.appendChild(host);
      Charts.mount(host, { type: 'heat', title: PILLNAME[k] || k, sub: 'dose-exact rate, 2 seeds per cell', left: 84, maxCell: 62, cellH: 32, legendLabel: '0 → 100 % of doses exact', rows: sw.rows, cols: sw.cols, cells: sw.cells, table: sw.table });
    }
  }
  ProdoseSite.tabs(adjTabs, showAdj);

  // ---------------------------------------------------------------- 5 · fill level & motor limits
  const p4 = rows('P4'), fills = [100, 50, 20], prs4 = ['otc_ibuprofen', 'apap_caplet'];
  if (p4.length) Charts.mount($('chFill'), {
    type: 'heat', title: 'Bottle fill level (dose of 3)', sub: 'dose-exact rate for a dose of 3 · 3 fills per cell', left: 100, maxCell: 40, cellH: 30, legendLabel: '0 → 100 % of doses exact',
    colGroups: prs4.map((k) => ({ label: PILLNAME[k], n: fills.length })), cols: prs4.flatMap(() => fills.map((f) => ({ label: f + '%' }))), rows: designs.map((d) => ({ label: label(d) })),
    cells: designs.map((d) => prs4.flatMap((k) => fills.map((f) => { const rs = p4.filter((r) => r.d === d.key && r.k === k && r.fill === f); if (!rs.length) return null; const a = agg(rs); return { v: a.doseRate.p, text: Math.round(a.doseRate.p * 100) + '', tip: [['dose exact', `${a.dose} / ${a.n}`], ['stopped on error', a.errors]] }; }))),
    table: { cols: ['Concept'].concat(prs4.flatMap((k) => fills.map((f) => PILLNAME[k] + ' ' + f + '%'))), rows: designs.map((d) => [label(d)].concat(prs4.flatMap((k) => fills.map((f) => { const rs = p4.filter((r) => r.d === d.key && r.k === k && r.fill === f); return rs.length ? pct(agg(rs).doseRate.p) : '–'; })))) },
  });
  const p5 = rows('P5'), p6 = rows('P6'), PN5 = { vitd_softgel: 'softgel', otc_ibuprofen: 'tablet', bcomplex: 'capsule' };
  function motorChart(id, dset, unit, title, src, sub) {
    const rs = src.filter((r) => dset.includes(r.d)); if (!rs.length) return;
    const vals = sortedUniq(rs.map((r) => r.v)), rws = [];
    for (const dk of dset) for (const k of ['vitd_softgel', 'otc_ibuprofen', 'bcomplex']) rws.push({ d: byKey[dk], k });
    Charts.mount($(id), {
      type: 'heat', title, sub, left: 132, maxCell: 50, cellH: 28, legendLabel: '0 → 100 % of doses exact',
      cols: vals.map((v) => ({ label: v + '' })), rows: rws.map(({ d, k }) => ({ label: `${d.letter} · ${PN5[k]}` })),
      cells: rws.map(({ d, k }) => vals.map((v) => { const g = rs.filter((r) => r.d === d.key && r.k === k && r.v === v); if (!g.length) return null; const a = agg(g); return { v: a.doseRate.p, text: Math.round(a.doseRate.p * 100) + '', tip: [['limit', v + ' ' + unit], ['dose exact', `${a.dose} / ${a.n}`], ['jams / dose', a.jamsPerDose.toFixed(1)], ['broken / 100', a.dmgPer100.toFixed(1)], ['stressed / 100', a.strPer100.toFixed(1)], ['peak squeeze ÷ crush', pct(a.squeeze, 0)]] }; })),
      table: { cols: ['Concept · pill'].concat(vals.map((v) => v + ' ' + unit)), rows: rws.map(({ d, k }) => [`${label(d)} · ${PN5[k]}`].concat(vals.map((v) => { const g = rs.filter((r) => r.d === d.key && r.k === k && r.v === v); return g.length ? pct(agg(g).doseRate.p) : '–'; }))) },
    });
  }
  motorChart('chMotorF', ['shuttle', 'lane'], 'N', 'Motor current limit (force, N), tuned machine', p5, 'dose-exact rate · 3 seeds per cell · low limits stall on friction');
  motorChart('chMotorT', ['wheel', 'vacdisc'], 'N·mm', 'Motor torque limit (N·mm), tuned machine', p5, 'dose-exact rate · 3 seeds per cell · low limits stall on friction');
  motorChart('chStressF', ['shuttle'], 'N', 'Stress test: shuttle, lip clearance 0.5 mm too tight', p6, 'rigid lips · dose-exact rate (a broken pill fails the dose) · 3 seeds per cell');
  motorChart('chStressT', ['wheel'], 'N·mm', 'Stress test: wheel, scraper clearance 0.5 mm too tight', p6, 'dose-exact rate (a broken pill fails the dose) · 3 seeds per cell');
  const sqz = designs.map((d) => { const a = agg(p1.filter((r) => r.d === d.key)), b = p6.length ? agg(p6.filter((r) => r.d === d.key)) : null; return { d, a, b, v: Math.max(a.squeeze, b ? b.squeeze : 0) }; });
  const dmgAll = sqz.map(({ d }) => agg(rows('P1', (r) => r.d === d.key).concat(p6.filter((r) => r.d === d.key)).concat(p5.filter((r) => r.d === d.key))));
  Charts.mount($('chMotorD'), {
    type: 'bars', title: 'Safety margin: worst squeeze force ÷ crush strength', sub: 'largest force any pill saw from a motor (P1 reliability + P6 stress) as a share of that pill’s crush strength, 100 % would break it', domain: [0, 1], ticks: [0, 0.25, 0.5, 0.75, 1], fmtTick: (v) => pct(v), fmt: (v) => pct(v), metric: 'of crush strength', ref: { value: 1, label: 'crush' },
    items: sqz.map(({ d, a, b, v }, i) => ({ key: d.key, label: label(d), value: Math.min(1, v), color: d.color, tip: [['worst squeeze (P1)', pct(a.squeeze, 0), d.color], ['worst squeeze (stress test)', b ? pct(b.squeeze, 0) : 'not run'], ['broken pills', String(Math.round(dmgAll[i].dmgPer100 * Math.max(1, rows('P1', (r) => r.d === d.key).reduce((s, r) => s + r.dispensed, 0)) / 100))], ['worst impact ÷ rating', pct(a.impact, 0)]] })),
    table: { cols: ['Concept', 'Worst squeeze (P1)', 'Worst squeeze (P6 stress)', 'Worst impact ÷ rating (P1)'], rows: sqz.map(({ d, a, b }) => [label(d), pct(a.squeeze, 0), b ? pct(b.squeeze, 0) : '–', pct(a.impact, 0)]) },
  });

  // ---------------------------------------------------------------- 6 · live bench
  for (const d of designs) { const o = document.createElement('option'); o.value = d.key; o.textContent = `${d.letter} · ${d.name}`; $('liveDesign').appendChild(o); }
  for (const p of meta.presets) { const o = document.createElement('option'); o.value = p.key; o.textContent = p.label; $('livePreset').appendChild(o); }
  let running = false, results = [];
  function liveSummary() {
    const a = agg(results.map((r) => r.res)); const el = $('liveSummary');
    el.innerHTML = results.length ? `<div class="stat"><b>${pct(a.doseRate.p)}</b><span>dose exact (${a.dose} / ${a.n}) · 95 % ${pct(a.doseRate.lo)}–${pct(a.doseRate.hi)}</span></div><div class="stat"><b>${a.cyc ? pct(a.single.p) : '–'}</b><span>single-pill success (${a.ok} / ${a.cyc} cycles)</span></div><div class="stat"><b>${a.multi}</b><span>multiples</span></div><div class="stat"><b>${a.miss}</b><span>misses</span></div><div class="stat"><b>${(a.jamsPerDose).toFixed(1)}</b><span>jams per dose</span></div><div class="stat"><b>${a.dmgPer100.toFixed(1)}</b><span>damaged per 100</span></div>` : '';
  }
  $('liveGo').addEventListener('click', () => {
    if (running) return; running = true; results = [];
    $('liveGo').disabled = true; $('liveStop').disabled = false; $('liveTbl').tBodies[0].innerHTML = ''; liveSummary();
    const design = $('liveDesign').value, preset = $('livePreset').value, n = Math.max(1, Math.min(60, +$('liveN').value || 8));
    let i = 0, cur = null;
    const tick = () => {
      if (!running) return finish();
      if (!cur) { if (i >= n) return finish(); cur = P.startTrial({ design, preset, seed: 301 + i * 17, count: 5 }); $('liveBar').style.width = ((i / n) * 100).toFixed(0) + '%'; }
      if (cur.step(40)) {
        const res = cur.result(); results.push({ res }); cur = null; i++;
        const tr = document.createElement('tr'), okc = res.doseOK ? 'pill-ok' : 'pill-bad';
        tr.innerHTML = `<td>${i}</td><td>${301 + (i - 1) * 17}</td><td><span class="chip ${okc}">${res.doseOK ? '✓ dose exact' : res.state === 'error' ? '✗ stopped: ' + Bench.esc(res.status.slice(0, 40)) : '✗ ' + res.collected + ' of ' + res.count + ' collected'}</span></td><td class="num">${res.collected}</td><td class="num">${res.cyc}</td><td class="mono">${res.seq || '–'}</td><td class="num">${res.jam}</td><td class="num">${res.dmg}</td><td class="num">${res.simS}</td>`;
        $('liveTbl').tBodies[0].appendChild(tr); liveSummary();
      }
      setTimeout(tick, 0);
    };
    const finish = () => { running = false; $('liveGo').disabled = false; $('liveStop').disabled = true; $('liveBar').style.width = '100%'; };
    tick();
  });
  $('liveStop').addEventListener('click', () => { running = false; });
  Bench.esc = Charts.esc;
})();
