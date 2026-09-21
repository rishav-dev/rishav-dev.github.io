(function () {
  const $ = (id) => document.getElementById(id), P = window.Prodose;
  let chart = null;
  const fmt = (v) => (Math.abs(v) >= 1000 || (Math.abs(v) < 0.01 && v !== 0) ? v.toExponential(2) : String(+v.toPrecision(5)));
  function run() {
    $('summary').textContent = 'running…';
    setTimeout(() => {
      const res = P.runValidation(), pass = res.filter((r) => r.pass).length, known = res.filter((r) => !r.pass && r.known).length, bad = res.length - pass - known;
      $('summary').className = 'chip ' + (bad ? 'pill-bad' : 'pill-ok'); $('summary').textContent = `${pass} of ${res.length} pass` + (known ? ` · ${known} documented limitation` : '') + (bad ? ` · ${bad} FAIL` : '');
      const used = (r) => (r.tol > 0 ? Math.min(1.5, r.err / r.tol) : 0);
      const spec = {
        type: 'bars', title: 'Error as a share of each test’s tolerance', sub: 'bars ending left of the dashed line pass', domain: [0, 1.5], ticks: [0, 0.5, 1, 1.5], fmtTick: (v) => Math.round(v * 100) + '%', fmt: (v) => Math.round(v * 100) + '%', ref: { value: 1, label: 'tolerance' }, rowH: 28, metric: 'of tolerance',
        items: res.map((r, i) => ({ key: 't' + i, label: r.name, value: used(r), color: r.pass ? 'var(--c3)' : r.known ? 'var(--warning)' : 'var(--critical)', badge: r.pass ? '✓' : r.known ? 'known limit' : '✗', tip: [['expected', `${fmt(r.expected)} ${r.unit}`], ['measured', `${fmt(r.measured)} ${r.unit}`], ['error', r.absolute ? `${r.err.toFixed(3)} ${r.unit}` : (r.err * 100).toFixed(2) + ' %'], ['limit', r.absolute ? `${r.tol} ${r.unit}` : (r.tol * 100).toFixed(0) + ' %']] })),
        table: { cols: ['Test', 'Expected', 'Measured', 'Error', 'Limit', 'Result'], rows: res.map((r) => [r.name, `${fmt(r.expected)} ${r.unit}`, `${fmt(r.measured)} ${r.unit}`, r.absolute ? r.err.toFixed(3) + ' ' + r.unit : (r.err * 100).toFixed(2) + ' %', r.absolute ? r.tol + ' ' + r.unit : (r.tol * 100).toFixed(0) + ' %', r.pass ? 'pass' : r.known ? 'known limitation' : 'FAIL']) },
      };
      if (chart) chart.update(spec); else { chart = Charts.mount($('chErr'), spec); }
      $('tbl').innerHTML = `<thead><tr><th>Test</th><th>Setup</th><th class="num">Expected</th><th class="num">Measured</th><th class="num">Error</th><th class="num">Limit</th><th>Result</th></tr></thead><tbody>${res.map((r) => `<tr><td><b>${Charts.esc(r.name)}</b></td><td class="wrap">${Charts.esc(r.what)}${r.extra ? ` <span style="color:var(--muted)">- ${Charts.esc(r.extra)}</span>` : ''}</td><td class="num">${fmt(r.expected)} ${r.unit}</td><td class="num">${fmt(r.measured)} ${r.unit}</td><td class="num">${r.absolute ? r.err.toFixed(3) + ' ' + r.unit : (r.err * 100).toFixed(2) + ' %'}</td><td class="num">${r.absolute ? r.tol + ' ' + r.unit : (r.tol * 100).toFixed(0) + ' %'}</td><td><span class="chip ${r.pass ? 'pill-ok' : r.known ? 'pill-warn' : 'pill-bad'}">${r.pass ? '✓ pass' : r.known ? '! known limitation' : '✗ FAIL'}</span></td></tr>`).join('')}</tbody>`;
    }, 30);
  }
  $('rerun').addEventListener('click', run); run();
})();
