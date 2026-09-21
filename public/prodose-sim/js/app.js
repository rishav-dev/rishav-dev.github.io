/* Prodose simulator, UI controller: concept tabs, sliders, presets, run loop, HUD. */
(function () {
  const P = window.Prodose;
  const $ = (id) => document.getElementById(id);
  const { clamp } = P;
  const Site = window.ProdoseSite;

  const DESIGN_LIST = Object.values(P.DESIGNS).sort((a, b) => a.order - b.order);
  const LETTER = { wheel: 'A', arm: 'B', shuttle: 'C', lane: 'D', belt: 'E', vacdisc: 'F' };
  const BLURB = {
    wheel: 'Inverted bottle over a rotating wheel with one slot per pill; a scraper strikes off extras and a trapdoor releases the pill. The reference design from the concept statement.',
    arm: 'Bottle docked from below in a sealed chamber; a vacuum-cup arm picks one pill and carries it to the outlet. The promising baseline, now a force-based suction model.',
    shuttle: 'A sliding plate with a pocket whose length and depth are adjustable. Compliant wiper lips strike off any second pill; the pocket carries one pill to the exit hole.',
    lane: 'The funnel feeds a sloped single-file lane. A rubber-faced clamp pad holds the queue while a trapdoor chamber releases the lead pill, no scraping of pills at all.',
    belt: 'No mechanical metering: a slow feed belt under a singulating roller, a light barrier and belt encoder count pills on the fly (pulse length ÷ pill length), and the feed stops at the dose while a fast belt flushes counted pills out.',
    vacdisc: 'A seed-meter style disc with suction ports around the rim. A knock-off wedge rejects any pill that is not sealed to a port; the vacuum is cut over the chute.',
  };
  const PHASES = {
    wheel: ['Load bottle', 'Screw on adapter cap', 'Flip & dock', 'Feed hopper', 'Sort & scrape', 'Release', 'Collect'],
    arm: ['Load bottle', 'Dock from below & seal', 'Vision scan', 'Vacuum pick', 'Transfer', 'Release', 'Collect'],
    shuttle: ['Load bottle', 'Flip & dock', 'Fill pocket', 'Wipe & shuttle', 'Drop through exit', 'Confirm & collect'],
    lane: ['Load bottle', 'Flip & dock', 'Queue in lane', 'Pad holds the queue', 'Trapdoor drop', 'Confirm & collect'],
    belt: ['Load bottle', 'Flip & dock', 'Singulate on feed belt', 'Count at belt end', 'Stop feed, flush', 'Confirm & collect'],
    vacdisc: ['Load bottle', 'Flip & dock', 'Pick up on ports', 'Wedge rejects extras', 'Release at chute', 'Confirm & collect'],
  };

  const state = {
    design: 'wheel', preset: P.DEFAULT_PRESET,
    pill: { shape: 'round', L: 9.5, W: 9.5, color: 'orange' },
    bottle: { style: 'vial', D: 40, H: 92, mouth: 34, color: 'amber' },
    fill: 70, pocket: 'auto', scraper: 1.4, scraperAuto: true, wheelSpeed: 220, vibe: true, cap: true, armSpeed: 1.5, qty: 5, speed: 2,
    pocketAuto: true, pocketLen: 12, pocketDepth: 8, compliantLip: true, shuttleSpeed: 260,
    laneAngle: 24, chamberAuto: true, chamberLen: 12,
    beltV1: 20, beltRatio: 5, beltSensing: 'width',
    vacuum: 25, portAuto: true, portDia: 3, discSpeed: 70,
    motorAuto: true, motorF: 8, motorT: 300,
  };

  let scene = null, renderer = null, rebuildTimer = 0, paused = false, lastHud = 0, logSeen = 0, lastScope = 0, tabs = null;

  // ---------------------------------------------------------------------------------------------
  //  Populate selects and concept tabs
  // ---------------------------------------------------------------------------------------------
  function fillSelect(el, obj, labelFn) { el.innerHTML = ''; for (const k of Object.keys(obj)) { const o = document.createElement('option'); o.value = k; o.textContent = labelFn(obj[k], k); el.appendChild(o); } }
  fillSelect($('preset'), P.PRESETS, (v) => v.label);
  { const o = document.createElement('option'); o.value = 'custom'; o.textContent = 'Custom (sliders)'; $('preset').appendChild(o); }
  fillSelect($('shape'), P.SHAPES, (v) => v.label);
  fillSelect($('color'), P.COLORS, (v) => v.label);
  fillSelect($('bstyle'), P.BOTTLES, (v) => v.label);
  fillSelect($('bcolor'), P.BOTTLE_COLORS, (v) => v.label);
  $('pocket').innerHTML = '<option value="auto">Auto (best fit for pill)</option>' + Array.from({ length: 10 }, (_, i) => `<option value="${i + 1}">Setting ${i + 1}, ${P.SLOT_WIDTHS[i].toFixed(1)} mm slot</option>`).join('');

  DESIGN_LIST.forEach((d, i) => {
    const b = document.createElement('button');
    b.type = 'button'; b.setAttribute('role', 'tab'); b.id = 'tab-' + d.key; b.dataset.tab = d.key; b.setAttribute('aria-selected', d.key === state.design); b.title = d.name;
    b.style.setProperty('--dot', `var(--c${i + 1})`);
    b.innerHTML = `<i>${LETTER[d.key] || i + 1}</i>${d.short}`;
    $('designTabs').appendChild(b);
  });

  // ---------------------------------------------------------------------------------------------
  //  State <-> UI
  // ---------------------------------------------------------------------------------------------
  const num = (k, unit, d) => [() => state[k], (v) => { state[k] = v; }, (v) => v.toFixed(d == null ? 0 : d) + (unit ? ' ' + unit : '')];
  const sliders = {
    L: [() => state.pill.L, (v) => { state.pill.L = v; }, (v) => v.toFixed(1) + ' mm'],
    W: [() => state.pill.W, (v) => { state.pill.W = v; }, (v) => v.toFixed(1) + ' mm'],
    D: [() => state.bottle.D, (v) => { state.bottle.D = v; }, (v) => v + ' mm'],
    H: [() => state.bottle.H, (v) => { state.bottle.H = v; }, (v) => v + ' mm'],
    mouth: [() => state.bottle.mouth, (v) => { state.bottle.mouth = v; }, (v) => v + ' mm'],
    fill: num('fill', '%'), wheelSpeed: num('wheelSpeed', '°/s'), scraper: num('scraper', 'mm', 1), armSpeed: num('armSpeed', '×', 1),
    pocketLen: num('pocketLen', 'mm', 1), pocketDepth: num('pocketDepth', 'mm', 1), shuttleSpeed: num('shuttleSpeed', 'mm/s'),
    laneAngle: num('laneAngle', '°'), chamberLen: num('chamberLen', 'mm', 1),
    beltV1: num('beltV1', 'mm/s'), beltRatio: num('beltRatio', '×', 1),
    vacuum: num('vacuum', 'kPa'), portDia: num('portDia', 'mm', 1), discSpeed: num('discSpeed', '°/s'),
    motorF: num('motorF', 'N', 1), motorT: num('motorT', 'N·mm'),
  };
  const checks = ['vibe', 'cap', 'scraperAuto', 'pocketAuto', 'compliantLip', 'chamberAuto', 'portAuto', 'motorAuto'];
  const selects = ['pocket', 'beltSensing'];

  function autoValues() {
    // show what "auto" resolves to so the sliders start from the real numbers
    if (!scene || !scene.machine) return {};
    const m = scene.machine, out = {};
    if (scene.design === 'shuttle') { out.pocketLen = m.Lp; out.pocketDepth = m.dp; out.motorF = m.motorF; }
    if (scene.design === 'lane') { out.chamberLen = m.Lc; out.motorF = m.motorF; }
    if (scene.design === 'vacdisc') { out.portDia = m.dPort; out.motorT = m.motorT; }
    if (scene.design === 'wheel') out.motorT = m.motorT;
    return out;
  }

  function syncUI() {
    for (const [id, [get, , fmt]] of Object.entries(sliders)) { const el = $(id); if (!el) continue; el.value = get(); $('o_' + id).textContent = fmt(+get()); }
    $('shape').value = state.pill.shape; $('color').value = state.pill.color;
    $('bstyle').value = state.bottle.style; $('bcolor').value = state.bottle.color;
    for (const c of checks) $(c).checked = !!state[c];
    for (const s of selects) $(s).value = state[s];
    $('scraper').disabled = state.scraperAuto; $('scraper').closest('.row').style.opacity = state.scraperAuto ? 0.45 : 1;
    for (const id of ['pocketLen', 'pocketDepth']) { $(id).disabled = state.pocketAuto; $(id).closest('.row').style.opacity = state.pocketAuto ? 0.45 : 1; }
    $('chamberLen').disabled = state.chamberAuto; $('chamberLen').closest('.row').style.opacity = state.chamberAuto ? 0.45 : 1;
    $('portDia').disabled = state.portAuto; $('portDia').closest('.row').style.opacity = state.portAuto ? 0.45 : 1;
    for (const id of ['motorF', 'motorT']) { $(id).disabled = state.motorAuto; $(id).closest('.row').style.opacity = state.motorAuto ? 0.45 : 1; }
    $('preset').value = state.preset; $('speed').value = String(state.speed); $('qty').value = state.qty;
    const round = state.pill.shape === 'round';
    $('W').disabled = round; $('rowW').style.opacity = round ? 0.45 : 1;
    document.querySelectorAll('[data-for]').forEach((el) => { el.hidden = !el.dataset.for.split(' ').includes(state.design); });
    $('btnDock').textContent = state.design === 'arm' ? 'Dock bottle from below' : 'Flip & dock bottle';
    tabs && tabs.select(state.design);
    const d = P.DESIGNS[state.design];
    $('blurb').innerHTML = `<b>${LETTER[d.key]} · ${d.name}.</b> ${BLURB[d.key]}`;
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

  // moving a slider that has an "auto" switch takes manual control, starting from the value auto resolved to
  const AUTO_OF = { scraper: 'scraperAuto', pocketLen: 'pocketAuto', pocketDepth: 'pocketAuto', chamberLen: 'chamberAuto', portDia: 'portAuto', motorF: 'motorAuto', motorT: 'motorAuto' };
  function onSlider(id) {
    const [, set] = sliders[id];
    set(+$(id).value);
    if (!['fill', 'wheelSpeed', 'armSpeed', 'shuttleSpeed', 'beltV1', 'beltRatio', 'vacuum', 'discSpeed', 'laneAngle', 'scraper'].includes(id) && ['L', 'W', 'D', 'H', 'mouth'].includes(id)) state.preset = 'custom';
    if (id === 'L' && state.pill.shape === 'round') state.pill.W = state.pill.L;
    normalizeState(); syncUI(); scheduleRebuild();
  }
  for (const id of Object.keys(sliders)) $(id).addEventListener('input', () => onSlider(id));
  for (const [id, autoKey] of Object.entries(AUTO_OF)) $(id).addEventListener('pointerdown', () => { /* disabled inputs do not fire */ });

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
  $('beltSensing').addEventListener('change', () => { state.beltSensing = $('beltSensing').value; scheduleRebuild(); });
  for (const c of checks) $(c).addEventListener('change', () => {
    const on = $(c).checked, was = state[c]; state[c] = on;
    if (was && !on) { // leaving auto: seed the manual slider with what auto resolved to
      const av = autoValues();
      for (const [k, a] of Object.entries(AUTO_OF)) if (a === c && av[k] != null) state[k] = clamp(+av[k], +$(k).min, +$(k).max);
    }
    syncUI(); scheduleRebuild();
  });
  $('preset').addEventListener('change', () => { if ($('preset').value !== 'custom') applyPreset($('preset').value); });
  $('speed').addEventListener('change', () => { state.speed = +$('speed').value; });
  $('qty').addEventListener('input', () => { state.qty = clamp(Math.round(+$('qty').value || 1), 1, 30); });
  $('qMinus').addEventListener('click', () => { state.qty = clamp(state.qty - 1, 1, 30); $('qty').value = state.qty; });
  $('qPlus').addEventListener('click', () => { state.qty = clamp(state.qty + 1, 1, 30); $('qty').value = state.qty; });

  tabs = Site.tabs($('designTabs'), (key) => {
    if (state.design === key) return;
    state.design = key; syncUI(); rebuild();
  });

  function applyPreset(key) {
    const pr = P.PRESETS[key]; if (!pr) return;
    state.preset = key;
    state.pill = { shape: pr.shape, L: pr.L, W: pr.W, color: pr.color };
    state.bottle = Object.assign({}, pr.bottle);
    state.fill = pr.fill; state.pocket = 'auto';
    state.pocketAuto = state.chamberAuto = state.portAuto = state.motorAuto = state.scraperAuto = true;
    normalizeState(); syncUI(); rebuild();
  }

  // ---------------------------------------------------------------------------------------------
  //  Scene lifecycle
  // ---------------------------------------------------------------------------------------------
  function scheduleRebuild(quick) { clearTimeout(rebuildTimer); rebuildTimer = setTimeout(rebuild, quick ? 30 : 220); }

  function buildParams() {
    const s = state;
    return {
      design: s.design, seed: 11 + Math.round(s.pill.L * 3),
      pill: Object.assign({}, s.pill), bottle: Object.assign({}, s.bottle), fill: s.fill,
      pocket: s.pocket, scraper: s.scraperAuto ? 'auto' : s.scraper, wheelSpeed: s.wheelSpeed, vibe: s.vibe, cap: s.cap, armSpeed: s.armSpeed,
      pocketAuto: s.pocketAuto, pocketLen: s.pocketLen, pocketDepth: s.pocketDepth, compliantLip: s.compliantLip, shuttleSpeed: s.shuttleSpeed,
      laneAngle: s.laneAngle, chamberAuto: s.chamberAuto, chamberLen: s.chamberLen,
      beltV1: s.beltV1, beltRatio: s.beltRatio, beltSensing: s.beltSensing,
      vacuum: s.vacuum, portDia: s.portAuto ? undefined : s.portDia, discSpeed: s.discSpeed,
      motorF: s.motorAuto ? undefined : s.motorF, motorT: s.motorAuto ? undefined : s.motorT,
    };
  }

  function rebuild() {
    clearTimeout(rebuildTimer);
    $('loading').classList.add('on');
    setTimeout(() => {
      normalizeState();
      try { scene = new P.Scene(buildParams()); }
      catch (e) { console.error(e); $('statusText').textContent = 'Build error: ' + e.message; $('loading').classList.remove('on'); return; }
      renderer.base = null;
      logSeen = 0; $('log').innerHTML = '';
      scene.log(`Loaded ${P.SHAPES[scene.spec.shape].label.toLowerCase()} ${scene.spec.L.toFixed(1)} × ${scene.spec.W.toFixed(1)} mm, ${scene.pills.length} pills in the bottle.`, 'info');
      if (scene.fillReq > scene.pills.length + 1) scene.log(`Fill limited to ${scene.pills.length} pills (bottle capacity for this size).`, 'warn');
      renderCompat();
      P.scopeLegend($('scopeLegend'), scene.design === 'vacdisc' || scene.design === 'arm');
      $('loading').classList.remove('on');
      updateButtons(); updateHud(true);
      window.dispatchEvent(new CustomEvent('prodose:rebuilt'));
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
      const d = document.createElement('div'), b = document.createElement('b'), s = document.createElement('span');
      b.textContent = r.k; s.textContent = r.v; d.append(b, s); li.appendChild(d); ul.appendChild(li);
    }
  }

  // ---------------------------------------------------------------------------------------------
  //  Buttons
  // ---------------------------------------------------------------------------------------------
  $('btnDock').addEventListener('click', () => { if (scene) { scene.startDock(); updateButtons(); } });
  $('btnDispense').addEventListener('click', () => {
    if (!scene) return;
    const m = scene.machine;
    if (m.busy) return;
    if (m.state === 'error') m.state = 'idle';
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

  // ---------------------------------------------------------------------------------------------
  //  Canvas interaction (pan / zoom)
  // ---------------------------------------------------------------------------------------------
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

  // ---------------------------------------------------------------------------------------------
  //  HUD
  // ---------------------------------------------------------------------------------------------
  function phaseIndex() {
    const m = scene.machine, d = scene.design, s = m.state;
    if (scene.phase === 'station') return 0;
    if (scene.phase === 'docking') return d === 'wheel' || d === 'arm' ? (d === 'wheel' ? 2 : 1) : 1;
    if (s === 'done') return PHASES[d].length - 1;
    if (d === 'wheel') { if (s === 'idle') return 3; if (s === 'step') return 4; if (s === 'dwell') return m.gateOpen ? 5 : 4; if (s === 'unjam') return 4; return 3; }
    if (d === 'arm') { if (s === 'idle') return 2; if (s === 'scan') return 2; if (['aim', 'descend', 'seal', 'retract'].includes(s)) return 3; if (['lift', 'turn', 'transfer'].includes(s)) return 4; if (s === 'release') return 5; if (s === 'return') return 6; return 2; }
    if (s === 'idle') return 2;
    const map = {
      shuttle: { fill: 2, stroke: 3, release: 4, return: 5, unjam: 3, reseat: 2 },
      lane: { fill: 2, separate: 3, open: 4, close: 4, raise: 5, unjam: 3 },
      belt: { run: 3, agitate: 3, stop: 4 },
      vacdisc: { run: 3, stop: 4, unjam: 3 },
    };
    const v = (map[d] || {})[s];
    if (d === 'belt' && s === 'run' && m.inPulse) return 3;
    if (d === 'vacdisc' && s === 'run' && m.sensorBlocked) return 4;
    return v == null ? 2 : v;
  }
  function renderPhases() {
    const list = PHASES[scene.design].slice(); const idx = phaseIndex();
    if (scene.design !== 'arm' && !scene.sealedCap) list[1] = 'No cap, bottle is open!';
    const ol = $('phases');
    const key = scene.design + (scene.sealedCap ? 'c' : 'o');
    if (ol.dataset.design !== key) { ol.dataset.design = key; ol.innerHTML = list.map((t) => `<li>${t}</li>`).join(''); }
    [...ol.children].forEach((li, i) => { li.className = i < idx ? 'done' : i === idx ? 'on' : ''; });
  }

  function setTile(id, v, level) { const t = $(id); t.classList.toggle('hot', level === 'hot' && v > 0); t.classList.toggle('warm', level === 'warm' && v > 0); }

  function updateHud(force) {
    if (!scene) return;
    const st = scene.stats, m = scene.machine;
    renderPhases();
    $('statusText').textContent = scene.status;
    const dot = $('statusDot');
    const err = m.state === 'error';
    dot.className = 'dot ' + (err ? 'bad' : m.busy ? 'run' : m.state === 'done' ? 'ok' : '');
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
      for (const e of ev) if (e.id > logSeen) { const li = document.createElement('li'); li.className = e.level; const t = document.createElement('time'); t.textContent = (e.t / 1000).toFixed(1) + 's'; const sp = document.createElement('span'); sp.textContent = e.msg; li.append(t, sp); frag.appendChild(li); }
      ol.appendChild(frag); logSeen = ev[ev.length - 1].id; ol.scrollTop = ol.scrollHeight;
      while (ol.children.length > 120) ol.removeChild(ol.firstChild);
    }
    updateButtons();
  }

  // ---------------------------------------------------------------------------------------------
  //  Main loop
  // ---------------------------------------------------------------------------------------------
  let last = performance.now(), acc = 0;
  function frame(now) {
    const dtReal = Math.min(50, now - last); last = now;
    if (scene && !paused) {
      acc += dtReal * state.speed;
      let steps = Math.min(Math.floor(acc / P.DT), 400); acc -= steps * P.DT;
      const t0 = performance.now();
      while (steps-- > 0) {
        scene.step(P.DT);
        if (performance.now() - t0 > 13) { acc = 0; break; }
      }
    }
    if (scene) {
      renderer.draw(scene);
      if (now - lastHud > 100) { lastHud = now; updateHud(); }
      if (now - lastScope > 80) { lastScope = now; P.drawScope($('scope'), scene, { vac: scene.design === 'vacdisc' || scene.design === 'arm' }); }
    }
    requestAnimationFrame(frame);
  }
  document.addEventListener('themechange', () => { if (scene) P.drawScope($('scope'), scene, { vac: scene.design === 'vacdisc' || scene.design === 'arm' }); });

  // ---------------------------------------------------------------------------------------------
  //  Boot: shared #link, or ?design=…&preset=… deep link (used by the bench pages)
  // ---------------------------------------------------------------------------------------------
  function loadHash() {
    try {
      if (location.hash.length > 8) { const s = JSON.parse(decodeURIComponent(escape(atob(location.hash.slice(1))))); Object.assign(state, s); return true; }
    } catch (e) { /* ignore bad links */ }
    return false;
  }
  function loadQuery() {
    const q = new URLSearchParams(location.search); let hit = false;
    if (q.get('preset') && P.PRESETS[q.get('preset')]) { applyPresetSilently(q.get('preset')); hit = true; }
    if (q.get('design') && P.DESIGNS[q.get('design')]) { state.design = q.get('design'); hit = true; }
    if (q.get('L')) { state.pill.L = +q.get('L'); state.preset = 'custom'; hit = true; }
    if (q.get('W')) { state.pill.W = +q.get('W'); hit = true; }
    if (q.get('shape') && P.SHAPES[q.get('shape')]) { state.pill.shape = q.get('shape'); hit = true; }
    return hit;
  }
  function applyPresetSilently(key) { const pr = P.PRESETS[key]; state.preset = key; state.pill = { shape: pr.shape, L: pr.L, W: pr.W, color: pr.color }; state.bottle = Object.assign({}, pr.bottle); state.fill = pr.fill; }
  setupCanvas();
  if (!loadHash()) applyPresetSilently(P.DEFAULT_PRESET);
  loadQuery();
  if (!P.DESIGNS[state.design]) state.design = 'wheel';
  normalizeState(); syncUI(); rebuild();
  requestAnimationFrame(frame);

  window.__prodose = { state, get scene() { return scene; }, renderer: () => renderer, rebuild, applyPreset };
})();
