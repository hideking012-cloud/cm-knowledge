#!/usr/bin/env python3
"""排煙設備アニメーション（animations/haien_animation.html）の再生部分を流用し、
topics/<slug>.js の場面と topics/<slug>.json のナレーションから animations/<file> を作る。
使い方: python3 video-build/anim/build_anim.py <slug> [<slug> ...]"""
import json, re, sys
from pathlib import Path

here = Path(__file__).resolve().parent
root = here.parent.parent
src = (root / 'animations' / 'haien_animation.html').read_text(encoding='utf8')
lib = (here / 'lib.js').read_text(encoding='utf8')
COMMON_READ = [('架空', 'かくう'), ('CM', 'シーエム'), ('1つ', 'ひとつ'), ('2つ', 'ふたつ'), ('3つ', 'みっつ'), ('4つ', 'よっつ'), ('㎡', '平方メートル')]

head0, rest0 = src.split('<section class="hs-player"', 1)
_, script0 = rest0.split('<script>', 1)
utils0 = script0.split('  // ---------- scenes ----------')[0]
engine0 = '  // ---------- player ----------' + script0.split('  // ---------- player ----------', 1)[1]
controls0 = rest0.split('<div class="hs-stage">', 1)[1].split('</div>\n', 1)[1].split('<details class="hs-text">')[0]

def build(slug):
    cfg = json.loads((here / 'topics' / f'{slug}.json').read_text(encoding='utf8'))
    scenes = (here / 'topics' / f'{slug}.js').read_text(encoding='utf8')
    acc = cfg.get('accent', '#2b7de9')
    head = head0.replace('<title>排煙設備のしくみ｜アニメーション解説</title>', f"<title>{cfg['title']}｜アニメーション解説</title>")
    head = head.replace('--hs-accent:#e8432f', f'--hs-accent:{acc}').replace('../smoke-control-report.html', '../' + cfg['report'])
    items = '\n'.join(f'      <li><b>{n}：</b>{c}</li>' for n, c in cfg['cap'])
    section = f'''<section class="hs-player" id="hs-{cfg['id']}" aria-label="{cfg['title']} アニメーション解説">
  <div class="hs-stage">
    <canvas width="1280" height="720" role="img" aria-label="{cfg['title']}を説明するアニメーション。下の「テキストで読む」に同じ内容があります。"></canvas>
  </div>
{controls0}<details class="hs-text">
    <summary>テキストで読む</summary>
    <ol>
{items}
    </ol>
    <p class="hs-src">音声は端末のMicrosoft日本語女性音声から選択できます。字幕は消音時も表示します。音は再生ボタンか画面をタップした後から鳴ります。<br>出典：{cfg['source']}※解説用に要点を簡略化しています。</p>
  </details>
</section>

<script>'''
    utils = utils0.replace("document.getElementById('hs-haien')", f"document.getElementById('hs-{cfg['id']}')")
    reads = ''.join(f".replace(/{re.escape(a)}/g, {json.dumps(b, ensure_ascii=False)})" for a, b in cfg.get('read', []) + COMMON_READ)
    fan = cfg.get('fan')
    narr = f'''
  // ---------- narration ----------
  const CAP = {json.dumps([c for _, c in cfg['cap']], ensure_ascii=False)};
  const tts = s => s{reads};
  const NARR = CAP.map(tts);
  S.forEach((s, i) => {{ s.d = Math.max(s.d, Math.ceil(CAP[i].length / 7.2) + 2); }});   // 読み上げの長さに合わせる
  const FANI = {('S.findIndex(s => s.name === ' + json.dumps(fan, ensure_ascii=False) + ')') if fan else '-1'};

'''
    names = [n for n, _ in cfg['cap']]
    api = '__hs' + cfg['id'].replace('-', '_')
    engine = engine0.replace('}, total};   // プレビュー用', '}, total, starts};   // プレビュー用').replace('MECH', 'FANI')
    engine = engine.replace('rgba(232,67,47,.95)', acc).replace('__hsHaien', api).replace('// 機械排煙シーンの送風音', '// 送風の場面の音')
    body = f"  const ACC = '{acc}';\n" + lib + "\n  // ---------- scenes ----------\n  const S = [];\n" + scenes
    body += f"\n  if (S.length !== {len(names)}) console.error('scene/caption count mismatch', S.length, {len(names)});\n"
    out = head + section + utils + body + narr + engine
    (root / 'animations' / cfg['file']).write_text(out, encoding='utf8')
    print(cfg['file'], len(names), 'scenes', api)

for s in sys.argv[1:]: build(s)
