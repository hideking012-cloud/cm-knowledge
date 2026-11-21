import sys; import os; sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from common import *
def tl_row(y,x,label,d,c='#8ea3cf'): return f"<g data-in='{d}'><circle cx='{x}' cy='{y}' r='12' fill='{c}'/>"+txt(x,y-24,label,None,c,17,'middle')+"</g>"
def layer(x,y,w,h,fill,label,d,c='#eef3ff'): return f"<g data-in='{d}'><rect x='{x}' y='{y}' width='{w}' height='{h}' rx='8' fill='{fill}' stroke='{c}' stroke-width='2' opacity='.85'/>"+txt(x+12,y+28,label,None,c,18)+"</g>"
ground="<path d='M0 260 L160 260 L260 200 L540 200 V440 H0 z' fill='#5a4a3a'/>"

save('earthworks-development',{"kicker":"盛土規制法・開発許可","footnote":"架空事例の説明用モデル。区域と手続は所管に確認します。","steps":[
{"label":"区域","title":"規制区域を地図で照合","say":"まず、敷地の地番と工事範囲を、盛土規制法の規制区域や、都市計画区域と照合します。",
 "checks":[["宅地造成等工事規制区域","特定盛土等規制区域も"],["都市計画区域と線引き"],["崖・土砂災害・公園区域を重ねる"]],
 "svg":svg(layer(20,30,330,200,'#3a2f1d','盛土規制法の規制区域','0.04','#f5b942'),layer(80,110,330,200,'#1d3f4a','都市計画区域','0.18','#8ec5ff'),layer(140,190,330,200,'#3a1d2a','土砂災害の指定','0.32','#ff6b6b'),
  "<g data-in='0.48'><rect x='250' y='250' width='120' height='80' fill='none' stroke='#fff' stroke-width='5'/>"+txt(310,300,'敷地',None,'#fff',22,'middle',900)+"</g>","<rect data-pulse='0.55' x='240' y='240' width='140' height='100' fill='none' stroke='#5ad17b' stroke-width='4'/>")},
{"label":"制度","title":"二つの制度を分けて見る","say":"盛土規制法は造成の安全を、開発許可は、建築を目的とする土地の区画形質の変更を見ます。",
 "checks":[["盛土規制法","盛土・切土・土石の堆積の規模"],["都市計画法29条（開発許可）","区域・規模・目的"],["みなし許可と残る手続を分ける","一枚の工程に書く"]],
 "svg":svg(box(20,30,240,150,'盛土規制法','0.04',fs=26,sub='造成の安全'),box(280,30,240,150,'開発許可','0.16',fs=26,sub='建築目的の区画形質の変更'),
  "<g data-in='0.32'><path d='M140 184 V230 H400 V184' fill='none' stroke='#f5b942' stroke-width='4'/></g>",
  box(60,250,420,80,'みなし許可になる部分','0.42',fs=22,stroke='#5ad17b',color='#5ad17b',fill='#0c2d33'),
  box(60,345,420,80,'残る手続（標識・報告・検査）','0.55',fs=22,stroke='#f5b942'))},
{"label":"数量","title":"盛土・切土・仮置きを数量で","say":"盛土、切土、仮置きの面積と高さを数量表にし、許可図と現場で共通に使います。",
 "checks":[["盛土・切土の範囲と高さ","造成の平面図・断面図"],["土石の仮置き","場所・高さ・期間"],["排水系統と排水先"]],
 "svg":svg("<g data-in='0.03'>"+ground+"</g>",
  "<g data-in='0.15'><path d='M160 260 L260 200 L300 200 L200 260 z' fill='#ff6b6b' opacity='.55'/>"+txt(150,180,'切土',None,'#ff6b6b',22)+"</g>",
  "<g data-in='0.3'><path d='M0 260 H160 L160 230 H0 z' fill='#f5b942' opacity='.6'/>"+txt(20,220,'盛土',None,'#f5b942',22)+"<path d='M60 230 V260' stroke='#fff' stroke-width='3'/>"+txt(70,250,'H',None,'#fff',18)+"</g>",
  "<g data-in='0.45'><path d='M380 200 L420 150 L470 150 L510 200 z' fill='#c9b28a'/>"+txt(445,130,'仮置き',None,'#c9b28a',20,'middle')+"</g>",
  "<g data-in='0.6'><path d='M300 320 H520' stroke='#8ec5ff' stroke-width='6' stroke-dasharray='12 6'/>"+txt(410,350,'排水先',None,'#8ec5ff',19,'middle')+"</g>",
  doc(20,300,200,130,'数量表','0.7',lines=2,fs=20))},
{"label":"施工","title":"埋まる前に立ち会う","say":"排水や擁壁の背面など、埋まる前の工程は立会いで確認し、完了後は点検先を引き継ぎます。",
 "checks":[["排水・擁壁の背面","隠蔽前写真・材料・立会い"],["高さや工区の変更は事前に協議","必要な変更手続"],["排水先と維持管理者を引継ぎ","豪雨後の点検箇所と連絡先"]],
 "svg":svg("<g data-in='0.03'><path d='M0 120 H240 V380 H0 z' fill='#5a4a3a'/><path d='M240 110 H280 L300 380 H230 z' fill='#8a8f99' stroke='#cfd9f5' stroke-width='3'/><path d='M0 380 H540' stroke='#c9b28a' stroke-width='4'/></g>",
  "<g data-in='0.18'><rect x='190' y='130' width='40' height='240' fill='#8ec5ff' opacity='.35'/><path d='M210 360 H330' stroke='#8ec5ff' stroke-width='6'/>"+txt(100,170,'裏込め・排水',None,'#8ec5ff',19)+"</g>",
  "<circle data-pulse='0.3' cx='210' cy='300' r='40' fill='none' stroke='#ff6b6b' stroke-width='4'/>",
  camera(340,140,'0.42'),txt(395,270,'隠蔽前に立会い','0.46','#eef3ff',19,'middle'),
  "<g data-in='0.62'><rect x='330' y='300' width='190' height='80' rx='10' fill='#0c2d33' stroke='#5ad17b' stroke-width='3'/>"+txt(425,335,'点検箇所と',None,'#5ad17b',19,'middle')+txt(425,362,'連絡先を引継ぎ',None,'#5ad17b',19,'middle')+"</g>")}]})

