/* Prodose labs page, bottle interface Monte-Carlo, chute & collection (physics), cleaning model, materials. */
(function () {
  const $ = (id) => document.getElementById(id);
  const P = window.Prodose, pct = (v, d) => (100 * v).toFixed(d == null ? 0 : d) + '%';
  const tile = (v, s) => `<div class="stat"><b>${v}</b><span>${s}</span></div>`;
  ProdoseSite.tabs($('labTabs'), (id) => { window.dispatchEvent(new Event('resize')); });
  const rng = (s) => { let a = s >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };
  const gauss = (r) => { let u = 0; for (let i = 0; i < 6; i++) u += r(); return (u - 3) * Math.SQRT2; };
  const erf = (x) => { const s = Math.sign(x); x = Math.abs(x); const t = 1 / (1 + 0.3275911 * x); return s * (1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x)); };
  const Phi = (z) => 0.5 * (1 + erf(z / Math.SQRT2));

  // =========================================================================================== interface
  const shoreE = (S) => 0.0981 * (56 + 7.62336 * S) / (0.137505 * (254 - 2.54 * S));         // MPa (Gent)
  const IF = [
    { key: 'rigid', name: 'Rigid adjustable clamp', color: 'var(--c2)', E: () => 800, t: 6, mu: 0.35, adj: 0.10, note: 'Hard polymer jaws set once per bottle type (0.1 mm steps).' },
    { key: 'sleeve', name: 'Fixed silicone sleeve', color: 'var(--c4)', E: (S) => shoreE(S), t: 3, mu: 0.9, adj: null, note: 'One moulded sleeve per neck size; the tolerance goes straight into the seal.' },
    { key: 'iris', name: 'Iris + silicone lip', color: 'var(--c3)', E: (S) => shoreE(S), t: 3, mu: 0.9, adj: 0.15, note: 'Iris ring closes on the actual bottle (0.15 mm resolution), silicone lip seals.' },
  ];
  const P_SEAL = 0.15, P_MAX = 1.0, W_AX = 8;      // MPa min for the seal (≥ 2.5× the 60 kPa vacuum), MPa max for a thin plastic neck, axial contact mm
  function ifPass(d, D, sig, ov, S, mass, i0, N, seed) {
    const R = rng(seed), E = d.E(S); let ok = 0, seal = 0, crush = 0, hold = 0; const pmins = [];
    for (let k = 0; k < N; k++) {
      const od = D + sig * gauss(R);                                       // this bottle's neck diameter
      const iRad = d.adj == null ? i0 + (od - D) / 2 : i0 + (d.adj / Math.sqrt(12)) * gauss(R) / 2 + (d.key === 'rigid' ? (od - D) / 2 * 0.35 : 0);   // rigid clamp partly re-set by hand
      const iMin = iRad - ov / 4, iMax = iRad + ov / 4;                    // out-of-round: radial interference varies around the neck
      const pmin = Math.max(0, E * iMin / d.t), pmax = Math.max(0, E * iMax / d.t);
      const F = d.mu * pmin * Math.PI * od * W_AX, need = 5 * (mass / 1000) * 9.81;   // pull-out ≥ 5 × weight
      const s1 = pmin >= P_SEAL, s2 = pmax <= P_MAX, s3 = F >= need;
      if (s1) seal++; if (s2) crush++; if (s3) hold++; if (s1 && s2 && s3) ok++; pmins.push(pmin);
    }
    pmins.sort((a, b) => a - b);
    return { pass: ok / N, seal: seal / N, crush: crush / N, hold: hold / N, p05: pmins[Math.floor(N * 0.05)] };
  }
  let ifChart = null;
  function drawIface() {
    const D = +$('if_D').value, sig = +$('if_sig').value, ov = +$('if_ov').value, S = +$('if_sh').value, m = +$('if_m').value;
    $('o_D').textContent = D + ' mm'; $('o_sig').textContent = sig.toFixed(2) + ' mm'; $('o_ov').textContent = ov.toFixed(2) + ' mm'; $('o_sh').textContent = S + ' Shore A'; $('o_m').textContent = m + ' g';
    const xs = []; for (let i = 0; i <= 30; i++) xs.push(i * 0.05);
    const series = IF.map((d) => ({ key: d.key, label: d.name, color: d.color, pts: xs.map((x, k) => [x, ifPass(d, D, sig, ov, S, m, x, 1500, 11 + k).pass]) }));
    const best = series.map((s, i) => { let b = s.pts[0]; for (const p of s.pts) if (p[1] > b[1]) b = p; return { d: IF[i], x: b[0], p: b[1] }; });
    const spec = { type: 'line', title: 'Probability the interface seals, holds and spares the neck', sub: 'vs nominal radial interference (mm) · 1 500 random bottles per point', x: [0, 1.5], y: [0, 1], h: 250, fmtX: (v) => v.toFixed(2) + ' mm', fmtY: (v) => pct(v), xLabel: 'nominal radial interference (mm)', series,
      table: { cols: ['Interference (mm)'].concat(IF.map((d) => d.name)), rows: xs.map((x, k) => [x.toFixed(2)].concat(series.map((s) => pct(s.pts[k][1])))).filter((_, k) => k % 2 === 0) } };
    if (ifChart) ifChart.update(spec); else ifChart = Charts.mount($('chIface'), spec);
    const det = best.map((b) => Object.assign(b, ifPass(b.d, D, sig, ov, S, m, b.x, 6000, 99)));
    $('ifTiles').innerHTML = det.map((b) => tile(pct(b.p, 1), `${b.d.name}, best at ${b.x.toFixed(2)} mm`)).join('');
    $('tblIface').innerHTML = `<thead><tr><th>Design</th><th class="num">Best interference</th><th class="num">Reliability</th><th class="num">Seals</th><th class="num">Neck spared</th><th class="num">Holds 5× weight</th><th class="num">5th-pct contact pressure</th><th>Notes</th></tr></thead><tbody>${det.map((b) => `<tr><td><span class="chip"><i style="background:${b.d.color}"></i>${b.d.name}</span></td><td class="num">${b.x.toFixed(2)} mm</td><td class="num"><b>${pct(b.p, 1)}</b></td><td class="num">${pct(b.seal, 1)}</td><td class="num">${pct(b.crush, 1)}</td><td class="num">${pct(b.hold, 1)}</td><td class="num">${b.p05.toFixed(2)} MPa</td><td class="wrap">${b.d.note}</td></tr>`).join('')}</tbody>`;
    const w = det.reduce((a, b) => (b.p > a.p ? b : a));
    $('ifNote').innerHTML = `<b>Reading it.</b> Seal needs ≥ ${P_SEAL} MPa contact pressure (2.5× a 60 kPa vacuum), a thin plastic neck tolerates ≤ ${P_MAX} MPa, and holding force μ·p·πD·${W_AX} mm must exceed 5× the bottle's weight (${(5 * m / 1000 * 9.81).toFixed(1)} N). A rigid clamp has a modulus of ${IF[0].E()} MPa, so 0.1 mm of tolerance is ${(IF[0].E() * 0.1 / IF[0].t).toFixed(0)} MPa, the window between “leaks” and “crushes” is narrower than the tolerance. Silicone at ${S} Shore A is ${shoreE(S).toFixed(1)} MPa, ${(IF[0].E() / shoreE(S)).toFixed(0)}× softer, so the same tolerance is a usable spread. Best here: <b>${w.d.name}</b> at ${pct(w.p, 1)}. The iris earns its extra part when the neck tolerance is large: it re-centres the sleeve on the bottle in hand.`;
  }
  for (const id of ['if_D', 'if_sig', 'if_ov', 'if_sh', 'if_m']) $(id).addEventListener('input', () => { clearTimeout(drawIface.t); drawIface.t = setTimeout(drawIface, 60); });
  drawIface();

  // =========================================================================================== chute
  const CH = window.PRODOSE_CHUTE;
  const PN = { round: 'Round tablet 9.5 mm', caplet: 'Caplet 17 × 7 mm', softgel: 'Softgel 11 × 6.5 mm' }, PC = { round: 'var(--c1)', caplet: 'var(--c2)', softgel: 'var(--c3)' };
  if (CH) {
    Charts.mount($('chFall'), { type: 'line', title: 'Why the chute exists: free-fall damage margin', sub: 'impact speed ÷ the pill’s rated speed vs free-fall height onto a hard surface (30 % of a drop rating ≈ no risk)', h: 250, x: [0, 1200], y: [0, 1], fmtX: (v) => v.toFixed(0) + ' mm', fmtY: (v) => pct(v), xLabel: 'free-fall height (mm)', refs: [{ y: 0.6, label: 'damage accrues above 60 %' }],
      series: Object.keys(PN).map((k) => ({ key: k, label: PN[k], color: PC[k], pts: CH.fall.filter((r) => r.pill === k).map((r) => [r.height, r.ratioMax]) })),
      table: { cols: ['Height (mm)'].concat(Object.values(PN)), rows: [...new Set(CH.fall.map((r) => r.height))].map((h) => [h].concat(Object.keys(PN).map((k) => pct(CH.fall.find((r) => r.pill === k && r.height === h).ratioMax)))) } });
    const angles = [...new Set(CH.ramp.map((r) => r.angle))].sort((a, b) => a - b);
    Charts.mount($('chRampAngle'), { type: 'heat', title: 'Does the pill slide down the ramp?', sub: 'share of pills reaching the tray (PTFE ramp) · transit time in tooltip', left: 130, maxCell: 62, cellH: 34, legendLabel: '0 → 100 % reach the tray',
      rows: Object.keys(PN).map((k) => ({ label: PN[k].replace(' mm', '') })), cols: angles.map((a) => ({ label: a + '°' })),
      cells: Object.keys(PN).map((k) => angles.map((a) => { const r = CH.ramp.find((x) => x.pill === k && x.ramp === 'ptfe' && x.angle === a); return r ? { v: 1 - r.stuck, text: Math.round((1 - r.stuck) * 100) + '', tip: [['reach the tray', pct(1 - r.stuck)], ['transit time', r.t + ' s'], ['impact ÷ rating', pct(r.ratioMax)]] } : null; })),
      table: { cols: ['Pill'].concat(angles.map((a) => a + '°')), rows: Object.keys(PN).map((k) => [PN[k]].concat(angles.map((a) => { const r = CH.ramp.find((x) => x.pill === k && x.ramp === 'ptfe' && x.angle === a); return r ? pct(1 - r.stuck) : '–'; }))) } });
    const wh = [6, 10, 16, 24, 36], rowsT = []; for (const k of Object.keys(PN)) for (const da of [34, 100]) rowsT.push({ k, da });
    Charts.mount($('chTray'), { type: 'heat', title: 'Does the tray keep the pill?', sub: 'share of pills still in the tray (steel floor, worst case) by wall height', left: 150, maxCell: 62, cellH: 30, legendLabel: '0 → 100 % kept',
      rows: rowsT.map((r) => ({ label: `${PN[r.k].split(' ')[0]} · ${r.da} mm drop` })), cols: wh.map((w) => ({ label: w + ' mm' })),
      cells: rowsT.map((r) => wh.map((w) => { const x = CH.tray.find((t) => t.pill === r.k && t.tray === 'steel' && t.wallH === w && t.dropAfter === r.da); return x ? { v: 1 - x.out, text: Math.round((1 - x.out) * 100) + '', tip: [['kept', pct(1 - x.out)], ['tray impact ÷ rating', pct(x.ratioMax)]] } : null; })),
      table: { cols: ['Pill · drop'].concat(wh.map((w) => w + ' mm wall')), rows: rowsT.map((r) => [`${PN[r.k]} · ${r.da} mm`].concat(wh.map((w) => { const x = CH.tray.find((t) => t.pill === r.k && t.tray === 'steel' && t.wallH === w && t.dropAfter === r.da); return x ? pct(1 - x.out) : '–'; }))) } });
    const f800 = CH.fall.filter((r) => r.height === 800).map((r) => r.ratioMax), f25 = CH.fall.filter((r) => r.height === 25).map((r) => r.ratioMax);
    $('chuteNote').innerHTML = `<b>Findings.</b> A 25 mm hop onto a ramp hits at ${pct(Math.min(...f25))}–${pct(Math.max(...f25))} of the rated speed, no damage. Without a ramp, an ${'800'} mm free fall would be at ${pct(Math.min(...f800))}–${pct(Math.max(...f800))}: the pills survive, but with a thin margin once real-world lot variation is added, which is why the chute is a slide, not a drop. <b>Ramp angle</b> matters for pills that do not roll: caplets stop dead below ~20° and softgels need about 33° (static friction of the pill itself governs, in this engine the contact takes the larger static coefficient of the two materials, so a PTFE lining does not change the result; a real PTFE surface would help more, so read this as the conservative case). <b>Tray:</b> from 10 mm walls up, nothing leaves the tray for drops up to 100 mm, because the pills arrive at 0.5–1 m/s and every lining absorbs most of it.`;
  }
  for (const [id, key] of [['cu_r', 'ramp'], ['cu_t', 'tray']]) for (const [k, l] of Object.entries(P.LININGS)) { const o = document.createElement('option'); o.value = k; o.textContent = l.label; $(id).appendChild(o); }
  $('cu_r').value = 'ptfe'; $('cu_t').value = 'silicone';
  $('cu_go').addEventListener('click', () => {
    $('cu_go').disabled = true; $('cu_st').textContent = 'simulating 40 pills…';
    setTimeout(() => {
      const pills = { round: { shape: 'round', L: 9.5, W: 9.5, color: 'orange' }, caplet: { shape: 'caplet', L: 17, W: 7, color: 'white' }, softgel: { shape: 'softgel', L: 11, W: 6.5, color: 'gold' } };
      const cfg = { pill: pills[$('cu_pill').value], height: +$('cu_h').value, angle: +$('cu_a').value, ramp: $('cu_r').value, tray: $('cu_t').value, wallH: +$('cu_w').value, dropAfter: +$('cu_d').value };
      const r = P.chute.batch(cfg, 40, 4242);
      $('cu_out').innerHTML = tile(pct(1 - r.out), 'stay in the tray') + tile(pct(r.stuck), 'stuck on the ramp') + tile(pct(r.ratioMax), 'worst impact ÷ rating') + tile(r.vRamp.toFixed(2) + ' m/s', 'mean ramp impact') + tile(r.t.toFixed(2) + ' s', 'mean time to settle');
      $('cu_st').textContent = 'done'; $('cu_go').disabled = false;
    }, 30);
  });

  // =========================================================================================== cleaning
  const RHO = 1.2;
  function purge(pkpa, n, dmed, f, hepa, vib) {
    const u = Math.sqrt((2 * pkpa * 1e3) / RHO), uw = 0.25 * u, tau = 0.5 * 0.006 * RHO * uw * uw, mult = 2 * (vib ? 1.3 : 1);
    const pRem = (dum) => { const r = (dum / 2) * 1e-6, Fd = 32 * tau * r * r * mult, Fad = 1.5 * Math.PI * 0.05 * r * f; return Phi(Math.log(Fd / Fad) / 0.8); };
    const ds = [], N = 160; for (let i = 0; i < N; i++) ds.push(Math.exp(Math.log(1) + (Math.log(300) - Math.log(1)) * i / (N - 1)));
    const sg = Math.log(1.7), wts = ds.map((d) => Math.exp(-0.5 * ((Math.log(d) - Math.log(dmed)) / sg) ** 2) / d * Math.pow(d, 3));     // lognormal pdf in ln d, × mass ∝ d³
    const sw = wts.reduce((a, b) => a + b, 0);
    const eta = (nn) => { let e = 0; ds.forEach((d, i) => { e += (wts[i] / sw) * (1 - Math.pow(1 - pRem(d), nn)); }); return e * (hepa ? 1 : 0.65); };
    return { u, tau, pRem, eta, air: Math.PI * 0.75e-3 * 0.75e-3 * u * 0.15 * 1e6 };   // mL per pulse (Ø1.5 mm nozzle, 150 ms)
  }
  let chRem = null, chPul = null;
  function drawClean() {
    const p = +$('cl_p').value, n = +$('cl_n').value, dm = +$('cl_d').value, f = +$('cl_f').value, hepa = $('cl_hepa').checked, vib = $('cl_vib').checked;
    $('o_pp').textContent = p + ' kPa'; $('o_np').textContent = n; $('o_dm').textContent = dm + ' µm'; $('o_fr').textContent = f.toFixed(2);
    const cur = purge(p, n, dm, f, hepa, vib), eta = cur.eta(n), dust = 20;      // 20 mg on the surfaces between cleanings
    const resid = (1 - eta) * dust, carry = resid * 0.04 / 500 * 1e6 / 1000;      // µg… → ppm of a 500 mg dose: resid[mg]*0.04 / 500 mg
    const ppm = (resid * 0.04 / 500) * 1e6;
    $('clTiles').innerHTML = tile(pct(eta, 1), 'dust mass removed') + tile(resid.toFixed(1) + ' mg', 'left on surfaces') + tile(ppm.toFixed(0) + ' ppm', 'carry-over into next dose') + tile(cur.u.toFixed(0) + ' m/s', 'jet speed · wall shear ' + cur.tau.toFixed(1) + ' Pa') + tile(cur.air.toFixed(0) + ' mL', 'air per pulse');
    const ds = []; for (let i = 0; i <= 60; i++) ds.push(Math.log10(2) + (Math.log10(300) - Math.log10(2)) * i / 60);
    const mk = (pk, key, label, color) => { const q = purge(pk, n, dm, f, hepa, vib); return { key, label, color, pts: ds.map((l) => [l, 1 - Math.pow(1 - q.pRem(Math.pow(10, l)), n)]) }; };
    const spec = { type: 'line', title: 'Which particles does the purge remove?', sub: `share of particles lifted after ${n} pulses vs particle diameter`, h: 250, x: [ds[0], ds[ds.length - 1]], y: [0, 1], fmtX: (v) => Math.pow(10, v).toFixed(0) + ' µm', fmtY: (v) => pct(v), xLabel: 'particle diameter (log scale)',
      series: [mk(p, 'now', `your setting (${p} kPa)`, 'var(--c1)'), mk(10, 'lo', '10 kPa', 'var(--c4)'), mk(60, 'hi', '60 kPa', 'var(--c2)')],
      table: { cols: ['Diameter (µm)', 'your setting', '10 kPa', '60 kPa'], rows: [2, 5, 10, 20, 50, 100, 200, 300].map((d) => [d].concat([p, 10, 60].map((pk) => pct(1 - Math.pow(1 - purge(pk, n, dm, f, hepa, vib).pRem(d), n))))) } };
    if (chRem) chRem.update(spec); else chRem = Charts.mount($('chRemoval'), spec);
    const items = Array.from({ length: 12 }, (_, i) => i + 1).map((k) => { const e = cur.eta(k), rr = (1 - e) * dust * 0.04 / 500 * 1e6; return { key: 'n' + k, label: k + (k === 1 ? ' pulse' : ' pulses'), value: rr, color: 'var(--c3)', tip: [['dust removed', pct(e, 1)], ['carry-over', rr.toFixed(0) + ' ppm']] }; });
    const spec2 = { type: 'bars', title: 'Carry-over vs number of pulses', sub: 'ppm of the next 500 mg dose · goal: below 10 ppm', domain: [0, Math.max(20, Math.ceil(items[0].value / 20) * 20)], fmt: (v) => v.toFixed(0) + ' ppm', ref: { value: 10, label: '10 ppm' }, metric: 'carry-over', rowH: 24, items, table: { cols: ['Pulses', 'carry-over (ppm)'], rows: items.map((it) => [it.label, it.value.toFixed(0)]) } };
    if (chPul) chPul.update(spec2); else chPul = Charts.mount($('chPulses'), spec2);
  }
  for (const id of ['cl_p', 'cl_n', 'cl_d', 'cl_f', 'cl_hepa', 'cl_vib']) $(id).addEventListener('input', () => { clearTimeout(drawClean.t); drawClean.t = setTimeout(drawClean, 50); });
  drawClean();

  // =========================================================================================== materials
  const REQ = [['autoclave', 'Autoclavable / steam-sterilisable'], ['usp', 'USP VI / FDA food-contact grades'], ['lowmu', 'Low friction to pills'], ['highmu', 'High friction / grip'], ['wear', 'Wear resistant'], ['machine', 'CNC machinable'], ['mold', 'Injection / compression moulding'], ['print', '3-D printable'], ['clear', 'Transparent'], ['cost', 'Low cost']];
  const MAT = [
    ['316L stainless steel', 'Stainless', '0.25–0.40', '~150 HV', 'Yes', 'FDA food-contact; standard pharma grade', 'CNC, laser / sheet, electropolish', 4, 'Wheel, scraper, funnel, wedge, tray', ['autoclave', 'usp', 'wear', 'machine']],
    ['17-4 PH stainless (H900)', 'Stainless', '0.25–0.40', '~40 HRC', 'Yes', 'Food-contact OK; check corrosion in wash', 'CNC + heat treat', 4, 'Wear tips, wedge edges', ['autoclave', 'wear', 'machine']],
    ['PTFE', 'Fluoropolymer', '0.05–0.10', 'Shore D 55', 'Yes', 'FDA / USP VI grades exist', 'CNC, skived sheet, coating', 3, 'Chute / ramp liner, lane surface', ['lowmu', 'autoclave', 'usp', 'machine']],
    ['POM (acetal)', 'Engineering polymer', '0.15–0.25', 'Shore D 82', 'Marginal', 'FDA grades exist', 'CNC, injection moulding', 2, 'Metering wheel / shuttle, gears, guides', ['lowmu', 'wear', 'machine', 'mold', 'cost']],
    ['UHMW-PE', 'Polyolefin', '0.10–0.20', 'Shore D 65', 'No (≤ 80 °C)', 'FDA grades exist', 'CNC, sheet', 2, 'Guides, lane rails, wear strips', ['lowmu', 'wear', 'machine', 'cost']],
    ['PEEK', 'High-performance polymer', '0.25–0.35', 'Shore D 85', 'Yes', 'USP VI grades', 'CNC, injection', 5, 'Precision wear parts, autoclaved fixtures', ['autoclave', 'usp', 'wear', 'machine', 'mold']],
    ['Polypropylene', 'Polyolefin', '0.25–0.35', 'Shore D 72', 'Yes (121 °C)', 'FDA food-contact', 'Injection moulding', 1, 'Hopper, housings, tray, adapter body', ['autoclave', 'mold', 'cost']],
    ['Polycarbonate', 'Engineering polymer', '0.35–0.45', 'Shore D 85', 'Limited', 'USP VI grades', 'Injection, CNC', 2, 'Windows, covers', ['clear', 'mold', 'machine']],
    ['Silicone 40–60A', 'Elastomer', '0.8–1.2', 'Shore A 40–60', 'Yes', 'USP VI, FDA', 'LSR / compression moulding', 2, 'Bottle seal, wiper lips, vacuum cups, tray liner', ['highmu', 'autoclave', 'usp', 'mold']],
    ['EPDM', 'Elastomer', '0.7–1.0', 'Shore A 60–70', 'Yes (steam)', 'FDA grades', 'Compression moulding', 1, 'Gaskets, O-rings', ['highmu', 'autoclave', 'mold', 'cost']],
    ['FKM', 'Elastomer', '0.5–0.7', 'Shore A 75', 'Yes', 'FDA grades', 'Compression moulding', 3, 'Seals in solvent wash', ['highmu', 'mold']],
    ['TPU 85A', 'Thermoplastic elastomer', '0.6–0.9', 'Shore A 85', 'No', 'Food-contact grades exist', 'Injection, 3-D print', 2, 'Belts, prototype lips', ['highmu', 'mold', 'print', 'cost']],
    ['PA12 (SLS / MJF)', 'Polyamide', '0.25–0.35', 'Shore D 75', 'Limited', 'Check per supplier', '3-D print', 2, 'Prototype housings, lane parts', ['print', 'machine']],
    ['PETG', 'Polyester', '0.3–0.4', 'Shore D 75', 'No', 'Not intended for reuse', '3-D print (FDM)', 1, 'Bench prototypes', ['print', 'clear', 'cost']],
    ['6061-T6 aluminium (anodised)', 'Light alloy', '0.30–0.45', '~95 HB', 'No', 'Non-contact only', 'CNC, extrusion', 2, 'Frames, brackets (not in the pill path)', ['machine', 'wear', 'cost']],
  ];
  const on = new Set();
  const req = $('matReq');
  for (const [k, l] of REQ) { const b = document.createElement('button'); b.type = 'button'; b.className = 'btn'; b.textContent = l; b.setAttribute('aria-pressed', 'false'); b.addEventListener('click', () => { on.has(k) ? on.delete(k) : on.add(k); b.classList.toggle('on', on.has(k)); b.setAttribute('aria-pressed', on.has(k)); drawMat(); }); req.appendChild(b); }
  function drawMat() {
    const rows = MAT.map((m) => ({ m, hit: [...on].filter((k) => m[9].includes(k)).length })).sort((a, b) => b.hit - a.hit || a.m[7] - b.m[7]);
    $('tblMat').innerHTML = `<thead><tr><th>Material</th><th>Family</th><th>μ vs pill</th><th>Hardness</th><th>Autoclave</th><th>Regulatory</th><th>Process</th><th class="num">Cost (1–5)</th><th>Typical use here</th>${on.size ? '<th class="num">Meets</th>' : ''}</tr></thead><tbody>${rows.map(({ m, hit }) => `<tr style="${on.size && hit < on.size ? 'opacity:.5' : ''}"><td><b>${m[0]}</b></td><td>${m[1]}</td><td>${m[2]}</td><td>${m[3]}</td><td>${m[4]}</td><td class="wrap">${m[5]}</td><td class="wrap">${m[6]}</td><td class="num">${m[7]}</td><td class="wrap">${m[8]}</td>${on.size ? `<td class="num"><span class="chip ${hit === on.size ? 'pill-ok' : hit ? 'pill-warn' : ''}">${hit} / ${on.size}</span></td>` : ''}</tr>`).join('')}</tbody>`;
  }
  drawMat();
  $('tblWhere').innerHTML = `<thead><tr><th>Part</th><th>First choice</th><th>Why</th></tr></thead><tbody>${[
    ['Bottle-neck seal / gripper', 'Silicone 50A (LSR)', 'Compliant, sealing, USP VI, autoclavable; ± 0.3 mm neck tolerance stays inside the pressure window (Interface lab).'],
    ['Adapter body and iris ring', 'Polypropylene (moulded) or POM', 'Cheap, stiff enough, autoclavable (PP), interchangeable per neck size.'],
    ['Funnel / hopper', '316L electropolished, or PP', 'Smooth walls keep pills from arching; PP for cost, 316L where autoclaving is required.'],
    ['Metering wheel, shuttle plate, disc', 'POM, or 316L with PTFE-coated pocket', 'Dimensionally stable, low friction, machinable; pocket edges are the tolerance-critical feature.'],
    ['Wiper lips, singulating roller', 'Silicone 50A / TPU', 'Compliance is the point: it yields instead of crushing a pill (Bench, motor-limit sweep).'],
    ['Lane, chute, ramp', '316L polished or PTFE-lined', 'Low, stable friction and easy to wipe down.'],
    ['Tray', 'PP with a silicone liner', 'Soft floor takes the last impact; walls ≥ 10 mm keep pills in (Chute lab).'],
    ['Vacuum cups', 'Silicone 40A', 'Conforms to a curved pill face; seal quality sets the hold force.'],
    ['Frame, brackets (no pill contact)', '6061 aluminium', 'Cheap and stiff; keep it out of the pill path.'],
  ].map((r) => `<tr><td><b>${r[0]}</b></td><td class="wrap">${r[1]}</td><td class="wrap">${r[2]}</td></tr>`).join('')}</tbody>`;
})();
