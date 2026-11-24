  S.push({name: 'タイトル', d: 7, draw: sc.title('タイムマネジメント', '重要な仕事の時間を、先に確保する', '実績ログ ／ 重要度と緊急度 ／ 完了条件 ／ 作業可能枠 ／ 予備 ／ 予約 ／ 割り込み ／ 翌週レビュー', 'CM知識一覧｜実務スキル')});
  S.push({name: 'タスクとタイム', d: 14, draw: sc.compare('[タスク管理]と[タイム管理]の違い', [['', 'タスク管理', ['何を・誰が・完了条件・期限', '道具：タスク一覧・ボード', '失敗：やることが漏れる'], '#5b6474'], ['', 'タイム管理', ['いつ・何分・どの枠で', '道具：カレンダー・時間ログ', '失敗：時間が取れず遅れる'], ACC]], '一覧を時間枠に予約して、初めて実行できる')});
  S.push({name: '実績ログ', d: 15, draw(t) {
    plain(); ctx.fillStyle = '#5b6474'; ctx.font = f(600, 20); ctx.textAlign = 'left'; ctx.fillText('3日間の平均（架空例・分／日）', 90, 160);
    const D = [['会議', 150, '#5b6474'], ['割り込み対応', 90, HOT], ['メール', 80, '#8a93a3'], ['移動', 60, '#aab6c8'], ['資料作成', 100, ACC]];
    D.forEach(([l, v, c], i) => { const tt = t - .5 - i * .9, y = 190 + i * 76; ctx.fillStyle = INK; ctx.font = f(800, 23); ctx.textAlign = 'right'; ctx.fillText(l, 280, y + 36);
      if (tt > 0) { const k = eo(tt / .6); ctx.fillStyle = c; ctx.fillRect(300, y + 8, v * 4 * k, 54); if (k > .9) { ctx.fillStyle = INK; ctx.textAlign = 'left'; ctx.fillText(v + '分', 300 + v * 4 + 12, y + 36); } } });
    if (t > 6) { ctx.strokeStyle = HOT; ctx.lineWidth = 5; ctx.globalAlpha = .6 + .4 * Math.sin(t * 5); rr(290, 488, 430, 70, 10); ctx.stroke(); ctx.globalAlpha = 1; fx('考える仕事は100分だけ', 980, 525, 28, HOT, t - 6); }
    foot('感覚で見積もると、会議や割り込みを少なく見がち。まず数日記録する', t - 8);
    headline('まず[実績]を記録する', t);
  }});
  S.push({name: '時間ログの例', d: 14, draw: sc.table('時間ログは[予定内・予定外]も書く', ['時間帯', '内容', '区分', '予定'], [['9:00–10:00', '定例会議（施工者）', '会議', '予定内'], ['10:00–10:25', '施工者から仕様確認の電話', '割り込み', '予定外'], ['14:00–14:30', '現場からの問合せ', '割り込み', '予定外'], ['16:00–16:30', '承認資料の作成（途中で中断）', '資料作成', '予定内']], '記録の細かさは、続けられる粒度で決める', [220, 500, 200, 180])});
  S.push({name: '重要度と緊急度', d: 15, draw(t) {
    plain(); const x0 = 200, y0 = 170, w = 440, h = 210;
    ctx.fillStyle = '#5b6474'; ctx.font = f(800, 22); ctx.textAlign = 'center'; ctx.fillText('緊急', x0 + w / 2, y0 - 12); ctx.fillText('緊急でない', x0 + w * 1.5 + 20, y0 - 12);
    ctx.textAlign = 'right'; ctx.fillText('重要', x0 - 16, y0 + h / 2); ctx.fillText('重要でない', x0 - 16, y0 + h * 1.5 + 20);
    [['すぐ対応', '安全連絡・事故の対応', HOT], ['時間を予約', '長納期設備の承認準備', ACC], ['まとめる・任せる', '定型の問合せ返信', '#8a93a3'], ['減らす・やめる', '資料の体裁直し', '#b0b8c6']].forEach(([a, b, c], i) => { const tt = t - .5 - i * 1.3; if (tt <= 0) return;
      const x = x0 + (i % 2) * (w + 20), y = y0 + Math.floor(i / 2) * (h + 20); ctx.globalAlpha = cl(tt / .3); ctx.fillStyle = c; rr(x, y, w, h, 16); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.font = f(900, 30); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(a, x + w / 2, y + h / 2 - 22); ctx.font = f(600, 22); ctx.fillText(b, x + w / 2, y + h / 2 + 26); ctx.globalAlpha = 1; });
    if (t > 7) { ctx.strokeStyle = '#ffd84a'; ctx.lineWidth = 8; rr(x0 + w + 16, y0 - 4, w + 8, h + 8, 18); ctx.stroke(); }
    headline('[重要・急がない]仕事に先に時間を', t);
  }});
  S.push({name: '完了条件と所要時間', d: 15, draw: sc.table('着手前に[完了条件]を合意する', ['成果物', '完了条件', '所要時間'], [['承認資料', '上長が内容を確認済み', '120分'], ['見積比較表', '3社を同じ条件で比較できる', '90分'], ['工程確認', '長納期品の納期が確定', '60分'], ['議事録', '決定事項に担当と期限が入る', '30分']], '合計300分（架空例）。途中で早めに方向を確認する', [300, 560, 240])});
  S.push({name: '作業可能枠', d: 16, draw(t) {
    plain(); const X = m => 120 + m * 1.9;
    ctx.fillStyle = '#5b6474'; ctx.font = f(600, 20); ctx.textAlign = 'left'; ctx.fillText('9:00〜18:00 の枠 540分', 120, 170);
    if (t > .5) { ctx.fillStyle = '#dfe6f1'; ctx.fillRect(X(0), 190, X(540) - X(0), 70); }
    const seg = (a, b, c, lab, tt, y = 190) => { if (tt <= 0) return; ctx.globalAlpha = eo(tt / .4); ctx.fillStyle = c; ctx.fillRect(X(a), y, X(b) - X(a), 70); ctx.fillStyle = '#fff'; ctx.font = f(800, 20); ctx.textAlign = 'center'; ctx.fillText(lab, (X(a) + X(b)) / 2, y + 42); ctx.globalAlpha = 1; };
    seg(60, 120, '#5b6474', '会議', t - 1.5); seg(180, 240, '#8a93a3', '休憩', t - 2.2); seg(360, 420, '#5b6474', '会議', t - 2.9);
    if (t > 4.5) { seg(0, 300, ACC, '計画作業 300分', t - 4.5, 320); seg(300, 360, '#e09a00', '予備 60', t - 5.5, 320); }
    if (t > 7) box(200, 440, 880, 130, [['作業可能枠 360分 ＝ 540 − 会議120 − 休憩60', 28, 900, INK], ['＝ 計画300分 ＋ 予備60分', 26, 800, ACC]], t - 7);
    headline('[作業可能枠]を計算して予備を残す', t);
  }});
  S.push({name: '予備は分で', d: 12, draw(t) { plain(); box(140, 190, 1000, 330, [['予備は「分」で持つ', 34, 900, ACC], ['割合で書くなら分母を添える（枠360分か、計画300分か）', 23, 700, INK], ['大きさは、割り込みの実績から決める', 23, 700, INK], ['「必ず○割」のような一律の値は使わない', 22, 600, '#4a5262']], t - .5); headline('予備は[分]で考える', t); }});
  S.push({name: '先に予約する', d: 15, draw(t) {
    plain(); const days = ['月', '火', '水', '木', '金'], x0 = 160, cw = 200, y0 = 190, rh = 70;
    days.forEach((d, i) => { ctx.fillStyle = INK; ctx.font = f(800, 24); ctx.textAlign = 'center'; ctx.fillText(d, x0 + i * cw + cw / 2, 175); ctx.fillStyle = '#eef1f6'; ctx.fillRect(x0 + i * cw + 6, y0, cw - 12, rh * 5); });
    const blk = (d, r, h, c, lab, tt) => { if (tt <= 0) return; ctx.globalAlpha = eo(tt / .3); ctx.fillStyle = c; rr(x0 + d * cw + 10, y0 + r * rh + 4, cw - 20, h * rh - 8, 8); ctx.fill(); ctx.fillStyle = '#fff'; ctx.font = f(800, 19); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(lab, x0 + d * cw + cw / 2, y0 + r * rh + h * rh / 2); ctx.globalAlpha = 1; };
    blk(0, 0, 1.5, ACC, '承認資料', t - .5); blk(2, 0, 1.5, ACC, '承認資料', t - .9); blk(1, 0, 1.5, BLUE, '見積比較', t - 1.3); blk(3, 0, 1.5, BLUE, '見積比較', t - 1.7);
    for (let d = 0; d < 5; d++) blk(d, 4, 1, '#e09a00', '予備', t - 3 - d * .2);
    for (let d = 0; d < 5; d++) blk(d, 2, 1, '#8a93a3', '会議', t - 5 - d * .2);
    foot('会議が入る前に、集中枠と予備枠を週の予定に入れる', t - 7.5);
    headline('重要な作業の時間を[先に予約]する', t);
  }});
  S.push({name: '割り込みの振り分け', d: 14, draw: sc.flow('割り込みを[振り分ける]', [['安全・緊急', '電話など即時のルートで対応'], ['2分で済む', 'その場で処理（目安）'], ['それ以外', 'メモして後でまとめる'], ['終わったら元の作業へ', '']], 'メールをまとめる時間帯でも、安全・緊急の連絡は待たせない')});
  S.push({name: '事例で考える', d: 14, draw: sc.quiz('集中枠の最中に、運営から「客室の色の件で少しよろしいですか」と声がかかりました。', ['安全に関わらなければ、決めた枠（15時）でまとめて確認する', 'すぐに集中枠を中断して対応する'], 0, '安全・緊急なら即時。それ以外は決めた枠でまとめて確認する')});
  S.push({name: '時短しないもの', d: 14, draw: sc.compare('[削ってよいもの]と[削らないもの]', [['', '減らしてよい例', ['資料の過剰な体裁直し', '会議での資料の読み上げ', '同じ内容の重複報告'], '#5b6474'], ['', '削らないもの', ['安全確認', '法令で決まった\n検査・届出の期限', '受入れ検査・引渡し前の確認'], HOT]], '時間が足りないことを理由に、安全と法令の確認は省略しない')});
  S.push({name: '翌週レビュー', d: 15, draw(t) {
    plain(); const vals = [310, 340, 290, 360, 300], X = i => 220 + i * 170, Y = v => 560 - (v - 200) * 2;
    poly([[180, Y(300)], [1080, Y(300)]], '#8a93a3', 3, [10, 8]); ctx.fillStyle = '#5b6474'; ctx.font = f(700, 20); ctx.textAlign = 'left'; ctx.fillText('計画 300', 1090, Y(300) + 6);
    vals.forEach((v, i) => { const tt = t - .5 - i * .5; ctx.fillStyle = INK; ctx.font = f(800, 22); ctx.textAlign = 'center'; ctx.fillText('月火水木金'[i], X(i), 600);
      if (tt > 0) { const k = eo(tt / .6); ctx.fillStyle = v > 300 ? HOT : ACC; ctx.fillRect(X(i) - 40, 560 - (v - 200) * 2 * k, 80, (v - 200) * 2 * k); if (k > .9) ctx.fillText(String(v), X(i), Y(v) - 12); } });
    if (t > 4) { poly([[180, Y(320)], [1080, Y(320)]], '#e09a00', 3); fx('平均 320分', 1000, Y(320) - 26, 24, '#e09a00', t - 4); }
    if (t > 6) pill('次の週：計画280分＋予備80分（枠360分は同じ）', W / 2, 640, t - 6, {align: 'center', bg: ACC, size: 22});
    headline('翌週に[計画と実績]を比べて直す', t);
  }});
  S.push({name: 'チェックリスト', d: 14, draw: sc.table('実践[チェックリスト]', ['手順', '確認すること'], [['記録する', '数日間、実際に使った時間をログに付けたか'], ['分ける', '重要度と緊急度で仕事を分けたか'], ['合意する', '成果物の完了条件と所要時間を書いたか'], ['計算する', '作業可能枠を出し、予備を分で残したか'], ['予約・見直し', '集中枠を先に予約し、翌週に実績で直したか']], '', [260, 840])});
  S.push({name: 'まとめ', d: 12, draw: sc.summary([['記録する', '実績ログを\n数日', ACC], ['予約する', '重要な作業を\n先に', BLUE], ['残す', '予備は\n分で', '#e09a00'], ['直す', '翌週に\n見積もりを', GRN]], '時間・回数は架空例または運用例です。自分に合う方法を試して見つけます')});