def bars():
    out="<g data-in='0.05'>"+txt(20,36,'階',None,'#a9b9de',18)+txt(140,36,'X方向',None,'#a9b9de',18,'middle')+txt(330,36,'Y方向',None,'#a9b9de',18,'middle')+"</g>"
    vals=[(0.95,0.9),(0.85,0.7),(0.75,0.45),(0.8,0.5)]
    for i,(x,y) in enumerate(vals):
        yy=60+i*80; d=str(round(0.1+i*0.08,2))
        out+=txt(30,yy+38,f'{4-i}F',None,'#cfd9f5',20)
        out+=f"<g data-in='{d}' data-grow='left center'><rect x='70' y='{yy+10}' width='{x*160}' height='40' fill='#3b6fd1'/></g>"
        out+=f"<g data-in='{d}' data-grow='left center'><rect x='260' y='{yy+10}' width='{y*160}' height='40' fill='{'#ff6b6b' if y<0.6 else '#3b6fd1'}'/></g>"
    out+="<g data-in='0.5'><path d='M362 50 V390 M172 50 V390' stroke='#f5b942' stroke-width='3' stroke-dasharray='8 6'/>"+txt(470,420,'判定の目安',None,'#f5b942',18,'end')+"</g>"
    out+="<rect data-pulse='0.6' x='250' y='212' width='130' height='140' fill='none' stroke='#ff6b6b' stroke-width='4'/>"
    return out
