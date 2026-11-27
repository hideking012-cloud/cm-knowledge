(() => {
  'use strict';
  const root=document.querySelector('.hs-player'), video=root.querySelector('video');
  const data=JSON.parse(document.getElementById('lesson-data').textContent);
  const play=root.querySelector('.hs-btn'), sound=root.querySelector('.hs-snd'), voice=root.querySelector('.hs-voice');
  const seek=root.querySelector('.hs-track'), time=root.querySelector('.hs-time'), cap=root.querySelector('.hs-cap');
  const cc=root.querySelector('.hs-captions'), rate=root.querySelector('.hs-rate'), full=root.querySelector('.hs-fs');
  const bgm=root.querySelector('.hs-bgm'), status=root.querySelector('.hs-status'), trackElement=root.querySelector('track');
  const chips=[...root.querySelectorAll('.hs-chip')];
  let audible=false,showCaptions=true,loading=false,revision=0,lastTime=0,resumeAfterLoad=false,bgmOn=false;
  let context=null,musicGain=null,musicTimer=null,beat=0;
  const stamp=t=>Math.floor(Math.max(0,t)/60)+':'+String(Math.floor(Math.max(0,t)%60)).padStart(2,'0');
  const duration=()=>Number.isFinite(video.duration)?video.duration:data.duration;
  function position(){return loading?lastTime:video.currentTime;}
  function updatePosition(){
    const current=position(); if(!loading)lastTime=current;
    seek.value=String(current);seek.max=String(duration());
    seek.style.setProperty('--progress',Math.max(0,Math.min(100,current/duration()*100))+'%');
    time.textContent=stamp(current)+' / '+stamp(duration());seek.setAttribute('aria-valuetext',time.textContent);
    let active=0;for(let i=0;i<data.chapters.length;i++)if(data.chapters[i].start<=current+.01)active=i;
    for(let i=0;i<chips.length;i++){if(i===active)chips[i].setAttribute('aria-current','true');else chips[i].removeAttribute('aria-current');}
  }
  function updateCaptions(){
    const track=video.textTracks[0];if(track)track.mode='hidden';
    cap.hidden=!showCaptions;cc.textContent=showCaptions?'字幕 ON':'字幕 OFF';cc.setAttribute('aria-pressed',String(showCaptions));
    if(showCaptions){const cues=track?.activeCues;cap.textContent=cues?.length?[...cues].map(c=>c.text).join('\n'):(position()===0?data.chapters[0].text:'');}
  }
  function updatePlay(){const playing=!video.paused&&!video.ended;play.textContent=playing?'❚❚':'▶';play.setAttribute('aria-label',playing?'一時停止':'再生');updateMusic();}
  function updateSound(){video.muted=!audible;sound.textContent=audible?'🔊':'🔇';sound.setAttribute('aria-label',audible?'音声をオフ':'音声をオン');sound.setAttribute('aria-pressed',String(audible));updateMusic();}
  function stopMusic(){if(musicTimer){clearInterval(musicTimer);musicTimer=null;}if(musicGain&&context)musicGain.gain.setTargetAtTime(0,context.currentTime,.03);}
  function musicNote(){
    if(!context||context.state!=='running')return;
    const notes=[261.63,329.63,392,329.63,220,261.63,329.63,261.63];
    const oscillator=context.createOscillator(),envelope=context.createGain(),now=context.currentTime;
    oscillator.type='sine';oscillator.frequency.value=notes[beat++%notes.length]/2;
    envelope.gain.setValueAtTime(0,now);envelope.gain.linearRampToValueAtTime(.32,now+.06);envelope.gain.exponentialRampToValueAtTime(.001,now+1.25);
    oscillator.connect(envelope);envelope.connect(musicGain);oscillator.start(now);oscillator.stop(now+1.3);
  }
  function updateMusic(){
    const enabled=bgmOn&&audible&&!video.paused&&!video.ended&&!loading;
    if(!enabled){stopMusic();return;}
    const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return;
    if(!context){context=new Audio();musicGain=context.createGain();musicGain.gain.value=0;musicGain.connect(context.destination);}
    const start=()=>{if(!(bgmOn&&audible&&!video.paused&&!loading))return;musicGain.gain.setTargetAtTime(.06,context.currentTime,.15);if(!musicTimer){musicNote();musicTimer=setInterval(musicNote,800);}};
    if(context.state==='suspended')context.resume().then(start).catch(()=>{});else start();
  }
  function togglePlay(){if(video.paused||video.ended){if(video.ended)video.currentTime=0;video.play().catch(()=>{status.textContent='再生ボタンを押してください。';});}else video.pause();}
  function goTo(value){const target=Math.max(0,Math.min(duration()-.01,value));lastTime=target;if(!loading&&video.readyState)video.currentTime=target;else if(!loading)video.addEventListener('loadedmetadata',()=>{video.currentTime=lastTime;},{once:true});updatePosition();}
  function isFull(){return document.fullscreenElement===root||root.classList.contains('hs-full');}
  function updateFull(){full.setAttribute('aria-label',isFull()?'全画面を終了':'全画面');full.textContent=isFull()?'✕':'⛶';}
  function fallbackFull(){root.classList.add('hs-full');document.body.classList.add('hs-full-open');updateFull();}
  function leaveFull(){root.classList.remove('hs-full');document.body.classList.remove('hs-full-open');if(document.fullscreenElement===root)document.exitFullscreen().catch(()=>{});updateFull();}
  play.addEventListener('click',togglePlay);video.addEventListener('click',togglePlay);
  sound.addEventListener('click',()=>{audible=!audible;updateSound();});
  cc.addEventListener('click',()=>{showCaptions=!showCaptions;updateCaptions();});
  rate.addEventListener('change',()=>{video.playbackRate=Number(rate.value);});
  bgm.addEventListener('click',()=>{bgmOn=!bgmOn;bgm.textContent=bgmOn?'BGM オン':'BGM オフ';bgm.setAttribute('aria-pressed',String(bgmOn));bgm.classList.toggle('hs-off',!bgmOn);updateMusic();});
  seek.addEventListener('input',()=>goTo(Number(seek.value)));
  seek.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();goTo(position()+(event.key==='ArrowRight'?3:-3));}});
  for(const button of root.querySelectorAll('[data-chapter]'))button.addEventListener('click',()=>goTo(data.chapters[Number(button.dataset.chapter)].start));
  voice.addEventListener('change',()=>{
    const id=++revision;lastTime=position();resumeAfterLoad=loading?resumeAfterLoad:!video.paused;loading=true;stopMusic();status.textContent='音声を切り替えています';
    video.addEventListener('loadedmetadata',()=>{if(id!==revision)return;video.currentTime=Math.min(lastTime,Math.max(0,duration()-.01));loading=false;status.textContent='';updatePosition();updateCaptions();if(resumeAfterLoad)video.play().catch(()=>{status.textContent='再生ボタンを押してください。';});},{once:true});
    video.src=voice.selectedOptions[0].dataset.src;video.load();
  });
  full.addEventListener('click',()=>{if(isFull())leaveFull();else if(root.requestFullscreen)root.requestFullscreen().catch(fallbackFull);else fallbackFull();});
  document.addEventListener('fullscreenchange',updateFull);
  root.addEventListener('keydown',event=>{if(event.key==='Escape'){leaveFull();return;}if(event.target.matches('button,input,select,a,summary'))return;if(event.code==='Space'){event.preventDefault();togglePlay();}else if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();goTo(position()+(event.key==='ArrowRight'?3:-3));}});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)video.pause();});
  window.addEventListener('pagehide',()=>{video.pause();stopMusic();if(context)context.close().catch(()=>{});});
  video.addEventListener('timeupdate',updatePosition);video.addEventListener('seeked',()=>{updatePosition();updateCaptions();});
  for(const event of ['play','pause','ended'])video.addEventListener(event,updatePlay);
  video.addEventListener('loadedmetadata',()=>{video.playbackRate=Number(rate.value);updateSound();updatePosition();updateCaptions();});
  video.addEventListener('error',()=>{status.textContent='動画を読み込めませんでした。ページを再読み込みしてください。';stopMusic();});
  const bindTrack=()=>{const track=video.textTracks[0];if(track){track.mode='hidden';track.addEventListener('cuechange',updateCaptions);}updateCaptions();};
  trackElement.addEventListener('load',bindTrack);bindTrack();updateSound();updatePosition();updatePlay();
  video.controls=false;
})();
