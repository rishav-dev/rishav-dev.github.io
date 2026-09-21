/* Prodose, sensor scope: rolling trace of the break-beam channels, tray load cell and (vacuum concepts) the pressure signal.
 * Reads the 1 kHz waveforms the physics scene records in scene.scope. Colours come from the page's CSS tokens. */
(function (G) {
  const P = (G.Prodose = G.Prodose || {});

  function css(name, fb) { const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim(); return v || fb; }

  // traces: [{ key, label, colour token, scale, lane }]
  P.drawScope = function (canvas, scene, opts) {
    opts = opts || {};
    const dpr = Math.min(2, G.devicePixelRatio || 1), r = canvas.getBoundingClientRect();
    const W = Math.max(60, r.width), H = Math.max(40, r.height);
    if (canvas.width !== Math.round(W * dpr) || canvas.height !== Math.round(H * dpr)) { canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr); }
    const ctx = canvas.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
    const sc = scene && scene.scope; if (!sc || sc.t.length < 2) return;
    const span = opts.span || 4000, tEnd = sc.t[sc.t.length - 1], t0 = tEnd - span;
    let i0 = sc.t.length - 1; while (i0 > 0 && sc.t[i0] > t0) i0--;
    const grid = css('--grid', '#ddd'), ink2 = css('--ink-2', '#555'), muted = css('--muted', '#888');
    const lanes = opts.lanes || [
      { key: 'b1', label: 'beam 1', colour: css('--c1', '#2a78d6'), lo: 0, hi: 1, fmt: (v) => (v * 100).toFixed(0) + '%' },
      { key: 'b2', label: 'beam 2', colour: css('--c2', '#eb6834'), lo: 0, hi: 1, share: 0 },
      { key: 'm', label: 'load cell', colour: css('--c3', '#1baf7a'), lo: -60, hi: null, fmt: (v) => v.toFixed(1) + ' mg' },
    ];
    const has = (k) => sc[k] && sc[k].length;
    const bands = [];
    bands.push({ h: 0.42, traces: lanes.filter((l) => l.key === 'b1' || l.key === 'b2'), unit: 'beam' });
    bands.push({ h: 0.34, traces: lanes.filter((l) => l.key === 'm'), unit: 'g' });
    if (opts.vac) bands.push({ h: 0.24, traces: [{ key: 'v', label: 'vacuum sealed', colour: css('--c6', '#008300'), lo: 0, hi: 1 }], unit: 'seal' });
    const tot = bands.reduce((a, b) => a + b.h, 0);
    let y = 4; const pad = 4;
    ctx.font = '10px system-ui, sans-serif'; ctx.textBaseline = 'top';
    for (const bd of bands) {
      const bh = (H - 8 - pad * (bands.length - 1)) * bd.h / tot;
      ctx.strokeStyle = grid; ctx.lineWidth = 1; ctx.strokeRect(0.5, y + 0.5, W - 1, bh - 1);
      let hi = 1, lo = 0;
      for (const tr of bd.traces) {
        if (!has(tr.key)) continue;
        if (tr.hi == null) { let mx = 200; for (let i = i0; i < sc[tr.key].length; i++) mx = Math.max(mx, sc[tr.key][i]); hi = mx * 1.08; lo = tr.lo; } else { hi = tr.hi; lo = tr.lo; }
      }
      // gridline at the mid-level
      ctx.strokeStyle = grid; ctx.beginPath(); ctx.moveTo(0, y + bh / 2); ctx.lineTo(W, y + bh / 2); ctx.stroke();
      for (const tr of bd.traces) {
        const a = sc[tr.key]; if (!a || !a.length) continue;
        ctx.strokeStyle = tr.colour; ctx.lineWidth = 1.4; ctx.beginPath();
        let first = true;
        for (let i = i0; i < a.length; i++) {
          const x = ((sc.t[i] - t0) / span) * W, v = (Math.min(hi, Math.max(lo, a[i])) - lo) / (hi - lo), yy = y + bh - 2 - v * (bh - 4);
          if (first) { ctx.moveTo(x, yy); first = false; } else ctx.lineTo(x, yy);
        }
        ctx.stroke();
      }
      ctx.fillStyle = muted; ctx.fillText(bd.unit === 'g' ? `tray load cell (up to ${hi.toFixed(0)} mg)` : bd.unit === 'beam' ? 'break-beam blocked fraction' : 'ports sealed', 5, y + 2);
      y += bh + pad;
    }
  };

  P.scopeLegend = function (el, vac) {
    const items = [['--c1', 'beam 1'], ['--c2', 'beam 2 (7 mm below)'], ['--c3', 'tray load cell']];
    if (vac) items.push(['--c6', 'vacuum sealed']);
    el.innerHTML = items.map(([c, t]) => `<span><i style="background:var(${c})"></i>${t}</span>`).join('');
  };
})(typeof window !== 'undefined' ? window : globalThis);
