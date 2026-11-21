#!/usr/bin/env python3
"""図解動画のスライドを、cm-slide-controls.js 方式のデッキに差し込む。

使い方: python3 video-build/insert.py <slug> <after>
  <after> 番目のスライドの次に動画スライドを入れ、番号・リンク・index.html の枚数を直す。
  すでに動画スライドがあれば、その中身だけを差し替える（番号は変えない）。
"""
import html, json, re, sys
from pathlib import Path

here = Path(__file__).resolve().parent
root = here.parent
slug, after = sys.argv[1], int(sys.argv[2])
spec = json.loads((here / 'specs' / f'{slug}.json').read_text(encoding='utf8', newline=''))
tl = json.loads((here / '.work' / slug / 'timeline.json').read_text(encoding='utf8', newline=''))
base = spec.get('out', f'{slug}-video')
deck_path = root / f'{slug}-slides.html'
s = deck_path.read_text(encoding='utf8', newline='')
esc = html.escape

def mmss(t):
    t = int(round(t)); return f'{t // 60}:{t % 60:02d}'

def build_section(num, total):
    steps = spec['steps']
    btns = ''.join(
        f'<li><button type="button" data-seek="{x["start"]}" data-end="{x["end"]}" aria-current="false">'
        f'<span>{mmss(x["start"])}</span>{esc(st["title"])}</button></li>'
        for st, x in zip(steps, tl['steps']))
    say = ''.join(st['say'] for st in steps)
    names = '→'.join(st.get('label') or st['title'] for st in steps)
    cues = json.dumps([[round(x['voiceStart'], 2), round(x['voiceEnd'], 2), st.get('caption') or st['say']] for st, x in zip(steps, tl['steps'])], ensure_ascii=False)
    return f'''<section class="slide" id="s{num}" aria-label="スライド{num}" data-video="1">
<div class="meta"><span class="cat">動画</span><span>{num:02d} / {total}</span></div>
  <h2 class="a">動画で見る：{esc(names)}</h2>
  <div class="cm-video">
    <div class="cm-video-frame">
      <video controls preload="metadata" playsinline data-cues="{esc(cues)}" poster="{base}-poster.png" aria-label="{esc(spec['kicker'])}の4つの手順の図解動画（{round(tl['total'])}秒・日本語ナレーションと字幕付き）">
        <source src="{base}.mp4" type="video/mp4">
        <track kind="subtitles" srclang="ja" label="日本語" src="{base}-ja.vtt" default>
      </video>
      <p class="cm-video-fail">動画を読み込めませんでした。{base}.mp4 がこのページと同じフォルダにあるか確認してください。</p>
    </div>
    <ol class="cm-video-steps" aria-label="動画の場面へ移動">{btns}</ol>
  </div>
  <p class="cm-video-note">「読み上げ開始」で動画の音声が流れます。場面のボタンでその位置から再生します。字幕は「字幕」ボタンで切り替えられます。</p>
<details class="script"><summary>原稿</summary><p class="say">{esc(say)}</p></details></section>
'''

sec_re = re.compile(r'<section class="slide[^"]*" id="s(\d+)".*?</section>\n?', re.S)
secs = list(sec_re.finditer(s))
total_old = len(secs)
existing = [m for m in secs if 'data-video="1"' in m.group(0)[:300]]

if existing:
    m = existing[0]
    num = int(m.group(1))
    s = s[:m.start()] + build_section(num, total_old) + s[m.end():]
    total = total_old
else:
    total = total_old + 1
    ins = secs[after - 1].end()
    # 後ろのスライドの番号を1つずつずらす（後ろから）
    def renum(text, n_old, n_new, total):
        text = text.replace(f'id="s{n_old}"', f'id="s{n_new}"', 1)
        text = text.replace(f'aria-label="スライド{n_old}"', f'aria-label="スライド{n_new}"', 1)
        return text
    head, tail = s[:ins], s[ins:]
    out_tail = tail
    for m in reversed(list(sec_re.finditer(tail))):
        n = int(m.group(1))
        out_tail = out_tail[:m.start()] + renum(m.group(0), n, n + 1, total) + out_tail[m.end():]
    s = head + build_section(after + 1, total) + out_tail
    # ページ内リンク (#sN / data-jump="N") を、差し込み位置より後ろなら +1
    s = re.sub(r'href="#s(\d+)"', lambda m: f'href="#s{int(m.group(1)) + (1 if int(m.group(1)) > after else 0)}"', s)
    s = re.sub(r'data-jump="(\d+)"', lambda m: f'data-jump="{int(m.group(1)) + (1 if int(m.group(1)) > after else 0)}"', s)
    # 各スライドの "NN / MM" を振り直す
    def fix_meta(m):
        sec = m.group(0); n = int(m.group(1))
        return re.sub(r'(<div class="meta">.*?<span>)\d+ / \d+(</span>)', lambda k: f'{k.group(1)}{n:02d} / {total}{k.group(2)}', sec, count=1, flags=re.S)
    s = sec_re.sub(fix_meta, s)
    # index.html の枚数
    idx = root / 'index.html'
    t = idx.read_text(encoding='utf8', newline='')
    pat = re.compile(rf'(<a href="{re.escape(slug)}-slides\.html" aria-label="[^"]*?)、{total_old}枚(">スライド（){total_old}(枚）)')
    t2, n = pat.subn(rf'\g<1>、{total}枚\g<2>{total}\g<3>', t)
    if n != 1:
        print('WARN: index.html の枚数を更新できませんでした', file=sys.stderr)
    idx.write_text(t2, encoding='utf8', newline='')

deck_path.write_text(s, encoding='utf8', newline='')
print(f'{deck_path.name}: {total} slides')
