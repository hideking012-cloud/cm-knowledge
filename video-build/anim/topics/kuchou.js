  S.push({name: 'タイトル', d: 7, draw(t) {
    const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#16304f'); g.addColorStop(1, '#0b1626');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    for (let i = 0; i < 22; i++) { const [a, b, c] = PUFFS[i], ph = (t * .1 + a) % 1;
      ctx.fillStyle = i % 2 ? `rgba(58,160,255,${.22 * (1 - ph)})` : `rgba(255,122,58,${.18 * (1 - ph)})`;
      ctx.beginPath(); ctx.arc(ph * W, b * H + Math.sin(t + i) * 20, 10 + c * 26, 0, Math.PI * 2); ctx.fill(); }
    pill('CM知識一覧｜空調', W / 2, 205, t, {align: 'center', bg: BLUE, size: 28});
    const s = eb((t - .25) / .5);
    if (s > 0) { ctx.save(); ctx.translate(W / 2, 330); ctx.scale(s, s);
      ctx.font = f(900, 112); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.lineWidth = 12; ctx.strokeStyle = '#fff'; ctx.strokeText('空調設備', 0, 0); ctx.fillStyle = BLUE; ctx.fillText('空調設備', 0, 0); ctx.restore(); }
    if (t > .8) { ctx.globalAlpha = eo((t - .8) / .4); ctx.font = f(800, 44); ctx.fillStyle = '#fff'; ctx.textAlign = 'center';
      ctx.fillText('熱を「運ぶ」しくみと、更新の判断', W / 2, 460); ctx.globalAlpha = 1; }
    if (t > 1.4) { ctx.globalAlpha = eo((t - 1.4) / .4); ctx.font = f(500, 23); ctx.fillStyle = '#b9c2d3';
      ctx.fillText('冷媒と水 ／ 2管式・4管式 ／ 外気 ／ 診断 ／ 実測 ／ 能力と電力 ／ 更新案 ／ 工程 ／ 試運転 ／ 引渡し', W / 2, 530); ctx.globalAlpha = 1; }
  }});

  S.push({name: '中間期の不満', d: 15, draw(t) {
    plain('#eaf2fb');
    const y0 = 200, h = 300;
    // 南の客室（左）・北の客室（右）
    ctx.fillStyle = '#fff4e6'; ctx.fillRect(90, y0, 500, h); ctx.fillStyle = '#e8f1ff'; ctx.fillRect(690, y0, 500, h);
    ctx.strokeStyle = '#5b6474'; ctx.lineWidth = 6; ctx.strokeRect(90, y0, 500, h); ctx.strokeRect(690, y0, 500, h);
    ctx.fillStyle = '#9fd3ff'; ctx.fillRect(84, y0 + 70, 12, 140); ctx.fillRect(1184, y0 + 70, 12, 140);
    ctx.fillStyle = INK; ctx.font = f(900, 28); ctx.textAlign = 'center'; ctx.fillText('南向きの客室', 340, y0 - 22); ctx.fillText('北向きの客室', 940, y0 - 22);
    sun(60, 150, t);
    for (let k = 0; k < 4; k++) { const ph = (t * .8 + k / 4) % 1; ctx.strokeStyle = `rgba(255,182,39,${1 - ph})`; ctx.lineWidth = 5;
      ctx.beginPath(); ctx.moveTo(100 + ph * 120, y0 + 60 + k * 30); ctx.lineTo(130 + ph * 120, y0 + 70 + k * 30); ctx.stroke(); }
    fcu(380, y0 + 8, t); fcu(980, y0 + 8, t);
    // 建物全体に温水
    const pipe = [[60, y0 - 50], [1220, y0 - 50]];
    poly(pipe, '#f3b6a6', 14); flow(pipe, t, WARM, 18, 120, 6);
    pill('建物全体に温水', 640, y0 - 50, t - .6, {align: 'center', bg: WARM, size: 22});
    const tS = lerp(24, 28, eio((t - 2) / 5)), tN = lerp(24, 22, eio((t - 2) / 5));
    thermo(250, y0 + 200, tS.toFixed(1) + '℃', HOT, '', t - 1.5); thermo(850, y0 + 200, tN.toFixed(1) + '℃', COOL, '', t - 1.5);
    bubble('暑い…冷房が効かない', 420, y0 + 140, t - 6);
    bubble('少し寒い', 1050, y0 + 140, t - 7.5, COOL);
    if (t > 9.5) pill('築30年・客室120室の架空ホテル（2管式ファンコイル）', W / 2, 640, t - 9.5, {align: 'center', bg: '#1f2430', size: 24});
    headline('秋の中間期：[南は暑く]、[北は寒い]', t);
  }});

  S.push({name: '熱を運ぶ方法', d: 17, draw(t) {
    plain();
    // 左：パッケージエアコン（冷媒）
    ctx.fillStyle = '#fff'; rr(40, 150, 580, 450, 18); ctx.fill(); ctx.fillStyle = '#fff'; rr(660, 150, 580, 450, 18); ctx.fill();
    ctx.fillStyle = INK; ctx.font = f(900, 28); ctx.textAlign = 'center'; ctx.fillText('個別方式（パッケージエアコン）', 330, 192); ctx.fillText('中央方式（ファンコイル）', 950, 192);
    const ref = [[170, 330], [170, 260], [470, 260], [470, 330], [470, 470], [170, 470], [170, 330]];
    poly(ref, '#c9d3e3', 12); if (t > .8) flow(ref, t, '#9b59d0', 14, 110, 7);
    unit(90, 300, 160, 70, '室内機', t - .3); unit(400, 430, 150, 90, '室外機', t - .5);
    pill('冷媒（ガス⇄液体）', 330, 560, t - 1.2, {align: 'center', bg: '#9b59d0', size: 22});
    // 右：熱源機＋ポンプ＋FCU（水）
    const sup = [[780, 470], [780, 270], [1100, 270]], ret = [[1120, 300], [810, 300], [810, 470]];
    poly(sup, '#bcd9ff', 12); poly(ret, '#ffd0bf', 12);
    if (t > 3) { flow(sup, t, COOL, 10, 100, 7); flow(ret, t, '#7fb4ff', 10, 100, 6); }
    unit(700, 440, 200, 90, '熱源機\n冷凍機・ボイラ', t - 2.4, {size: 20}); unit(1070, 250, 140, 70, 'FCU', t - 2.7);
    unit(900, 470, 110, 54, 'ポンプ', t - 3, {size: 20});
    pill('冷水・温水', 950, 560, t - 3.4, {align: 'center', bg: BLUE, size: 22});
    if (t > 7) { pill('漏れると：冷媒の漏えい', 330, 640, t - 7, {align: 'center', bg: '#1f2430', size: 22}); pill('漏れると：漏水', 950, 640, t - 7.6, {align: 'center', bg: '#1f2430', size: 22}); }
    headline('熱を運ぶのは[冷媒]か[水]か', t);
  }});

  S.push({name: '2管式と4管式', d: 17, draw(t) {
    plain();
    ctx.fillStyle = '#fff'; rr(40, 150, 580, 450, 18); ctx.fill(); rr(660, 150, 580, 450, 18); ctx.fill();
    ctx.fillStyle = INK; ctx.font = f(900, 30); ctx.textAlign = 'center'; ctx.fillText('2管式', 330, 195); ctx.fillText('4管式', 950, 195);
    const summer = Math.floor(t / 2.2) % 2 === 0, c2 = summer ? COOL : WARM;
    unit(80, 380, 150, 90, '熱源', t - .2); unit(440, 250, 140, 70, 'FCU', t - .3);
    const s2 = [[230, 405], [330, 405], [330, 270], [440, 270]], r2 = [[440, 300], [360, 300], [360, 445], [230, 445]];
    poly(s2, '#d6dde8', 12); poly(r2, '#d6dde8', 12); if (t > .8) { flow(s2, t, c2, 8, 90, 7); flow(r2, t, c2, 8, 90, 6); }
    pill(summer ? '夏：冷水' : '冬：温水', 330, 520, t - .8, {align: 'center', bg: c2, size: 24});
    if (t > 5) pill('部屋ごとに冷暖を選べない', 330, 565, t - 5, {align: 'center', bg: '#1f2430', size: 22});
    unit(700, 380, 150, 90, '熱源', t - 6); unit(1060, 250, 140, 70, 'FCU', t - 6.1);
    const lines = [[[850, 395], [950, 395], [950, 262], [1060, 262], COOL], [[850, 415], [970, 415], [970, 282], [1060, 282], '#7fb4ff'],
                   [[850, 435], [990, 435], [990, 302], [1060, 302], WARM], [[850, 455], [1010, 455], [1010, 318], [1060, 318], '#ffb08a']];
    lines.forEach((l, k) => { const pts = l.slice(0, 4); poly(pts, '#d6dde8', 9); if (t > 6.6 + k * .2) flow(pts, t, l[4], 7, 90, 5); });
    if (t > 7.5) pill('冷水と温水を同時に：部屋ごとに選べる', 950, 520, t - 7.5, {align: 'center', bg: GRN, size: 22});
    if (t > 10) pill('配管が倍：天井内・費用・工期が増える', 950, 565, t - 10, {align: 'center', bg: HOT, size: 22});
    headline('水の方式は[2管式]と[4管式]', t);
  }});

  S.push({name: '外気は別系統', d: 14, draw(t) {
    plain('#eaf2fb');
    ctx.fillStyle = '#fff'; ctx.fillRect(320, 230, 640, 330); ctx.strokeStyle = '#5b6474'; ctx.lineWidth = 6; ctx.strokeRect(320, 230, 640, 330);
    ctx.fillStyle = '#cfd6e2'; ctx.fillRect(320, 170, 640, 60);
    fcu(560, 238, t);
    // 室内の循環
    for (let k = 0; k < 10; k++) { const a = t * 1.2 + k / 10 * Math.PI * 2; const x = 640 + Math.cos(a) * 200, y = 410 + Math.sin(a) * 90;
      ctx.fillStyle = 'rgba(43,125,233,.55)'; ctx.beginPath(); ctx.arc(x, y, 7, 0, Math.PI * 2); ctx.fill(); }
    pill('FCU：室内の空気を循環して温度調整', 640, 600, t - .6, {align: 'center', bg: BLUE, size: 22});
    // 外調機から外気
    unit(60, 160, 200, 80, '外調機', t - 3, {line: GRN});
    const oa = [[260, 200], [860, 200], [860, 232]]; poly(oa, '#bfe6cf', 14); if (t > 3.6) flow(oa, t, GRN, 12, 110, 6);
    pill('外気を処理して供給', 160, 290, t - 4, {align: 'center', bg: GRN, size: 20});
    const ea = [[420, 232], [420, 140], [1240, 140]]; poly(ea, '#e5d4c7', 14, [18, 10]); if (t > 6) flow(ea, t, '#a0785a', 10, 110, 6);
    pill('排気は別の経路', 1100, 108, t - 6.4, {align: 'center', bg: '#a0785a', size: 20});
    if (t > 8.5) pill('更新案を比べるときも、外気量と換気系統は別に確認', W / 2, 660, t - 8.5, {align: 'center', bg: '#1f2430', size: 22});
    headline('室温の調整と[外気の取り入れ]は別', t);
  }});


  S.push({name: "空気環境の基準", d: 15, draw: sc.table('[空気環境の基準]（特定建築物など）', ['項目', '基準値', '適用の条件'], [['浮遊粉じん・CO・CO2', '0.15mg/m³以下・6ppm以下\n1000ppm以下', '空調または機械換気がある'], ['温度', '18℃以上28℃以下', '空調設備がある'], ['相対湿度', '40%以上70%以下', '空調設備がある']], '特定建築物以外で多数が使う建物は、基準に従う努力義務', [300, 420, 380])});
  S.push({name: '機器の診断', d: 15, draw(t) {
    plain();
    const cw = 560, ch = 200, x0 = 70, y0 = 170, g = 40;
    card(x0, y0, cw, ch, '1', 'コイルの汚れ・腐食', '目視と洗浄後の能力確認\n洗浄で回復するか、交換か', t - .4, BLUE);
    card(x0 + cw + g, y0, cw, ch, '2', 'ドレンパンの錆・漏水', '結露水を受ける皿\n漏水すると客室に被害', t - 2.4, BLUE);
    card(x0, y0 + ch + 22, cw, ch, '3', 'ファンの異音・振動', '軸受の傷み\n部分交換できるか', t - 4.6, BLUE);
    card(x0 + cw + g, y0 + ch + 22, cw, ch, '4', '修理部品の供給', '製造終了で直せない期間は？\nメーカーに書面で確認', t - 6.6, HOT);
    if (t > 9) pill('寿命年数は一律に決めず、状態と部品供給で判断', W / 2, 668, t - 9, {align: 'center', bg: '#1f2430', size: 22});
    headline('更新の前に[機器の状態]を診断', t);
  }});

  S.push({name: '実測', d: 16, draw(t) {
    plain();
    ctx.fillStyle = '#fff'; rr(50, 150, 760, 470, 18); ctx.fill();
    const gx = 120, gy = 560, gw = 640, gh = 340, T2Y = v => gy - (v - 18) / 12 * gh, H2X = h => gx + h / 24 * gw;
    ctx.strokeStyle = '#c4ccd8'; ctx.lineWidth = 2; ctx.font = f(500, 18); ctx.fillStyle = '#5b6474'; ctx.textAlign = 'center';
    for (let h = 0; h <= 24; h += 6) { ctx.beginPath(); ctx.moveTo(H2X(h), gy); ctx.lineTo(H2X(h), gy - gh); ctx.stroke(); ctx.fillText(h + '時', H2X(h), gy + 28); }
    ctx.textAlign = 'right'; for (let v = 20; v <= 28; v += 4) { ctx.fillText(v + '℃', gx - 10, T2Y(v) + 6); }
    poly([[gx, T2Y(24)], [gx + gw, T2Y(24)]], '#8a93a3', 3, [10, 8]); ctx.textAlign = 'left'; ctx.fillStyle = '#5b6474'; ctx.fillText('設定 24℃', gx + gw - 90, T2Y(24) - 10);
    const P = [[0, 23.5], [6, 23.2], [9, 24], [11, 26.5], [13, 28], [15, 27.6], [18, 25], [21, 23.5], [24, 23.4]].map(([h, v]) => [H2X(h), T2Y(v)]);
    const k = eio((t - 1) / 5), L = polyLen(P), part = []; let acc = 0; part.push(P[0]);
    for (let i = 1; i < P.length; i++) { const l = Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]); if (acc + l <= L * k) { part.push(P[i]); acc += l; } else { part.push(along(P, L * k)); break; } }
    if (k > 0) poly(part, HOT, 6);
    if (t > 5) fx('28℃近く', H2X(13), T2Y(28) - 34, 30, HOT, t - 5);
    ctx.fillStyle = INK; ctx.font = f(800, 22); ctx.textAlign = 'left'; ctx.fillText('南向き客室の1日（架空）', 80, 190);
    // 水温
    ctx.fillStyle = '#fff'; rr(850, 150, 380, 470, 18); ctx.fill();
    ctx.fillStyle = INK; ctx.font = f(800, 24); ctx.textAlign = 'center'; ctx.fillText('FCUの水温', 1040, 195);
    fcu(965, 240, t, true);
    thermo(960, 380, '45℃', WARM, '往き', t - 7); thermo(1120, 380, '40℃', '#f59c74', '還り', t - 7.6);
    if (t > 8.5) fx('差 5℃', 1040, 490, 34, BLUE, t - 8.5);
    if (t > 10) pill('運転時間・苦情の時刻・電力量も同時に記録', W / 2, 668, t - 10, {align: 'center', bg: '#1f2430', size: 22});
    headline('まず[測る]：室温と水温を同時に', t);
  }});

  S.push({name: '能力と電力', d: 18, draw(t) {
    plain();
    unit(470, 250, 340, 190, 'ヒートポンプ', t - .3, {size: 30, line: BLUE});
    // 入力（電気）
    if (t > 1.2) { arrow(150, 345, 460, 345, '#ffb627', 10, t - 1.2); fx('電気 1.25kW', 260, 300, 32, '#e09a00', t - 1.6); }
    // 運ぶ熱
    if (t > 3) { for (let k = 0; k < 3; k++) arrow(820, 300 + k * 45, 1150, 300 + k * 45, COOL, 12, t - 3 - k * .2); fx('運ぶ熱 5kW', 1000, 245, 34, BLUE, t - 3.6); }
    if (t > 5.5) box(300, 480, 680, 100, [['入力 ＝ 能力 ÷ COP ＝ 5 ÷ 4 ＝ 1.25kW', 34, 900, INK]], t - 5.5);
    if (t > 8) pill('COP：使った電気の何倍の熱を運べるか', W / 2, 615, t - 8, {align: 'center', bg: BLUE, size: 22});
    if (t > 11) pill('これは瞬間の値。年間の電力量kWhは、負荷・運転時間・補機を含めて別計算', W / 2, 668, t - 11, {align: 'center', bg: HOT, size: 21});
    headline('冷房能力[5kW]は、電気[5kW]ではない', t);
  }});

  S.push({name: '更新案の比較', d: 18, draw(t) {
    plain();
    const cw = 370, x0 = 45, y0 = 160, h = 410;
    const C = [['A', '2管FCUを更新', ['部屋ごとの冷暖：不可', '既存配管：診断して判断', '停止期間：短め'], '#5b6474', .4],
               ['B', '熱源付きFCU（2管のまま）', ['部屋ごとの冷暖：可', '水温・流量・水質を照合', '客室側の電源・騒音'], BLUE, 3.2],
               ['C', '個別エアコン化', ['部屋ごとの冷暖：可', '冷媒管を新設', '室外機の置場・停止期間長め'], GRN, 6]];
    C.forEach(([n, ttl, items, col, t0], i) => {
      const tt = t - t0; if (tt <= 0) return; const x = x0 + i * (cw + 25), s = .85 + .15 * eb(tt / .35);
      ctx.save(); ctx.globalAlpha = cl(tt / .2); ctx.translate(x + cw / 2, y0 + h / 2); ctx.scale(s, s); ctx.translate(-cw / 2, -h / 2);
      ctx.fillStyle = 'rgba(0,0,0,.15)'; rr(4, 6, cw, h, 16); ctx.fill(); ctx.fillStyle = '#fff'; rr(0, 0, cw, h, 16); ctx.fill();
      ctx.fillStyle = col; rr(0, 0, cw, 70, [16, 16, 0, 0]); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.font = f(900, 26); ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(n + '案', 22, 36);
      ctx.font = f(800, 21); ctx.fillText(ttl, 90, 36);
      ctx.fillStyle = INK; ctx.font = f(600, 21);
      items.forEach((it, k) => { if (tt > .6 + k * .5) { ctx.fillStyle = col; ctx.beginPath(); ctx.arc(28, 120 + k * 80, 7, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = INK; ctx.fillText(it, 46, 121 + k * 80); } });
      ctx.restore();
    });
    if (t > 9.5) pill('どの案でも外気系統は別に確認 ／ 同じ条件（費用・電力量・停止室数）で比べる', W / 2, 640, t - 9.5, {align: 'center', bg: '#1f2430', size: 21});
    headline('更新案は[同じ条件]で比べる', t);
  }});

  S.push({name: '天井内の納まり', d: 15, draw(t) {
    plain('#eaf2fb');
    ctx.fillStyle = '#8a8f99'; ctx.fillRect(60, 150, 1160, 40);
    ctx.fillStyle = '#7a808c'; ctx.fillRect(520, 190, 240, 90); ctx.fillStyle = '#fff'; ctx.font = f(800, 22); ctx.textAlign = 'center'; ctx.fillText('梁', 640, 240);
    ctx.fillStyle = '#c9ced8'; ctx.fillRect(60, 470, 1160, 16); ctx.fillStyle = INK; ctx.font = f(700, 20); ctx.textAlign = 'left'; ctx.fillText('天井', 70, 510);
    if (t > 2.4) { const dx = (1 - eo((t - 2.4) / 1)) * -300; ctx.save(); ctx.translate(dx, 0); fcu(560, 400, t, true, 170, 60); ctx.restore(); }
    if (t > 3.6) { poly([[60, 310], [1220, 310]], '#bfe6cf', 26); flow([[60, 310], [1220, 310]], t, GRN, 14, 90, 6); ctx.fillStyle = GRN; ctx.font = f(800, 20); ctx.fillText('外気ダクト', 80, 300); }
    if (t > 4.8) { poly([[60, 355], [1220, 355]], '#bcd9ff', 12); poly([[60, 378], [1220, 378]], '#ffd0bf', 12); flow([[60, 355], [1220, 355]], t, COOL, 14, 100, 5); ctx.fillStyle = BLUE; ctx.fillText('冷温水管', 80, 346); }
    if (t > 6.5) fx('通るか？', 640, 330, 34, HOT, t - 6.5);
    dimV(1000, 280, 470, t - .6, '梁下の有効高さ');
    if (t > 8.5) { ctx.fillStyle = '#5b6474'; ctx.fillRect(300, 468, 110, 20); pill('点検口', 355, 535, t - 8.5, {align: 'center', bg: '#5b6474', size: 20}); }
    if (t > 10) pill('室外機の置場と騒音・既存冷媒の回収方法も早めに決める', W / 2, 640, t - 10, {align: 'center', bg: '#1f2430', size: 22});
    headline('天井の中に[納まるか]を確かめる', t);
  }});

  S.push({name: '工程と営業', d: 16, draw(t) {
    plain();
    const x = 120, w = 420, fh = 52, top = 150;
    for (let i = 0; i < 8; i++) {
      const fl = 8 - i, y = top + i * fh, k = fl >= 3 ? (8 - fl) : -1, tt = t - 1 - k * 1.4;
      ctx.fillStyle = '#dfe6f1'; ctx.fillRect(x, y, w, fh - 4);
      if (k >= 0 && tt > 0) { ctx.fillStyle = `rgba(232,67,47,${.25 + .55 * eo(tt / .5)})`; ctx.fillRect(x, y, w * eo(tt / .5), fh - 4); }
      ctx.fillStyle = INK; ctx.font = f(800, 20); ctx.textAlign = 'right'; ctx.textBaseline = 'middle'; ctx.fillText(fl + 'F', x - 14, y + fh / 2);
      if (k >= 0 && tt > .4) { ctx.textAlign = 'left'; ctx.fillStyle = INK; ctx.font = f(700, 19); ctx.fillText(`第${k * 2}〜${k * 2 + 2}週　20室停止`, x + w + 20, y + fh / 2); }
    }
    if (t > 10) { box(820, 220, 400, 230, [['工程に入れる', 26, 900, INK], ['騒音作業の時間帯', 22, 600, '#4a5262'], ['資材の搬入経路', 22, 600, '#4a5262'], ['エレベーターの使用時間', 22, 600, '#4a5262']], t - 10); }
    if (t > 12) pill('販売停止の範囲と期間は運営と合意してから確定（工程は架空例）', W / 2, 640, t - 12, {align: 'center', bg: '#1f2430', size: 21});
    headline('営業しながら[1フロアずつ]止めて更新', t);
  }});

  S.push({name: '試運転', d: 16, draw(t) {
    plain();
    const rows = [['冷房 吹出温度', '14.5℃'], ['風量（強）', '520 m³/h'], ['冷水 往き／還り', '7℃／12℃'], ['室内騒音', '38 dB'], ['ドレン排水', '漏れなし']];
    const x0 = 140, y0 = 160, rh = 74;
    ctx.fillStyle = '#1f2430'; rr(x0, y0, 1000, 60, [14, 14, 0, 0]); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.font = f(800, 22); ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillText('項目', x0 + 30, y0 + 31); ctx.fillText('測定値（架空）', x0 + 420, y0 + 31); ctx.fillText('判定', x0 + 820, y0 + 31);
    rows.forEach(([a, b], i) => { const tt = t - .8 - i * 1.3; if (tt <= 0) return; const y = y0 + 60 + i * rh;
      ctx.globalAlpha = eo(tt / .3); ctx.fillStyle = i % 2 ? '#f6f8fb' : '#fff'; ctx.fillRect(x0, y, 1000, rh);
      ctx.fillStyle = INK; ctx.font = f(700, 24); ctx.fillText(a, x0 + 30, y + rh / 2); ctx.font = f(900, 26); ctx.fillText(b, x0 + 420, y + rh / 2);
      if (tt > .6) { ctx.fillStyle = GRN; ctx.font = f(900, 26); ctx.fillText('✓ 記録', x0 + 820, y + rh / 2); }
      ctx.globalAlpha = 1; });
    if (t > 8.5) pill('判定の基準は設計図書・メーカー資料 ／ 試験は専門業者、CMは計画と記録を確認', W / 2, 640, t - 8.5, {align: 'center', bg: BLUE, size: 21});
    headline('試運転は[値]と[判定の根拠]を記録', t);
  }});

  S.push({name: '引渡し', d: 15, draw(t) {
    plain();
    const D = [['試運転記録', '全客室の測定値と判定'], ['取扱説明・操作研修', '運営・設備管理へ'], ['保守の連絡先・点検計画', '部品供給も'], ['残る不具合と期限', '内容・期限・担当']];
    D.forEach(([a, b], i) => cardSm(70, 160 + i * 112, 640, 96, String(i + 1), a, b, t - .5 - i * 1.4, BLUE));
    if (t > 6.8) { box(780, 200, 430, 300, [['フロン類の回収', 30, 900, HOT], ['対象機器の廃棄では', 22, 600, '#4a5262'], ['登録業者へ回収を依頼', 22, 600, '#4a5262'], ['引取の書面まで確認', 24, 900, INK]], t - 6.8); }
    if (t > 10) pill('書類と担当をそろえて、運営と設備管理へ渡す', W / 2, 640, t - 10, {align: 'center', bg: '#1f2430', size: 22});
    headline('引渡しは[記録]と[担当]をセットで', t);
  }});

  S.push({name: "よくある失敗", d: 15, draw: sc.ng('よくある[失敗]', [['能力kWを電力kWと読む', 'COPで割る・年間は別計算'], ['外気の系統を見落とす', '換気は別に確認'], ['案ごとに条件が違う', '同じ条件で比べる'], ['冷媒回収の書面がない', '登録業者と引取の書面']], '')});
  S.push({name: "実践チェックリスト", d: 15, draw: sc.table('実践[チェックリスト]', ['段階', '確認すること'], [['相談・仕組み', '苦情の場所・時刻・季節／冷媒か水か・2管か4管か・外気'], ['診断・実測', '劣化と部品供給を書面で／室温・水温・運転時間'], ['計算・比較', '能力kW・電力kW・電力量kWhを区別／同じ条件で比較'], ['設計・工程', '天井内・室外機置場・冷媒回収／販売停止を運営と合意'], ['試験・引渡し', '判定基準の出典と記録／冷媒回収の書面と保守体制']], '', [260, 840])});
  S.push({name: 'まとめ', d: 13, draw(t) {
    const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#16304f'); g.addColorStop(1, '#0b1626');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    const tiles = [['知る', '冷媒か水か\n2管か4管か', BLUE], ['測る', '室温・水温\n運転時間', GRN], ['比べる', '同じ条件で\nA・B・C案', '#9b59d0'], ['引き渡す', '工程・試験\n記録と冷媒回収', HOT]];
    tiles.forEach(([a, b, col], i) => {
      const tt = t - .5 - i * .9; if (tt <= 0) return;
      const x = 70 + i * 290, y = 190, s = .8 + .2 * eb(tt / .35);
      ctx.save(); ctx.globalAlpha = cl(tt / .2); ctx.translate(x + 130, y + 150); ctx.scale(s, s); ctx.translate(-130, -150);
      ctx.fillStyle = '#fff'; rr(0, 0, 260, 300, 22); ctx.fill(); ctx.fillStyle = col; rr(0, 0, 260, 110, [22, 22, 0, 0]); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.font = f(900, 44); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(a, 130, 57);
      ctx.fillStyle = INK; ctx.font = f(700, 26); b.split('\n').forEach((l, k) => ctx.fillText(l, 130, 170 + k * 44));
      ctx.restore();
    });
    if (t > 4.5) { ctx.globalAlpha = eo((t - 4.5) / .5); ctx.font = f(500, 18); ctx.fillStyle = '#b9c2d3'; ctx.textAlign = 'center';
      ctx.fillText('数値は説明用の架空試算。判定の基準は各案件の設計図書・メーカー資料によります ／ ※イラストはイメージです', W / 2, 640); ctx.globalAlpha = 1; }
    pill('まとめ', W / 2, 110, t, {align: 'center', bg: BLUE, size: 30});
  }});
