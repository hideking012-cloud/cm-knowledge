# 図解動画のビルド

各テーマの「4つの手順」動画（1280×720・日本語ナレーション・字幕付き）を作る仕組みです。

```
node video-build/build.mjs <slug>          # specs/<slug>.json → <slug>-video.mp4 / -ja.vtt / -poster.png
python3 video-build/insert.py <slug> <n>   # <n>枚目の次に動画スライドを入れ、番号と index.html の枚数を直す
```

- `specs/*.json` … 場面ごとの見出し・ナレーション・確認項目・図（SVG）。
- `specsrc/*.py` … 上の JSON を生成する元スクリプト（`python3 video-build/specsrc/batch2.py` など）。
- ナレーションは `edge-tts`（音声 `ja-JP-NanamiNeural`）で作ります。`speech.platform.bing.com` への接続が必要です。
- フォントは初回に `@fontsource/noto-sans-jp` を `.work/` へ取得します。
- 再生と場面ボタン、字幕の切替は共通の `cm-slide-controls.js` / `cm-slide-theme.css` が担当します。
