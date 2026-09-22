/* Prodose design page, decision matrix, rank stability, failure modes, acceptance criteria, recommendation. */
(function () {
  const $ = (id) => document.getElementById(id);
  const { designs, rows, agg, pct, meta } = Bench;
  const p1 = rows('P1'), p2 = rows('P2'), p3 = rows('P3'), p4 = rows('P4');
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const label = (d) => `${d.letter} · ${d.short}`;
  const PRESET = Object.fromEntries(meta.presets.map((p) => [p.key, p.label.replace(/^(OTC|Rx|Supp) · /, '').replace(/ \(.*\)/, '')]));

  // ------------------------------------------------------------------ computed criteria
  const A = {}; for (const d of designs) A[d.key] = agg(p1.filter((r) => r.d === d.key));
  const p6 = rows('P6');
  const worstMargin = (d) => Math.max(A[d.key].squeeze, A[d.key].impact, ...p6.filter((r) => r.d === d.key).map((r) => r.peakSqueeze || 0));
  const minSpp = Math.min(...designs.map((d) => A[d.key].secPerPill).filter((v) => v > 0));
  function sizeCoverage(d) {
    const cells = new Map(); for (const r of p2.filter((x) => x.d === d.key)) { const k = r.fam + r.L; if (!cells.has(k)) cells.set(k, []); cells.get(k).push(r); }
    let good = 0; for (const rs of cells.values()) if (agg(rs).doseRate.p >= 0.9) good++;
    return { good, of: cells.size };
  }
  function forgiveness(d) {
    const cells = new Map(); for (const r of p3.filter((x) => x.d === d.key)) { const k = r.k + '|' + r.x + '|' + r.y; if (!cells.has(k)) cells.set(k, []); cells.get(k).push(r); }
    let good = 0; for (const rs of cells.values()) if (agg(rs).doseRate.p >= 0.9) good++;
    return { good, of: cells.size };
  }
  const COV = {}, FOR = {}, FILL = {};
  for (const d of designs) { COV[d.key] = sizeCoverage(d); FOR[d.key] = forgiveness(d); const f = p4.filter((r) => r.d === d.key); FILL[d.key] = f.length ? agg(f).doseRate.p : NaN; }

  const JUDGED = {
    confirm: { wheel: [7, 'One slot = one pill is a strong mechanical prior; the exit curtain catches the residual doubles.'], arm: [8, 'One pill at a time by construction, and the vacuum-pressure signature confirms the pick before release.'], shuttle: [6, 'The pocket is only seen empty or full at the exit; a stacked second pill is invisible until it drops.'], lane: [7, 'The trapdoor chamber holds exactly one pill; confirmation is a presence check, but rolling round pills can slip past.'], belt: [5, 'The counter IS the metering: its blind spots are the dose error (see Sensing, one beam cannot see side-by-side pills).'], vacdisc: [7, 'Two independent signals: per-port vacuum pressure and the release barrier.'] },
    clean: { wheel: [6, 'Slots trap dust, but the wheel lifts out for washing.'], arm: [5, 'Sealed chamber, many articulations; the vacuum line can draw dust back.'], shuttle: [8, 'Open flat plate and one pocket wipe clean; no dead volume.'], lane: [7, 'Smooth channel, one moving pad; the flap hinge is the trap.'], belt: [3, 'Belts, rollers and seams hold dust and cannot be air-purged effectively.'], vacdisc: [4, 'Suction ports clog with powder, a purge or brush is mandatory.'] },
    simple: { wheel: [7, 'One motor, one moving wheel, a trapdoor.'], arm: [3, 'Three axes, a vacuum system and a camera.'], shuttle: [8, 'One linear actuator; the adjustable pocket is two sliding inserts.'], lane: [6, 'Pad actuator, trapdoor servo and a floor vibrator.'], belt: [4, 'Two belts, two drives, a roller and an optical array.'], vacdisc: [5, 'Disc drive, vacuum pump, valve and a rotary seal.'] },
    mfg: { wheel: [7, 'Turned or moulded wheel; slot tolerance is easy to hold.'], arm: [3, 'Precision axes and a pick-and-place calibration.'], shuttle: [8, 'Plate + insert + lips: machined or moulded, no exotic parts.'], lane: [6, 'A moulded lane with a tight height tolerance and a coated surface.'], belt: [5, 'Off-the-shelf belts but alignment and tracking need care.'], vacdisc: [4, 'Precision-drilled ports, vacuum manifold and a rotary vacuum seal.'] },
  };
  const CRIT = [
    { k: 'rel', name: 'Reliability', src: 'computed', w: 25, desc: 'Dose-exact rate over all pills (P1), point estimate.', score: (d) => 10 * A[d.key].doseRate.p, why: (d) => `${A[d.key].dose} of ${A[d.key].n} doses exact` },
    { k: 'range', name: 'Pill size range', src: 'computed', w: 15, desc: 'Share of the 25 swept pill sizes handled at ≥ 90 % (P2).', score: (d) => (COV[d.key].of ? 10 * COV[d.key].good / COV[d.key].of : 0), why: (d) => `${COV[d.key].good} of ${COV[d.key].of} sizes at ≥ 90 %` },
    { k: 'safety', name: 'Pill safety', src: 'computed', w: 10, desc: '10 × (1 − worst squeeze or impact as a share of the pill’s limit, P1 + stress test P6), reduced for any broken or stressed pills.', score: (d) => 10 * (1 - clamp(worstMargin(d), 0, 1)) * Math.exp(-(A[d.key].dmgPer100 + 0.5 * A[d.key].strPer100) / 2), why: (d) => `worst squeeze / impact ${pct(worstMargin(d), 0)} of the pill’s limit; ${A[d.key].dmgPer100.toFixed(1)} broken, ${A[d.key].strPer100.toFixed(1)} stressed per 100` },
    { k: 'speed', name: 'Throughput', src: 'computed', w: 5, desc: 'Fastest concept = 10; others by ratio of seconds per pill.', score: (d) => (A[d.key].secPerPill > 0 ? 10 * minSpp / A[d.key].secPerPill : 0), why: (d) => `${A[d.key].secPerPill.toFixed(1)} s per pill` },
    { k: 'repeat', name: 'Repeatability', src: 'computed', w: 5, desc: 'Timing spread between runs: 10·(1 − CV/0.4).', score: (d) => (isNaN(A[d.key].cv) ? 0 : 10 * clamp(1 - A[d.key].cv / 0.4, 0, 1)), why: (d) => `timing CV ${isNaN(A[d.key].cv) ? '–' : pct(A[d.key].cv)}` },
    { k: 'fill', name: 'Fill-level robustness', src: 'computed', w: 5, desc: 'Dose-exact rate for a dose of 3 with the bottle 100 / 50 / 20 % full (P4), includes the last pills.', score: (d) => (isNaN(FILL[d.key]) ? 0 : 10 * FILL[d.key]), why: (d) => `${isNaN(FILL[d.key]) ? '–' : pct(FILL[d.key])} exact across fill levels` },
    { k: 'forg', name: 'Adjustment forgiveness', src: 'computed', w: 10, desc: 'Share of the swept setting space that still works (P3): a wide good region is findable; a knife-edge is not.', score: (d) => (FOR[d.key].of ? 10 * FOR[d.key].good / FOR[d.key].of : 0), why: (d) => `${FOR[d.key].good} of ${FOR[d.key].of} settings at ≥ 90 %` },
    { k: 'confirm', name: 'Confirmability', src: 'judged', w: 10, desc: 'How well a real sensor can prove one pill for this concept.', score: (d) => JUDGED.confirm[d.key][0], why: (d) => JUDGED.confirm[d.key][1] },
    { k: 'clean', name: 'Cleanability', src: 'judged', w: 5, desc: 'Residue traps, dead volume, purge effectiveness.', score: (d) => JUDGED.clean[d.key][0], why: (d) => JUDGED.clean[d.key][1] },
    { k: 'simple', name: 'Simplicity', src: 'judged', w: 5, desc: 'Actuators and moving parts.', score: (d) => JUDGED.simple[d.key][0], why: (d) => JUDGED.simple[d.key][1] },
    { k: 'mfg', name: 'Manufacturability & cost', src: 'judged', w: 5, desc: 'Tolerances, tooling, bill of materials.', score: (d) => JUDGED.mfg[d.key][0], why: (d) => JUDGED.mfg[d.key][1] },
  ];
  const S = {}; for (const c of CRIT) { S[c.k] = {}; for (const d of designs) S[c.k][d.key] = clamp(c.score(d) || 0, 0, 10); }
  const W0 = Object.fromEntries(CRIT.map((c) => [c.k, c.w]));
  let W = Object.assign({}, W0);

  // ------------------------------------------------------------------ weights UI
  const wbox = $('weights');
  for (const c of CRIT) {
    const l = document.createElement('label'); l.innerHTML = `<span style="display:flex;justify-content:space-between"><span>${c.name} <span class="chip ${c.src === 'judged' ? 'pill-warn' : ''}" style="font-size:10.5px;padding:0 6px">${c.src}</span></span><b id="wv_${c.k}"></b></span><input type="range" id="w_${c.k}" min="0" max="40" step="1" style="width:100%" aria-label="Weight for ${c.name}">`;
    wbox.appendChild(l); l.querySelector('input').addEventListener('input', (e) => { W[c.k] = +e.target.value; refresh(); });
  }
  function setW(w) { W = Object.assign({}, w); for (const c of CRIT) $('w_' + c.k).value = W[c.k]; refresh(); }
  $('wReset').onclick = () => setW(W0);
  $('wEqual').onclick = () => setW(Object.fromEntries(CRIT.map((c) => [c.k, 9])));
  $('wSafety').onclick = () => setW(Object.assign({}, W0, { safety: 30, rel: 25, confirm: 15, speed: 2, simple: 2, mfg: 2 }));
  $('wCost').onclick = () => setW(Object.assign({}, W0, { mfg: 22, simple: 16, clean: 10, rel: 18, range: 10, safety: 6, forg: 8, confirm: 6, speed: 2, repeat: 2, fill: 2 }));

  const total = (w, key) => { const sw = CRIT.reduce((a, c) => a + w[c.k], 0) || 1; return CRIT.reduce((a, c) => a + (w[c.k] / sw) * S[c.k][key], 0) * 10; };
  const dlg = document.createElement('dialog'); dlg.innerHTML = '<div class="dlg-h"><h3></h3><button class="icon-btn" type="button" aria-label="Close">✕</button></div><div class="dlg-b"></div>'; (document.querySelector('.lab') || document.body).appendChild(dlg);
  dlg.querySelector('button').onclick = () => dlg.close();
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
  function why(c, d) { dlg.querySelector('h3').textContent = `${c.name}, ${label(d)}`; dlg.querySelector('.dlg-b').innerHTML = `<p><b>Score ${S[c.k][d.key].toFixed(1)} / 10</b> <span class="chip ${c.src === 'judged' ? 'pill-warn' : ''}">${c.src}</span></p><p>${Charts.esc(c.why(d))}</p><p style="color:var(--ink-2)">${Charts.esc(c.desc)}</p>`; dlg.showModal(); }

  let chRank = null;
  function refresh() {
    const sw = CRIT.reduce((a, c) => a + W[c.k], 0) || 1;
    for (const c of CRIT) $('wv_' + c.k).textContent = pct(W[c.k] / sw, 0);
    const tot = designs.map((d) => ({ d, t: total(W, d.key) })), order = [...tot].sort((a, b) => b.t - a.t), rankOf = Object.fromEntries(order.map((o, i) => [o.d.key, i + 1]));
    const spec = { type: 'bars', title: 'Weighted score', sub: 'out of 100 · #rank at the bar end', domain: [0, 100], ticks: [0, 25, 50, 75, 100], fmt: (v) => v.toFixed(0), metric: 'score', rowH: 34,
      items: tot.map(({ d, t }) => ({ key: d.key, label: label(d), value: t, color: d.color, badge: '#' + rankOf[d.key], tip: [['weighted score', t.toFixed(1), d.color], ['rank', '#' + rankOf[d.key]]].concat(CRIT.filter((c) => W[c.k] > 0).map((c) => [c.name, (S[c.k][d.key]).toFixed(1) + ' / 10']).slice(0, 6)) })),
      table: { cols: ['Concept', 'Score', 'Rank'], rows: tot.map(({ d, t }) => [label(d) + ' ' + d.short, t.toFixed(1), rankOf[d.key]]) } };
    if (chRank) chRank.update(spec); else chRank = Charts.mount($('chRank'), spec);
    $('rankNote').innerHTML = `<b>#1 ${order[0].d.name}</b> with ${order[0].t.toFixed(0)}, ${order[1].d.name} is ${(order[0].t - order[1].t).toFixed(1)} points behind, ${order[2].d.name} third.`;
    $('tblMatrix').innerHTML = `<thead><tr><th>Criterion</th><th class="num">Weight</th>${designs.map((d) => `<th class="num"><span class="chip"><i style="background:${d.color}"></i>${d.letter}</span></th>`).join('')}</tr></thead><tbody>${CRIT.map((c) => `<tr><td><b>${c.name}</b> <span class="chip ${c.src === 'judged' ? 'pill-warn' : ''}" style="font-size:10.5px;padding:0 6px">${c.src}</span></td><td class="num">${pct(W[c.k] / sw, 0)}</td>${designs.map((d) => { const v = S[c.k][d.key], col = Charts.seq(v / 10); return `<td class="num"><button type="button" class="btn" style="background:${col.fill};color:${col.ink};border-color:transparent;min-width:52px;padding:3px 8px" data-c="${c.k}" data-d="${d.key}" aria-label="${c.name}, ${d.short}: ${v.toFixed(1)}. Show why">${v.toFixed(1)}</button></td>`; }).join('')}</tr>`).join('')}<tr><td><b>Weighted total</b></td><td class="num">100%</td>${tot.map(({ d, t }) => `<td class="num"><b>${t.toFixed(0)}</b> <span style="color:var(--muted)">#${rankOf[d.key]}</span></td>`).join('')}</tr></tbody>`;
    $('tblMatrix').querySelectorAll('button[data-c]').forEach((b) => b.addEventListener('click', () => why(CRIT.find((c) => c.k === b.dataset.c), Bench.byKey[b.dataset.d])));
  }
  setW(W0);

  // ------------------------------------------------------------------ Pareto frontier (two objectives straight off the bench, no weights)
  (function () {
    const pts = designs.map((d) => ({ d, x: A[d.key].doseRate.p, y: clamp(1 - worstMargin(d), 0, 1) }));
    const front = Bench.paretoFront(pts, ['x', 'y']);
    const W = 560, H = 340, m = { l: 52, r: 20, t: 16, b: 40 }, pw = W - m.l - m.r, ph = H - m.t - m.b;
    const X = (v) => m.l + v * pw, Y = (v) => m.t + ph - v * ph;
    const NS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(NS, 'svg'); svg.setAttribute('viewBox', `0 0 ${W} ${H}`); svg.setAttribute('width', '100%'); svg.style.maxWidth = W + 'px'; svg.style.display = 'block';
    const el = (tag, attrs) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); return e; };
    // grid + axes
    for (const t of [0, 0.25, 0.5, 0.75, 1]) {
      svg.appendChild(Object.assign(el('line', { x1: X(t), x2: X(t), y1: m.t, y2: m.t + ph, stroke: 'var(--grid)' })));
      svg.appendChild(Object.assign(el('line', { x1: m.l, x2: m.l + pw, y1: Y(t), y2: Y(t), stroke: 'var(--grid)' })));
      const tx = el('text', { x: X(t), y: H - m.b + 16, 'text-anchor': 'middle', fill: 'var(--muted)', 'font-size': 11 }); tx.textContent = Math.round(t * 100) + '%'; svg.appendChild(tx);
      const ty = el('text', { x: m.l - 8, y: Y(t) + 4, 'text-anchor': 'end', fill: 'var(--muted)', 'font-size': 11 }); ty.textContent = Math.round(t * 100) + '%'; svg.appendChild(ty);
    }
    const lx = el('text', { x: m.l + pw / 2, y: H - 4, 'text-anchor': 'middle', fill: 'var(--ink-2)', 'font-size': 11.5 }); lx.textContent = 'reliability, dose-exact rate (P1) →'; svg.appendChild(lx);
    const ly = el('text', { x: 12, y: m.t + ph / 2, 'text-anchor': 'middle', fill: 'var(--ink-2)', 'font-size': 11.5, transform: `rotate(-90 12 ${m.t + ph / 2})` }); ly.textContent = 'pill safety margin →'; svg.appendChild(ly);
    // frontier line: non-dominated points sorted by x
    const nd = front.filter((p) => !p.dominated).sort((a, b) => a.x - b.x);
    if (nd.length > 1) { const d0 = 'M' + nd.map((p) => `${X(p.x).toFixed(1)},${Y(p.y).toFixed(1)}`).join('L'); svg.appendChild(el('path', { d: d0, fill: 'none', stroke: 'var(--axis)', 'stroke-width': 1.5, 'stroke-dasharray': '4 3' })); }
    front.forEach((p) => {
      const g = el('g', {});
      const c = el('circle', { cx: X(p.x), cy: Y(p.y), r: p.dominated ? 6 : 8, fill: p.dominated ? 'var(--surface)' : p.d.color, stroke: p.d.color, 'stroke-width': 2 });
      g.appendChild(c);
      const t = el('title', {}); t.textContent = `${label(p.d)}, ${p.d.name}\nreliability ${pct(p.x, 0)}, safety margin ${pct(p.y, 0)}${p.dominated ? '\n(dominated: another concept beats it on both axes)' : '\n(Pareto-optimal)'}`; g.appendChild(t);
      const lbl = el('text', { x: X(p.x) + 11, y: Y(p.y) + 4, 'font-size': 11.5, fill: 'var(--ink)', 'font-weight': p.dominated ? 400 : 700 }); lbl.textContent = p.d.letter; g.appendChild(lbl);
      svg.appendChild(g);
    });
    $('chPareto').innerHTML = ''; const wrap = document.createElement('div'); wrap.className = 'viz'; wrap.appendChild(svg); $('chPareto').appendChild(wrap);
    $('tblPareto').innerHTML = `<caption>Reliability = P1 dose-exact rate. Safety margin = 1 − the worst force any pill saw (squeeze or impact) as a share of its crush strength or drop rating, across the reliability run and the P6 stress test, 0 % would mean a pill right at its breaking point.</caption><thead><tr><th>Concept</th><th class="num">Reliability</th><th class="num">Safety margin</th><th>Pareto-optimal?</th></tr></thead><tbody>${front.sort((a, b) => b.x - a.x).map((p) => `<tr><td><span class="chip"><i style="background:${p.d.color}"></i>${label(p.d)}</span></td><td class="num">${pct(p.x)}</td><td class="num">${pct(p.y)}</td><td>${p.dominated ? 'no, dominated' : '<span class="chip pill-ok">yes</span>'}</td></tr>`).join('')}</tbody>`;
  })();

  // ------------------------------------------------------------------ rank stability
  (function () {
    const N = 2000, wins = {}, ranks = {}; designs.forEach((d) => { wins[d.key] = 0; ranks[d.key] = new Array(designs.length).fill(0); });
    let seed = 20260920; const R = () => { seed = (seed + 0x6D2B79F5) >>> 0; let t = seed; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
    for (let i = 0; i < N; i++) {
      const w = {}; for (const c of CRIT) w[c.k] = W0[c.k] * (0.4 + 1.8 * R());
      const o = designs.map((d) => ({ d, t: total(w, d.key) })).sort((a, b) => b.t - a.t); wins[o[0].d.key]++; o.forEach((x, k) => ranks[x.d.key][k]++);
    }
    Charts.mount($('chWins'), { type: 'bars', title: 'How often each concept ranks first', sub: `${N} random weightings (each weight × 0.4–2.2)`, domain: [0, 1], ticks: [0, 0.25, 0.5, 0.75, 1], fmtTick: (v) => pct(v), fmt: (v) => pct(v), metric: 'ranks first',
      items: designs.map((d) => { const w = Charts.wilson(wins[d.key], N); return { key: d.key, label: label(d), value: w.p, lo: w.lo, hi: w.hi, color: d.color }; }),
      table: { cols: ['Concept', 'Ranks #1'], rows: designs.map((d) => [label(d), pct(wins[d.key] / N, 1)]) } });
    Charts.mount($('chRank2'), { type: 'heat', title: 'Rank distribution', sub: 'share of weightings giving each rank', left: 110, maxCell: 54, cellH: 30, legendLabel: '0 → 100 %', rows: designs.map((d) => ({ label: label(d) })), cols: designs.map((_, k) => ({ label: '#' + (k + 1) })),
      cells: designs.map((d) => ranks[d.key].map((n) => ({ v: n / N, text: n / N >= 0.05 ? Math.round((100 * n) / N) + '' : '', tip: [['share', pct(n / N, 1)]] }))),
      table: { cols: ['Concept'].concat(designs.map((_, k) => '#' + (k + 1))), rows: designs.map((d) => [label(d)].concat(ranks[d.key].map((n) => pct(n / N, 1)))) } });
    window.__wins = wins;
  })();

  // ------------------------------------------------------------------ alternatives
  const ALT = {
    wheel: ['Rotary pocket', 'The reference design from the concept statement. An inverted bottle feeds a wheel with one pocket per pill; a scraper strikes off extras and a trapdoor releases the pill.', 'Mature, one motor, size settings are a simple rotary detent.', 'A slot has to fit the pill to within about a pill-thickness, one size setting works for one or two neighbouring pill sizes; scraper pinch is the jam mode.'],
    arm: ['Pick and place', 'Bottle docked from below in a sealed chamber; a vacuum-cup arm pivoting at the mouth picks one visible pill and carries it to the outlet. The promising baseline from earlier work, now with suction modelled as a force limited by ΔP × cup area.', 'One pill at a time by construction; handles every shape; vacuum pressure confirms the pick.', 'Slowest, most parts, needs vision and calibration; long pills need a rotating wrist to fit the neck.'],
    shuttle: ['Linear pocket', 'A sliding plate with a pocket whose length and depth adjust independently (width follows the pill). Compliant silicone lips strike off a second pill; the plate carries one pill to an exit hole.', 'Both pocket dimensions adjust continuously, so one mechanism spans sizes; the flat plate is easy to clean.', 'Doubles appear when depth is more than about one pill; a stacked pill under a rigid lip is the jam mode, hence the compliant lip.'],
    lane: ['Single-file queue', 'The funnel feeds a sloped lane whose height only lets pills lie flat. A clamp pad holds the queue while a trapdoor chamber (adjustable length) releases the lead pill.', 'No scraping of pills; escapement force is a fraction of a newton; excellent for elongated pills.', 'Small round pills roll past the pad and stagger inside the lane; the slope must beat pill friction.'],
    belt: ['Sensor-gated feed', 'No mechanical metering: a slow feed belt under a counter-rotating singulating roller, a barrier and belt encoder count pills on the fly, the feed stops at the dose while a fast belt flushes counted pills out.', 'Gentle on pills (spring-loaded roller, friction drive); the count is the control, so the sensing lab applies directly.', 'Everything depends on the count: a pill riding over another fools a single-height barrier; belts are hard to clean.'],
    vacdisc: ['Suction singulation', 'A seed-meter style disc with suction ports around the rim. A knock-off wedge strips any pill not sealed to a port; the vacuum is cut over the chute.', 'Physically singulates: an unsealed pill cannot leave. Port pressure is a second confirmation signal.', 'Flat oblong pills cannot seal against a curved rim; ports clog with dust; needs a vacuum system.'],
  };
  $('altCards').innerHTML = designs.map((d) => { const a = ALT[d.key], m = A[d.key]; return `<div class="card"><div class="meta"><span class="chip"><i style="background:${d.color}"></i>${label(d)}</span> ${a[0]}</div><h3>${d.name}</h3><p>${a[1]}</p><p><b>Strength.</b> ${a[2]}</p><p><b>Weakness.</b> ${a[3]}</p><p style="color:var(--ink-2)">Bench: dose exact ${pct(m.doseRate.p)}, single-pill ${pct(m.single.p)}, ${m.jamsPerDose.toFixed(2)} jams / dose.</p><p><a href="simulator.html?design=${d.key}">Open in the simulator →</a></p></div>`; }).join('');

  // ------------------------------------------------------------------ FMEA
  const worst = (d, fn, dir) => { const g = Bench.groupBy(p1.filter((r) => r.d === d.key), (r) => r.k); let best = null; for (const [k, rs] of g) { const v = fn(agg(rs)); if (best == null || (dir > 0 ? v > best.v : v < best.v)) best = { k, v }; } return best; };
  const TAXONOMY = [
    ['F1', 'Multiple pills released', 'one metering cycle delivers ≥ 2 pills'],
    ['F2', 'Empty cycle', 'one metering cycle delivers 0 pills'],
    ['F3', 'Pinch / jam', 'a pill is caught between two hard or force-limited surfaces; the motor stalls at its limit'],
    ['F4', 'Confirmation error', 'the sensor reports a different count than the ground-truth number of pills'],
    ['F5', 'Interface failure', 'the bottle-to-machine seal leaks, slips, or crushes the neck'],
    ['F6', 'Transport failure', 'a pill leaves the chute or tray (spill) or does not reach it'],
    ['F7', 'Stall / no-progress', 'the mechanism reports no pill for longer than its retry limit and stops'],
    ['F8', 'Pill damage', 'squeeze or impact force reaches the pill’s crush strength or drop rating'],
  ];
  $('tblTaxonomy').innerHTML = `<caption>Failure taxonomy, every row in the table below is tagged with one of these codes, so the same failure can be tracked across concepts and across future bench runs.</caption><thead><tr><th>Code</th><th>Failure class</th><th>Definition</th></tr></thead><tbody>${TAXONOMY.map((t) => `<tr><td><b class="mono">${t[0]}</b></td><td>${t[1]}</td><td class="wrap" style="color:var(--ink-2)">${t[2]}</td></tr>`).join('')}</tbody>`;
  const FM = {
    wheel: [['F1', 'Two pills in one slot', 'Slot wider than one pill; scraper gap too large', (d) => `${pct(A[d.key].multiRate.p, 1)} of cycles`, 'Exit curtain / load cell', 'Slot-size setting + auto scraper gap'], ['F3', 'Pill pinched at the scraper', 'Pill straddles slot edge under the scraper', (d) => `${A[d.key].jamsPerDose.toFixed(2)} jams / dose`, 'Motor torque hits its limit → stall signal', 'Torque limit at 25 % of crush; reverse and shake'], ['F2', 'Empty slot', 'Pill did not seat before the slot moved on', (d) => `${pct(A[d.key].missRate.p, 1)} of cycles`, 'Exit barrier sees nothing', 'Vibration assist, dwell, retry']],
    arm: [['F2', 'Pick fails (no seal)', 'Pill face tilted or too curved for the cup; cup larger than the pill', (d) => `${pct(A[d.key].missRate.p, 1)} of cycles`, 'Vacuum pressure does not drop on contact', 'Pick another pill; cup sized to the pill'], ['F2', 'Pill dropped in transit', 'Snag on the neck or neighbours needs more force than ΔP·A', (d) => `${pct(A[d.key].missRate.p, 1)} of cycles`, 'Vacuum signal collapses mid-lift', 'Higher vacuum; slower lift; wrist roll for long pills'], ['F7', 'No reachable pill', 'Last pills in the shoulder corners', (d) => `${A[d.key].errors} of ${A[d.key].n} doses stopped`, 'Vision reports none reachable', 'Tilt the bottle at the end of life']],
    shuttle: [['F1', 'Double under the wiper', 'Pocket deeper than about one pill; lip yields too far', (d) => `${pct(A[d.key].multiRate.p, 1)} of cycles`, 'Exit curtain', 'Auto pocket depth; lip yield capped below a stacked pill’s protrusion'], ['F3', 'Pill pinched by the lip', 'Second pill wedged under the wiper', (d) => `${A[d.key].jamsPerDose.toFixed(2)} jams / dose`, 'Servo current limit', 'Compliant lip; back-off and reseat'], ['F2', 'Pocket empty', 'Fill time too short for the pile to seat a pill', (d) => `${pct(A[d.key].missRate.p, 1)} of cycles`, 'Empty at the exit', 'Longer fill dwell; vibration']],
    lane: [['F1', 'Two pills leave together', 'Round pills roll or stagger past the clamp pad', (d) => `${pct(A[d.key].multiRate.p, 1)} of cycles`, 'Exit curtain / load cell', 'Steeper pad hold; lane height below 1.3 × thickness'], ['F2/F7', 'Queue starves', 'Pills stand on end at the lane entrance', (d) => `${pct(A[d.key].missRate.p, 1)} of cycles`, 'No pill for 10 cycles', 'Floor vibration; longer feed opening'], ['F3', 'Trapdoor pinch', 'Pill straddles the flap edge', (d) => `${A[d.key].jamsPerDose.toFixed(2)} jams / dose`, 'Flap servo torque', 'Flap hinged at the downhill end']],
    belt: [['F4', 'Count error → wrong dose', 'Pills overlap: single-height barrier or edge counting reads one', (d) => `${pct(1 - A[d.key].doseRate.p, 0)} of doses not exact`, 'Load cell in the tray; second barrier height', 'Encoder-based length count; upper barrier'], ['F8', 'Pill damaged at the roller nip', 'Spring-loaded roller squeezes a soft pill', (d) => `${A[d.key].dmgPer100.toFixed(1)} broken / 100`, 'None in-process', 'Lower spring rate; softer roller; larger clearance'], ['F7', 'No pulse for 6 s', 'Pills bridge under the lip', (d) => `${A[d.key].errors} of ${A[d.key].n} doses stopped`, 'Watchdog', 'Reverse feed belt, shake hopper']],
    vacdisc: [['F2', 'Flat pill will not seal', 'Rim radius 50 mm vs a 17 mm caplet: chord sag leaks', (d) => { const w = worst(d, (a) => a.doseRate.p, -1); return `worst: ${PRESET[w.k]} ${pct(w.v)} exact`; }, 'Port pressure never drops', 'Flat vacuum plate instead of a disc; smaller ports'], ['F1', 'Double pick', 'Wedge gap too big for the pill; two pills sealed to one port', (d) => `${pct(A[d.key].multiRate.p, 1)} of cycles`, 'Release barrier; port pressure', 'Singulator gap = 1.25 × thickness + 0.6 mm'], ['F7', 'Vacuum lost', 'Port clogged with dust or seal leak', (d) => `${A[d.key].errors} of ${A[d.key].n} doses stopped`, 'Pressure signal', 'Purge and brush; filter on the line']],
  };
  $('tblFmea').innerHTML = `<thead><tr><th>Concept</th><th>Code</th><th>Failure mode</th><th>Cause (physics)</th><th>Observed on the bench</th><th>Detected by</th><th>Prevented / recovered by</th></tr></thead><tbody>${designs.map((d) => FM[d.key].map((f, i) => `<tr>${i === 0 ? `<td rowspan="3" style="vertical-align:top"><span class="chip"><i style="background:${d.color}"></i>${label(d)}</span></td>` : ''}<td class="mono">${f[0]}</td><td class="wrap"><b>${f[1]}</b></td><td class="wrap">${f[2]}</td><td class="wrap">${f[3](d)}</td><td class="wrap">${f[4]}</td><td class="wrap">${f[5]}</td></tr>`).join('')).join('')}</tbody>`;

  // ------------------------------------------------------------------ acceptance criteria
  const SENS = window.PRODOSE_SENSING;
  const fused = SENS ? (() => { const bad = SENS.trials.filter((t) => t.n !== 1); return bad.filter((t) => t.est.M6 === 1).length / (bad.length || 1); })() : NaN;
  const spillTrials = (d) => { const rs = p1.filter((r) => r.d === d.key && r.state === 'done'); return rs.length ? rs.filter((r) => r.spill === 0).length / rs.length : NaN; };
  const CR = [
    ['Single-pill success', 'Bench §1 (P1)', '≥ 95 %, interval lower bound ≥ 90 %', (d) => { const s = A[d.key].single; return [s.p >= 0.95 && s.lo >= 0.9, pct(s.p) + ` (≥ ${pct(s.lo)})`]; }],
    ['Miss rate', 'Bench §1', '≤ 3 % of cycles', (d) => [A[d.key].missRate.p <= 0.03, pct(A[d.key].missRate.p, 1)]],
    ['Multiples', 'Bench §1', '≤ 2 % of cycles', (d) => [A[d.key].multiRate.p <= 0.02, pct(A[d.key].multiRate.p, 1)]],
    ['Jams', 'Bench §1', '≤ 0.1 per dose', (d) => [A[d.key].jamsPerDose <= 0.1, A[d.key].jamsPerDose.toFixed(2)]],
    ['Repeatability', 'Bench §1', 'timing CV ≤ 25 %', (d) => [A[d.key].cv <= 0.25, isNaN(A[d.key].cv) ? '–' : pct(A[d.key].cv)]],
    ['Pill damage', 'Bench §5', '≤ 0.5 broken per 100', (d) => [A[d.key].dmgPer100 <= 0.5, A[d.key].dmgPer100.toFixed(1)]],
    ['Compatibility range', 'Bench §3 (P2)', '≥ 60 % of swept sizes', (d) => [COV[d.key].good / (COV[d.key].of || 1) >= 0.6, `${COV[d.key].good} / ${COV[d.key].of}`]],
    ['Adjustable-mechanism effectiveness', 'Bench §4 (P3)', '≥ 30 % of the setting space works', (d) => [FOR[d.key].good / (FOR[d.key].of || 1) >= 0.3, pct(FOR[d.key].good / (FOR[d.key].of || 1))]],
    ['Fill-level robustness', 'Bench §5 (P4)', '≥ 90 % exact at 100/50/20 % fill', (d) => [FILL[d.key] >= 0.9, isNaN(FILL[d.key]) ? '–' : pct(FILL[d.key])]],
    ['Chute movement', 'Bench (spill count) + Labs', 'no pill escapes the chute or tray', (d) => [spillTrials(d) === 1, isNaN(spillTrials(d)) ? '–' : pct(spillTrials(d)) + ' clean']],
  ];
  $('tblCrit').innerHTML = `<thead><tr><th>Metric (concept statement)</th><th>Measured in</th><th>Acceptance</th>${designs.map((d) => `<th class="num"><span class="chip"><i style="background:${d.color}"></i>${d.letter}</span></th>`).join('')}</tr></thead><tbody>${CR.map((c) => `<tr><td><b>${c[0]}</b></td><td>${c[1]}</td><td class="wrap">${c[2]}</td>${designs.map((d) => { const [ok, txt] = c[3](d); return `<td class="num"><span class="chip ${ok ? 'pill-ok' : 'pill-bad'}">${ok ? '✓' : '✗'} ${txt}</span></td>`; }).join('')}</tr>`).join('')}
    <tr><td><b>Bottle-interface reliability</b></td><td>Labs · Interface</td><td class="wrap">≥ 95 % seals, holds and spares the neck (default tolerances)</td><td colspan="${designs.length}" class="wrap">Iris + silicone lip at 0.30 mm neck tolerance, shared by every concept; see the Labs page for the number under your tolerances.</td></tr>
    <tr><td><b>Confirmation reliability</b></td><td>Sensing lab</td><td class="wrap">no false confirmation of one pill</td><td colspan="${designs.length}" class="wrap">${isNaN(fused) ? 'Run node bench/sensing.js' : `Fused curtain + dual beam + load cell: ${pct(fused, 1)} false confirmations over ${SENS.trials.filter((t) => t.n !== 1).length} multi-pill / empty drops. A single beam alone is not acceptable.`}</td></tr>
    <tr><td><b>Ease of loading and cleaning</b></td><td>Decision matrix (judged)</td><td class="wrap">score ≥ 6</td>${designs.map((d) => { const v = (S.clean[d.key] + JUDGED.mfg[d.key][0]) / 2; return `<td class="num"><span class="chip ${S.clean[d.key] >= 6 ? 'pill-ok' : 'pill-warn'}">${S.clean[d.key].toFixed(0)}</span></td>`; }).join('')}</tr></tbody>`;

  // ------------------------------------------------------------------ recommendation (default weights)
  const def = designs.map((d) => ({ d, t: total(W0, d.key), a: A[d.key] })).sort((a, b) => b.t - a.t);
  const top = def[0], sec = def[1], win = window.__wins || {};
  const passes = (d) => CR.filter((c) => c[3](d)[0]).length;
  $('recoBox').innerHTML = `
    <div class="cards">
      <div class="card"><div class="meta">Build first</div><h3>${label(top.d)}, ${top.d.name}</h3><p>Highest weighted score (${top.t.toFixed(0)} / 100) and ranked first in ${pct((win[top.d.key] || 0) / 2000, 0)} of random re-weightings. It passes ${passes(top.d)} of ${CR.length} acceptance checks; dose-exact ${pct(top.a.doseRate.p)}, single-pill ${pct(top.a.single.p)}.</p></div>
      <div class="card"><div class="meta">Build in parallel</div><h3>${label(sec.d)}, ${sec.d.name}</h3><p>Second at ${sec.t.toFixed(0)}; ranked first in ${pct((win[sec.d.key] || 0) / 2000, 0)} of re-weightings. It hedges the choice: a different physical principle, so a failure mode that hurts the leader is unlikely to hurt this one.</p></div>
      <div class="card"><div class="meta">Whatever is chosen</div><h3>Confirm with three views</h3><p>Do not accept a single break-beam as proof of one pill. Fuse a light curtain, dual-beam length and tray weight; refuse the dose when they disagree (Sensing lab).</p></div>
    </div>
    <div class="note" style="margin-top:14px"><b>Model limitations.</b> This is a 2-D simulation: pill width is handled analytically, pills are rigid (no chipping mechanics beyond crush and impact ratings), and contact uses the larger static friction of the two surfaces, which is conservative for coated ramps. Sizes, forces and friction come from typical handbook values, not measurements of the team's pills. The ranking should be treated as <em>where to spend prototype time</em>, not as proof, the first physical prototype of the leader should re-run the same protocols (P1–P5) with real pills and compare against these predictions.</div>
    <h3 style="margin:22px 0 8px">Next steps</h3>
    <ol style="color:var(--ink-2);max-width:78ch;padding-left:20px">
      <li>Prototype the leading module with 3D-printed parts (PETG/PA12 for the pocket or slot, TPU for wipers) using the sizes on this site; the Materials lab lists the production swap.</li>
      <li>Repeat protocols P1 (8 real pill products × 12 fills) and P3 (the adjustment sweep) on the bench and overlay them on these charts; where they disagree, fix the model before trusting more predictions.</li>
      <li>Build the fused confirmation (curtain + dual beam + load cell) first, it is cheap, it is independent of the metering concept, and it makes every later experiment measurable.</li>
      <li>Decide on the optional air purge only after measuring dust shed by the actual pills; the Cleaning lab shows it removes chips but not fine powder, so a brushable, wipe-clean surface is the fallback.</li>
    </ol>`;
})();
