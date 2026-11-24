  S.push({name: 'タイトル', d: 7, draw: sc.title('バリアフリー改修', '入口から客室まで、途切れない動線を', '適用範囲 ／ 経路をたどる ／ 客室の実測 ／ 改修案 ／ 他の基準との調整 ／ 実寸確認 ／ 情報と対応', 'CM知識一覧｜バリアフリー')});
  S.push({name: '適用と目標', d: 14, draw: sc.flow('[適用範囲]と[目標]を決める', [['バリアフリー法・施行令と条例を照合', ''], ['新築・増改築・用途変更と対象部分を確認', ''], ['法令の基準と施設独自の目標を記録', '推奨事項も設計条件にする']], '便所・駐車場などの基準は令和7年6月に見直し。施行日と工事範囲を照合')});
  S.push({name: '経路をたどる', d: 15, draw(t) {
    plain('#eef3f7');
    const P = [[110, 560], [300, 560], [300, 470], [520, 470], [520, 300], [760, 300], [760, 200], [1060, 200]];
    unit(60, 580, 180, 70, '車寄せ', t - .3, {size: 22}); unit(380, 500, 180, 70, '受付', t - .6, {size: 22}); unit(560, 320, 160, 160, '昇降機', t - .9, {size: 22}); unit(1000, 220, 200, 100, '客室・浴室', t - 1.2, {size: 22, line: GRN});
    if (t > 2) { const L = polyLen(P), k = eio((t - 2) / 5); poly(P, 'rgba(30,158,90,.25)', 14); const [x, y] = along(P, L * k);
      ctx.fillStyle = ACC; ctx.beginPath(); ctx.arc(x, y - 18, 12, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = ACC; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(x, y + 6, 16, 0, Math.PI * 2); ctx.stroke(); }
    if (t > 4) { ctx.strokeStyle = HOT; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(300, 515, 26 + Math.sin(t * 5) * 3, 0, Math.PI * 2); ctx.stroke(); fx('段差は？', 300, 620, 26, HOT, t - 4); }
    if (t > 6) { ctx.strokeStyle = HOT; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(1000, 200, 24 + Math.sin(t * 5) * 3, 0, Math.PI * 2); ctx.stroke(); fx('扉の幅は？', 900, 150, 26, HOT, t - 6); }
    foot('1か所の段差や狭い扉でも、経路全体が使いにくくなる', t - 8.5);
    headline('車寄せから客室まで[一続き]にたどる', t);
  }});
  S.push({name: '客室の実測', d: 15, draw(t) {
    plain();
    ctx.fillStyle = '#fff'; ctx.fillRect(100, 160, 760, 440); ctx.strokeStyle = '#5b6474'; ctx.lineWidth = 6; ctx.strokeRect(100, 160, 760, 440);
    ctx.fillStyle = '#e8eef7'; ctx.fillRect(103, 163, 280, 230); ctx.strokeStyle = '#5b6474'; ctx.lineWidth = 3; ctx.strokeRect(103, 163, 280, 230); ctx.fillStyle = INK; ctx.font = f(800, 22); ctx.textAlign = 'center'; ctx.fillText('浴室', 243, 200);
    ctx.fillStyle = '#cfd9f5'; rr(560, 300, 260, 170, 10); ctx.fill(); ctx.fillStyle = INK; ctx.fillText('ベッド', 690, 392);
    if (t > 1) { ctx.fillStyle = '#fff'; ctx.fillRect(94, 470, 12, 110); poly([[80, 470], [80, 580]], '#e09a00', 5); fx('扉の有効幅', 200, 525, 24, '#e09a00', t - 1); }
    if (t > 3) { ctx.strokeStyle = GRN; ctx.lineWidth = 4; ctx.setLineDash([10, 8]); ctx.beginPath(); ctx.arc(450, 470, 75 * eo((t - 3) / .6), 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]); fx('移乗・回転の空間', 450, 470, 22, GRN, t - 3.4); }
    if (t > 5) { poly([[130, 300], [350, 300]], BLUE, 8); fx('手すり', 240, 270, 22, BLUE, t - 5); poly([[150, 360], [330, 360]], HOT, 5); fx('段差', 240, 385, 22, HOT, t - 5.4); }
    box(900, 180, 320, 400, [['実測すること', 25, 900, INK], ['扉の有効寸法', 21, 600, '#4a5262'], ['移乗の空間', 21, 600, '#4a5262'], ['手すり・段差', 21, 600, '#4a5262'], ['スイッチの位置', 21, 600, '#4a5262'], ['緊急連絡', 21, 600, '#4a5262']], t - 7);
    headline('客室は[家具を置いて]実測する', t);
  }});
  S.push({name: '改修案', d: 15, draw: sc.compare('旧館の客室を[使いやすく]する案', [['', '入口に近い客室を改修', ['受付からの経路', '客室単価\n共用便所との距離'], '#5b6474'], ['', '隣の客室と一体化', ['販売客室数が減る', '区画・設備と工費'], ACC], ['', '共用部とあわせて改修', ['経路全体を改善', '工期と費用'], BLUE]], '広さだけでなく、利用の経路と営業の条件で比べる')});
  S.push({name: '他の基準との調整', d: 15, draw: sc.table('扉やスロープは[他の基準]と調整', ['変更', '照合先'], [['出入口の拡幅・扉の変更', '防火区画・避難・扉の動作'], ['浴室・便所の改修', '床の高さ・防水・給排水・清掃と保守'], ['昇降設備・段差の解消', '構造・設置場所・保守']], '', [440, 660])});
  S.push({name: '実寸で確認', d: 14, draw(t) {
    plain();
    box(90, 170, 500, 330, [[' ', 10, 400, INK]], t - .3);
    if (t > .5) { ctx.fillStyle = INK; ctx.font = f(900, 26); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('実物・実寸のサンプル', 340, 215); }
    if (t > 1.2) { ctx.strokeStyle = BLUE; ctx.lineWidth = 4; ctx.setLineDash([12, 8]); ctx.strokeRect(150, 250, 380, 200); ctx.setLineDash([]); ctx.fillStyle = '#cfd9f5'; ctx.fillRect(170, 330, 120, 100); }
    if (t > 2.5) { poly([[150, 470], [530, 470]], '#e09a00', 5); fx('家具を置いた内法', 340, 540, 24, '#e09a00', t - 2.5); }
    box(660, 170, 530, 330, [['運営と確認', 26, 900, INK], ['利用者への案内', 22, 600, '#4a5262'], ['緊急時の連絡', 22, 600, '#4a5262'], ['スタッフの支援', 22, 600, '#4a5262']], t - 5);
    headline('[実寸]で使い勝手を確かめる', t);
  }});
  S.push({name: '情報と対応', d: 14, draw: sc.table('予約から[チェックアウト]まで一致させる', ['引き渡すもの', '使う場面'], [['客室・経路の情報', '予約の案内・到着前の相談'], ['機器と備品の使い方', '案内・清掃・初期のトラブル'], ['緊急時の連絡と支援', '夜間や災害のとき']], '', [460, 640])});
  S.push({name: 'まとめ', d: 12, draw: sc.summary([['照合する', '法令・条例\n施設の目標', ACC], ['たどる', '車寄せから\n客室まで', BLUE], ['測る', '家具を置いた\n内法', '#e09a00'], ['伝える', '予約の案内\n緊急時の支援', GRN]], '基準は法令・条例と所管で確認します ／ ※イラストはイメージです')});
