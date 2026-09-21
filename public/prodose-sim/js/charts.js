/* Prodose charts, small SVG chart kit that follows the site's data-viz rules:
 *   • categorical hues come from the fixed --c1…--c8 tokens (one per concept), sequential = one-hue blue ramp, status colours are reserved
 *   • thin marks, 4px rounded data ends anchored to the baseline, 2px surface gaps, direct labels only where they fit
 *   • every chart has a hover/focus tooltip and a table view; legends are real buttons that can hide a series
 *   • all colours are CSS variables, so light / dark / forced-colours work without re-rendering
 * Usage:  Charts.mount(container, spec)   spec.type ∈ bars | stack | heat | line   */
(function (G) {
  const NS = 'http://www.w3.org/2000/svg';
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const css = (n, fb) => (getComputedStyle(document.querySelector('.lab') || document.documentElement).getPropertyValue(n).trim() || fb);

  // ---- wilson score interval for a binomial proportion ----
  function wilson(k, n, z) {
    z = z || 1.96; if (!n) return { p: 0, lo: 0, hi: 1 };
    const p = k / n, d = 1 + (z * z) / n, c = p + (z * z) / (2 * n), m = z * Math.sqrt((p * (1 - p)) / n + (z * z) / (4 * n * n));
    return { p, lo: Math.max(0, (c - m) / d), hi: Math.min(1, (c + m) / d) };
  }

  // ---- sequential ramp (one hue, blue). Light theme: light→dark with value; dark theme: dark→light so more = louder ----
  const RAMP = ['--seq-100', '--seq-250', '--seq-400', '--seq-550', '--seq-700'];
  function hex2rgb(h) { h = h.trim(); if (h[0] === '#') { const n = parseInt(h.length === 4 ? h.replace(/./g, (c, i) => (i ? c + c : c)).slice(1) : h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; } const m = h.match(/\d+/g); return m ? m.slice(0, 3).map(Number) : [128, 128, 128]; }
  function lum([r, g, b]) { const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); }
  function seq(v) {
    const dark = G.ProdoseSite ? G.ProdoseSite.theme() === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
    const stops = RAMP.map((n) => hex2rgb(css(n, '#3987e5')));
    if (dark) stops.reverse();
    const t = clamp(v, 0, 1) * (stops.length - 1), i = Math.min(stops.length - 2, Math.floor(t)), f = t - i;
    const c = stops[i].map((x, k) => Math.round(x + (stops[i + 1][k] - x) * f));
    return { fill: `rgb(${c})`, ink: lum(c) > 0.32 ? '#0b0b0b' : '#ffffff' };
  }

  // ---- shell: header, tools, legend, svg host, tooltip, table ----
  function shell(el, spec) {
    el.classList.add('viz'); el.setAttribute('role', 'figure'); el.setAttribute('aria-label', spec.title || 'chart');
    el.innerHTML = `<header><h3>${esc(spec.title || '')}</h3><span class="sub">${esc(spec.sub || '')}</span><span class="tools"><button type="button" data-v="chart" aria-pressed="true">Chart</button><button type="button" data-v="table" aria-pressed="false">Table</button></span></header><div class="legend" data-legend></div><div data-host></div><div data-table hidden></div><div class="tip" role="status" aria-live="polite"></div>`;
    const S = { el, host: el.querySelector('[data-host]'), legend: el.querySelector('[data-legend]'), tbl: el.querySelector('[data-table]'), tip: el.querySelector('.tip'), hidden: new Set() };
    el.querySelectorAll('.tools button').forEach((b) => b.addEventListener('click', () => {
      const t = b.dataset.v === 'table';
      el.querySelectorAll('.tools button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      S.host.hidden = t; S.legend.hidden = t; S.tbl.hidden = !t;
    }));
    return S;
  }
  function legend(S, items, redraw) {
    if (items.length < 2) { S.legend.innerHTML = ''; return; }
    S.legend.innerHTML = items.map((it) => `<button type="button" data-k="${esc(it.key)}" aria-pressed="${!S.hidden.has(it.key)}"><i style="background:${it.color}"></i>${esc(it.label)}</button>`).join('');
    S.legend.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => { const k = b.dataset.k; S.hidden.has(k) ? S.hidden.delete(k) : S.hidden.add(k); redraw(); }));
  }
  function table(S, t) {
    if (!t) { S.tbl.innerHTML = ''; return; }
    S.tbl.innerHTML = `<div class="tbl-wrap"><table class="tbl"><thead><tr>${t.cols.map((c, i) => `<th class="${i ? 'num' : ''}">${esc(c)}</th>`).join('')}</tr></thead><tbody>${t.rows.map((r) => `<tr>${r.map((c, i) => `<td class="${i ? 'num' : ''}">${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  }
  function tipShow(S, html, evt, target) {
    const t = S.tip; t.innerHTML = html; t.classList.add('on');
    const r = S.el.getBoundingClientRect();
    let x, y;
    if (evt && evt.clientX != null && evt.type !== 'focus') { x = evt.clientX - r.left; y = evt.clientY - r.top; }
    else { const b = target.getBoundingClientRect(); x = b.left - r.left + b.width / 2; y = b.top - r.top; }
    const w = t.offsetWidth, h = t.offsetHeight;
    t.style.left = clamp(x + 14, 6, r.width - w - 6) + 'px'; t.style.top = clamp(y - h - 10, 6, r.height - h - 6) + 'px';
  }
  const tipHide = (S) => S.tip.classList.remove('on');
  const rows = (pairs) => pairs.map(([k, v, c]) => `<div class="r"><span>${c ? `<i style="background:${c}"></i>` : ''}${esc(k)}</span><b style="font-weight:600">${esc(v)}</b></div>`).join('');
  function bindTip(S, node, html) {
    node.addEventListener('pointermove', (e) => tipShow(S, html, e, node)); node.addEventListener('pointerleave', () => tipHide(S));
    node.addEventListener('focus', (e) => tipShow(S, html, e, node)); node.addEventListener('blur', () => tipHide(S));
  }
  function svg(S, w, h) { const s = document.createElementNS(NS, 'svg'); s.setAttribute('viewBox', `0 0 ${w} ${h}`); s.setAttribute('width', w); s.setAttribute('height', h); s.setAttribute('role', 'img'); s.setAttribute('aria-hidden', 'false'); S.host.innerHTML = ''; S.host.appendChild(s); return s; }
  const roundEnd = (x0, y, len, th, r) => { // horizontal bar: square at the baseline (x0), 4px round at the data end
    len = Math.max(len, 0); r = Math.min(r, len, th / 2); if (len <= 0) return '';
    return `M${x0},${y}h${len - r}a${r},${r} 0 0 1 ${r},${r}v${th - 2 * r}a${r},${r} 0 0 1 ${-r},${r}h${-(len - r)}z`;
  };
  const el = (tag, attrs, parent) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; };
  const textEl = (parent, x, y, txt, attrs) => { const t = el('text', Object.assign({ x, y }, attrs || {}), parent); t.textContent = txt; return t; };
  function ticks(lo, hi, n) { const out = []; for (let i = 0; i <= n; i++) out.push(lo + ((hi - lo) * i) / n); return out; }

  // =====================================================================================================
  //  bars: horizontal bars with optional confidence whiskers, one colour per item
  // =====================================================================================================
  function bars(S, spec) {
    const items = spec.items.filter((i) => !S.hidden.has(i.key));
    const W = Math.max(320, S.el.clientWidth - 28), rowH = spec.rowH || 30, top = 6, bot = 26, left = Math.min(190, W * 0.36), right = 92;
    const H = top + items.length * rowH + bot, dom = spec.domain || [0, 1], plotW = W - left - right;
    const s = svg(S, W, H), X = (v) => left + ((clamp(v, dom[0], dom[1]) - dom[0]) / (dom[1] - dom[0])) * plotW;
    const g = el('g', { class: 'grid' }, s), ax = el('g', { class: 'axis' }, s);
    const tk = spec.ticks || ticks(dom[0], dom[1], 4);
    for (const t of tk) { el('line', { x1: X(t), x2: X(t), y1: top, y2: top + items.length * rowH }, g); textEl(ax, X(t), H - 8, spec.fmtTick ? spec.fmtTick(t) : String(t), { 'text-anchor': 'middle', class: 'dim' }); }
    el('line', { x1: X(dom[0]), x2: X(dom[0]), y1: top, y2: top + items.length * rowH, stroke: 'var(--axis)' }, ax);
    if (spec.ref != null) { el('line', { x1: X(spec.ref.value), x2: X(spec.ref.value), y1: top, y2: top + items.length * rowH, stroke: 'var(--ink-2)', 'stroke-dasharray': '3 3' }, s); textEl(s, X(spec.ref.value), top - 1, spec.ref.label, { 'text-anchor': 'middle', class: 'dim', 'font-size': '10.5' }); }
    items.forEach((it, i) => {
      const y = top + i * rowH, th = Math.min(18, rowH - 10), by = y + (rowH - th) / 2, cy = y + rowH / 2;
      const gr = el('g', { tabindex: 0, 'data-mark': '', 'aria-label': `${it.label}: ${spec.fmt(it.value)}${it.note ? ', ' + it.note : ''}` }, s);
      el('rect', { x: 0, y, width: W, height: rowH, fill: 'transparent' }, gr);           // generous hit target
      textEl(gr, left - 10, cy + 4, it.label, { 'text-anchor': 'end', class: 'lbl', 'font-size': '12' });
      if (it.value > dom[0]) el('path', { d: roundEnd(X(dom[0]), by, X(it.value) - X(dom[0]), th, 4), fill: it.color }, gr);
      if (it.lo != null) {
        el('line', { x1: X(it.lo), x2: X(it.hi), y1: cy, y2: cy, stroke: 'var(--ink)', 'stroke-width': 1.5 }, gr);
        el('line', { x1: X(it.lo), x2: X(it.lo), y1: cy - 4, y2: cy + 4, stroke: 'var(--ink)', 'stroke-width': 1.5 }, gr); el('line', { x1: X(it.hi), x2: X(it.hi), y1: cy - 4, y2: cy + 4, stroke: 'var(--ink)', 'stroke-width': 1.5 }, gr);
      }
      textEl(gr, X(Math.max(it.hi != null ? it.hi : it.value, it.value)) + 8, cy + 4, spec.fmt(it.value) + (it.badge ? '  ' + it.badge : ''), { class: 'lbl', 'font-size': '12' });
      bindTip(S, gr, `<b>${esc(it.label)}</b>` + rows(it.tip || [[spec.metric || 'value', spec.fmt(it.value), it.color]]));
    });
    legend(S, spec.items.map((i) => ({ key: i.key, label: i.label, color: i.color })), () => bars(S, spec));
  }

  // =====================================================================================================
  //  stack: 100 % stacked horizontal bars of outcome shares (status hues, 2px gaps)
  // =====================================================================================================
  function stack(S, spec) {
    const items = spec.items, parts = spec.parts.filter((p) => !S.hidden.has(p.key));
    const W = Math.max(320, S.el.clientWidth - 28), rowH = 30, top = 4, bot = 24, left = Math.min(190, W * 0.36), right = 10, plotW = W - left - right;
    const H = top + items.length * rowH + bot, s = svg(S, W, H), X = (f) => left + f * plotW;
    const g = el('g', { class: 'grid' }, s), ax = el('g', { class: 'axis' }, s);
    for (const t of [0, 0.25, 0.5, 0.75, 1]) { el('line', { x1: X(t), x2: X(t), y1: top, y2: top + items.length * rowH }, g); textEl(ax, X(t), H - 7, Math.round(t * 100) + '%', { 'text-anchor': 'middle', class: 'dim' }); }
    items.forEach((it, i) => {
      const y = top + i * rowH, th = 16, by = y + (rowH - th) / 2, cy = y + rowH / 2;
      const gr = el('g', { tabindex: 0, 'data-mark': '', 'aria-label': `${it.label}: ` + spec.parts.map((p) => `${p.label} ${(100 * (it.vals[p.key] || 0) / (it.total || 1)).toFixed(0)}%`).join(', ') }, s);
      el('rect', { x: 0, y, width: W, height: rowH, fill: 'transparent' }, gr);
      textEl(gr, left - 10, cy + 4, it.label, { 'text-anchor': 'end', class: 'lbl', 'font-size': '12' });
      let acc = 0; const tot = parts.reduce((a, p) => a + (it.vals[p.key] || 0), 0) || 1;
      parts.forEach((p, k) => {
        const f = (it.vals[p.key] || 0) / tot; if (f <= 0) return;
        const x0 = X(acc), wd = Math.max(0, f * plotW - (k < parts.length - 1 ? 2 : 0)); acc += f;
        el('rect', { x: x0, y: by, width: wd, height: th, fill: p.color, rx: 0 }, gr);
        if (wd > 34) { const t = textEl(gr, x0 + wd / 2, cy + 4, Math.round(f * 100) + '%', { 'text-anchor': 'middle', 'font-size': '10.5', fill: p.ink || '#0b0b0b', 'font-weight': 600 }); t.style.fill = p.ink || '#0b0b0b'; }
      });
      bindTip(S, gr, `<b>${esc(it.label)}</b>` + rows(spec.parts.map((p) => [p.label, `${it.vals[p.key] || 0} (${((100 * (it.vals[p.key] || 0)) / (it.total || 1)).toFixed(0)}%)`, p.color])));
    });
    legend(S, spec.parts.map((p) => ({ key: p.key, label: (p.icon ? p.icon + ' ' : '') + p.label, color: p.color })), () => stack(S, spec));
  }

  // =====================================================================================================
  //  heat: matrix of cells on the sequential ramp; null = not run (hatched)
  // =====================================================================================================
  function heat(S, spec) {
    const R = spec.rows, C = spec.cols;
    const W = Math.max(340, S.el.clientWidth - 28), left = spec.left || Math.min(170, W * 0.3), top = spec.colGroups ? 44 : 30, cw = Math.max(20, Math.min(spec.maxCell || 56, (W - left - 8) / C.length)), ch = spec.cellH || 30;
    const H = top + R.length * ch + 8, s = svg(S, left + cw * C.length + 8, H);
    const defs = el('defs', {}, s), pat = el('pattern', { id: 'hatch' + S.el.id, width: 6, height: 6, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(45)' }, defs);
    el('rect', { width: 6, height: 6, fill: 'var(--surface-2)' }, pat); el('line', { x1: 0, y1: 0, x2: 0, y2: 6, stroke: 'var(--axis)', 'stroke-width': 1.5 }, pat);
    if (spec.colGroups) { let x = 0; for (const grp of spec.colGroups) { const w = grp.n * cw; textEl(s, left + x + w / 2, 12, grp.label, { 'text-anchor': 'middle', class: 'lbl', 'font-size': '11' }); el('line', { x1: left + x + 3, x2: left + x + w - 3, y1: 17, y2: 17, stroke: 'var(--axis)' }, s); x += w; } }
    C.forEach((c, j) => textEl(s, left + j * cw + cw / 2, top - 8, c.label, { 'text-anchor': 'middle', class: 'dim', 'font-size': '10.5' }));
    R.forEach((r, i) => {
      const y = top + i * ch;
      textEl(s, left - 8, y + ch / 2 + 4, r.label, { 'text-anchor': 'end', class: 'lbl', 'font-size': '12' });
      C.forEach((c, j) => {
        const cell = spec.cells[i][j], x = left + j * cw;
        const gr = el('g', { tabindex: 0, 'data-mark': '', 'aria-label': `${r.label}, ${c.label}: ${cell && cell.v != null ? cell.text : 'not run'}` }, s);
        if (!cell || cell.v == null) { el('rect', { x: x + 1, y: y + 1, width: cw - 2, height: ch - 2, fill: `url(#hatch${S.el.id})`, rx: 3 }, gr); }
        else {
          const col = seq(cell.v); el('rect', { x: x + 1, y: y + 1, width: cw - 2, height: ch - 2, fill: col.fill, rx: 3 }, gr);
          if (cw >= 26) { const t = textEl(gr, x + cw / 2, y + ch / 2 + 4, cell.text, { 'text-anchor': 'middle', 'font-size': cw < 34 ? 9.5 : 11, 'font-weight': 600 }); t.style.fill = col.ink; }
        }
        bindTip(S, gr, `<b>${esc(r.label)} · ${esc(c.label)}</b>` + rows(cell && cell.tip ? cell.tip : [['result', cell && cell.v != null ? cell.text : 'not run']]));
      });
    });
    // sequential legend bar
    const lg = el('g', {}, s), lx = left, ly = H - 2;
    S.legend.innerHTML = `<span><i style="background:linear-gradient(90deg, ${[0, 0.25, 0.5, 0.75, 1].map((v) => seq(v).fill).join(',')});width:80px"></i>${esc(spec.legendLabel || '0 → 100 %')}</span><span><i style="background:repeating-linear-gradient(45deg,var(--axis) 0 2px,var(--surface-2) 2px 5px)"></i>not run</span>`;
  }

  // =====================================================================================================
  //  line: y(x) traces with a hover crosshair; used for step responses / sweeps
  // =====================================================================================================
  function line(S, spec) {
    const series = spec.series.filter((s) => !S.hidden.has(s.key));
    const W = Math.max(320, S.el.clientWidth - 28), H = spec.h || 240, m = { l: 46, r: 16, t: 10, b: 30 }, pw = W - m.l - m.r, ph = H - m.t - m.b;
    const xd = spec.x, yd = spec.y, X = (v) => m.l + ((v - xd[0]) / (xd[1] - xd[0])) * pw, Y = (v) => m.t + ph - ((v - yd[0]) / (yd[1] - yd[0])) * ph;
    const s = svg(S, W, H), g = el('g', { class: 'grid' }, s), ax = el('g', { class: 'axis' }, s);
    for (const t of ticks(yd[0], yd[1], 4)) { el('line', { x1: m.l, x2: W - m.r, y1: Y(t), y2: Y(t) }, g); textEl(ax, m.l - 6, Y(t) + 4, spec.fmtY ? spec.fmtY(t) : t.toFixed(1), { 'text-anchor': 'end', class: 'dim' }); }
    for (const t of ticks(xd[0], xd[1], 6)) textEl(ax, X(t), H - 10, spec.fmtX ? spec.fmtX(t) : t.toFixed(0), { 'text-anchor': 'middle', class: 'dim' });
    el('line', { x1: m.l, x2: W - m.r, y1: Y(yd[0]), y2: Y(yd[0]), stroke: 'var(--axis)' }, ax);
    if (spec.xLabel) textEl(ax, m.l + pw / 2, H - 0, spec.xLabel, { 'text-anchor': 'middle', class: 'dim', 'font-size': '10.5' });
    for (const b of spec.bands || []) el('rect', { x: X(b.x0), y: m.t, width: Math.max(0, X(b.x1) - X(b.x0)), height: ph, fill: b.color || 'var(--accent)', opacity: 0.09 }, s);
    for (const r of spec.refs || []) { el('line', { x1: m.l, x2: W - m.r, y1: Y(r.y), y2: Y(r.y), stroke: 'var(--ink-2)', 'stroke-dasharray': '3 3' }, s); textEl(s, W - m.r - 2, Y(r.y) - 4, r.label, { 'text-anchor': 'end', class: 'dim', 'font-size': '10.5' }); }
    for (const se of series) {
      const d = se.pts.map((p, i) => (i ? 'L' : 'M') + X(p[0]).toFixed(1) + ',' + Y(clamp(p[1], yd[0], yd[1])).toFixed(1)).join('');
      el('path', { d, fill: 'none', stroke: se.color, 'stroke-width': 2, 'stroke-linejoin': 'round', 'stroke-linecap': 'round', 'data-mark': '' }, s);
    }
    const cross = el('line', { y1: m.t, y2: m.t + ph, stroke: 'var(--axis)', opacity: 0 }, s), dots = series.map((se) => el('circle', { r: 4, fill: se.color, stroke: 'var(--surface)', 'stroke-width': 2, opacity: 0 }, s));
    const hit = el('rect', { x: m.l, y: m.t, width: pw, height: ph, fill: 'transparent', tabindex: 0 }, s);
    const at = (px) => xd[0] + ((px - m.l) / pw) * (xd[1] - xd[0]);
    const show = (e, focus) => {
      const r = s.getBoundingClientRect(), px = ((e.clientX - r.left) / r.width) * W, xv = clamp(at(px), xd[0], xd[1]);
      cross.setAttribute('x1', X(xv)); cross.setAttribute('x2', X(xv)); cross.setAttribute('opacity', 1);
      const pairs = series.map((se, k) => { let best = se.pts[0]; for (const p of se.pts) if (Math.abs(p[0] - xv) < Math.abs(best[0] - xv)) best = p; dots[k].setAttribute('cx', X(best[0])); dots[k].setAttribute('cy', Y(clamp(best[1], yd[0], yd[1]))); dots[k].setAttribute('opacity', 1); return [se.label, (spec.fmtY || ((v) => v.toFixed(2)))(best[1]), se.color]; });
      tipShow(S, `<b>${esc((spec.fmtX || ((v) => v.toFixed(0)))(xv))}</b>` + rows(pairs), e, hit);
    };
    hit.addEventListener('pointermove', show);
    hit.addEventListener('pointerleave', () => { cross.setAttribute('opacity', 0); dots.forEach((d) => d.setAttribute('opacity', 0)); tipHide(S); });
    legend(S, spec.series.map((x) => ({ key: x.key, label: x.label, color: x.color })), () => line(S, spec));
  }

  const TYPES = { bars, stack, heat, line };
  function mount(el, spec) {
    const S = shell(el, spec);
    const draw = () => { TYPES[spec.type](S, spec); };
    table(S, spec.table);
    let w = 0; draw();
    const ro = new ResizeObserver(() => { const nw = Math.round(el.clientWidth); if (nw !== w && nw > 0) { w = nw; draw(); } });
    ro.observe(el);
    return { redraw: draw, update(next) { Object.assign(spec, next); if (next.table) table(S, spec.table); draw(); } };
  }

  G.Charts = { mount, wilson, seq, esc };
})(window);