save('seismic-retrofit',{"kicker":"耐震診断・耐震改修","footnote":"架空事例の説明用モデル（数値は図解用）。判定は構造技術者が行います。","steps":[
{"label":"履歴","title":"建設時期と履歴を集める","say":"まず、建設時期、構造図、増改築の履歴を集め、診断を構造技術者へ依頼します。",
 "checks":[["建設・確認の時期","昭和56年6月の基準の前か後か"],["構造図・増改築の履歴"],["耐震改修促進法の対象を照合","用途・規模・指定された道路"]],
 "svg":svg("<line x1='20' y1='110' x2='520' y2='110' stroke='#6f86bb' stroke-width='6'/>",tl_row(110,60,'建設','0.04','#cfd9f5'),
  "<g data-in='0.15'><path d='M220 70 V150' stroke='#f5b942' stroke-width='4' stroke-dasharray='6 5'/>"+txt(220,175,'昭和56年6月',None,'#f5b942',18,'middle')+txt(220,198,'新耐震基準',None,'#f5b942',18,'middle')+"</g>",tl_row(110,360,'増築','0.26'),tl_row(110,480,'今回','0.34','#5ad17b'),
  doc(30,240,150,180,'構造図','0.45',lines=3,fs=21),doc(195,240,150,180,'確認記録','0.53',lines=3,fs=20),box(360,240,160,180,'構造技術者','0.62',fs=20,stroke='#5ad17b',sub='診断を依頼'))},
{"label":"診断","title":"階と方向で弱点を読む","say":"診断結果は全体の平均で読まず、どの階の、どの方向が弱いかを見ます。",
 "checks":[["階・方向別の結果","低い所がどこに集中するか"],["判定の指標と基準","構造種別と診断方法ごと"],["調査の前提と未確認の範囲","材料強度など"]],"svg":svg(bars())},
{"label":"目標","title":"目標と補強案を決める","say":"人命の安全と被災後の運営を目標に、補強の位置を、営業や景観と一緒に比べます。",
 "checks":[["人命の安全","倒壊防止・避難経路・落下対策"],["被災後の運営","給水・電源・機器の固定"],["内部補強／外側補強／建替え","営業・景観・休業期間で比べる"]],
 "svg":svg("<g data-in='0.03'><rect x='150' y='60' width='240' height='330' fill='#24407e' stroke='#8ea3cf' stroke-width='3'/>"+''.join(f"<line x1='150' y1='{60+i*82}' x2='390' y2='{60+i*82}' stroke='#6f86bb' stroke-width='3'/>" for i in range(1,4))+"</g>",
  "<g data-in='0.2'><path d='M200 228 L260 308 M260 228 L200 308' stroke='#f5b942' stroke-width='8'/>"+txt(230,215,'内部補強',None,'#f5b942',18,'middle')+"</g>",
  "<g data-in='0.35'><rect x='392' y='228' width='22' height='162' fill='#5ad17b'/><path d='M392 228 L414 308 M414 228 L392 308 M392 308 L414 390 M414 308 L392 390' stroke='#0a1636' stroke-width='3'/>"+txt(470,300,'外側補強',None,'#5ad17b',18,'middle')+"</g>",
  "<g data-in='0.5'>"+person(110,340,'#8ec5ff')+txt(80,420,'人命の安全',None,'#8ec5ff',18,'middle')+"</g>",
  "<g data-in='0.62'><rect x='20' y='20' width='120' height='40' rx='8' fill='#13285e' stroke='#6f86bb'/>"+txt(80,47,'営業',None,'#eef3ff',18,'middle')+"<rect x='400' y='20' width='120' height='40' rx='8' fill='#13285e' stroke='#6f86bb'/>"+txt(460,47,'景観',None,'#eef3ff',18,'middle')+"</g>")},
{"label":"検査","title":"接合部を検査して記録","say":"既存部との接合を隠れる前に検査し、補強の位置を竣工図に残して引き継ぎます。",
 "checks":[["既存部との接合","下地調査・施工状況・検査結果"],["補強部材・基礎","承認図・材料・試験"],["診断報告と竣工図を保管","地震後の運用判断も共有"]],
 "svg":svg("<g data-in='0.03'><rect x='20' y='40' width='300' height='40' fill='#7a8bb0'/><rect x='20' y='300' width='300' height='40' fill='#7a8bb0'/><rect x='20' y='80' width='40' height='220' fill='#7a8bb0'/><rect x='280' y='80' width='40' height='220' fill='#7a8bb0'/></g>",
  "<g data-in='0.15'><path d='M60 80 L280 300 M280 80 L60 300' stroke='#f5b942' stroke-width='10'/></g>",
  "<g data-in='0.28'>"+''.join(f"<circle cx='{x}' cy='{y}' r='7' fill='#eef3ff'/>" for x,y in [(70,90),(90,90),(270,90),(250,90),(70,290),(90,290),(250,290),(270,290)])+"</g>",
  "<circle data-pulse='0.36' cx='80' cy='90' r='30' fill='none' stroke='#ff6b6b' stroke-width='4'/>"+txt(130,30,'既存部との接合','0.36','#ff6b6b',18),
  camera(380,60,'0.5'),doc(350,220,170,200,'竣工図','0.65',lines=3,fs=20))}]})

