/* Prodose, renderer extensions for the concepts built on InvertedBase (shuttle, lane, belt, vacuum disc).
 * Everything is drawn from the live physics bodies, so what you see is exactly what is being simulated. */
(function (G) {
  const P = (G.Prodose = G.Prodose || {});
  const R = P.Renderer.prototype;
  const DEG = Math.PI / 180;

  const STYLE = {
    housing: { fill: '#b9bfc8', edge: '#7f8791' }, roof: { fill: '#e4e7ec', edge: '#aeb5bf' }, chamber: { fill: '#8e959f', edge: '#59606b' },
    base: { fill: '#9aa1ab', edge: '#5f6670' }, lane: { fill: '#a7aeb8', edge: '#606874' }, meter: { fill: '#59606b', edge: '#2f333a' },
    gate: { fill: '#59606b', edge: '#2f333a' }, belt: { fill: '#30333a', edge: '#171a1f' }, disc: { fill: '#3d4047', edge: '#22252a' },
    lip: { fill: '#e8865b', edge: '#a8481f' }, ramp: { fill: '#eef0f3', edge: '#a7aeb8' }, chute: { fill: '#eef0f3', edge: '#a7aeb8' },
    tray: { fill: '#eef0f3', edge: '#a7aeb8' }, shutter: { fill: '#6b7280', edge: '#3a3f47' },
  };
  const SKIP = { table: 1, bottle: 1, cap: 1, shutter: 1 };

  function partsOf(body) { return body.parts.length > 1 ? body.parts.slice(1) : body.parts; }

  R.drawBodySet = function (bodies, labels, invert) {
    const ctx = this.ctx, px = this.px;
    for (const b of bodies) {
      for (const part of partsOf(b)) {
        const lab = part.label && STYLE[part.label] ? part.label : (b.label && STYLE[b.label] ? b.label : null);
        if (!lab || SKIP[lab]) continue;
        const inSet = labels ? labels.includes(lab) : true;
        if (invert ? inSet : !inSet) continue;
        const st = STYLE[lab], v = part.vertices;
        ctx.beginPath(); ctx.moveTo(v[0].x, v[0].y); for (let i = 1; i < v.length; i++) ctx.lineTo(v[i].x, v[i].y); ctx.closePath();
        ctx.fillStyle = st.fill; ctx.fill(); ctx.lineWidth = 0.9 * px; ctx.strokeStyle = st.edge; ctx.stroke();
      }
    }
  };

  R.drawInvertedBack = function (scene) {
    const ctx = this.ctx, m = scene.machine, px = this.px;
    // casing behind the mechanism
    const z = m.zones[0];
    if (z) {
      const x0 = z.x0 - 14, x1 = z.x1 + 14, y0 = m.roofY + 8, y1 = z.y1 + 16;
      const g = ctx.createLinearGradient(x0, 0, x1, 0); g.addColorStop(0, '#eceef2'); g.addColorStop(0.5, '#fff'); g.addColorStop(1, '#e3e6eb');
      ctx.fillStyle = g; ctx.strokeStyle = '#b9c0c9'; ctx.lineWidth = 1.4 * px;
      const r = 14; ctx.beginPath(); ctx.moveTo(x0 + r, y0); ctx.arcTo(x1, y0, x1, y1, r); ctx.arcTo(x1, y1, x0, y1, r); ctx.arcTo(x0, y1, x0, y0, r); ctx.arcTo(x0, y0, x1, y0, r); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = 'rgba(203,209,218,0.85)'; ctx.fillRect(x0 + 8, y0 + 6, x1 - x0 - 16, y1 - y0 - 12);
    }
    const dyn = m.drawBodies();
    this.drawBodySet(dyn, ['housing', 'lip'], true);          // everything except the funnel walls and lips goes behind the pills
    const fn = P.DRAWERS && P.DRAWERS[scene.design];
    if (fn && fn.back) fn.back(this, scene);
  };

  R.drawInvertedFront = function (scene) {
    const ctx = this.ctx, m = scene.machine, px = this.px;
    this.drawBodySet(m.drawBodies(), ['housing', 'lip'], false);
    // exit chute / tray / sensor
    this.drawTray(m.tray, scene);
    const bm = m.beam;
    if (bm) {
      ctx.fillStyle = '#2c2f36'; ctx.fillRect(bm.x0 - 9, bm.y - 4, 8, 8); ctx.fillRect(bm.x1 + 1, bm.y - 4, 8, 8);
      const on = m.sensorBlocked;
      ctx.strokeStyle = on ? '#ff6a5e' : 'rgba(255,59,48,0.85)'; ctx.lineWidth = (on ? 2.2 : 1.1) * px; ctx.shadowColor = '#ff3b30'; ctx.shadowBlur = on ? 10 : 4;
      ctx.beginPath(); ctx.moveTo(bm.x0, bm.y); ctx.lineTo(bm.x1, bm.y); ctx.stroke();
      ctx.strokeStyle = 'rgba(255,59,48,0.45)'; ctx.lineWidth = px; ctx.beginPath(); ctx.moveTo(bm.x0, bm.y2); ctx.lineTo(bm.x1, bm.y2); ctx.stroke(); ctx.shadowBlur = 0;
    }
    // adapter interface ring at the roof
    const g = scene.geo, ry = m.roofY, wo = g.wn + 14;
    const ig = ctx.createLinearGradient(-wo, 0, wo, 0); ig.addColorStop(0, '#d9dde3'); ig.addColorStop(0.5, '#fff'); ig.addColorStop(1, '#cfd4db');
    ctx.fillStyle = ig; ctx.strokeStyle = '#8f97a3'; ctx.lineWidth = px * 1.2;
    ctx.beginPath(); ctx.roundRect(-wo, ry, wo * 2, 12, 3); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = '#59606b'; ctx.lineWidth = px * 1.3; const ax = wo - 5;
    ctx.beginPath(); ctx.moveTo(-ax, ry + 6); ctx.lineTo(ax, ry + 6); ctx.moveTo(-ax, ry + 6); ctx.lineTo(-ax + 3, ry + 3.5); ctx.moveTo(-ax, ry + 6); ctx.lineTo(-ax + 3, ry + 8.5);
    ctx.moveTo(ax, ry + 6); ctx.lineTo(ax - 3, ry + 3.5); ctx.moveTo(ax, ry + 6); ctx.lineTo(ax - 3, ry + 8.5); ctx.stroke();
    if (m.jamFlash > 0) { ctx.strokeStyle = `rgba(217,54,54,${Math.min(1, m.jamFlash / 500)})`; ctx.lineWidth = 3 * px; ctx.strokeRect((z0(m).x0), z0(m).y0, z0(m).x1 - z0(m).x0, z0(m).y1 - z0(m).y0); }
    const fn = P.DRAWERS && P.DRAWERS[scene.design];
    if (fn && fn.front) fn.front(this, scene);
  };
  function z0(m) { return m.zones[0] || { x0: 0, y0: 0, x1: 0, y1: 0 }; }

  // ---------------------------------------------------------------------------------------------------
  //  concept-specific decoration
  // ---------------------------------------------------------------------------------------------------
  P.DRAWERS = {
    shuttle: {
      front(r, scene) {
        const ctx = r.ctx, m = scene.machine, px = r.px;
        // stroke ruler + pocket outline
        const s = m.act.s;
        ctx.strokeStyle = 'rgba(47,109,246,0.75)'; ctx.lineWidth = 1.1 * px; ctx.setLineDash([2 * px, 2 * px]);
        ctx.strokeRect(s - m.Lp / 2, 0, m.Lp, m.dp); ctx.setLineDash([]);
        ctx.fillStyle = 'rgba(47,109,246,0.9)'; ctx.font = `${6}px system-ui`; ctx.textAlign = 'center';
        ctx.fillText(`${m.Lp.toFixed(1)}×${m.dp.toFixed(1)}`, s, m.dp + 8.5);
        // exit hole marker
        ctx.strokeStyle = 'rgba(0,0,0,0.35)'; ctx.setLineDash([1.5 * px, 1.5 * px]);
        ctx.beginPath(); ctx.moveTo(m.stroke - m.Lh / 2, m.dp + 9); ctx.lineTo(m.stroke + m.Lh / 2, m.dp + 9); ctx.stroke(); ctx.setLineDash([]);
      },
    },
    lane: {
      front(r, scene) {
        const ctx = r.ctx, m = scene.machine, px = r.px;
        // slope arrow along the lane
        const a = m.W(m.ol + 6, m.h + 9), b = m.W(m.ol + 22, m.h + 9);
        ctx.strokeStyle = 'rgba(47,109,246,0.8)'; ctx.lineWidth = 1.2 * px; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(b.x, b.y); ctx.lineTo(b.x - 3 * Math.cos(m.beta - 0.5), b.y - 3 * Math.sin(m.beta - 0.5)); ctx.moveTo(b.x, b.y); ctx.lineTo(b.x - 3 * Math.cos(m.beta + 0.5), b.y - 3 * Math.sin(m.beta + 0.5)); ctx.stroke();
      },
    },
    belt: {
      back(r, scene) {
        const ctx = r.ctx, m = scene.machine, px = r.px, bx = m.beltX;
        // moving tread marks on both belts, roller with spokes
        const tread = (x0, x1, ph) => { ctx.strokeStyle = 'rgba(255,255,255,0.25)'; ctx.lineWidth = 1 * px; const pitch = 6; for (let x = x0 + (((ph % pitch) + pitch) % pitch); x < x1; x += pitch) { ctx.beginPath(); ctx.moveTo(x, 1); ctx.lineTo(x, 7); ctx.stroke(); } };
        tread(bx.xa + 2, bx.xb - 2, m.phase1); tread(bx.xc + 2, bx.xd - 2, m.phase2);
        // belt end pulleys
        ctx.fillStyle = '#4c515b'; for (const x of [bx.xa, bx.xb, bx.xc, bx.xd]) { ctx.beginPath(); ctx.arc(x, 4, 4.4, 0, 7); ctx.fill(); }
        // singulating roller
        const c = m.rollerC, rr = m.rR, ph = m.rollerPhase || 0;
        ctx.save(); ctx.translate(c.x, c.y); ctx.rotate(ph);
        const g = ctx.createRadialGradient(-2, -2, 1, 0, 0, rr); g.addColorStop(0, '#8c929c'); g.addColorStop(1, '#4a4f58');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, rr, 0, 7); ctx.fill(); ctx.strokeStyle = '#2b2e34'; ctx.lineWidth = px; ctx.stroke();
        ctx.strokeStyle = 'rgba(255,255,255,0.4)'; for (let i = 0; i < 6; i++) { ctx.rotate(Math.PI / 3); ctx.beginPath(); ctx.moveTo(1.5, 0); ctx.lineTo(rr - 1, 0); ctx.stroke(); }
        ctx.restore();
      },
    },
    vacdisc: {
      back(r, scene) {
        const ctx = r.ctx, m = scene.machine, px = r.px, C = m.C, Rd = m.Rd, phi = m.rotor.angle;
        // disc face, spokes, hub
        const g = ctx.createRadialGradient(C.x, C.y, 5, C.x, C.y, Rd); g.addColorStop(0, '#5a5e66'); g.addColorStop(0.8, '#3a3d43'); g.addColorStop(1, '#2b2d32');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(C.x, C.y, Rd, 0, 7); ctx.fill();
        ctx.save(); ctx.translate(C.x, C.y); ctx.rotate(phi); ctx.fillStyle = 'rgba(0,0,0,0.22)';
        for (let k = 0; k < m.N; k++) { ctx.save(); ctx.rotate((k + 0.5) * m.dA); ctx.beginPath(); ctx.ellipse(Rd * 0.55, 0, Rd * 0.17, Rd * 0.05, 0, 0, 7); ctx.fill(); ctx.restore(); }
        // suction ports on the rim
        for (let k = 0; k < m.N; k++) {
          ctx.save(); ctx.rotate(k * m.dA);
          const held = m.portHold[k] > 0.25, active = m.portF[k] > 0;
          ctx.fillStyle = held ? '#4d9bff' : '#aab1bb'; ctx.strokeStyle = held ? '#1f5fbf' : '#555b64'; ctx.lineWidth = 0.9 * px;
          ctx.beginPath(); ctx.roundRect(Rd - 3.2, -m.dPort / 2, 3.4, m.dPort, 1); ctx.fill(); ctx.stroke();
          ctx.restore();
        }
        ctx.restore();
        const hg = ctx.createRadialGradient(C.x - 3, C.y - 3, 1, C.x, C.y, 12); hg.addColorStop(0, '#f2f3f5'); hg.addColorStop(1, '#8b9099');
        ctx.fillStyle = hg; ctx.beginPath(); ctx.arc(C.x, C.y, 11, 0, 7); ctx.fill(); ctx.strokeStyle = '#3a3d43'; ctx.lineWidth = px; ctx.stroke();
        // vacuum zone arc
        ctx.strokeStyle = 'rgba(47,109,246,0.35)'; ctx.lineWidth = 2.2 * px; ctx.beginPath(); ctx.arc(C.x, C.y, Rd + 3.4, m.aOn, m.aRelease); ctx.stroke();
        ctx.fillStyle = 'rgba(47,109,246,0.9)'; ctx.font = '5.5px system-ui'; ctx.textAlign = 'center';
        const lp = { x: C.x + (Rd + 12) * Math.cos(m.aOn - 0.28), y: C.y + (Rd + 12) * Math.sin(m.aOn - 0.28) }; ctx.fillText(`−${m.vacKPa.toFixed(0)} kPa`, lp.x, lp.y);
      },
    },
  };

  // generic dispatcher hook used by Renderer.draw
  R.drawMachineBack = function (scene) { if (scene.design === 'wheel') this.drawWheelMachineBack(scene); else if (scene.design === 'arm') this.drawArmMachineBack(scene); else this.drawInvertedBack(scene); };
  R.drawMachineFront = function (scene) { if (scene.design === 'wheel') this.drawWheelMachineFront(scene); else if (scene.design === 'arm') this.drawArmMachineFront(scene); else this.drawInvertedFront(scene); };

  // ---------------------------------------------------------------------------------------------------
  //  labels for the new concepts (screen-space callouts)
  // ---------------------------------------------------------------------------------------------------
  P.conceptLabels = function (scene) {
    const m = scene.machine, g = scene.geo, L = [];
    const iface = { t: 'Adjustable airtight bottle interface', p: { x: m.wn + 18, y: m.roofY + 6 }, d: [56, -30] };
    const tray = { t: 'Collection tray', p: { x: m.tray.xr - 20, y: m.tray.yFloor - 4 }, d: [30, 30] };
    if (scene.design === 'shuttle') L.push(iface, { t: 'Compliant wiper lips (silicone)', p: { x: m.ow, y: -m.gap - 1.5 }, d: [74, -4] }, { t: `Adjustable pocket ${m.Lp.toFixed(1)}×${m.dp.toFixed(1)} mm`, p: { x: m.act.s, y: m.dp / 2 }, d: [-50, -36], w: true }, { t: 'Shuttle slide (force-limited servo)', p: { x: m.plateX.xr - 20, y: m.dp / 2 }, d: [30, -64] }, { t: 'Exit hole', p: { x: m.stroke, y: m.dp + 8 }, d: [56, 26] }, { t: 'Break-beam sensors', p: { x: m.beam.x0, y: m.beam.y }, d: [-40, 44], w: true }, tray);
    else if (scene.design === 'lane') L.push(iface, { t: 'Single-file lane (height ≈ pill thickness)', p: m.W(m.ol + 25, m.h), d: [70, -46] }, { t: 'Clamp pad (holds the queue)', p: { x: m.wedge.body.position.x, y: m.wedge.body.position.y }, d: [64, -14] }, { t: 'Trapdoor chamber', p: m.W(m.uEnd - m.Lc / 2, -2), d: [64, 20] }, { t: 'Break-beam sensors', p: { x: m.beam.x0, y: m.beam.y }, d: [-40, 44], w: true }, tray);
    else if (scene.design === 'belt') L.push(iface, { t: 'Singulating roller', p: m.rollerC, d: [60, -40] }, { t: 'Feed belt (slow)', p: { x: 40, y: 2 }, d: [-20, 56], w: true }, { t: 'Spacing belt (fast)', p: { x: 140, y: 2 }, d: [10, 60] }, { t: 'Counting barrier + belt encoder', p: { x: m.sensX, y: -m.h / 2 }, d: [-50, -56], w: true }, { t: 'Exit barrier (verification)', p: { x: m.beam.x0 + 10, y: m.beam.y }, d: [-50, 34], w: true }, tray);
    else if (scene.design === 'vacdisc') L.push(iface, { t: 'Vacuum metering disc', p: { x: m.C.x, y: m.C.y + 20 }, d: [-8, 74], w: true }, { t: 'Suction ports + vacuum sensor', p: { x: m.C.x + m.Rd * Math.cos(m.rotor.angle + 4 * m.dA), y: m.C.y + m.Rd * Math.sin(m.rotor.angle + 4 * m.dA) }, d: [70, -52] }, { t: 'Singulator wedge', p: { x: m.C.x + (m.Rd + m.gs) * Math.cos(217 * DEG), y: m.C.y + (m.Rd + m.gs) * Math.sin(217 * DEG) }, d: [-70, -34], w: true }, { t: 'Release (vacuum cut)', p: { x: m.C.x + m.Rd, y: m.C.y - 8 }, d: [60, -24] }, { t: 'Break-beam sensors', p: { x: m.beam.x0, y: m.beam.y }, d: [-30, 40], w: true }, tray);
    return L;
  };
})(typeof window !== 'undefined' ? window : globalThis);
