#!/usr/bin/env node
// CM動画ビルダー: specs/<slug>.json → <slug>-video.mp4 / -video-ja.vtt / -video-poster.png
// 使い方: node video-build/build.mjs fire-safety-cm [--no-tts]
// 必要: ffmpeg, Playwright(chromium), edge-tts (pip), Noto Sans JP (初回に npm pack で取得)
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { execFileSync, spawn } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const slug = process.argv[2];
if (!slug) { console.error('usage: build.mjs <slug>'); process.exit(1); }
const spec = JSON.parse(readFileSync(join(here, 'specs', slug + '.json'), 'utf8'));
const work = join(here, '.work', slug);
mkdirSync(work, { recursive: true });

const FPS_RENDER = 15, W = 1280, H = 720;
const LEAD = 0.5, TAIL = 0.8, MIN_STEP = 5.5;
const voice = spec.voice || 'ja-JP-NanamiNeural';

// ---------- fonts ----------
const fontDir = join(here, '.work', 'fonts');
function ensureFonts() {
  const probe = join(fontDir, 'package', 'files', 'noto-sans-jp-japanese-700-normal.woff2');
  if (existsSync(probe)) return join(fontDir, 'package', 'files');
  mkdirSync(fontDir, { recursive: true });
  execFileSync('npm', ['pack', '@fontsource/noto-sans-jp@5.2.5', '-q'], { cwd: fontDir });
  const tgz = readdirSync(fontDir).find(f => f.endsWith('.tgz'));
  execFileSync('tar', ['xzf', tgz], { cwd: fontDir });
  return join(fontDir, 'package', 'files');
}

// ---------- narration ----------
function dur(file) {
  return parseFloat(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file]).toString());
}
function tts(text, out) {
  if (existsSync(out) && existsSync(out + '.txt') && readFileSync(out + '.txt', 'utf8') === voice + '|' + text) return;
  const args = ['--voice', voice, '--text', text, '--write-media', out];
  if (process.env.HTTPS_PROXY) args.unshift('--proxy', process.env.HTTPS_PROXY);
  execFileSync('edge-tts', args, { stdio: 'inherit' });
  writeFileSync(out + '.txt', voice + '|' + text);
}

const steps = spec.steps;
const timeline = [];
let t = 0;
steps.forEach((s, i) => {
  const mp3 = join(work, `n${i + 1}.mp3`);
  tts(s.say, mp3);
  const d = dur(mp3);
  const len = Math.max(MIN_STEP, LEAD + d + TAIL);
  timeline.push({ start: t, end: t + len, voiceStart: t + LEAD, voiceEnd: t + LEAD + d, mp3 });
  t += len;
});
const total = Math.ceil(t * 10) / 10;
timeline[timeline.length - 1].end = total;

// audio: place each clip at its start
const audio = join(work, 'narration.m4a');
{
  const args = ['-v', 'error', '-y'];
  timeline.forEach(x => args.push('-i', x.mp3));
  const parts = timeline.map((x, i) => `[${i}:a]aresample=48000,adelay=${Math.round(x.voiceStart * 1000)}:all=1[a${i}]`);
  const mix = timeline.map((_, i) => `[a${i}]`).join('') + `amix=inputs=${timeline.length}:normalize=0,apad,atrim=0:${total},loudnorm=I=-16:TP=-1.5[out]`;
  args.push('-filter_complex', parts.join(';') + ';' + mix, '-map', '[out]', '-ac', '1', '-ar', '48000', '-c:a', 'aac', '-b:a', '96k', audio);
  execFileSync('ffmpeg', args);
}