save('building-services-renewal',{"kicker":"設備の更新","footnote":"架空事例の説明用モデル。停止の条件は施設側と決めます。","steps":[
{"label":"記録","title":"止まる範囲を把握する","say":"機器一覧と系統図、故障の記録から、一台の故障で止まる範囲を把握します。",
 "checks":[["機器一覧・設置年・系統図"],["点検・故障・部品供給の記録"],["故障で止まる部屋と営業機能"]],
 "svg":svg(box(200,30,140,70,'熱源','0.04',fs=22),"<g data-in='0.15'><path d='M270 100 V140 M90 140 H450 M90 140 V180 M270 140 V180 M450 140 V180' stroke='#8ec5ff' stroke-width='5' fill='none'/></g>",
  box(20,180,140,70,'客室','0.2',fs=22),box(200,180,140,70,'宴会場','0.24',fs=22),box(380,180,140,70,'厨房','0.28',fs=22),
  "<g data-in='0.42'><rect x='196' y='26' width='148' height='78' rx='12' fill='none' stroke='#ff6b6b' stroke-width='5'/>"+txt(360,60,'故障',None,'#ff6b6b',20)+"</g>",
  "<g data-in='0.55'><rect x='16' y='176' width='508' height='78' rx='12' fill='#ff6b6b' opacity='.18'/>"+txt(270,300,'一台の故障で止まる範囲',None,'#ff6b6b',22,'middle')+"</g>",
  doc(140,330,260,100,'機器一覧・故障記録','0.68',lines=1,fs=20))},
{"label":"優先","title":"優先と更新方式を比べる","say":"空調、給排水、受変電の優先をつけ、部分更新と一括更新を、同じ評価期間で比べます。",
 "checks":[["故障時の停止と復旧の難しさ","空調・給排水・受変電"],["機器単位・系統単位・一括","停止回数・仮設・互換"],["初期費と運用・保守費で比較","同じ評価期間で"]],
 "svg":svg(box(20,30,155,80,'空調','0.04',fs=22),box(192,30,155,80,'給排水・給湯','0.1',fs=20),box(364,30,156,80,'受変電','0.16',fs=22),
  arrowdown(270,120,'0.25',40),
  box(20,180,155,110,'機器単位','0.32',fs=22,sub='停止が短い'),box(192,180,155,110,'系統単位','0.4',fs=22,sub='仮設が要る'),box(364,180,156,110,'一括','0.48',fs=22,sub='長時間停止'),
  "<g data-in='0.62'><rect x='20' y='320' width='500' height='90' rx='12' fill='#0c2d33' stroke='#5ad17b' stroke-width='3'/>"+txt(270,358,'初期費 ＋ 運用・保守費',None,'#5ad17b',22,'middle',900)+txt(270,392,'同じ評価期間で比べる',None,'#cfd9f5',18,'middle')+"</g>")},
{"label":"停止","title":"停止を工程に見せる","say":"停電、断水、空調の停止は、試験と予備時間も含めて、工程に見せます。",
 "checks":[["系統と影響先を図で確認"],["代替運転と戻せる状態","切替前の状態に戻す手順"],["切替の承認・通知・立会い"]],
 "svg":svg(txt(20,40,'切替日の工程',None,'#a9b9de',19),"<line x1='20' y1='70' x2='520' y2='70' stroke='#6f86bb' stroke-width='3'/>"+''.join(txt(20+i*125,95,f'{22+i if 22+i<24 else (22+i)%24}:00',None,'#a9b9de',16) for i in range(5)),
  "<g data-in='0.1' data-grow='left center'><rect x='20' y='120' width='250' height='50' fill='#ff6b6b' opacity='.7'/></g>"+txt(30,153,'停電・切替','0.14','#fff',20),
  "<g data-in='0.25' data-grow='left center'><rect x='270' y='120' width='120' height='50' fill='#f5b942' opacity='.75'/></g>"+txt(280,153,'復旧試験','0.29','#0a1636',20),
  "<g data-in='0.4' data-grow='left center'><rect x='390' y='120' width='130' height='50' fill='#8ea3cf' opacity='.6'/></g>"+txt(400,153,'予備時間','0.44','#0a1636',20),
  box(20,220,240,90,'代替運転','0.55',fs=22,sub='仮設・戻せる状態'),box(280,220,240,90,'承認・通知','0.62',fs=22,sub='施設側と立会い'),
  txt(270,370,'停止時間＝工事＋試験＋予備','0.72','#5ad17b',22,'middle',900))},
{"label":"試運転","title":"試運転から季節試験まで","say":"試運転は単体、連動、異常時まで確かめ、季節の試験と初年度の点検を予定に入れます。",
 "checks":[["単体・連動・停電と復電","警報と起動の順序"],["操作と緊急対応を訓練","施設の担当者へ"],["季節試験と初年度点検","系統図・機器一覧を更新"]],
 "svg":svg(box(20,30,155,90,'単体','0.04',fs=24),arrowright(178,75,'0.1',14),box(192,30,155,90,'連動','0.14',fs=24),arrowright(350,75,'0.2',14),box(364,30,156,90,'異常時','0.24',fs=24,stroke='#ff6b6b'),
  "<g data-in='0.4'><line x1='20' y1='230' x2='520' y2='230' stroke='#6f86bb' stroke-width='6'/></g>",tl_row(230,60,'引渡し','0.42','#8ec5ff'),tl_row(230,230,'夏の試験','0.5','#f5b942'),tl_row(230,370,'冬の試験','0.56','#8ec5ff'),tl_row(230,490,'初年度点検','0.62','#5ad17b'),
  "<g data-in='0.72'>"+person(80,320,'#eef3ff')+txt(120,350,'操作と緊急対応の訓練',None,'#eef3ff',20)+"</g>")}]})

