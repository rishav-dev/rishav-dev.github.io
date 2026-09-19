(function () {
  const P = window.Prodose;
  const $ = (id) => document.getElementById(id);
  const { clamp } = P;

  const state = {
    design: 'wheel', preset: P.DEFAULT_PRESET,
    pill: { shape: 'round', L: 9.5, W: 9.5, color: 'orange' },
    bottle: { style: 'vial', D: 40, H: 92, mouth: 34, color: 'amber' },
    fill: 70, pocket: 'auto', scraper: 1.4, scraperAuto: true, wheelSpeed: 220, vibe: true, cap: true, armSpeed: 1.5, qty: 5, speed: 2,
  };

  let scene = null, renderer = null, rebuildTimer = 0, paused = false, lastHud = 0, logSeen = 0;

  function fillSelect(el, obj, labelFn) { el.innerHTML = ''; for (const k of Object.keys(obj)) { const o = document.createElement('option'); o.value = k; o.textContent = labelFn(obj[k], k); el.appendChild(o); } }
  fillSelect($('preset'), P.PRESETS, (v) => v.label);
  { const o = document.createElement('option'); o.value = 'custom'; o.textContent = 'Custom (sliders)'; $('preset').appendChild(o); }
  fillSelect($('shape'), P.SHAPES, (v) => v.label);
  fillSelect($('color'), P.COLORS, (v) => v.label);
  fillSelect($('bstyle'), P.BOTTLES, (v) => v.label);
  fillSelect($('bcolor'), P.BOTTLE_COLORS, (v) => v.label);
  $('pocket').innerHTML = '<option value="auto">Auto (best fit for pill)</option>' + Array.from({ length: 10 }, (_, i) => `<option value="${i + 1}">Setting ${i + 1} — ${P.SLOT_WIDTHS[i].toFixed(1)} mm slot</option>`).join('');

  const sliders = {
    L: [() => state.pill.L, (v) => { state.pill.L = v; }, (v) => v.toFixed(1) + ' mm'],
    W: [() => state.pill.W, (v) => { state.pill.W = v; }, (v) => v.toFixed(1) + ' mm'],
    D: [() => state.bottle.D, (v) => { state.bottle.D = v; }, (v) => v + ' mm'],
    H: [() => state.bottle.H, (v) => { state.bottle.H = v; }, (v) => v + ' mm'],
    mouth: [() => state.bottle.mouth, (v) => { state.bottle.mouth = v; }, (v) => v + ' mm'],
    fill: [() => state.fill, (v) => { state.fill = v; }, (v) => v + ' %'],
    wheelSpeed: [() => state.wheelSpeed, (v) => { state.wheelSpeed = v; }, (v) => v + ' °/s'],
    scraper: [() => state.scraper, (v) => { state.scraper = v; }, (v) => v.toFixed(1) + ' mm'],
    armSpeed: [() => state.armSpeed, (v) => { state.armSpeed = v; }, (v) => v.toFixed(1) + '×'],
  };

  function syncUI() {
    for (const [id, [get, , fmt]] of Object.entries(sliders)) { $(id).value = get(); $('o_' + id).textContent = fmt(+get()); }
    $('shape').value = state.pill.shape; $('color').value = state.pill.color;
    $('bstyle').value = state.bottle.style; $('bcolor').value = state.bottle.color;
    $('pocket').value = state.pocket; $('vibe').checked = state.vibe; $('cap').checked = state.cap; $('scraperAuto').checked = state.scraperAuto;
    $('scraper').disabled = state.scraperAuto; $('rowScraper').style.opacity = state.scraperAuto ? 0.45 : 1;
    $('preset').value = state.preset;
    $('speed').value = String(state.speed);
    $('qty').value = state.qty;
    const round = state.pill.shape === 'round';
    $('W').disabled = round; $('rowW').style.opacity = round ? 0.45 : 1;
    $('secWheel').style.display = state.design === 'wheel' ? '' : 'none';
    $('secArm').style.display = state.design === 'arm' ? '' : 'none';
    $('btnDock').textContent = state.design === 'wheel' ? 'Flip & dock bottle' : 'Dock bottle from below';
    document.querySelectorAll('#designTabs button').forEach((b) => b.classList.toggle('on', b.dataset.design === state.design));
  }

  function normalizeState() {
    const p = state.pill, b = state.bottle;
    p.L = clamp(p.L, 3, 32);
    if (p.shape === 'round') p.W = p.L;
    p.W = clamp(p.W, 2.5, Math.min(18, p.L));
    b.D = clamp(b.D, 25, 95);
    b.mouth = clamp(b.mouth, 14, Math.min(66, b.D - 5.6));
    b.H = clamp(b.H, 45, 200);
  }

  function onSlider(id) {
    const [, set] = sliders[id];
    set(+$(id).value);
    state.preset = 'custom';
    if (id === 'scraper') state.scraperAuto = false;
    if (id === 'L' && state.pill.shape === 'round') state.pill.W = state.pill.L;
    normalizeState(); syncUI(); scheduleRebuild();
  }
  for (const id of Object.keys(sliders)) $(id).addEventListener('input', () => onSlider(id));

  $('shape').addEventListener('change', () => {
    state.pill.shape = $('shape').value; state.preset = 'custom';
    const d = { round: 'orange', oval: 'white', caplet: 'white', capsule: 'duo', softgel: 'gold' }[state.pill.shape];
    if (d) state.pill.color = d;
    if (state.pill.shape === 'round') state.pill.W = state.pill.L;
    else if (state.pill.W > state.pill.L * 0.85) state.pill.W = +(state.pill.L * (state.pill.shape === 'softgel' ? 0.5 : 0.42)).toFixed(1);
    normalizeState(); syncUI(); scheduleRebuild();
  });
  $('color').addEventListener('change', () => { state.pill.color = $('color').value; scheduleRebuild(true); });
  $('bstyle').addEventListener('change', () => { state.bottle.style = $('bstyle').value; state.preset = 'custom'; scheduleRebuild(); });
  $('bcolor').addEventListener('change', () => { state.bottle.color = $('bcolor').value; scheduleRebuild(true); });
  $('pocket').addEventListener('change', () => { state.pocket = $('pocket').value; scheduleRebuild(); });
  $('vibe').addEventListener('change', () => { state.vibe = $('vibe').checked; scheduleRebuild(); });
  $('scraperAuto').addEventListener('change', () => { state.scraperAuto = $('scraperAuto').checked; syncUI(); scheduleRebuild(); });
  $('cap').addEventListener('change', () => { state.cap = $('cap').checked; scheduleRebuild(); });
  $('preset').addEventListener('change', () => { if ($('preset').value !== 'custom') applyPreset($('preset').value); });
  $('speed').addEventListener('change', () => { state.speed = +$('speed').value; });
  $('qty').addEventListener('input', () => { state.qty = clamp(Math.round(+$('qty').value || 1), 1, 30); });
  $('qMinus').addEventListener('click', () => { state.qty = clamp(state.qty - 1, 1, 30); $('qty').value = state.qty; });
  $('qPlus').addEventListener('click', () => { state.qty = clamp(state.qty + 1, 1, 30); $('qty').value = state.qty; });

  document.querySelectorAll('#designTabs button').forEach((b) => b.addEventListener('click', () => {
    if (state.design === b.dataset.design) return;
    state.design = b.dataset.design; syncUI(); rebuild();
  }));

  function applyPreset(key) {
    const pr = P.PRESETS[key]; if (!pr) return;
    state.preset = key;
    state.pill = { shape: pr.shape, L: pr.L, W: pr.W, color: pr.color };
    state.bottle = Object.assign({}, pr.bottle);
    state.fill = pr.fill; state.pocket = 'auto';
    normalizeState(); syncUI(); rebuild();
  }

  function scheduleRebuild(quick) { clearTimeout(rebuildTimer); rebuildTimer = setTimeout(rebuild, quick ? 30 : 220); }

  function buildParams() {
    return {
      design: state.design, seed: 11 + Math.round(state.pill.L * 3),
      pill: Object.assign({}, state.pill), bottle: Object.assign({}, state.bottle), fill: state.fill,
      pocket: state.pocket, scraper: state.scraperAuto ? 'auto' : state.scraper, wheelSpeed: state.wheelSpeed, vibe: state.vibe, cap: state.cap, armSpeed: state.armSpeed,
    };
  }

  // Rebuild the scene after a parameter change.
  function rebuild() {
    clearTimeout(rebuildTimer);
    $('loading').classList.add('on');
    setTimeout(() => {
      normalizeState();
      try { scene = new P.Scene(buildParams()); }
      catch (e) { console.error(e); $('statusText').textContent = 'Build error: ' + e.message; $('loading').classList.remove('on'); return; }
      renderer.base = null;
      logSeen = 0; $('log').innerHTML = '';
      scene.log(`Loaded ${P.SHAPES[scene.spec.shape].label.toLowerCase()} ${scene.spec.L.toFixed(1)} × ${scene.spec.W.toFixed(1)} mm — ${scene.pills.length} pills in the bottle.`, 'info');
      if (scene.fillReq > scene.pills.length + 1) scene.log(`Fill limited to ${scene.pills.length} pills (bottle capacity for this size).`, 'warn');
      renderCompat();
      $('loading').classList.remove('on');
      updateButtons(); updateHud(true);
    }, 30);
  }

  function renderCompat() {
    const ul = $('checks'); ul.innerHTML = '';
    const rows = scene.machine.compat().slice();
    const sp = scene.spec, g = scene.geo;
    if (sp.L > g.wi * 2 - 2) rows.push({ k: 'Bottle width', v: 'pill is longer than the bottle interior', ok: false });
    if (g.mouth < sp.W + 3) rows.push({ k: 'Mouth', v: 'pill cannot pass the bottle mouth', ok: false });
    for (const r of rows) {
      const li = document.createElement('li'); if (!r.ok) li.className = 'bad';
      li.innerHTML = `<div><b>${r.k}</b><span>${r.v}</span></div>`; ul.appendChild(li);
    }
  }

  $('btnDock').addEventListener('click', () => { if (scene) { scene.startDock(); updateButtons(); } });
  $('btnDispense').addEventListener('click', () => {
    if (!scene) return;
    const m = scene.machine;
    if (m.busy) return;
    if (m.state === 'error') { /* allow retry */ m.state = 'idle'; }
    scene.dispense(state.qty); updateButtons();
  });
  $('btnTake').addEventListener('click', () => { if (scene) scene.takeTray(); });
  $('btnPause').addEventListener('click', togglePause);
  $('btnLabels').addEventListener('click', () => { renderer.labels = !renderer.labels; $('btnLabels').classList.toggle('on', renderer.labels); });
  $('btnReset').addEventListener('click', rebuild);
  $('btnShare').addEventListener('click', () => {
    const h = '#' + btoa(unescape(encodeURIComponent(JSON.stringify(state))));
    history.replaceState(null, '', h);
    (navigator.clipboard ? navigator.clipboard.writeText(location.href) : Promise.reject()).then(() => flash($('btnShare'), 'Link copied ✓'), () => flash($('btnShare'), 'Link is in the address bar'));
  });
  function flash(el, txt) { const o = el.textContent; el.textContent = txt; setTimeout(() => (el.textContent = o), 1600); }
  function togglePause() { paused = !paused; $('btnPause').textContent = paused ? 'Resume' : 'Pause'; $('btnPause').classList.toggle('on', paused); }
  window.addEventListener('keydown', (e) => {
    if (/INPUT|SELECT|TEXTAREA/.test(e.target.tagName) && e.target.type !== 'range') return;
    if (e.code === 'Space') { e.preventDefault(); togglePause(); }
    else if (e.key === 'd') $('btnDock').click();
    else if (e.key === 'Enter') $('btnDispense').click();
  });

  function updateButtons() {
    if (!scene) return;
    const m = scene.machine;
    $('btnDock').disabled = scene.phase !== 'station';
    $('btnDispense').disabled = !!m.busy;
    $('btnDispense').textContent = scene.phase === 'docked' ? 'Dispense' : 'Dock & dispense';
  }

  // Canvas pan and zoom.
  function setupCanvas() {
    const cv = $('cv'); renderer = new P.Renderer(cv);
    const ro = new ResizeObserver(() => { renderer.resize(); if (renderer.base) { const sc = renderer.base.scene; renderer.fit(scene || sc); renderer.base.scene = scene; } });
    ro.observe(cv.parentElement);
    renderer.resize();
    let drag = null;
    cv.addEventListener('pointerdown', (e) => { drag = { x: e.clientX, y: e.clientY, px: renderer.view.panX, py: renderer.view.panY }; cv.setPointerCapture(e.pointerId); cv.classList.add('drag'); });
    cv.addEventListener('pointermove', (e) => { if (!drag) return; renderer.view.panX = drag.px + (e.clientX - drag.x); renderer.view.panY = drag.py + (e.clientY - drag.y); });
    const end = () => { drag = null; cv.classList.remove('drag'); };
    cv.addEventListener('pointerup', end); cv.addEventListener('pointercancel', end);
    cv.addEventListener('wheel', (e) => {
      e.preventDefault();
      const r = cv.getBoundingClientRect(), mx = e.clientX - r.left, my = e.clientY - r.top;
      const before = renderer.toWorld(mx, my);
      renderer.view.zoom = clamp(renderer.view.zoom * Math.exp(-e.deltaY * 0.0015), 0.4, 6);
      const after = renderer.toScreen(before.x, before.y);
      renderer.view.panX += mx - after.x; renderer.view.panY += my - after.y;
    }, { passive: false });
    cv.addEventListener('dblclick', () => renderer.resetView());
    $('btnLabels').classList.add('on');
  }

  const PHASES = {
    wheel: ['Load bottle', 'Screw on adapter cap', 'Flip & dock', 'Feed hopper', 'Sort & scrape', 'Release', 'Collect'],
    arm: ['Load bottle', 'Dock from below & seal', 'Vision scan', 'Vacuum pick', 'Transfer', 'Release', 'Collect'],
  };
  function phaseIndex() {
    const m = scene.machine, d = scene.design, s = m.state;
    if (scene.phase === 'station') return 0;
    if (scene.phase === 'docking') return d === 'wheel' ? 2 : 1;
    if (s === 'idle') return d === 'wheel' ? 3 : 2;
    if (s === 'done') return 6;
    if (d === 'wheel') { if (s === 'step') return 4; if (s === 'dwell') return m.gateOpen ? 5 : 4; if (s === 'unjam') return 4; return 3; }
    if (s === 'scan') return 2; if (['aim', 'descend', 'seal', 'retract'].includes(s)) return 3; if (['lift', 'turn', 'transfer'].includes(s)) return 4; if (s === 'release') return 5; if (s === 'return') return 6;
    return 2;
  }
  function renderPhases() {
    const list = PHASES[scene.design].slice(); const idx = phaseIndex();
    if (scene.design === 'wheel' && !scene.sealedCap) list[1] = 'No cap — bottle is open!';
    const ol = $('phases');
    const key = scene.design + (scene.sealedCap ? 'c' : 'o');
    if (ol.dataset.design !== key) { ol.dataset.design = key; ol.innerHTML = list.map((t) => `<li>${t}</li>`).join(''); }
    [...ol.children].forEach((li, i) => { li.className = i < idx ? 'done' : i === idx ? 'on' : ''; });
  }

  function setTile(id, v, level) { const t = $(id); t.classList.toggle('hot', level === 'hot' && v > 0); t.classList.toggle('warm', level === 'warm' && v > 0); }

  // Refresh status and result counters.
  function updateHud(force) {
    if (!scene) return;
    const st = scene.stats, m = scene.machine;
    renderPhases();
    $('statusText').textContent = scene.status;
    const dot = $('statusDot');
    const err = m.state === 'error';
    dot.className = 'dot ' + (err ? 'bad' : m.busy ? 'run' : m.state === 'done' ? 'ok' : '');
    const job = st.dispensed - (st.jobStart || 0), target = m.job || 0;
    $('sDispensed').textContent = st.dispensed; $('sTarget').textContent = st.target;
    const frac = st.target ? clamp(st.dispensed / st.target, 0, 1) : 0;
    const bf = $('barFill'); bf.style.width = (frac * 100).toFixed(0) + '%'; bf.className = err ? 'bad' : (st.target && st.dispensed >= st.target ? 'ok' : '');
    $('sCollected').textContent = st.collected; $('sBottle').textContent = st.inBottle; $('sMachine').textContent = st.inMachine;
    $('sTime').textContent = (st.elapsed / 1000).toFixed(1);
    $('sMiss').textContent = st.misses; $('sDbl').textContent = st.doubles; $('sJam').textContent = st.jams;
    $('sDmg').textContent = st.damaged; $('sStr').textContent = st.stressed; $('sSpill').textContent = st.spilled;
    setTile('tMiss', st.misses, 'warm'); setTile('tDbl', st.doubles, 'hot'); setTile('tJam', st.jams, 'warm'); setTile('tDmg', st.damaged, 'hot'); setTile('tStr', st.stressed, 'warm'); setTile('tSpill', st.spilled, 'hot');
    const ev = scene.events;
    if (ev.length && ev[ev.length - 1].id !== logSeen) {
      const ol = $('log'), frag = document.createDocumentFragment();
      for (const e of ev) if (e.id > logSeen) { const li = document.createElement('li'); li.className = e.level; li.innerHTML = `<time>${(e.t / 1000).toFixed(1)}s</time><span></span>`; li.lastChild.textContent = e.msg; frag.appendChild(li); }
      ol.appendChild(frag); logSeen = ev[ev.length - 1].id; ol.scrollTop = ol.scrollHeight;
      while (ol.children.length > 120) ol.removeChild(ol.firstChild);
    }
    updateButtons();
  }

  let last = performance.now(), acc = 0;
  // Main animation loop.
  function frame(now) {
    const dtReal = Math.min(50, now - last); last = now;
    if (scene && !paused) {
      acc += dtReal * state.speed;
      let steps = Math.min(Math.floor(acc / P.DT), 400); acc -= steps * P.DT;
      const t0 = performance.now();
      while (steps-- > 0) {
        scene.step(P.DT);
        if (performance.now() - t0 > 13) { acc = 0; break; } // never let physics starve rendering
      }
    }
    if (scene) {
      renderer.draw(scene);
      if (now - lastHud > 100) { lastHud = now; updateHud(); }
    }
    requestAnimationFrame(frame);
  }

  function loadHash() {
    try {
      if (location.hash.length > 8) { const s = JSON.parse(decodeURIComponent(escape(atob(location.hash.slice(1))))); Object.assign(state, s); return true; }
    } catch (e) { /* ignore bad links */ }
    return false;
  }
  setupCanvas();
  if (!loadHash()) applyPresetSilently(P.DEFAULT_PRESET);
  function applyPresetSilently(key) { const pr = P.PRESETS[key]; state.preset = key; state.pill = { shape: pr.shape, L: pr.L, W: pr.W, color: pr.color }; state.bottle = Object.assign({}, pr.bottle); state.fill = pr.fill; }
  normalizeState(); syncUI(); rebuild();
  requestAnimationFrame(frame);

  window.__prodose = { state, get scene() { return scene; }, renderer: () => renderer, rebuild, applyPreset };
})();
