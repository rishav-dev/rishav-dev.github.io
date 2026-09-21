/* Prodose simulation, canvas renderer. Draws everything in world millimetres via a single 2-D transform. */
(function (G) {
  const P = (G.Prodose = G.Prodose || {});
  const { clamp } = P;
  const DEG = Math.PI / 180;

  const C = {
    bgTop: '#eef0f3', bgBot: '#dde1e7',
    casing: '#fbfbfc', casingEdge: '#b9c0c9', casingShade: '#e6e9ee',
    cavity: '#dfe3e9', cavityDark: '#c9ced6',
    wall: '#8a919c', wallDark: '#4c515b', wheel: '#3d4047', wheel2: '#2d2f35', metal: '#c9ccd1',
    tray: '#f4f5f7', trayEdge: '#9aa1ab', laser: '#ff3b30', accent: '#2f6df6', ok: '#1f9d55', warn: '#e08a00', bad: '#d93636',
    label: '#1f2530',
  };

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r); ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h); ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r); ctx.arcTo(x, y, x + r, y, r); ctx.closePath();
  }

  function polyPath(ctx, verts) {
    ctx.beginPath();
    ctx.moveTo(verts[0].x, verts[0].y);
    for (let i = 1; i < verts.length; i++) ctx.lineTo(verts[i].x, verts[i].y);
    ctx.closePath();
  }

  class Renderer {
    constructor(canvas) {
      this.canvas = canvas; this.ctx = canvas.getContext('2d');
      this.view = { zoom: 1, panX: 0, panY: 0 };
      this.labels = true; this.showBeam = true;
      this.pillPath = null; this.pillSpecKey = '';
      this.dpr = 1; this.w = 0; this.h = 0;
    }

    resize() {
      const r = this.canvas.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      this.dpr = dpr; this.w = r.width; this.h = r.height;
      this.canvas.width = Math.max(2, Math.round(r.width * dpr)); this.canvas.height = Math.max(2, Math.round(r.height * dpr));
    }

    fit(scene) {
      const b = scene.machine.bounds();
      const bw = b.x1 - b.x0, bh = b.y1 - b.y0;
      const s0 = Math.min(this.w / bw, this.h / bh) * 0.94;
      this.base = { s: s0, cx: (b.x0 + b.x1) / 2, cy: (b.y0 + b.y1) / 2 };
    }
    resetView() { this.view = { zoom: 1, panX: 0, panY: 0 }; }
    scale() { return this.base.s * this.view.zoom; }
    toWorld(px, py) {
      const s = this.scale();
      return { x: (px - this.w / 2 - this.view.panX) / s + this.base.cx, y: (py - this.h / 2 - this.view.panY) / s + this.base.cy };
    }
    toScreen(x, y) {
      const s = this.scale();
      return { x: (x - this.base.cx) * s + this.w / 2 + this.view.panX, y: (y - this.base.cy) * s + this.h / 2 + this.view.panY };
    }

    // ------------------------------------------------------------------------------------------
    draw(scene, opts) {
      const ctx = this.ctx;
      if (!this.base || this.base.scene !== scene) { this.fit(scene); this.base.scene = scene; this.buildPillPath(scene); }
      ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      const g = ctx.createLinearGradient(0, 0, 0, this.h);
      g.addColorStop(0, C.bgTop); g.addColorStop(1, C.bgBot);
      ctx.fillStyle = g; ctx.fillRect(0, 0, this.w, this.h);
      const s = this.scale();
      // world transform
      ctx.save();
      ctx.translate(this.w / 2 + this.view.panX, this.h / 2 + this.view.panY);
      ctx.scale(s, s);
      ctx.translate(-this.base.cx, -this.base.cy);
      this.px = 1 / s;
      this.drawTable(scene);
      this.drawMachineBack(scene);
      this.drawBottleBack(scene);
      this.drawPills(scene, opts);
      this.drawBottleFront(scene);
      this.drawMachineFront(scene);
      ctx.restore();
      if (this.labels) this.drawLabels(scene);
    }

    buildPillPath(scene) {
      const v = scene.localVerts;
      const p = new Path2D();
      p.moveTo(v[0].x, v[0].y);
      for (let i = 1; i < v.length; i++) p.lineTo(v[i].x, v[i].y);
      p.closePath();
      this.pillPath = p;
    }

    drawTable(scene) {
      const ctx = this.ctx, m = scene.machine, b = m.bounds();
      const y = m.floorY != null ? m.floorY : b.y1;
      ctx.fillStyle = 'rgba(0,0,0,0.06)'; ctx.fillRect(b.x0 - 400, y, (b.x1 - b.x0) + 800, 400);
      ctx.fillStyle = '#c8cdd4'; ctx.fillRect(b.x0 - 400, y, (b.x1 - b.x0) + 800, 2 * this.px);
    }

    // ------------------------------------------------------------------------------------------
    //  Bottle
    // ------------------------------------------------------------------------------------------
    outerPts(geo) {
      // offset the right-hand inner polyline outward by wall thickness (miter, clamped)
      const pts = geo.pts, t = geo.t, out = [];
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
        let dx = b.x - a.x, dy = b.y - a.y; const l = Math.hypot(dx, dy) || 1; dx /= l; dy /= l;
        let nx = dy, ny = -dx;
        if (i === 0) { nx = 1; ny = 0; }
        if (i === pts.length - 1) { nx = 0; ny = 1; }
        out.push({ x: p.x + nx * t, y: p.y + ny * t });
      }
      return out;
    }

    bottleLoop(pts) {
      const ctx = this.ctx;
      ctx.moveTo(-pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(-pts[i].x, pts[i].y);
      for (let i = pts.length - 1; i >= 0; i--) ctx.lineTo(pts[i].x, pts[i].y);
      ctx.closePath();
    }

    withBottle(scene, fn) {
      const ctx = this.ctx, b = scene.bottle;
      ctx.save(); ctx.translate(b.ox, b.oy); ctx.rotate(b.a); fn(); ctx.restore();
    }

    drawBottleBack(scene) {
      const ctx = this.ctx, geo = scene.geo, col = P.BOTTLE_COLORS[geo.color] || P.BOTTLE_COLORS.amber;
      this.withBottle(scene, () => {
        ctx.beginPath(); this.bottleLoop(geo.pts);
        ctx.fillStyle = col.inner; ctx.fill();
      });
    }

    drawBottleFront(scene) {
      const ctx = this.ctx, geo = scene.geo, col = P.BOTTLE_COLORS[geo.color] || P.BOTTLE_COLORS.amber, px = this.px;
      const outer = this.outerPts(geo);
      this.withBottle(scene, () => {
        // glass wall band
        ctx.beginPath(); this.bottleLoop(outer); this.bottleLoop(geo.pts);
        ctx.fillStyle = col.fill; ctx.fill('evenodd');
        ctx.lineWidth = 1.2 * px; ctx.strokeStyle = col.edge; ctx.stroke();
        // specular streaks
        const gx = ctx.createLinearGradient(-geo.wi, 0, geo.wi, 0);
        gx.addColorStop(0, 'rgba(255,255,255,0.28)'); gx.addColorStop(0.12, 'rgba(255,255,255,0.0)'); gx.addColorStop(0.85, 'rgba(255,255,255,0)'); gx.addColorStop(1, 'rgba(255,255,255,0.16)');
        ctx.beginPath(); this.bottleLoop(geo.pts); ctx.fillStyle = gx; ctx.fill();
        // paper label on the straight body
        const yb0 = geo.hN + geo.hS, yb1 = geo.H - geo.ch;
        const ly0 = yb0 + (yb1 - yb0) * 0.30, ly1 = yb0 + (yb1 - yb0) * 0.74;
        if (ly1 - ly0 > 12) {
          ctx.fillStyle = 'rgba(255,255,255,0.42)';
          ctx.fillRect(-geo.wi, ly0, geo.wi * 2, ly1 - ly0);
          ctx.strokeStyle = 'rgba(0,0,0,0.10)'; ctx.lineWidth = px; ctx.strokeRect(-geo.wi, ly0, geo.wi * 2, ly1 - ly0);
          ctx.fillStyle = 'rgba(60,66,78,0.55)';
          const lh = ly1 - ly0, bx = -geo.wi + 4;
          ctx.font = `bold ${Math.min(lh * 0.22, 9)}px system-ui, sans-serif`; ctx.textBaseline = 'top';
          ctx.save(); ctx.scale(1, 1);
          ctx.fillText('Rx', bx, ly0 + lh * 0.08);
          ctx.restore();
          for (let i = 0; i < 4; i++) { const w = (geo.wi * 2 - 8) * (i === 0 ? 0.75 : 0.95 - i * 0.12); ctx.fillRect(bx, ly0 + lh * (0.36 + i * 0.16), w, Math.max(0.7, lh * 0.045)); }
        }
        // adapter cap (design A): threaded collar around the neck + tube + shutter
        if (geo.hc > 0) {
          const wo = geo.wn + geo.t + 3.5;
          const cg = ctx.createLinearGradient(-wo, 0, wo, 0);
          cg.addColorStop(0, '#dfe2e7'); cg.addColorStop(0.5, '#ffffff'); cg.addColorStop(1, '#cfd3da');
          ctx.fillStyle = cg; ctx.strokeStyle = '#9aa1ab'; ctx.lineWidth = px;
          roundRect(ctx, -wo, -geo.hc, wo * 2, geo.hc + Math.max(geo.hN, 4) + 4, 2.5); ctx.fill(); ctx.stroke();
          ctx.strokeStyle = 'rgba(80,88,100,0.28)';
          for (let x = -wo + 3; x < wo - 2; x += 3.2) { ctx.beginPath(); ctx.moveTo(x, -geo.hc + 2); ctx.lineTo(x, geo.hN + 2); ctx.stroke(); }
          // bore
          ctx.fillStyle = 'rgba(30,34,42,0.22)'; ctx.fillRect(-geo.wn, -geo.hc, geo.wn * 2, geo.hc);
          // shutter plate
          const m = scene.machine;
          if (m.shutter) {
            const off = m.shutterAnim * (geo.wn * 2 + 8);
            ctx.fillStyle = '#6b7280'; ctx.fillRect(-geo.wn - 3 + off, -geo.hc + 0.5, geo.wn * 2 + 6, 3);
          }
        }
      });
    }

    // ------------------------------------------------------------------------------------------
    //  Pills
    // ------------------------------------------------------------------------------------------
    drawPills(scene, opts) {
      const ctx = this.ctx, spec = scene.spec, col = P.COLORS[spec.color] || P.COLORS.white, path = this.pillPath, px = this.px;
      const target = scene.machine.target && scene.machine.target.p;
      ctx.lineJoin = 'round';
      for (const b of scene.pills) {
        const info = b.plugin.pill;
        ctx.save();
        ctx.translate(b.position.x, b.position.y); ctx.rotate(b.angle);
        this.paintPill(ctx, spec, col, path, info, px);
        ctx.restore();
      }
      if (target && scene.machine.state && ['aim', 'descend', 'seal'].includes(scene.machine.state)) {
        ctx.strokeStyle = C.accent; ctx.lineWidth = 1.6 * px;
        const r = Math.max(spec.L, spec.W) * 0.85 + 2;
        ctx.beginPath(); ctx.arc(target.position.x, target.position.y, r, 0, 7); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(target.position.x - r - 4, target.position.y); ctx.lineTo(target.position.x - r + 3, target.position.y);
        ctx.moveTo(target.position.x + r - 3, target.position.y); ctx.lineTo(target.position.x + r + 4, target.position.y);
        ctx.moveTo(target.position.x, target.position.y - r - 4); ctx.lineTo(target.position.x, target.position.y - r + 3);
        ctx.moveTo(target.position.x, target.position.y + r - 3); ctx.lineTo(target.position.x, target.position.y + r + 4); ctx.stroke();
      }
    }

    paintPill(ctx, spec, col, path, info, px) {
      const L = spec.L, W = spec.W;
      if (spec.shape === 'softgel') {
        const g = ctx.createRadialGradient(-L * 0.12, -W * 0.18, W * 0.05, 0, 0, L * 0.6);
        g.addColorStop(0, '#fff3c4'); g.addColorStop(0.25, col.a); g.addColorStop(1, col.b);
        ctx.fillStyle = g; ctx.fill(path);
        ctx.lineWidth = 0.7 * px * 1.2; ctx.strokeStyle = col.edge; ctx.stroke(path);
        ctx.fillStyle = 'rgba(255,255,255,0.55)';
        ctx.beginPath(); ctx.ellipse(-L * 0.12, -W * 0.22, L * 0.22, W * 0.09, 0, 0, 7); ctx.fill();
      } else if (spec.shape === 'capsule') {
        ctx.save(); ctx.clip(path);
        ctx.fillStyle = col.a; ctx.fillRect(-L, -W, L, W * 2);
        ctx.fillStyle = col.b; ctx.fillRect(0, -W, L, W * 2);
        const g = ctx.createLinearGradient(0, -W / 2, 0, W / 2);
        g.addColorStop(0, 'rgba(255,255,255,0.35)'); g.addColorStop(0.45, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(0,0,0,0.18)');
        ctx.fillStyle = g; ctx.fillRect(-L, -W, L * 2, W * 2);
        ctx.fillStyle = 'rgba(0,0,0,0.18)'; ctx.fillRect(-0.3, -W, 0.6, W * 2);
        ctx.restore();
        ctx.lineWidth = 0.7 * px * 1.2; ctx.strokeStyle = col.edge; ctx.stroke(path);
      } else {
        const g = ctx.createRadialGradient(-W * 0.2, -W * 0.25, 0.5, 0, 0, Math.max(L, W) * 0.62);
        g.addColorStop(0, '#ffffff'); g.addColorStop(0.35, col.a); g.addColorStop(1, shade(col.a, -0.16));
        ctx.fillStyle = g; ctx.fill(path);
        ctx.lineWidth = 0.7 * px * 1.2; ctx.strokeStyle = col.edge; ctx.stroke(path);
        // score line
        ctx.strokeStyle = 'rgba(0,0,0,0.22)'; ctx.lineWidth = 0.55 * px * 1.2;
        ctx.beginPath();
        if (spec.shape === 'round') { ctx.moveTo(-L * 0.36, 0); ctx.lineTo(L * 0.36, 0); }
        else { ctx.moveTo(0, -W * 0.3); ctx.lineTo(0, W * 0.3); }
        ctx.stroke();
      }
      if (info.held) { ctx.strokeStyle = 'rgba(47,109,246,0.9)'; ctx.lineWidth = 1.2 * px; ctx.stroke(path); }
      if (info.level === 1) { ctx.strokeStyle = 'rgba(224,138,0,0.95)'; ctx.lineWidth = 1.5 * px; ctx.stroke(path); }
      else if (info.level === 2) {
        ctx.fillStyle = 'rgba(217,54,54,0.32)'; ctx.fill(path);
        ctx.strokeStyle = 'rgba(160,20,20,0.95)'; ctx.lineWidth = 1.4 * px; ctx.stroke(path);
        ctx.beginPath(); ctx.moveTo(-L * 0.3, -W * 0.28); ctx.lineTo(-L * 0.08, W * 0.04); ctx.lineTo(L * 0.06, -W * 0.16); ctx.lineTo(L * 0.3, W * 0.3); ctx.stroke();
      }
    }

    // ------------------------------------------------------------------------------------------
    //  Design A drawing
    // ------------------------------------------------------------------------------------------
    cavityPath(m) {
      const ctx = this.ctx;
      ctx.beginPath();
      const rp = m.hopperRP;
      ctx.moveTo(-rp[0].x, rp[0].y);
      for (let i = 1; i < rp.length; i++) ctx.lineTo(-rp[i].x, rp[i].y);
      // left inner wall bottom is at housing radius; arc counter-clockwise on the left is the path from aL back to aR through the bottom
      ctx.arc(0, 0, m.Rh, m.aL, m.aR, true);
      for (let i = rp.length - 1; i >= 0; i--) ctx.lineTo(rp[i].x, rp[i].y);
      ctx.closePath();
    }

    drawWheelMachineBack(scene) {
      const ctx = this.ctx, m = scene.machine, px = this.px, R = m.R, Rh = m.Rh;
      // casing
      const x0 = -(R + 40), x1 = R + 40, y0 = m.roofY + 8, y1 = Rh + m.tk + 14;
      const cg = ctx.createLinearGradient(x0, 0, x1, 0);
      cg.addColorStop(0, '#eceef2'); cg.addColorStop(0.5, '#ffffff'); cg.addColorStop(1, '#e3e6eb');
      ctx.fillStyle = cg; ctx.strokeStyle = C.casingEdge; ctx.lineWidth = 1.4 * px;
      roundRect(ctx, x0, y0, x1 - x0, y1 - y0, 16); ctx.fill(); ctx.stroke();
      // roof plates (thin dark tops)
      ctx.fillStyle = '#e9ecf0'; ctx.strokeStyle = C.casingEdge;
      for (const b of m.statics) if (b.label === 'roof') { polyPath(ctx, b.vertices); ctx.fill(); ctx.stroke(); }
      // cavity
      this.cavityPath(m);
      const cvg = ctx.createRadialGradient(0, 0, 10, 0, 0, Rh + 30);
      cvg.addColorStop(0, '#e7eaef'); cvg.addColorStop(1, '#cdd2da');
      ctx.fillStyle = cvg; ctx.fill();
      // wheel
      const wa = m.wheel.a, phi = wa;
      ctx.save(); ctx.rotate(phi + 0);
      // (Rig angle is the wheel angle; slots were authored at fixed angles a_k)
      const rimG = ctx.createRadialGradient(0, 0, R * 0.2, 0, 0, R);
      rimG.addColorStop(0, '#55595f'); rimG.addColorStop(0.75, '#3a3d43'); rimG.addColorStop(1, '#2b2d32');
      ctx.fillStyle = rimG; ctx.beginPath(); ctx.arc(0, 0, R, 0, Math.PI * 2); ctx.fill();
      // slots
      ctx.fillStyle = '#d3d8df';
      for (const pk of m.pockets) {
        ctx.save(); ctx.rotate(pk.a);
        ctx.beginPath();
        const rf = R - pk.d;
        ctx.moveTo(rf, -pk.w / 2); ctx.lineTo(R + 0.5, -pk.w / 2 * 1.0); ctx.lineTo(R + 0.5, pk.w / 2); ctx.lineTo(rf, pk.w / 2); ctx.closePath();
        ctx.fillStyle = '#d5dae1'; ctx.fill();
        ctx.strokeStyle = 'rgba(0,0,0,0.35)'; ctx.lineWidth = px; ctx.stroke();
        ctx.restore();
      }
      // spokes / lightening holes
      ctx.fillStyle = 'rgba(0,0,0,0.22)';
      for (let k = 0; k < m.N; k++) {
        const a = ((k + 0.5) * 360) / m.N * DEG;
        ctx.save(); ctx.rotate(a); ctx.beginPath(); ctx.ellipse(R * 0.42, 0, R * 0.14, R * 0.055, 0, 0, 7); ctx.fill(); ctx.restore();
      }
      // hub
      const hg = ctx.createRadialGradient(-3, -3, 1, 0, 0, 13);
      hg.addColorStop(0, '#f2f3f5'); hg.addColorStop(1, '#8b9099');
      ctx.fillStyle = hg; ctx.beginPath(); ctx.arc(0, 0, 12, 0, 7); ctx.fill();
      ctx.strokeStyle = '#3a3d43'; ctx.lineWidth = px; ctx.stroke();
      ctx.fillStyle = '#5d626b'; ctx.beginPath(); ctx.arc(0, 0, 3.6, 0, 7); ctx.fill();
      ctx.restore();
      // slot numbers (size-setting reference marks) stay upright
      ctx.fillStyle = 'rgba(255,255,255,0.75)'; ctx.font = `${5.2}px system-ui, sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      for (let k = 0; k < m.N; k++) {
        const a = phi + (k * 360) / m.N * DEG;
        ctx.fillText(String(k + 1), Math.cos(a) * (R * 0.72), Math.sin(a) * (R * 0.72));
      }
    }

    drawWheelMachineFront(scene) {
      const ctx = this.ctx, m = scene.machine, px = this.px, R = m.R, Rh = m.Rh;
      // housing outline on top of pills so nothing looks like it pokes through
      ctx.lineWidth = m.tk; ctx.lineJoin = 'round'; ctx.lineCap = 'butt';
      const wg = ctx.createLinearGradient(-R, 0, R, 0); wg.addColorStop(0, '#9aa1ab'); wg.addColorStop(0.5, '#c4c9d1'); wg.addColorStop(1, '#8e959f');
      ctx.strokeStyle = wg;
      ctx.beginPath();
      const rp = m.hopperRP;
      ctx.moveTo(rp[0].x + m.tk / 2, rp[0].y); for (let i = 1; i < rp.length; i++) ctx.lineTo(rp[i].x + m.tk / 2, rp[i].y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-rp[0].x - m.tk / 2, rp[0].y); for (let i = 1; i < rp.length; i++) ctx.lineTo(-rp[i].x - m.tk / 2, rp[i].y);
      ctx.stroke();
      // housing arcs, split at the trapdoor
      const eA = Math.PI / 2 - m.gapHalf, eB = Math.PI / 2 + m.gapHalf;
      ctx.beginPath(); ctx.arc(0, 0, Rh + m.tk / 2, m.aR, eA); ctx.stroke();
      ctx.beginPath(); ctx.arc(0, 0, Rh + m.tk / 2, eB, m.aL); ctx.stroke();
      // trapdoor slides along the housing
      ctx.strokeStyle = '#59606b'; ctx.lineWidth = m.tk;
      const slide = m.gateAnim * (m.gapHalf * 2 + 0.06);
      ctx.beginPath(); ctx.arc(0, 0, Rh + m.tk / 2, eA + slide, eB + slide); ctx.stroke();
      // scraper mark at the right hopper wall
      ctx.strokeStyle = '#d93636'; ctx.lineWidth = 2 * px;
      const yh = -Math.sqrt(Rh * Rh - m.hw * m.hw);
      ctx.beginPath(); ctx.moveTo(m.hw - 0.5, yh - 5); ctx.lineTo(m.hw - 0.5, yh + 0.5); ctx.stroke();
      // exit funnel, ramp, tray
      for (const b of m.statics) {
        if (b.label === 'ramp' || b.label === 'chute') { polyPath(ctx, b.vertices); ctx.fillStyle = '#eef0f3'; ctx.fill(); ctx.strokeStyle = '#a7aeb8'; ctx.lineWidth = px * 1.2; ctx.stroke(); }
      }
      this.drawTray(m.tray, scene);
      // adapter interface ring (airtight, adjustable)
      const g = scene.geo, ry = m.roofY;
      const wo = g.wn + 14;
      const ig = ctx.createLinearGradient(-wo, 0, wo, 0); ig.addColorStop(0, '#d9dde3'); ig.addColorStop(0.5, '#ffffff'); ig.addColorStop(1, '#cfd4db');
      ctx.fillStyle = ig; ctx.strokeStyle = '#8f97a3'; ctx.lineWidth = px * 1.2;
      roundRect(ctx, -wo, ry, wo * 2, 12, 3); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = '#59606b'; ctx.lineWidth = px * 1.3;
      const ax = wo - 5; ctx.beginPath(); ctx.moveTo(-ax, ry + 6); ctx.lineTo(ax, ry + 6);
      ctx.moveTo(-ax, ry + 6); ctx.lineTo(-ax + 3, ry + 3.5); ctx.moveTo(-ax, ry + 6); ctx.lineTo(-ax + 3, ry + 8.5);
      ctx.moveTo(ax, ry + 6); ctx.lineTo(ax - 3, ry + 3.5); ctx.moveTo(ax, ry + 6); ctx.lineTo(ax - 3, ry + 8.5); ctx.stroke();
      // dispense / jam sensor
      const gw = m.gw + 8, yb = m.yBeam;
      ctx.fillStyle = '#2c2f36'; ctx.fillRect(-gw - 8, yb - 4, 8, 8); ctx.fillRect(gw, yb - 4, 8, 8);
      const on = m.sensorBlocked;
      ctx.strokeStyle = on ? '#ff6a5e' : 'rgba(255,59,48,0.85)'; ctx.lineWidth = (on ? 2.2 : 1.1) * px;
      ctx.shadowColor = C.laser; ctx.shadowBlur = on ? 10 : 4;
      ctx.beginPath(); ctx.moveTo(-gw, yb); ctx.lineTo(gw, yb); ctx.stroke(); ctx.shadowBlur = 0;
      // torque / jam flash
      if (m.jamFlash > 0) {
        ctx.strokeStyle = `rgba(217,54,54,${Math.min(1, m.jamFlash / 500)})`; ctx.lineWidth = 3 * px;
        ctx.beginPath(); ctx.arc(0, 0, R + 8, 0, 7); ctx.stroke();
      }
    }

    drawTray(t, scene) {
      const ctx = this.ctx, px = this.px;
      const g = ctx.createLinearGradient(0, t.yFloor - t.wall, 0, t.yFloor + 8);
      g.addColorStop(0, 'rgba(255,255,255,0.55)'); g.addColorStop(1, 'rgba(228,231,236,0.95)');
      ctx.fillStyle = g; ctx.strokeStyle = C.trayEdge; ctx.lineWidth = 1.4 * px;
      ctx.beginPath();
      ctx.moveTo(t.xl - 6, t.yFloor - t.wall); ctx.lineTo(t.xl - 6, t.yFloor + 8); ctx.lineTo(t.xr + 6, t.yFloor + 8); ctx.lineTo(t.xr + 6, t.yFloor - t.wall);
      ctx.lineTo(t.xr, t.yFloor - t.wall); ctx.lineTo(t.xr, t.yFloor); ctx.lineTo(t.xl, t.yFloor); ctx.lineTo(t.xl, t.yFloor - t.wall); ctx.closePath();
      ctx.fill(); ctx.stroke();
    }

    // ------------------------------------------------------------------------------------------
    //  Design B drawing
    // ------------------------------------------------------------------------------------------
    drawArmMachineBack(scene) {
      const ctx = this.ctx, m = scene.machine, px = this.px, g = scene.geo;
      // dock housing behind the bottle
      const x0 = -m.Lc - 14, x1 = m.xEnd + 14;
      const cg = ctx.createLinearGradient(x0, 0, x1, 0);
      cg.addColorStop(0, '#eceef2'); cg.addColorStop(0.5, '#ffffff'); cg.addColorStop(1, '#e3e6eb');
      ctx.fillStyle = cg; ctx.strokeStyle = C.casingEdge; ctx.lineWidth = 1.4 * px;
      roundRect(ctx, x0, -m.Hc - 14, x1 - x0, m.Hc + 22, 14); ctx.fill(); ctx.stroke();
      // sealed chamber window
      ctx.fillStyle = 'rgba(214,220,228,0.85)';
      ctx.fillRect(-m.Lc, -m.Hc, m.xEnd + m.Lc, m.Hc);
      // scan overlay
      if (m.state === 'scan') {
        const gx = -g.wi + (g.wi * 2) * (0.5 - 0.5 * Math.cos(m.scanAngle));
        ctx.save();
        ctx.fillStyle = 'rgba(47,109,246,0.10)'; ctx.fillRect(-g.wi, 0, g.wi * 2, g.H);
        ctx.strokeStyle = 'rgba(47,109,246,0.9)'; ctx.lineWidth = 1.5 * px; ctx.setLineDash([4 * px, 3 * px]);
        ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, g.H); ctx.stroke(); ctx.restore();
      }
      // rail
      ctx.fillStyle = '#4c515b'; ctx.fillRect(-m.Lc + 4, m.Jy - 7, m.xEnd + m.Lc - 8, 5);
      // vision camera on the ceiling above the mouth
      ctx.fillStyle = '#2c2f36'; roundRect(ctx, -9, -m.Hc + 1, 18, 9, 2); ctx.fill();
      ctx.fillStyle = m.state === 'scan' ? '#5aa2ff' : '#7d8794'; ctx.beginPath(); ctx.arc(0, -m.Hc + 10, 3.2, 0, 7); ctx.fill();
    }

    drawArmMachineFront(scene) {
      const ctx = this.ctx, m = scene.machine, px = this.px, g = scene.geo;
      // floor plates, walls, ceiling
      for (const b of m.statics) {
        if (['chamber', 'ramp', 'chute'].includes(b.label)) { polyPath(ctx, b.vertices); ctx.fillStyle = b.label === 'chamber' ? '#8e959f' : '#eef0f3'; ctx.fill(); ctx.strokeStyle = '#59606b'; ctx.lineWidth = px * 1.1; ctx.stroke(); }
      }
      // outlet flap
      const slide = m.gateAnim * (m.Wo * 0.9);
      ctx.fillStyle = '#59606b'; ctx.fillRect(m.xo - m.Wo / 2 + slide * 0.0 + (m.gateAnim > 0.1 ? m.Wo * 0.55 * m.gateAnim : 0) - (m.gateAnim > 0.1 ? 0 : 0), -6, m.Wo, 6);
      // airtight dock collar at the mouth
      const wo = g.wn + g.t + 7;
      const ig = ctx.createLinearGradient(-wo, 0, wo, 0); ig.addColorStop(0, '#d9dde3'); ig.addColorStop(0.5, '#ffffff'); ig.addColorStop(1, '#cfd4db');
      ctx.fillStyle = ig; ctx.strokeStyle = '#8f97a3'; ctx.lineWidth = px * 1.2;
      roundRect(ctx, -wo, 2.5, wo * 2, 10, 3); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#2c2f36'; ctx.fillRect(-g.wn - g.t, -1.5, (g.wn + g.t) * 2, 3);
      ctx.strokeStyle = '#59606b'; ctx.lineWidth = px * 1.2;
      const ax = wo - 4; ctx.beginPath(); ctx.moveTo(-ax, 7.5); ctx.lineTo(ax, 7.5);
      ctx.moveTo(-ax, 7.5); ctx.lineTo(-ax + 3, 5.5); ctx.moveTo(-ax, 7.5); ctx.lineTo(-ax + 3, 9.5);
      ctx.moveTo(ax, 7.5); ctx.lineTo(ax - 3, 5.5); ctx.moveTo(ax, 7.5); ctx.lineTo(ax - 3, 9.5); ctx.stroke();
      // tray
      this.drawTray(m.tray, scene);
      // sensor
      const gx0 = m.xo - m.Wo / 2, gx1 = m.xo + m.Wo / 2, yb = m.yBeam;
      ctx.fillStyle = '#2c2f36'; ctx.fillRect(gx0 - 9, yb - 4, 8, 8); ctx.fillRect(gx1 + 1, yb - 4, 8, 8);
      const on = m.sensorBlocked;
      ctx.strokeStyle = on ? '#ff6a5e' : 'rgba(255,59,48,0.85)'; ctx.lineWidth = (on ? 2.2 : 1.1) * px; ctx.shadowColor = C.laser; ctx.shadowBlur = on ? 10 : 4;
      ctx.beginPath(); ctx.moveTo(gx0, yb); ctx.lineTo(gx1, yb); ctx.stroke(); ctx.shadowBlur = 0;
      // robot arm
      const t = m.tipWorld, jx = t.jx;
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#3a3e46'; ctx.lineWidth = 5 * px * 1.0 + 1;
      ctx.beginPath(); ctx.moveTo(jx, m.Jy); ctx.lineTo(t.x, t.y); ctx.stroke();
      ctx.strokeStyle = '#cfd3da'; ctx.lineWidth = 3.4;
      ctx.beginPath(); ctx.moveTo(jx, m.Jy); ctx.lineTo(t.x, t.y); ctx.stroke();
      // carriage
      ctx.fillStyle = '#2f6df6'; roundRect(ctx, jx - 9, m.Jy - 9, 18, 13, 3); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(jx, m.Jy - 2, 2.4, 0, 7); ctx.fill();
      // vacuum cup
      ctx.save(); ctx.translate(t.x, t.y); ctx.rotate(-m.alpha.pos);
      ctx.fillStyle = m.held ? '#2f6df6' : '#3a3e46';
      ctx.beginPath(); ctx.moveTo(-m.cupR, -3.2); ctx.lineTo(m.cupR, -3.2); ctx.lineTo(m.cupR * 0.75, 0); ctx.lineTo(-m.cupR * 0.75, 0); ctx.closePath(); ctx.fill();
      if (m.held) { ctx.strokeStyle = 'rgba(47,109,246,0.55)'; ctx.lineWidth = px; for (let i = 1; i <= 2; i++) { ctx.beginPath(); ctx.arc(0, 1, m.cupR + i * 2.2, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke(); } }
      ctx.restore();
      ctx.lineCap = 'butt';
    }

    // ------------------------------------------------------------------------------------------
    //  Labels (screen space, leader lines like the concept drawings)
    // ------------------------------------------------------------------------------------------
    drawLabels(scene) {
      const ctx = this.ctx, m = scene.machine, g = scene.geo;
      let items = [];
      if (scene.design !== 'wheel' && scene.design !== 'arm' && P.conceptLabels) items = P.conceptLabels(scene);
      else if (scene.design === 'wheel') {
        const b = scene.bottle;
        items.push({ t: 'Adjustable airtight bottle interface', p: { x: m.wn + 18, y: m.roofY + 6 }, d: [56, -30] });
        items.push({ t: `Multi-size sorting wheel (size ${m.size}/10)`, p: { x: -m.R * 0.66, y: m.R * 0.30 }, d: [-118, 34], w: true });
        items.push({ t: 'Scraper, one pill per slot', p: { x: m.hw, y: -Math.sqrt(m.Rh * m.Rh - m.hw * m.hw) - 6 }, d: [78, 4] });
        items.push({ t: 'Trapdoor release', p: { x: m.gw * 0.7, y: m.Rh + 3 }, d: [56, 4] });
        items.push({ t: 'Dispense / jam sensor', p: { x: -m.gw - 4, y: m.yBeam }, d: [-70, 24], w: true });
        items.push({ t: 'Collection tray', p: { x: m.tray.xr - 20, y: m.tray.yFloor - 4 }, d: [30, 30] });
        if (scene.phase === 'station') items.push({ t: 'Bottle + adapter cap (upright)', p: { x: b.ox, y: b.oy + g.H * 0.5 }, d: [-40, 0], w: true });
      } else {
        items.push({ t: 'Airtight dock, bottle enters from below', p: { x: -g.wn - g.t - 6, y: 8 }, d: [-40, 46], w: true });
        items.push({ t: 'Vacuum pick arm (pivots at the mouth)', p: { x: m.tipWorld.jx, y: m.Jy }, d: [-70, -16], w: true });
        items.push({ t: 'Vision camera', p: { x: 0, y: -m.Hc + 8 }, d: [46, -18] });
        items.push({ t: 'Outlet gate', p: { x: m.xo, y: -3 }, d: [44, -46] });
        items.push({ t: 'Dispense sensor', p: { x: m.xo + m.Wo / 2, y: m.yBeam }, d: [40, 6] });
        items.push({ t: 'Collection tray', p: { x: m.tray.xr - 20, y: m.tray.yFloor - 4 }, d: [30, 30] });
      }
      ctx.save();
      ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      ctx.font = '600 11.5px system-ui, -apple-system, Segoe UI, sans-serif'; ctx.textBaseline = 'middle';
      for (const it of items) {
        const a = this.toScreen(it.p.x, it.p.y);
        let bx = a.x + it.d[0], by = a.y + it.d[1];
        const tw = ctx.measureText(it.t).width;
        const left = it.w || it.d[0] < 0;
        if (bx < 8 || bx + tw > this.w - 8 && !left) { /* keep on screen */ }
        const tx = left ? bx - tw : bx;
        if (tx < 6 || tx + tw > this.w - 6 || by < 12 || by > this.h - 12) continue;
        ctx.strokeStyle = 'rgba(31,37,48,0.55)'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(bx, by); ctx.lineTo(left ? bx - tw - 2 : bx + tw + 2, by); ctx.stroke();
        ctx.fillStyle = '#1f2530'; ctx.beginPath(); ctx.arc(a.x, a.y, 2.6, 0, 7); ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.72)'; ctx.fillRect(tx - 3, by - 16, tw + 6, 15);
        ctx.fillStyle = '#1f2530'; ctx.textAlign = 'left'; ctx.fillText(it.t, tx, by - 8.5);
      }
      ctx.restore();
    }
  }

  function shade(hex, amt) {
    const n = parseInt(hex.slice(1), 16);
    let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    const f = (c) => clamp(Math.round(c + (amt < 0 ? c * amt : (255 - c) * amt)), 0, 255);
    r = f(r); g = f(g); b = f(b);
    return `rgb(${r},${g},${b})`;
  }

  P.Renderer = Renderer;
})(window);