save('accessibility-renovation',{"kicker":"バリアフリー改修","footnote":"架空事例の説明用モデル。基準は法令・条例と所管で確認します。","steps":[
{"label":"適用","title":"適用範囲と目標を決める","say":"バリアフリー法と条例を照合し、法令の基準と、施設独自の目標を記録します。",
 "checks":[["バリアフリー法・施行令と条例"],["新築・増改築・用途変更と対象部分"],["法令の基準と施設の目標を記録"]],
 "svg":svg(doc(20,40,150,190,'法・施行令','0.04',lines=4,fs=20),doc(195,40,150,190,'条例','0.14',lines=4,fs=22),doc(370,40,150,190,'施設の目標','0.24',lines=4,fs=20),
  "<g data-in='0.38'><path d='M95 236 V280 H445 V236 M270 236 V280' fill='none' stroke='#f5b942' stroke-width='4'/></g>",
  box(70,300,400,110,'対象部分と目標を記録','0.5',fs=24,stroke='#5ad17b',color='#5ad17b',fill='#0c2d33',sub='工事の種別・規模・客室数'))},
{"label":"経路","title":"入口から客室まで一続きに","say":"道路や車寄せから、受付、昇降機を経て、客室までの経路を一続きでたどります。",
 "checks":[["道路・駐車場・車寄せから入口"],["受付・昇降機を経て客室へ","段差・扉の幅"],["浴室・便所・食事会場・非常時の案内"]],
 "svg":svg(box(20,330,110,70,'車寄せ','0.04',fs=20),box(150,330,110,70,'受付','0.14',fs=20),box(280,180,110,220,'昇降機','0.24',fs=20),box(410,60,110,90,'客室','0.34',fs=20,stroke='#5ad17b'),
  "<g data-in='0.45'><path d='M75 320 V300 H205 V320 M205 300 H335 V170 M335 170 V120 H405' fill='none' stroke='#5ad17b' stroke-width='6' stroke-dasharray='14 8'/></g>",
  "<circle data-pulse='0.55' cx='140' cy='365' r='18' fill='none' stroke='#ff6b6b' stroke-width='4'/>"+txt(140,425,'1か所の段差も確認','0.55','#ff6b6b',18,'middle'))},
{"label":"客室","title":"寸法と設備を実測する","say":"客室は、扉の有効寸法、移乗の空間、浴室の段差や手すりを、実測で確かめます。",
 "checks":[["客室の入口","開口・敷居・扉の有効寸法"],["ベッド周辺","移乗空間・スイッチ・緊急連絡"],["浴室・便所","段差・手すり・回転の空間"]],
 "svg":svg("<g data-in='0.03'><rect x='20' y='30' width='500' height='380' fill='#13285e' stroke='#8ea3cf' stroke-width='5'/><rect x='20' y='30' width='190' height='170' fill='#1d3a74' stroke='#8ea3cf' stroke-width='3'/>"+txt(115,60,'浴室',None,'#eef3ff',20,'middle')+"<rect x='300' y='150' width='200' height='130' rx='8' fill='#cfd9f5'/>"+txt(400,220,'ベッド',None,'#0a1636',20,'middle')+"</g>",
  "<g data-in='0.15'><path d='M20 300 V390' stroke='#0b1a40' stroke-width='10'/><path d='M8 300 V390' stroke='#f5b942' stroke-width='4'/><path d='M0 300 H16 M0 390 H16' stroke='#f5b942' stroke-width='4'/>"+txt(40,350,'扉の有効寸法',None,'#f5b942',18)+"</g>",
  "<g data-in='0.32'><circle cx='230' cy='300' r='70' fill='none' stroke='#5ad17b' stroke-width='3' stroke-dasharray='10 6'/>"+txt(230,305,'移乗空間',None,'#5ad17b',18,'middle')+"</g>",
  "<g data-in='0.5'><path d='M40 160 H180' stroke='#8ec5ff' stroke-width='6'/>"+txt(110,150,'手すり',None,'#8ec5ff',17,'middle')+"<path d='M60 200 H170' stroke='#ff6b6b' stroke-width='4'/>"+txt(115,225,'段差',None,'#ff6b6b',17,'middle')+"</g>")},
{"label":"確認","title":"実寸で確かめて引き継ぐ","say":"実寸サンプルで使い勝手を確かめ、完成時の寸法と案内を、スタッフへ引き継ぎます。",
 "checks":[["実物・実寸のサンプルで確認"],["家具・備品を含む完成内法を測る"],["予約時の案内と緊急時の支援","スタッフへ引き継ぐ"]],
 "svg":svg("<g data-in='0.04'><rect x='20' y='40' width='260' height='220' rx='10' fill='#13285e' stroke='#6f86bb' stroke-width='3'/>"+txt(150,80,'実寸サンプル',None,'#eef3ff',22,'middle')+"<rect x='50' y='110' width='200' height='120' fill='none' stroke='#8ec5ff' stroke-width='3' stroke-dasharray='10 6'/></g>",
  "<g data-in='0.2'><path d='M60 240 H240' stroke='#f5b942' stroke-width='4'/><path d='M60 230 V250 M240 230 V250' stroke='#f5b942' stroke-width='4'/>"+txt(150,285,'家具を置いた内法',None,'#f5b942',19,'middle')+"</g>",
  doc(310,40,210,220,'客室の情報','0.4',lines=4,fs=20),
  "<g data-in='0.6'>"+person(120,350,'#eef3ff')+person(170,350,'#eef3ff')+txt(220,380,'スタッフへ引継ぎ',None,'#eef3ff',20)+"</g>")}]})

