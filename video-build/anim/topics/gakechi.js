  const SOIL = '#8b6b4a', SOILL = '#c9b28a';
  function cliff(H0 = 140, top = 230, x0 = 330, x1 = 470, base = 560) {
    ctx.fillStyle = SOIL; ctx.beginPath(); ctx.moveTo(0, top); ctx.lineTo(x0, top); ctx.lineTo(x1, base); ctx.lineTo(W, base); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath(); ctx.fill();
    poly([[0, top], [x0, top], [x1, base], [W, base]], SOILL, 5);
  }
  S.push({name: 'タイトル', d: 7, draw: sc.title('崖地条例', '崖の近くに建てる前に確かめること', '測量 ／ 崖高と距離 ／ 東京都と横浜市 ／ 既存擁壁 ／ 関係する指定 ／ 配置案 ／ 施工と点検', 'CM知識一覧｜崖地')});
  S.push({name: '断面を測量', d: 15, draw(t) {
    plain('#e8f1fb'); cliff();
    dimV(500, 230, 560, t - 1, '崖高 H');
    if (t > 2.4) { ctx.strokeStyle = HOT; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(470, 560, 18 + Math.sin(t * 5) * 3, 0, Math.PI * 2); ctx.stroke(); fx('下端', 470, 600, 26, HOT, t - 2.4); }
    if (t > 3.4) fx('上端', 330, 200, 26, '#fff', t - 3.4);
    if (t > 4.6) { const k = eo((t - 4.6) / .6); ctx.fillStyle = '#e8edf5'; ctx.fillRect(800, 560 - 160 * k, 220, 160 * k); ctx.strokeStyle = '#5b6474'; ctx.lineWidth = 3; ctx.strokeRect(800, 560 - 160 * k, 220, 160 * k);
      if (k > .9) { ctx.fillStyle = INK; ctx.font = f(800, 24); ctx.textAlign = 'center'; ctx.fillText('計画建物', 910, 490); } }
    dimH(470, 800, 530, t - 6, '水平距離 D');
    if (t > 8) { poly([[200, 150], [200, 680]], '#fff', 4, [12, 8]); pill('敷地境界', 200, 160, t - 8, {align: 'center', bg: DARK, size: 20}); }
    foot('崖が隣地にあっても、影響があれば調べる範囲に含める', t - 9.5);
    headline('まず[測量]で崖の断面を確定', t);
  }});
  S.push({name: '高さと距離の条件', d: 15, draw(t) {
    plain('#e8f1fb'); cliff();
    dimV(500, 230, 560, t - .6, 'H ＞ 2m');
    if (t > 2.5) { const k = eo((t - 2.5) / 1.2); ctx.fillStyle = 'rgba(232,67,47,.28)'; ctx.fillRect(470, 420, 660 * k, 140); poly([[470, 590], [470 + 660 * k, 590]], HOT, 4);
      if (k > .95) fx('下端から 2H 以内', 800, 620, 30, HOT, t - 3.7); }
    if (t > 5.5) { ctx.fillStyle = '#8a8f99'; ctx.beginPath(); ctx.moveTo(330, 230); ctx.lineTo(372, 230); ctx.lineTo(392, 560); ctx.lineTo(330, 560); ctx.closePath(); ctx.globalAlpha = eo((t - 5.5) / .6); ctx.fill(); ctx.globalAlpha = 1;
      pill('原則：擁壁が必要（例外あり）', 360, 170, t - 6, {align: 'center', bg: ACC, size: 22}); }
    if (t > 8) { ctx.fillStyle = '#e8edf5'; ctx.fillRect(820, 420, 180, 140); ctx.strokeStyle = '#5b6474'; ctx.lineWidth = 3; ctx.strokeRect(820, 420, 180, 140); fx('？', 910, 480, 50, HOT, t - 8.3); }
    foot('東京都建築安全条例6条の例。数値と例外は所在地の条例で確認', t - 9.5);
    headline('高さ[2m超]・下端から[2倍以内]', t);
  }});
  S.push({name: '東京都と横浜市', d: 15, draw: sc.table('自治体で[条件が違う]', ['条例', '高さ・勾配', '距離', '原則の対応'],
    [['東京都\n建築安全条例6条', '高さ2m超', '下端から\n崖高の2倍以内', '高さ2m超の擁壁\n（例外あり）'], ['横浜市\n建築基準条例3条', '勾配30度超\n高さ3m超', '下端から\n崖高の2倍以内', '擁壁または防土堤\n（例外あり）']],
    '測る起点・崖の定義・例外まで、所在地の条例と窓口で確認', [250, 250, 260, 340])});
  S.push({name: '既存擁壁', d: 16, draw(t) {
    plain('#e8f1fb');
    ctx.fillStyle = SOIL; ctx.fillRect(0, 170, 430, 420); ctx.fillStyle = '#8a8f99'; ctx.beginPath(); ctx.moveTo(430, 160); ctx.lineTo(480, 160); ctx.lineTo(505, 590); ctx.lineTo(420, 590); ctx.closePath(); ctx.fill();
    poly([[0, 590], [W, 590]], SOILL, 5);
    if (t > 1.5) { poly([[455, 260], [465, 300], [457, 330], [470, 370]], HOT, 5); fx('ひび割れ', 560, 320, 26, HOT, t - 1.5); }
    if (t > 3) { ctx.fillStyle = '#0b1a40'; ctx.beginPath(); ctx.arc(470, 480, 10, 0, Math.PI * 2); ctx.fill(); flow([[478, 484], [520, 500], [540, 560]], t, COOL, 4, 50, 5); fx('水抜き・湧水', 640, 500, 26, BLUE, t - 3); }
    if (t > 4.5) { arrow(485, 210, 560, 180, '#e09a00', 5, t - 4.5); fx('変位・傾き', 660, 180, 26, '#e09a00', t - 4.8); }
    docIcon(820, 200, 170, 190, '許可・検査', t - 6.5); docIcon(1020, 200, 170, 190, '構造図', t - 7.2);
    foot('築造時の範囲・仕様・増し積みの履歴と、今の状態を照合する', t - 9);
    headline('既存擁壁は[資料]と[現況]で', t);
  }});
  S.push({name: '関係する指定', d: 14, draw: sc.cards('[窓口ごとの判断]を一枚に', [['崖の条例', '崖上・崖下の配置\n安全性の例外'], ['盛土規制法', '規制区域と\n盛土・切土の規模'], ['土砂災害特別警戒区域', '居室のある建物の構造'], ['建築確認', '条例の判断との関係']], '建築・造成・防災の各窓口に相談する')});
  S.push({name: '配置案の比較', d: 16, draw: sc.compare('配置案を[3つ]並べる', [['A案', '建物を後退', ['擁壁工事と隣地への\n影響を抑えやすい', '床面積・駐車・\n消防動線が減る'], '#5b6474'],
    ['B案', '既存擁壁を活用', ['撤去・再施工を\n抑えられる可能性', '調査・補修・監視の費用'], ACC], ['C案', '擁壁を更新', ['新しい計画に合わせて\n安全性を確保', '費用・工期・\n隣地との協議'], GRN]], '客室数と費用に加え、隣地の条件と維持管理の負担も比べる')});
  S.push({name: '判断の順番', d: 14, draw: sc.flow('判断の[順番]', [['測量・既存資料を集める', '現況測量・代表断面・擁壁の資料'], ['地盤・擁壁を専門家が調査', ''], ['条例・造成・防災の窓口へ相談', ''], ['配置と工法を決め、条件を記録', '']], '安全性の確認が済む時点を、土地取得と発注の判断日につなげる')});
  S.push({name: '施工と点検', d: 15, draw(t) {
    plain('#e8f1fb');
    ctx.fillStyle = SOIL; ctx.fillRect(0, 170, 400, 420); ctx.fillStyle = '#8a8f99'; ctx.fillRect(400, 160, 60, 430); poly([[0, 590], [W, 590]], SOILL, 5);
    if (t > 1) { ctx.fillStyle = 'rgba(58,160,255,.3)'; ctx.fillRect(350, 180, 50, 400); fx('裏込め・排水', 250, 230, 24, BLUE, t - 1); }
    if (t > 2) { poly([[380, 570], [560, 570]], COOL, 8); flow([[380, 570], [560, 570]], t, '#fff', 5, 60, 4); }
    if (t > 3.5) { const tt = t - 3.5; ctx.save(); ctx.globalAlpha = eo(tt / .3); ctx.translate(640, 230); ctx.fillStyle = '#13285e'; rr(0, 14, 130, 86, 14); ctx.fill(); ctx.fillStyle = '#fff'; rr(42, 0, 46, 18, 4); ctx.fill();
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(65, 57, 26, 0, Math.PI * 2); ctx.stroke(); ctx.restore(); fx('隠れる前に記録', 705, 360, 26, '#fff', tt); }
    box(860, 200, 360, 300, [['引き渡すもの', 26, 900, INK], ['排水施設の点検項目', 22, 600, '#4a5262'], ['擁壁の点検項目', 22, 600, '#4a5262'], ['連絡先', 22, 600, '#4a5262']], t - 6);
    foot('工事中は掘削の順序・荷重・監視の条件を決めておく', t - 8.5);
    headline('記録して[点検]を引き継ぐ', t);
  }});
  S.push({name: 'まとめ', d: 12, draw: sc.summary([['測る', '崖高・下端\n水平距離', ACC], ['照合する', '条例・指定\n例外', BLUE], ['比べる', '後退・活用\n更新', '#9b59d0'], ['引き継ぐ', '監視・記録\n点検項目', GRN]], '条件は所在地の条例・窓口で確認します ／ ※イラストはイメージです')});
