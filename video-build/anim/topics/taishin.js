  S.push({name: 'タイトル', d: 7, draw: sc.title('耐震改修', '診断を読み、補強と営業を両立させる', '建物の履歴 ／ 階と方向 ／ 目標性能 ／ 補強案 ／ 設計・発注 ／ 接合部の検査 ／ 履歴の引継ぎ', 'CM知識一覧｜耐震')});
  S.push({name: '建物の履歴', d: 15, draw(t) {
    plain(); poly([[80, 260], [1200, 260]], '#8a93a3', 8);
    const pt = (x, lab, c, tt) => { if (tt <= 0) return; ctx.globalAlpha = eo(tt / .3); ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, 260, 16, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = INK; ctx.font = f(800, 24); ctx.textAlign = 'center'; ctx.fillText(lab, x, 220); ctx.globalAlpha = 1; };
    pt(150, '建設', '#5b6474', t - .3);
    if (t > 1.2) { poly([[440, 200], [440, 320]], ACC, 5, [10, 8]); fx('昭和56年6月', 440, 350, 26, ACC, t - 1.2); ctx.fillStyle = '#4a5262'; ctx.font = f(600, 20); ctx.textAlign = 'center'; if (t > 1.6) ctx.fillText('新しい耐震基準', 440, 385); }
    pt(760, '増築', '#5b6474', t - 2.6); pt(1100, '今回', GRN, t - 3.4);
    docIcon(110, 430, 200, 170, '構造図', t - 5); docIcon(340, 430, 200, 170, '確認・増築', t - 5.6);
    box(600, 430, 600, 170, [['構造技術者へ診断を依頼', 26, 900, INK], ['耐震改修促進法の対象か照合（用途・規模・指定）', 19, 600, '#4a5262']], t - 7);
    headline('まず[建設時期と履歴]を集める', t);
  }});
  S.push({name: '階と方向で読む', d: 15, draw(t) {
    plain(); const vals = [[.95, .9], [.85, .7], [.75, .45], [.8, .5]];
    ctx.fillStyle = INK; ctx.font = f(800, 22); ctx.textAlign = 'center'; ctx.fillText('X方向', 400, 165); ctx.fillText('Y方向', 860, 165);
    vals.forEach(([x, y], i) => { const yy = 190 + i * 95, tt = t - .5 - i * .7; ctx.fillStyle = INK; ctx.textAlign = 'right'; ctx.font = f(800, 24); ctx.fillText((4 - i) + 'F', 160, yy + 40);
      if (tt > 0) { const k = eo(tt / .8); ctx.fillStyle = BLUE; ctx.fillRect(200, yy + 15, 400 * x * k, 50); ctx.fillStyle = y < .6 ? HOT : BLUE; ctx.fillRect(660, yy + 15, 400 * y * k, 50); } });
    if (t > 3.5) { poly([[200 + 400 * .6, 180], [200 + 400 * .6, 580]], '#e09a00', 4, [10, 8]); poly([[660 + 400 * .6, 180], [660 + 400 * .6, 580]], '#e09a00', 4, [10, 8]); pill('判定の目安（図解用）', 330, 600, t - 3.5, {align: 'center', bg: '#e09a00', size: 20}); }
    if (t > 5.5) { ctx.strokeStyle = HOT; ctx.lineWidth = 5; ctx.globalAlpha = .6 + .4 * Math.sin(t * 5); ctx.strokeRect(645, 370, 440, 190); ctx.globalAlpha = 1; fx('低層のY方向が弱い', 865, 600, 26, HOT, t - 5.5); }
    foot('数値は診断の方法・判定の基準・材料強度などの前提とあわせて読む', t - 9);
    headline('平均で読まず[階と方向]で読む', t);
  }});
  S.push({name: '目標性能', d: 15, draw: sc.cards('目標を[人命]と[営業]で決める', [['人命の安全', '倒壊の防止\n避難経路・落下対策', HOT], ['被災後の運営', '給水・電源・空調\n機器の固定'], ['工事中の事業継続', '工区・客室の閉鎖\n仮設'], ['非構造部材も', '天井・外装・設備の\n落下と転倒', '#e09a00']], '構造体と、天井や設備などの対策は別々に確認する')});
  S.push({name: '補強案', d: 16, draw(t) {
    plain('#eef3f7');
    ctx.fillStyle = '#dfe6f1'; ctx.fillRect(330, 170, 440, 420); for (let i = 1; i < 5; i++) poly([[330, 170 + i * 84], [770, 170 + i * 84]], '#9aa6b8', 4);
    if (t > 1.5) { ctx.globalAlpha = eo((t - 1.5) / .5); poly([[400, 422], [520, 506]], ACC, 10); poly([[520, 422], [400, 506]], ACC, 10); poly([[400, 506], [520, 590]], ACC, 10); poly([[520, 506], [400, 590]], ACC, 10); ctx.globalAlpha = 1; fx('内部補強', 460, 395, 26, ACC, t - 1.5); }
    if (t > 4) { const k = eo((t - 4) / .6); ctx.fillStyle = GRN; ctx.fillRect(772, 590 - 168 * k, 30, 168 * k); fx('外側補強', 870, 395, 26, GRN, t - 4.4); }
    box(40, 200, 260, 170, [['内部', 26, 900, ACC], ['営業階・通路の改修', 19, 600, '#4a5262'], ['設備・仕上げの復旧', 19, 600, '#4a5262']], t - 2.5);
    box(960, 200, 280, 170, [['外側', 26, 900, GRN], ['敷地・基礎', 19, 600, '#4a5262'], ['景観・搬入', 19, 600, '#4a5262']], t - 5);
    box(960, 400, 280, 150, [['建替え', 26, 900, '#5b6474'], ['休業期間・費用', 19, 600, '#4a5262']], t - 7);
    headline('補強の位置を[営業と景観]と比べる', t);
  }});
  S.push({name: '設計・発注', d: 13, draw: sc.flow('診断から[設計・発注]へつなぐ', [['既存図・調査範囲と判定を確定', ''], ['補強目標・営業条件・手続を整理', ''], ['採用案の検査計画と工区を見積へ', '']], '調査の条件と補強の目標を、設計と見積の前提に共有する')});
  S.push({name: '接合部の検査', d: 14, draw(t) {
    plain('#eef3f7');
    ctx.fillStyle = '#8a93a3'; ctx.fillRect(220, 170, 520, 46); ctx.fillRect(220, 550, 520, 46); ctx.fillRect(220, 216, 60, 334); ctx.fillRect(680, 216, 60, 334);
    if (t > 1) { ctx.globalAlpha = eo((t - 1) / .5); poly([[280, 216], [680, 550]], ACC, 14); poly([[680, 216], [280, 550]], ACC, 14); ctx.globalAlpha = 1; }
    if (t > 2.5) { ctx.fillStyle = '#fff'; [[295, 230], [320, 230], [665, 230], [640, 230], [295, 536], [320, 536], [665, 536], [640, 536]].forEach(([x, y]) => { ctx.beginPath(); ctx.arc(x, y, 7, 0, Math.PI * 2); ctx.fill(); }); }
    if (t > 3.5) { ctx.strokeStyle = HOT; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(305, 232, 36 + Math.sin(t * 5) * 4, 0, Math.PI * 2); ctx.stroke(); fx('既存部との接合', 420, 280, 26, HOT, t - 3.5); }
    box(800, 190, 420, 330, [['隠れる前に記録', 26, 900, INK], ['下地の調査', 22, 600, '#4a5262'], ['施工状況', 22, 600, '#4a5262'], ['検査の結果', 22, 600, '#4a5262'], ['補強部材・基礎の試験', 22, 600, '#4a5262']], t - 5.5);
    headline('補強部材と[既存部の接合]を検査', t);
  }});
  S.push({name: '履歴の引継ぎ', d: 14, draw: sc.table('診断・補強の[履歴]を渡す', ['引き渡すもの', '使う場面'], [['診断報告・構造計算', '次の改修・確認'], ['補強位置と検査記録（竣工図）', '設備更新・内装改修のとき'], ['地震後の点検と運用判断', '被災後に営業を続けるか']], '', [520, 580])});
  S.push({name: 'まとめ', d: 12, draw: sc.summary([['集める', '建設時期\n増改築の履歴', ACC], ['読む', '階と方向\n診断の前提', BLUE], ['比べる', '内部・外側\n建替え', '#9b59d0'], ['残す', '接合部の検査\n補強の位置', GRN]], '判定は構造技術者が行います。図の数値は説明用です ／ ※イラストはイメージです')});