// captions
const fmt = s => { const h = Math.floor(s / 3600), m = Math.floor(s / 60) % 60, sec = (s % 60).toFixed(3).padStart(6, '0'); return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${sec}`; };
let vtt = 'WEBVTT\n\n';
steps.forEach((s, i) => { vtt += `${i + 1}\n${fmt(timeline[i].voiceStart)} --> ${fmt(timeline[i].voiceEnd)}\n${s.caption || s.say}\n\n`; });

// ---------- frames ----------
const files = ensureFonts();
const ff = (w, f) => `@font-face{font-family:NJP;font-weight:${w};src:url(file://${files}/noto-sans-jp-latin-${w}-normal.woff2) format('woff2');unicode-range:U+0000-00FF,U+2000-206F,U+20AC,U+2122,U+2212,U+FEFF}
@font-face{font-family:NJP;font-weight:${w};src:url(file://${files}/noto-sans-jp-japanese-${w}-normal.woff2) format('woff2')}`;
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

const pageHtml = `<!doctype html><html lang="ja"><head><meta charset="utf-8"><style>
${ff(400)}${ff(700)}${ff(900)}
*{box-sizing:border-box;margin:0}
html,body{width:${W}px;height:${H}px;overflow:hidden;background:#071430;font-family:NJP,sans-serif;color:#eef3ff}
body{background:radial-gradient(1200px 700px at 70% 10%,#0e2250 0%,#071430 60%,#050e24 100%)}
.step{position:absolute;inset:0;opacity:0}
.kick{position:absolute;left:64px;top:52px;font-weight:900;letter-spacing:.12em;color:#f5b942;font-size:22px}
.kick span{color:#8ea3cf;letter-spacing:.04em;font-weight:700;margin-left:14px}
h1{position:absolute;left:64px;top:92px;font-size:50px;font-weight:900;letter-spacing:.02em;line-height:1.2}
.dots{position:absolute;right:64px;top:58px;display:flex;gap:10px}
.dots b{min-width:38px;height:38px;border-radius:19px;background:#18295a;color:#8ea3cf;display:flex;align-items:center;justify-content:center;font-size:17px;font-weight:700;padding:0 13px}
.dots b.on{background:#f5b942;color:#0a1636}
.dots b.done{background:#24407e;color:#d6e1ff}
.fig{position:absolute;left:64px;top:190px;width:540px;height:440px}
.fig svg{width:100%;height:100%;overflow:visible}
.fig text{font-family:NJP,sans-serif}
.list{position:absolute;left:640px;top:200px;width:576px;display:flex;flex-direction:column;gap:18px}
.it{display:flex;align-items:center;gap:20px;background:#0f2050;border:2px solid #24407e;border-radius:14px;padding:18px 22px;font-size:27px;font-weight:700;line-height:1.35;opacity:.25;transform:translateX(16px)}
.it .bx{flex:none;width:40px;height:40px;border-radius:8px;border:3px solid #6f86bb;display:flex;align-items:center;justify-content:center}
.it .bx svg{width:30px;height:30px;opacity:0}
.it small{display:block;font-size:19px;font-weight:400;color:#a9b9de;margin-top:2px}
.it.ok{border-color:#3b5fa8}
.it.ok .bx{border-color:#5ad17b;background:#0c2d33}
.it.ok .bx svg{opacity:1}
.bar{position:absolute;left:64px;right:64px;bottom:44px;height:8px;border-radius:4px;background:#17295a}
.bar i{position:absolute;left:0;top:0;bottom:0;border-radius:4px;background:#f5b942}
.foot{position:absolute;left:64px;bottom:62px;font-size:16px;color:#7f93c2}
</style></head><body>
${steps.map((s, i) => `<section class="step" id="st${i}">
<div class="kick">STEP ${i + 1} / ${steps.length}<span>${esc(spec.kicker)}</span></div>
<h1>${esc(s.title)}</h1>
<div class="dots">${steps.map((x, k) => `<b data-k="${k}">${k + 1}${x.label ? ' ' + esc(x.label) : ''}</b>`).join('')}</div>
<div class="fig">${s.svg}</div>
<div class="list">${s.checks.map(c => {
  const [a, b] = Array.isArray(c) ? c : [c, ''];
  return `<div class="it"><div class="bx"><svg viewBox="0 0 30 30"><path d="M5 16 L12 23 L25 8" fill="none" stroke="#5ad17b" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/></svg></div><div>${esc(a)}${b ? `<small>${esc(b)}</small>` : ''}</div></div>`;
}).join('')}</div>
${spec.footnote ? `<div class="foot">${esc(spec.footnote)}</div>` : ''}
</section>`).join('')}
<div class="bar"><i id="bar"></i></div>
<script>
const TL=${JSON.stringify(timeline.map(x => [x.start, x.end, x.voiceStart, x.voiceEnd]))}, TOTAL=${total};
const cl=(x)=>Math.max(0,Math.min(1,x)), ease=x=>1-Math.pow(1-cl(x),3);
window.setT=function(t){
  let cur=TL.findIndex(x=>t>=x[0]&&t<x[1]); if(cur<0) cur=TL.length-1;
  document.getElementById('bar').style.width=(cl(t/TOTAL)*100)+'%';
  TL.forEach((x,i)=>{
    const s=document.getElementById('st'+i);
    if(i!==cur){s.style.opacity=0;return;}
    const lt=t-x[0], len=x[1]-x[0];
    // 場面の頭でフェードイン、最後の場面以外は終わりでフェードアウト
    let o=ease(lt/0.35); if(i<TL.length-1) o=Math.min(o,cl((x[1]-t)/0.25));
    s.style.opacity=o;
    s.querySelectorAll('.dots b').forEach(b=>{const k=+b.dataset.k;b.className=k===i?'on':(k<i?'done':'');});
    // 箇条: 音声の長さに合わせて順に表示・チェック
    const its=[...s.querySelectorAll('.it')], n=its.length;
    const a=x[2]-x[0], span=Math.max(1.2,(x[3]-x[2])*0.9);
    its.forEach((el,k)=>{
      const tin=a+span*(k/n)-0.2, tok=a+span*((k+1)/n);
      const p=ease((lt-tin)/0.4);
      el.style.opacity=0.25+0.75*p; el.style.transform='translateX('+(16*(1-p))+'px)';
      el.classList.toggle('ok',lt>=tok);
    });
    // 図: data-in (場面内の比率 0..1) でフェードイン、data-pulse で点滅強調
    s.querySelectorAll('[data-in]').forEach(el=>{
      const p=ease((lt/len-parseFloat(el.dataset.in))/0.08);
      el.style.opacity=p;
      if(el.dataset.grow){el.style.transformBox='fill-box';el.style.transformOrigin=el.dataset.grow;el.style.transform=(el.dataset.grow.includes('left')||el.dataset.grow.includes('right'))?'scaleX('+p+')':'scaleY('+p+')';}
    });
    s.querySelectorAll('[data-pulse]').forEach(el=>{
      const st=parseFloat(el.dataset.pulse)*len;
      el.style.opacity= lt<st?0: (0.55+0.45*Math.cos((lt-st)*Math.PI*1.6));
    });
    s.querySelectorAll('[data-move]').forEach(el=>{
      // data-move="from,to,dx,dy" 比率区間で平行移動
      const [f,to,dx,dy]=el.dataset.move.split(',').map(Number);
      const p=ease((lt/len-f)/(to-f));
      el.setAttribute('transform','translate('+(dx*p)+','+(dy*p)+')');
    });
  });
};
</script></body></html>`;
const htmlPath = join(work, 'frame.html');
writeFileSync(htmlPath, pageHtml);

const outBase = spec.out || slug + '-video';
const mp4 = join(root, outBase + '.mp4');
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
await page.goto('file://' + htmlPath);
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(300);

const video = join(work, 'video.mp4');
const ff1 = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(FPS_RENDER), '-i', '-',
  '-vf', 'fps=30,format=yuv420p', '-c:v', 'libx264', '-preset', 'slow', '-crf', '23', '-tune', 'stillimage', video], { stdio: ['pipe', 'inherit', 'inherit'] });
const nFrames = Math.round(total * FPS_RENDER);
for (let f = 0; f < nFrames; f++) {
  await page.evaluate(tt => window.setT(tt), f / FPS_RENDER);
  const buf = await page.screenshot({ type: 'png' });
  if (!ff1.stdin.write(buf)) await new Promise(r => ff1.stdin.once('drain', r));
}
ff1.stdin.end();
await new Promise((res, rej) => ff1.on('close', c => c === 0 ? res() : rej(new Error('ffmpeg ' + c))));

// poster: 1つ目の場面がすべて表示された状態
await page.evaluate(tt => window.setT(tt), timeline[0].end - 0.4);
await page.screenshot({ path: join(root, outBase + '-poster.png') });
await browser.close();

execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', video, '-i', audio, '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'copy',
  '-shortest', '-movflags', '+faststart', '-metadata:s:a:0', 'language=jpn', '-metadata:s:a:0', `handler_name=${voice}`, mp4]);
writeFileSync(join(root, outBase + '-ja.vtt'), vtt);
writeFileSync(join(work, 'timeline.json'), JSON.stringify({ total, steps: timeline.map((x, i) => ({ start: +x.start.toFixed(2), end: +x.end.toFixed(2), voiceStart: x.voiceStart, voiceEnd: x.voiceEnd, title: steps[i].title, label: steps[i].label })) }, null, 1));
console.log(`done: ${outBase}.mp4 (${total}s)`);
console.log(JSON.stringify(timeline.map((x, i) => [x.start.toFixed(1), steps[i].title])));