save('long-term-repair-budget',{"kicker":"長期修繕計画と予算配分","footnote":"架空事例の説明用モデル（金額・年度は図解用）。","steps":[
{"label":"台帳","title":"台帳に費用の根拠をつなぐ","say":"資産台帳に、数量、前回の工事、劣化の状態と、費用の根拠をつなぎます。",
 "checks":[["資産と数量","外壁面積・屋上面積・機器台数"],["劣化と点検","前回施工・法定点検"],["費用の根拠","見積時点・単価"]],
 "svg":svg("<g data-in='0.03'><rect x='20' y='30' width='500' height='380' rx='12' fill='#f4efe2'/>"+txt(270,72,'資産台帳',None,'#0a1636',24,'middle',900)+"</g>",
  "<g data-in='0.1'>"+''.join(txt(40+i*160,112,h,None,'#0a1636',18) for i,h in enumerate(['資産・数量','前回・劣化','費用の根拠']))+"<line x1='35' y1='124' x2='505' y2='124' stroke='#0a1636' stroke-width='2'/></g>",
  *[f"<g data-in='{0.2+i*0.12:.2f}'>"+txt(40,165+i*60,a,None,'#0a1636',18)+txt(200,165+i*60,b,None,'#0a1636',18)+txt(360,165+i*60,c,None,'#1d7a46',18)+f"<line x1='35' y1='{182+i*60}' x2='505' y2='{182+i*60}' stroke='#c9bfa8' stroke-width='1'/></g>" for i,(a,b,c) in enumerate([('外壁 3,200㎡','12年前・浮き','見積 R7'),('屋上 900㎡','18年前・漏水','単価 R6'),('給湯 2系統','15年前・故障','見積 R7'),('受変電 1式','20年前','概算')])])},
{"label":"優先","title":"先送りできるかを判断","say":"安全、法令、事業継続への影響で、先送りできるかを判断します。",
 "checks":[["直ちに対応","危険箇所の隔離・応急対策"],["早期に計画","全館停止・部品調達が困難・漏水"],["まとめ施工を検討","足場の共用など"]],
 "svg":svg(box(20,30,500,100,'直ちに対応','0.04',fs=26,stroke='#ff6b6b',color='#ff6b6b',sub='安全・法令'),box(20,155,500,100,'早期に計画','0.2',fs=26,stroke='#f5b942',color='#f5b942',sub='事業継続・故障リスク'),box(20,280,500,100,'まとめて施工','0.36',fs=26,stroke='#8ec5ff',color='#8ec5ff',sub='足場・仮設を共用'))},
{"label":"資金","title":"年度別の資金を複数案で","say":"設計費と工事費を、実際の支払時期に置き、年度別の資金需要を複数案で比べます。",
 "checks":[["基準案","工法・日程・費用の根拠"],["予算・工期の変動","物価・数量・営業制約"],["繰り延べ案","翌期の支出とリスク"]],
 "svg":svg(txt(20,36,'年度別の支出（図解用）',None,'#a9b9de',18),
  *[f"<g data-in='{0.08+i*0.08:.2f}' data-grow='center bottom'><rect x='{50+i*95}' y='{380-h}' width='34' height='{h}' fill='#3b6fd1'/><rect x='{86+i*95}' y='{380-h2}' width='34' height='{h2}' fill='#f5b942'/></g>"+txt(85+i*95,410,y,None,'#cfd9f5',18,'middle') for i,(y,h,h2) in enumerate([('R8',60,40),('R9',220,90),('R10',120,200),('R11',80,140),('R12',60,70)])],
  "<line x1='30' y1='380' x2='520' y2='380' stroke='#8ea3cf' stroke-width='3'/>",
  "<g data-in='0.55'><rect x='300' y='60' width='22' height='22' fill='#3b6fd1'/>"+txt(330,78,'基準案',None,'#eef3ff',18)+"<rect x='410' y='60' width='22' height='22' fill='#f5b942'/>"+txt(440,78,'繰り延べ案',None,'#eef3ff',18)+"</g>")},
{"label":"更新","title":"毎年見直して次へ戻す","say":"毎年、点検の結果と実績の金額で見直し、完了した工事の実額を、次の計画に戻します。",
 "checks":[["点検結果と実績金額を入力"],["緊急度と費用を再評価"],["翌年度の予算と発注順を確認","実額を次の計画へ"]],
 "svg":svg("<g data-in='0.04'><circle cx='270' cy='220' r='150' fill='none' stroke='#6f86bb' stroke-width='6'/></g>",
  box(190,40,160,70,'点検・実績','0.1',fs=21),box(380,185,150,70,'再評価','0.22',fs=21),box(190,330,160,70,'翌年度予算','0.34',fs=20),box(10,185,150,70,'工事・実額','0.46',fs=20),
  "<g data-in='0.58'>"+''.join(f"<path d='{d}' fill='#f5b942'/>" for d in ['M404 140 l14 -4 l-4 14 z','M404 300 l-4 14 l14 -4 z','M136 300 l-14 4 l4 -14 z','M136 140 l4 -14 l-14 4 z'])+"</g>",
  txt(270,228,'毎年更新','0.66','#5ad17b',26,'middle',900))}]})
print('ok')
