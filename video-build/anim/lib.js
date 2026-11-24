  // ---------- HVAC helpers ----------
  const BLUE = '#2b7de9', HOT = '#e8432f', GRN = '#1e9e5a', COOL = '#3aa0ff', WARM = '#ff7a3a';
  function poly(pts, color, w = 8, dash) {
    ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = w; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    if (dash) ctx.setLineDash(dash);
    ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke(); ctx.restore();
  }
  function polyLen(pts) { let L = 0; for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); return L; }
  function along(pts, d) {
    for (let i = 1; i < pts.length; i++) {
      const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], l = Math.hypot(x1 - x0, y1 - y0);
      if (d <= l) return [lerp(x0, x1, d / l), lerp(y0, y1, d / l)]; d -= l;
    }
    return pts[pts.length - 1];
  }
  function flow(pts, t, color, n = 10, speed = 90, r = 7) {   // 管の中を流れる粒
    const L = polyLen(pts); ctx.fillStyle = color;
    for (let i = 0; i < n; i++) { const [x, y] = along(pts, (t * speed + i * L / n) % L); ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); }
  }
  function arrow(x0, y0, x1, y1, color, w = 6, t = 1) {
    if (t <= 0) return; const k = eo(t / 0.4), xe = lerp(x0, x1, k), ye = lerp(y0, y1, k), a = Math.atan2(y1 - y0, x1 - x0);
    ctx.save(); ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = w; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(xe - Math.cos(a) * w * 2, ye - Math.sin(a) * w * 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(xe, ye); ctx.lineTo(xe - Math.cos(a - .45) * w * 3.6, ye - Math.sin(a - .45) * w * 3.6);
    ctx.lineTo(xe - Math.cos(a + .45) * w * 3.6, ye - Math.sin(a + .45) * w * 3.6); ctx.closePath(); ctx.fill(); ctx.restore();
  }
  function unit(x, y, w, h, label, t = 1, opt = {}) {           // 機器の箱
    if (t <= 0) return; const s = 0.85 + 0.15 * eb(t / 0.35);
    ctx.save(); ctx.globalAlpha = cl(t / 0.2); ctx.translate(x + w / 2, y + h / 2); ctx.scale(s, s); ctx.translate(-w / 2, -h / 2);
    ctx.fillStyle = 'rgba(0,0,0,.16)'; rr(3, 5, w, h, 12); ctx.fill();
    ctx.fillStyle = opt.bg || '#fff'; rr(0, 0, w, h, 12); ctx.fill(); ctx.strokeStyle = opt.line || '#5b6474'; ctx.lineWidth = 3; ctx.stroke();
    ctx.fillStyle = opt.color || INK; ctx.font = f(800, opt.size || 24); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    label.split('\n').forEach((l, i, a) => ctx.fillText(l, w / 2, h / 2 + (i - (a.length - 1) / 2) * (opt.size || 24) * 1.3));
    ctx.restore();
  }
  function fanIcon(x, y, r, t, color = '#5b6474') {
    ctx.save(); ctx.translate(x, y); ctx.rotate(t * 6); ctx.fillStyle = color;
    for (let k = 0; k < 4; k++) { ctx.rotate(Math.PI / 2); ctx.beginPath(); ctx.ellipse(r * .45, 0, r * .5, r * .2, 0, 0, Math.PI * 2); ctx.fill(); }
    ctx.restore();
  }
  function thermo(x, y, val, color, label, t = 1) {           // 温度の札
    if (t <= 0) return; ctx.save(); ctx.globalAlpha = eo(t / .3);
    ctx.fillStyle = color; rr(x - 62, y - 30, 124, 60, 14); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.font = f(900, 30); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(val, x, y + 1);
    if (label) { ctx.fillStyle = INK; ctx.font = f(700, 20); ctx.fillText(label, x, y + 52); }
    ctx.restore();
  }
  function sun(x, y, t) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(t * .4); ctx.fillStyle = '#ffb627';
    for (let k = 0; k < 12; k++) { ctx.rotate(Math.PI / 6); ctx.fillRect(46, -4, 22, 8); }
    ctx.beginPath(); ctx.arc(0, 0, 38, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  }
  function bubble(text, x, y, t, color = HOT) {
    if (t <= 0) return; const s = eb(t / .35); ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.font = f(900, 26); const w = ctx.measureText(text).width + 36;
    ctx.fillStyle = '#fff'; rr(-w / 2, -28, w, 56, 28); ctx.fill(); ctx.strokeStyle = color; ctx.lineWidth = 4; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-14, 26); ctx.lineTo(-30, 50); ctx.lineTo(4, 27); ctx.fillStyle = '#fff'; ctx.fill();
    ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 0, 1); ctx.restore();
  }
  function fcu(x, y, t, on = true, w = 150, h = 54) {          // 天井のファンコイル
    ctx.fillStyle = '#dfe4ec'; rr(x, y, w, h, 8); ctx.fill(); ctx.strokeStyle = '#5b6474'; ctx.lineWidth = 3; ctx.stroke();
    ctx.fillStyle = INK; ctx.font = f(800, 18); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('FCU', x + w / 2, y + h / 2);
    if (on) fanIcon(x + 22, y + h / 2, 16, t);
  }


  // ---------- generic scene builders ----------
  const DARK = '#1f2430';
  function foot(text, t, color = DARK) { if (text && t > 0) pill(text, W / 2, 660, t, {align: 'center', bg: color, size: 21}); }
  const sc = {
    title(big, sub, keys, label, color = ACC) {
      return t => {
        const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#16304f'); g.addColorStop(1, '#0b1626');
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
        for (let i = 0; i < 22; i++) { const [a, b, c] = PUFFS[i], ph = (t * .1 + a) % 1;
          ctx.fillStyle = `rgba(255,255,255,${.10 * (1 - ph)})`; ctx.beginPath(); ctx.arc(ph * W, b * H + Math.sin(t + i) * 20, 10 + c * 26, 0, Math.PI * 2); ctx.fill(); }
        pill(label, W / 2, 205, t, {align: 'center', bg: color, size: 28});
        const s = eb((t - .25) / .5);
        if (s > 0) { ctx.save(); ctx.translate(W / 2, 330); ctx.scale(s, s); ctx.font = f(900, big.length > 7 ? 92 : 112);
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineWidth = 12; ctx.strokeStyle = '#fff'; ctx.strokeText(big, 0, 0);
          ctx.fillStyle = color; ctx.fillText(big, 0, 0); ctx.restore(); }
        if (t > .8) { ctx.globalAlpha = eo((t - .8) / .4); ctx.font = f(800, 42); ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.fillText(sub, W / 2, 460); ctx.globalAlpha = 1; }
        if (t > 1.4) { ctx.globalAlpha = eo((t - 1.4) / .4); ctx.font = f(500, 23); ctx.fillStyle = '#b9c2d3'; ctx.fillText(keys, W / 2, 530); ctx.globalAlpha = 1; }
      };
    },
    cards(head, list, ft, fcol) {           // list: [title, body, color?] ×4
      return t => {
        plain(); const cw = 560, ch = 200, x0 = 70, y0 = 170, g = 40;
        list.forEach(([a, b, c], i) => card(x0 + (i % 2) * (cw + g), y0 + Math.floor(i / 2) * (ch + 22), cw, ch, String(i + 1), a, b, t - .4 - i * 2.1, c || ACC));
        foot(ft, t - (list.length * 2.1 + .6), fcol); headline(head, t);
      };
    },
    compare(head, cols, ft) {               // cols: [label, title, items[], color]
      return t => {
        plain(); const n = cols.length, gap = 25, cw = (1190 - gap * (n - 1)) / n, x0 = 45, y0 = 160, h = 410;
        cols.forEach(([lab, ttl, items, col], i) => {
          const tt = t - .4 - i * 2.6; if (tt <= 0) return; const x = x0 + i * (cw + gap), s = .85 + .15 * eb(tt / .35);
          ctx.save(); ctx.globalAlpha = cl(tt / .2); ctx.translate(x + cw / 2, y0 + h / 2); ctx.scale(s, s); ctx.translate(-cw / 2, -h / 2);
          ctx.fillStyle = 'rgba(0,0,0,.15)'; rr(4, 6, cw, h, 16); ctx.fill(); ctx.fillStyle = '#fff'; rr(0, 0, cw, h, 16); ctx.fill();
          ctx.fillStyle = col; rr(0, 0, cw, 70, [16, 16, 0, 0]); ctx.fill();
          ctx.fillStyle = '#fff'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
          if (lab) { ctx.font = f(900, 26); ctx.fillText(lab, 22, 36); }
          ctx.font = f(800, 22); ctx.fillText(ttl, lab ? 22 + ctx.measureText(lab).width + 50 : 22, 36);
          ctx.font = f(600, 21);
          items.forEach((it, k) => { if (tt > .6 + k * .5) { ctx.fillStyle = col; ctx.beginPath(); ctx.arc(28, 120 + k * 80, 7, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = INK; it.split('\n').forEach((l, j) => ctx.fillText(l, 46, 121 + k * 80 + j * 28)); } });
          ctx.restore();
        });
        foot(ft, t - (n * 2.6 + 1)); headline(head, t);
      };
    },
    table(head, cols, rows, ft, widths) {   // rows appear one by one
      return t => {
        plain(); const x0 = 90, wAll = 1100, ws = widths || cols.map(() => wAll / cols.length), y0 = 160, rh = Math.min(84, 380 / rows.length);
        ctx.fillStyle = DARK; rr(x0, y0, wAll, 60, [14, 14, 0, 0]); ctx.fill();
        ctx.font = f(800, 22); ctx.fillStyle = '#fff'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
        let x = x0; cols.forEach((c, k) => { ctx.fillText(c, x + 24, y0 + 31); x += ws[k]; });
        rows.forEach((r, i) => { const tt = t - .8 - i * 1.4; if (tt <= 0) return; const y = y0 + 60 + i * rh;
          ctx.globalAlpha = eo(tt / .3); ctx.fillStyle = i % 2 ? '#f6f8fb' : '#fff'; ctx.fillRect(x0, y, wAll, rh);
          let xx = x0; r.forEach((c, k) => { ctx.fillStyle = k === 0 ? INK : (k === r.length - 1 ? ACC : '#3a4252'); ctx.font = f(k === 0 ? 800 : 600, 22);
            c.split('\n').forEach((l, j, a) => ctx.fillText(l, xx + 24, y + rh / 2 + (j - (a.length - 1) / 2) * 26)); xx += ws[k]; });
          ctx.globalAlpha = 1; });
        foot(ft, t - (rows.length * 1.4 + 1.2)); headline(head, t);
      };
    },
    flow(head, steps, ft, color = ACC) {    // 縦に並ぶ手順
      return t => {
        plain(); const n = steps.length, bh = Math.min(92, (440 - (n - 1) * 22) / n), x = 230, w = 820, y0 = 160;
        steps.forEach(([a, b], i) => { const tt = t - .5 - i * 1.8; if (tt <= 0) return; const y = y0 + i * (bh + 22), dx = (1 - eo(tt / .4)) * 50;
          ctx.save(); ctx.globalAlpha = cl(tt / .25); ctx.translate(dx, 0);
          ctx.fillStyle = 'rgba(0,0,0,.12)'; rr(x + 3, y + 5, w, bh, 14); ctx.fill(); ctx.fillStyle = '#fff'; rr(x, y, w, bh, 14); ctx.fill();
          ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x + 46, y + bh / 2, 24, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#fff'; ctx.font = f(900, 24); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(String(i + 1), x + 46, y + bh / 2 + 1);
          ctx.textAlign = 'left'; ctx.fillStyle = INK; ctx.font = f(900, 26); ctx.fillText(a, x + 90, y + bh / 2 - (b ? 14 : 0));
          if (b) { ctx.fillStyle = '#4a5262'; ctx.font = f(500, 20); ctx.fillText(b, x + 90, y + bh / 2 + 18); }
          ctx.restore();
          if (i < n - 1 && tt > .5) arrow(x + 46, y + bh + 2, x + 46, y + bh + 20, color, 4, tt - .5);
        });
        foot(ft, t - (n * 1.8 + .8)); headline(head, t);
      };
    },
    summary(tiles, note) {                  // tiles: [word, body, color] ×4
      return t => {
        const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#16304f'); g.addColorStop(1, '#0b1626');
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
        tiles.forEach(([a, b, col], i) => { const tt = t - .5 - i * .9; if (tt <= 0) return;
          const x = 70 + i * 290, y = 190, s = .8 + .2 * eb(tt / .35);
          ctx.save(); ctx.globalAlpha = cl(tt / .2); ctx.translate(x + 130, y + 150); ctx.scale(s, s); ctx.translate(-130, -150);
          ctx.fillStyle = '#fff'; rr(0, 0, 260, 300, 22); ctx.fill(); ctx.fillStyle = col; rr(0, 0, 260, 110, [22, 22, 0, 0]); ctx.fill();
          ctx.fillStyle = '#fff'; ctx.font = f(900, a.length > 4 ? 36 : 44); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(a, 130, 57);
          ctx.fillStyle = INK; ctx.font = f(700, 25); b.split('\n').forEach((l, k) => ctx.fillText(l, 130, 170 + k * 42)); ctx.restore(); });
        if (t > 4.5) { ctx.globalAlpha = eo((t - 4.5) / .5); ctx.font = f(500, 18); ctx.fillStyle = '#b9c2d3'; ctx.textAlign = 'center'; ctx.fillText(note, W / 2, 640); ctx.globalAlpha = 1; }
        pill('まとめ', W / 2, 110, t, {align: 'center', bg: ACC, size: 30});
      };
    },
  };
  function building(x, y, w, floors, fh, t, opt = {}) {   // 階の積み重ね（上から）
    for (let i = 0; i < floors; i++) { const yy = y + i * fh, fl = floors - i;
      ctx.fillStyle = (opt.fill && opt.fill(fl, t)) || '#dfe6f1'; ctx.fillRect(x, yy, w, fh - 4);
      ctx.fillStyle = INK; ctx.font = f(800, 18); ctx.textAlign = 'right'; ctx.textBaseline = 'middle'; ctx.fillText(fl + 'F', x - 12, yy + fh / 2); }
  }
  function docIcon(x, y, w, h, title, t, color = ACC) {
    if (t <= 0) return; const s = .85 + .15 * eb(t / .35);
    ctx.save(); ctx.globalAlpha = cl(t / .2); ctx.translate(x + w / 2, y + h / 2); ctx.scale(s, s); ctx.translate(-w / 2, -h / 2);
    ctx.fillStyle = 'rgba(0,0,0,.15)'; rr(3, 5, w, h, 10); ctx.fill(); ctx.fillStyle = '#fff'; rr(0, 0, w, h, 10); ctx.fill();
    ctx.fillStyle = color; rr(0, 0, w, 44, [10, 10, 0, 0]); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.font = f(800, 20); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(title, w / 2, 23);
    ctx.strokeStyle = '#c4ccd8'; ctx.lineWidth = 3; for (let k = 0; k < 4; k++) { ctx.beginPath(); ctx.moveTo(16, 66 + k * 22); ctx.lineTo(w - 16 - (k === 3 ? 30 : 0), 66 + k * 22); ctx.stroke(); }
    ctx.restore();
  }
  function check(x, y, t, color = GRN) { if (t <= 0) return; ctx.save(); ctx.globalAlpha = eo(t / .3); ctx.strokeStyle = color; ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(x - 14, y); ctx.lineTo(x - 3, y + 12); ctx.lineTo(x + 18, y - 14); ctx.stroke(); ctx.restore(); }
