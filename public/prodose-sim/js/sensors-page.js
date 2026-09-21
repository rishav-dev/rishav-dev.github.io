/* Prodose sensing page, live drop test (browser physics) + Monte-Carlo results from data/sensing.js. */
(function () {
  const $ = (id) => document.getElementById(id);
  const P = window.Prodose, S = P.sensing, D = window.PRODOSE_SENSING || { meta: { methods: [], presets: [], patterns: [] }, trials: [], cal: {} };
  const M = D.meta.methods, pct = (v, d) => (100 * v).toFixed(d == null ? 0 : d) + '%';
  const COLOR = { M1: 'var(--c1)', M2: 'var(--c2)', M3: 'var(--c3)', M4: 'var(--c4)', M5: 'var(--c5)', M6: 'var(--c6)' };
  const PN = { otc_ibuprofen: 'Round tablet 9.5 mm', apap_caplet: 'Caplet 17 × 7 mm', vitd_softgel: 'Softgel 11 × 6.5 mm' };
  const PATNAME = { 'side-by-side': 'Side by side', stacked: 'Stacked (one above the other)', staggered: 'Staggered', sequential: 'Well separated in time', 'sequential-tight': 'Nearly touching in time' };

  // ------------------------------------------------------------------ live drop test
  for (const k of Object.keys(PN)) { const o = document.createElement('option'); o.value = k; o.textContent = PN[k]; $('lvPill').appendChild(o); }
  for (const k of S.PATTERNS) { const o = document.createElement('option'); o.value = k; o.textContent = PATNAME[k]; $('lvPat').appendChild(o); }
  $('lvPat').value = 'side-by-side';
  let chB = null, chL = null;
  const down = (a, step) => a.filter((_, i) => i % step === 0);

  function drop() {
    const preset = $('lvPill').value, n = +$('lvN').value, pat = $('lvPat').value, seed = +$('lvSeed').value || 7;
    $('lvGo').disabled = true; $('lvStatus').textContent = 'simulating…';
    setTimeout(() => {
      const tr = S.trial(preset, n, pat, seed * 977 + 13), f = S.features(tr);
      const C = D.cal[preset] || S.calibrate(preset, 10), est = S.estimate(f, C, tr.mass);
      const tB = tr.b1.map((_, i) => i * tr.dt), showB = [
        { key: 'b1', label: 'Barrier 1 shadow (mm)', color: 'var(--c1)', pts: tB.map((t, i) => [t, tr.b1[i]]).filter((_, i) => i % 2 === 0) },
        { key: 'b2', label: 'Barrier 2, 7 mm lower (mm)', color: 'var(--c2)', pts: tB.map((t, i) => [t, tr.b2[i]]).filter((_, i) => i % 2 === 0) },
      ];
      const ymax = Math.max(6, ...tr.b1, ...tr.b2) * 1.1;
      const spec1 = { type: 'line', title: 'Exit light barriers', sub: 'blocked length along the barrier line (mm) vs time (ms)', h: 220, x: [0, tB[tB.length - 1] || 260], y: [0, ymax], fmtX: (v) => v.toFixed(0) + ' ms', fmtY: (v) => v.toFixed(0), series: showB, table: { cols: ['t (ms)', 'barrier 1', 'barrier 2'], rows: tB.map((t, i) => [t.toFixed(1), tr.b1[i].toFixed(2), tr.b2[i].toFixed(2)]).filter((_, i) => i % 8 === 0) } };
      const tL = tr.lc.map((_, i) => i * 4), lcy = tr.lc, hi = Math.max(tr.mass * 1.5, ...lcy.map(Math.abs)) * 1.05 || 100;
      const spec2 = { type: 'line', title: 'Tray load cell', sub: 'mass (mg) vs time (ms): landings ring, then settle', h: 220, x: [0, tL[tL.length - 1] || 1700], y: [-Math.max(30, hi * 0.15), hi], fmtX: (v) => v.toFixed(0) + ' ms', fmtY: (v) => v.toFixed(0), series: [{ key: 'lc', label: 'Load cell (mg)', color: 'var(--c3)', pts: tL.map((t, i) => [t, lcy[i]]) }], refs: n > 0 ? [{ y: n * tr.mass, label: `${n} × nominal ${tr.mass.toFixed(0)} mg` }] : [], table: { cols: ['t (ms)', 'mass (mg)'], rows: tL.map((t, i) => [t, lcy[i].toFixed(1)]).filter((_, i) => i % 6 === 0) } };
      if (chB) { chB.update(spec1); chL.update(spec2); } else { chB = Charts.mount($('lvBeam'), spec1); chL = Charts.mount($('lvLoad'), spec2); }
      const why = {
        M1: `${f.p1.length} rising edge${f.p1.length === 1 ? '' : 's'} on barrier 1`,
        M2: f.p1.map((p) => ((p[1] - p[0]) / C.wid).toFixed(2) + '×').join(', ') || 'no pulse',
        M3: `shadow area ${f.area1.toFixed(0)} mm·ms ÷ ${C.area.toFixed(0)} per pill`,
        M4: f.speed ? `${f.speed.toFixed(2)} m/s fall speed → ${(f.speed * f.span1).toFixed(1)} mm long ÷ ${C.len.toFixed(1)} mm` : 'no speed (one barrier only)',
        M5: `settled ${f.mass.toFixed(0)} mg ÷ ${tr.mass.toFixed(0)} mg`,
        M6: est.M6 < 0 ? `curtain ${est.M3}, dual ${est.M4}, load cell ${est.M5}, disagree → flagged` : `all three say ${est.M3}`,
      };
      $('lvTbl').innerHTML = `<thead><tr><th>Method</th><th class="num">Reports</th><th>Verdict (truth: ${n} pill${n === 1 ? '' : 's'})</th><th>Why</th></tr></thead><tbody>${M.map((m) => { const e = est[m.key]; const flagged = e < 0; const right = flagged ? n !== 1 : e === n; const danger = !flagged && e === 1 && n !== 1; return `<tr><td><span class="chip"><i style="background:${COLOR[m.key]}"></i>${m.short}</span></td><td class="num">${flagged ? 'flag' : e}</td><td><span class="chip ${right ? 'pill-ok' : danger ? 'pill-bad' : 'pill-warn'}">${flagged ? (n === 1 ? '! false alarm, re-check' : '✓ caught: not confirmed') : right ? '✓ correct' : danger ? '✗ confirmed ONE wrongly' : '✗ wrong count'}</span></td><td class="wrap" style="color:var(--ink-2)">${why[m.key]}</td></tr>`; }).join('')}</tbody>`;
      $('lvStatus').textContent = `${tr.n} pill${tr.n === 1 ? '' : 's'} released · tray mass ${f.mass.toFixed(0)} mg`;
      $('lvGo').disabled = false;
    }, 30);
  }
  $('lvGo').addEventListener('click', drop);

  // ------------------------------------------------------------------ Monte-Carlo
  const T = D.trials;
  if (!T.length) { document.querySelector('#mc').insertAdjacentHTML('afterbegin', '<div class="note bad">No data/sensing.js, run <code>node bench/sensing.js</code>.</div>'); return drop(); }
  $('mcSub').textContent = `${T.length} drop tests: 3 pills × 0–3 released × 5 patterns. Calibration (single-pill shadow area, width, length) was learned from 30 clean drops per pill, exactly what a commissioning routine would do. Intervals are 95 % Wilson.`;
  const W = Charts.wilson;
  const cnt = (rows, fn) => rows.filter(fn).length;
  const multi = T.filter((t) => t.n >= 2 || t.n === 0), single = T.filter((t) => t.n === 1), pairs = T.filter((t) => t.n >= 2);
  const stats = M.map((m) => {
    const fc = cnt(multi, (t) => t.est[m.key] === 1), cf = cnt(single, (t) => t.est[m.key] === 1), ex = cnt(pairs, (t) => t.est[m.key] === t.n), caught = cnt(pairs, (t) => t.est[m.key] !== 1);
    return { m, falseConfirm: W(fc, multi.length), confirm1: W(cf, single.length), exact: W(ex, pairs.length), caught: W(caught, pairs.length) };
  });
  Charts.mount($('chFalse'), {
    type: 'bars', title: 'Wrongly confirms ONE pill', sub: 'share of multi-pill / empty drops the method reported as exactly 1, lower is better', domain: [0, 1], ticks: [0, 0.25, 0.5, 0.75, 1], fmtTick: (v) => pct(v), fmt: (v) => pct(v), metric: 'false confirm',
    items: stats.map((s) => ({ key: s.m.key, label: s.m.short, value: s.falseConfirm.p, lo: s.falseConfirm.lo, hi: s.falseConfirm.hi, color: COLOR[s.m.key], tip: [['false confirm', `${pct(s.falseConfirm.p, 1)} (${pct(s.falseConfirm.lo)}–${pct(s.falseConfirm.hi)})`, COLOR[s.m.key]], ['drops', multi.length]] })),
    table: { cols: ['Method', 'False confirm', 'Low', 'High'], rows: stats.map((s) => [s.m.label, pct(s.falseConfirm.p, 1), pct(s.falseConfirm.lo, 1), pct(s.falseConfirm.hi, 1)]) },
  });
  Charts.mount($('chConfirm'), {
    type: 'bars', title: 'Confirms a good dose', sub: 'share of single-pill drops reported as exactly 1, higher is better', domain: [0, 1], ticks: [0, 0.25, 0.5, 0.75, 1], fmtTick: (v) => pct(v), fmt: (v) => pct(v), metric: 'true confirm',
    items: stats.map((s) => ({ key: s.m.key, label: s.m.short, value: s.confirm1.p, lo: s.confirm1.lo, hi: s.confirm1.hi, color: COLOR[s.m.key], tip: [['confirms', `${pct(s.confirm1.p, 1)} (${pct(s.confirm1.lo)}–${pct(s.confirm1.hi)})`, COLOR[s.m.key]], ['drops', single.length]] })),
    table: { cols: ['Method', 'Confirms good dose', 'Low', 'High'], rows: stats.map((s) => [s.m.label, pct(s.confirm1.p, 1), pct(s.confirm1.lo, 1), pct(s.confirm1.hi, 1)]) },
  });
  const pats = D.meta.patterns.filter((p) => T.some((t) => t.n === 2 && t.pattern === p));
  Charts.mount($('chPattern'), {
    type: 'heat', title: 'Catching a double release, by how the two pills leave', sub: 'share of two-pill drops the method did NOT report as exactly 1', left: 120, maxCell: 100, cellH: 32, legendLabel: '0 → 100 % caught',
    rows: M.map((m) => ({ label: m.short })), cols: pats.map((p) => ({ label: PATNAME[p].replace(' (one above the other)', '').replace('Well separated in time', 'Separated') })),
    cells: M.map((m) => pats.map((p) => { const r = T.filter((t) => t.n === 2 && t.pattern === p); if (!r.length) return null; const k = cnt(r, (t) => t.est[m.key] !== 1); return { v: k / r.length, text: pct(k / r.length), tip: [['caught', `${k} / ${r.length}`], ['pattern', PATNAME[p]]] }; })),
    table: { cols: ['Method'].concat(pats.map((p) => PATNAME[p])), rows: M.map((m) => [m.label].concat(pats.map((p) => { const r = T.filter((t) => t.n === 2 && t.pattern === p); return r.length ? pct(cnt(r, (t) => t.est[m.key] !== 1) / r.length) : '–'; }))) },
  });
  Charts.mount($('chExact'), {
    type: 'heat', title: 'Exact count by number of pills released', sub: 'share of drops where the reported count equals the truth', left: 120, maxCell: 100, cellH: 32, legendLabel: '0 → 100 % exact',
    rows: M.map((m) => ({ label: m.short })), cols: [0, 1, 2, 3].map((n) => ({ label: n + (n === 1 ? ' pill' : ' pills') })),
    cells: M.map((m) => [0, 1, 2, 3].map((n) => { const r = T.filter((t) => t.n === n); if (!r.length) return null; const k = cnt(r, (t) => t.est[m.key] === n); return { v: k / r.length, text: pct(k / r.length), tip: [['exact', `${k} / ${r.length}`]] }; })),
    table: { cols: ['Method', '0', '1', '2', '3'], rows: M.map((m) => [m.label].concat([0, 1, 2, 3].map((n) => { const r = T.filter((t) => t.n === n); return r.length ? pct(cnt(r, (t) => t.est[m.key] === n) / r.length) : '–'; }))) },
  });

  // ------------------------------------------------------------------ confusion matrices
  let cm = null, cmKey = 'M1';
  const cmBtns = $('cmBtns');
  M.forEach((m) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'btn' + (m.key === cmKey ? ' on' : ''); b.textContent = m.short; b.setAttribute('aria-pressed', m.key === cmKey); b.addEventListener('click', () => { cmKey = m.key; cmBtns.querySelectorAll('button').forEach((x) => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b); }); drawCM(); }); cmBtns.appendChild(b); });
  function drawCM() {
    const cols = [0, 1, 2, 3, 4, -1], cl = (c) => (c < 0 ? 'flag' : c === 4 ? '4+' : String(c));
    const spec = {
      type: 'heat', title: M.find((m) => m.key === cmKey).label, sub: 'row = truth; each row sums to 100 %', left: 90, maxCell: 70, cellH: 34, legendLabel: '0 → 100 % of that row',
      rows: [0, 1, 2, 3].map((n) => ({ label: `truth ${n}` })), cols: cols.map((c) => ({ label: cl(c) })),
      cells: [0, 1, 2, 3].map((n) => { const r = T.filter((t) => t.n === n); return cols.map((c) => { if (!r.length) return null; const k = cnt(r, (t) => (c === 4 ? t.est[cmKey] >= 4 : t.est[cmKey] === c)); return { v: k / r.length, text: k ? pct(k / r.length) : '·', tip: [['drops', `${k} / ${r.length}`], ['truth', n], ['reported', cl(c)]] }; }); }),
      table: { cols: ['Truth \\ reported'].concat(cols.map(cl)), rows: [0, 1, 2, 3].map((n) => { const r = T.filter((t) => t.n === n); return [String(n)].concat(cols.map((c) => pct(cnt(r, (t) => (c === 4 ? t.est[cmKey] >= 4 : t.est[cmKey] === c)) / (r.length || 1)))); }) },
    };
    if (cm) cm.update(spec); else cm = Charts.mount($('chConf'), spec);
  }
  drawCM();

  // ------------------------------------------------------------------ methods table
  const NOTES = {
    M1: ['One diode pair, counts edges', 'Cheapest; what most dispensers ship with', 'Touching or simultaneous pills are one edge'],
    M2: ['One barrier, pulse ÷ single-pill width', 'Same hardware, a little firmware', 'Confused by tumbling pills and speed changes; blind to side-by-side'],
    M3: ['Linear photodiode array across the chute', 'Sees pills side by side; area ∝ pills', 'Stacked pills hide behind each other; needs a calibration'],
    M4: ['Two barriers 7 mm apart give fall speed', 'Fixes speed dependence, sees stacked pills', 'Cannot see side-by-side pairs (same length as one)'],
    M5: ['Load cell under the tray (weight-based verification)', 'Independent of geometry and optics; also sees pills that never reached the tray', 'Noise + landing ring-down: needs a settle time; mass variation between lots; cannot tell a chipped pill from a whole one'],
    M6: ['Three views must agree', 'No false confirmations; disagreement triggers a re-dose', 'Costliest; flags some good doses (see false alarms above)'],
  };
  $('tblMethods').innerHTML = `<thead><tr><th>Method</th><th>How it works</th><th>Strength</th><th>Blind spot</th><th class="num">False confirm</th><th class="num">Confirms good dose</th></tr></thead><tbody>${stats.map((s) => `<tr><td><span class="chip"><i style="background:${COLOR[s.m.key]}"></i>${s.m.short}</span></td><td class="wrap">${NOTES[s.m.key][0]}</td><td class="wrap">${NOTES[s.m.key][1]}</td><td class="wrap">${NOTES[s.m.key][2]}</td><td class="num">${pct(s.falseConfirm.p, 1)}</td><td class="num">${pct(s.confirm1.p, 1)}</td></tr>`).join('')}</tbody>`;

  drop();
})();
