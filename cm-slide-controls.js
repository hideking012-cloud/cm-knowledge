
(function(){
  var slides=[].slice.call(document.querySelectorAll('.slide'));
  var idx=0, playing=false, token=0;
  var synth=('speechSynthesis' in window&&typeof SpeechSynthesisUtterance!=='undefined')?window.speechSynthesis:null;
  var $=function(id){return document.getElementById(id)};
  var cap=$('caption'), auto=false, captionTimer=0, currentCaption='';
  function readPreference(key){
    try{return localStorage.getItem(key)}catch(e){return null}
  }
  function savePreference(key,value){
    try{localStorage.setItem(key,value)}catch(e){}
  }
  var capOn=readPreference('cmKnowledgeCaptions')!=='off';
  cap.removeAttribute('role');
  cap.setAttribute('aria-live','off');
  cap.setAttribute('aria-label','ナレーション字幕');

  function show(i,keepSpeech){
    if(i<0||i>=slides.length)return;
    idx=i;
    slides.forEach(function(s,k){s.classList.toggle('active',k===i)});
    pauseVideos(i);
    requestSlideFit();
    $('count').textContent=(i+1)+' / '+slides.length;
    $('prev').disabled=(i===0);$('next').disabled=(i===slides.length-1);
    if(history.replaceState)history.replaceState(null,'','#s'+(i+1));
    if(!document.body.classList.contains('list'))window.scrollTo(0,0);
    if(playing&&!keepSpeech){speakSlide(i)}
    else if(!playing){startSilentCaptions(i)}
  }
  /* --- speech --- */
  var voices=[], preferredVoice=readPreference('cmKnowledgeJapaneseVoice')||'';
  var rate=$('rate'), rates=['0.75','1','1.25','1.5','2'];
  rate.replaceChildren(...rates.map(function(value){return new Option(value+'倍',value)}));
  var savedRate=readPreference('cmKnowledgeNarrationRate');
  rate.value=rates.includes(savedRate)?savedRate:'1';
  function loadVoices(){
    if(!synth)return;
    var sel=$('voice');
    voices=synth.getVoices().filter(function(v){return /^ja(-|_|$)/i.test(v.lang)});
    sel.length=1;
    voices.forEach(function(v){
      var option=document.createElement('option');
      option.value=v.voiceURI;option.textContent=v.name;
      sel.appendChild(option);
    });
    sel.value=voices.some(function(v){return v.voiceURI===preferredVoice})?preferredVoice:'';
    sel.disabled=!voices.length;
    $('voiceNote').textContent=voices.length?'読み上げはボタンで開始します。選べる日本語音声は端末によって異なります。':
      'この端末で日本語音声が見つかりません。端末の読み上げ設定を確認してください。原稿は各スライドで読めます。';
  }
  if(synth){loadVoices();if(typeof synth.onvoiceschanged!=='undefined')synth.onvoiceschanged=loadVoices;}
  else{$('play').disabled=true;$('voiceNote').textContent='このブラウザーは音声読み上げに対応していません。各スライドの「原稿」をご覧ください。';}

  function sentences(i){
    var el=slides[i].querySelector('.say');var t=el?el.textContent.replace(/\s+/g,' ').trim():'';
    return (t.match(/[^。！？]+[。！？]?/g)||[]).filter(function(s){return s.length});
  }
  function startSilentCaptions(i){
    clearTimeout(captionTimer);
    currentCaption='';
    if(!capOn||document.body.classList.contains('list')||slides[i].querySelector('video')){renderCaption();return}
    var list=sentences(i), n=0;
    function next(){
      currentCaption=list[n]||'';
      renderCaption();
      if(n<list.length-1){
        captionTimer=setTimeout(next,Math.max(2200,list[n].length*135));
        n++;
      }
    }
    next();
  }
  function speakSlide(i){
    var vid=slides[i].querySelector('video');
    if(vid){playVideoSlide(i,vid);return;}
    if(!synth)return;
    clearTimeout(captionTimer);
    var my=++token;synth.cancel();
    var list=sentences(i), n=0;
    currentCaption=list[0]||'';renderCaption();
    function next(){
      if(my!==token)return;
      if(n>=list.length){
        if(auto&&idx<slides.length-1){show(idx+1,true);speakSlide(idx);}
        else{setPlaying(false);}
        return;
      }
      var u=new SpeechSynthesisUtterance(list[n]);
      u.lang='ja-JP';u.rate=Number(rate.value);
      var selected=voices.find(function(v){return v.voiceURI===preferredVoice})||voices.find(function(v){return v.default})||voices[0];if(selected)u.voice=selected;
      u.onend=function(){n++;next()};
      u.onerror=function(){if(my!==token)return;setPlaying(false);startSilentCaptions(idx);$('voiceNote').textContent='再生できませんでした。端末の音声設定を確認してください。'};
      u.onstart=function(){if(my===token){currentCaption=u.text;renderCaption()}};
      synth.speak(u);
    }
    next();
  }
  /* --- video slides --- */
  function pauseVideos(keep){
    slides.forEach(function(s,k){if(k===keep)return;s.querySelectorAll('video').forEach(function(v){try{v.pause()}catch(e){}})});
  }
  function playVideoSlide(i,vid){
    var my=++token;if(synth)synth.cancel();clearTimeout(captionTimer);
    currentCaption='';renderCaption();
    vid.muted=false;
    vid.onended=function(){
      if(my!==token)return;
      if(auto&&idx<slides.length-1){show(idx+1,true);speakSlide(idx);}
      else{setPlaying(false);}
    };
    if(vid.ended)vid.currentTime=0;
    var p=vid.play();if(p&&p.catch)p.catch(function(){if(my===token)setPlaying(false)});
  }
  [].forEach.call(document.querySelectorAll('.cm-video'),function(box){
    var vid=box.querySelector('video'),frame=box.querySelector('.cm-video-frame');
    var btns=[].slice.call(box.querySelectorAll('[data-seek]'));
    vid.addEventListener('error',function(){frame.classList.add('failed')});
    var src=vid.querySelector('source');if(src)src.addEventListener('error',function(){frame.classList.add('failed')});
    btns.forEach(function(b){b.addEventListener('click',function(){vid.currentTime=parseFloat(b.dataset.seek)+0.05;vid.muted=false;var p=vid.play();if(p&&p.catch)p.catch(function(){});})});
    vid.addEventListener('timeupdate',function(){
      var t=vid.currentTime;
      btns.forEach(function(b){b.setAttribute('aria-current',String(t>=parseFloat(b.dataset.seek)&&t<parseFloat(b.dataset.end)))});
    });
    var tr=vid.querySelector('track');
    function useInlineCues(){
      if(box.inlineCues||!window.VTTCue||!vid.dataset.cues)return;box.inlineCues=true;
      if(tr)tr.remove();
      var t=vid.addTextTrack('subtitles','日本語','ja');
      JSON.parse(vid.dataset.cues).forEach(function(c){t.addCue(new VTTCue(c[0],c[1],c[2]))});
      syncTrack();
    }
    if(tr)tr.addEventListener('error',useInlineCues);
    if(location.protocol==='file:')useInlineCues();
    function syncTrack(){for(var k=0;k<vid.textTracks.length;k++)vid.textTracks[k].mode=capOn?'showing':'hidden'}
    vid.addEventListener('loadedmetadata',syncTrack);box.syncTrack=syncTrack;syncTrack();
  });
  function renderCaption(){
    var line=capOn&&!document.body.classList.contains('list')?currentCaption:'';
    cap.textContent=line;
    cap.classList.toggle('show',Boolean(line));
    requestSlideFit();
  }
  function setPlaying(p){playing=p;$('play').textContent=p?'▶ 読み上げ中':'▶ 読み上げ開始';$('play').setAttribute('aria-pressed',p?'true':'false')}
  $('play').addEventListener('click',function(){if(!synth)return;loadVoices();if(document.body.classList.contains('list'))toggleList(false);setPlaying(true);speakSlide(idx)});
  $('stop').addEventListener('click',function(){token++;if(synth)synth.cancel();pauseVideos(-1);setPlaying(false);startSilentCaptions(idx)});
  rate.addEventListener('change',function(){savePreference('cmKnowledgeNarrationRate',rate.value);if(playing)speakSlide(idx)});
  $('voice').addEventListener('change',function(){preferredVoice=this.value;savePreference('cmKnowledgeJapaneseVoice',preferredVoice);if(playing)speakSlide(idx)});

  function bindToggle(id,fn){var b=$(id);b.addEventListener('click',function(){var v=b.getAttribute('aria-pressed')!=='true';b.setAttribute('aria-pressed',String(v));fn(v)})}
  var capToggle=$('tCap');
  function labelCaptions(){
    capToggle.textContent=capOn?'字幕 ON':'字幕 OFF';
    capToggle.setAttribute('aria-pressed',String(capOn));
  }
  labelCaptions();
  bindToggle('tCap',function(v){
    capOn=v;
    savePreference('cmKnowledgeCaptions',v?'on':'off');
    labelCaptions();
    [].forEach.call(document.querySelectorAll('.cm-video'),function(b){b.syncTrack&&b.syncTrack()});
    if(playing){renderCaption()}else{startSilentCaptions(idx)}
  });
  bindToggle('tAuto',function(v){auto=v});
  bindToggle('tMotion',function(v){document.body.classList.toggle('reduce',v)});
  function toggleList(v){$('tList').setAttribute('aria-pressed',String(v));document.body.classList.toggle('list',v);if(!v)show(idx,true);else{token++;if(synth)synth.cancel();pauseVideos(-1);setPlaying(false);startSilentCaptions(idx)}}
  bindToggle('tList',function(v){toggleList(v)});
  var mq=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)');
  if(mq&&mq.matches){document.body.classList.add('reduce');$('tMotion').setAttribute('aria-pressed','true')}

  $('prev').addEventListener('click',function(){show(idx-1)});
  $('next').addEventListener('click',function(){show(idx+1)});
  document.addEventListener('keydown',function(e){
    if(/INPUT|SELECT|TEXTAREA/.test(e.target.tagName)||e.target.classList.contains('diagram'))return;
    if(e.key==='Escape'&&document.body.classList.contains('cm-fullscreen')&&!document.fullscreenElement){setFullscreen(false);return;}
    if(e.key==='ArrowRight'||e.key==='PageDown'){show(idx+1);e.preventDefault()}
    if(e.key==='ArrowLeft'||e.key==='PageUp'){show(idx-1);e.preventDefault()}
  });
  var sx=null,sy=null;
  document.getElementById('deck').addEventListener('touchstart',function(e){var t=e.changedTouches[0];sx=t.clientX;sy=t.clientY},{passive:true});
  document.getElementById('deck').addEventListener('touchend',function(e){if(sx===null||document.body.classList.contains('list'))return;var t=e.changedTouches[0],dx=t.clientX-sx,dy=t.clientY-sy;if(Math.abs(dx)>70&&Math.abs(dx)>Math.abs(dy)*1.5){show(idx+(dx<0?1:-1))}sx=null},{passive:true});

  /* --- flow highlight (click only) --- */
  function flowState(id){var f=$(id);return {f:f,steps:[].slice.call(f.querySelectorAll('.step')),st:$(id+'-status')}}
  function setFlow(id,n){
    var o=flowState(id);o.f.dataset.cur=String(n);
    o.f.classList.toggle('playing',n>=0);
    o.steps.forEach(function(s,k){s.classList.toggle('on',k===n);s.classList.toggle('done',k<n);s.setAttribute('aria-current',k===n?'step':'false')});
    if(n<0){o.st.textContent='ボタンを押すと工程を順に強調します'}
    else{o.st.textContent=(n+1)+' / '+o.steps.length+'：'+o.steps[n].querySelector('b').textContent}
  }
  [].forEach.call(document.querySelectorAll('.flow-next'),function(b){b.addEventListener('click',function(){var id=b.dataset.flow,o=flowState(id),c=parseInt(o.f.dataset.cur||'-1',10)+1;if(c>=o.steps.length)c=0;setFlow(id,c)})});
  [].forEach.call(document.querySelectorAll('.flow-reset'),function(b){b.addEventListener('click',function(){setFlow(b.dataset.flow,-1)})});
  [].forEach.call(document.querySelectorAll('.flow'),function(f){[].forEach.call(f.querySelectorAll('.step'),function(s,k){s.tabIndex=0;s.addEventListener('click',function(){setFlow(f.id,k)});s.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){setFlow(f.id,k);e.preventDefault()}})})});


  document.querySelectorAll('.chart-next').forEach(function(button){
    var chart=button.closest('.anim'), progress=button.parentElement.querySelector('.chart-step');
    var steps=Number(chart.dataset.steps);
    button.addEventListener('click',function(){
      var step=(Number(chart.dataset.cmStep)||0)+1;
      if(step>steps)step=0;
      chart.dataset.cmStep=String(step);
      chart.querySelectorAll('.st,.stc,.sl').forEach(function(el){
        var chosen=step>0&&el.classList.contains('s'+step);
        el.classList.toggle('highlighted',chosen&&el.namespaceURI!=='http://www.w3.org/2000/svg');
        el.classList.toggle('chart-highlight',chosen&&el.namespaceURI==='http://www.w3.org/2000/svg');
        el.classList.toggle('chart-dim',step>0&&!chosen&&el.namespaceURI==='http://www.w3.org/2000/svg');
      });
      progress.textContent=step?step+' / '+steps:'全体表示';
    });
  });
  document.querySelectorAll('.figzoom').forEach(function(button){
    button.addEventListener('click',function(){
      var figure=button.closest('.fig'), expanded=figure.classList.toggle('is-zoomed'), diagram=figure.querySelector('.diagram');
      button.setAttribute('aria-pressed',String(expanded));
      button.textContent=expanded?'図を元に戻す':'図を拡大';
      if(expanded)diagram.tabIndex=0;
      else{diagram.removeAttribute('tabindex');diagram.scrollLeft=0}
    });
  });
  document.querySelectorAll('[data-jump]').forEach(function(link){
    link.addEventListener('click',function(e){e.preventDefault();show(Number(link.dataset.jump)-1)})
  });

  /* --- Fit one 16:9 frame and keep the reading view unscaled --- */
  var deck = $('deck');
  var pager = document.querySelector('.pager');
  var controls = document.querySelector('.controls');
  var format = deck.querySelector('.cm-slide-format span');
  if(format)format.textContent='一覧表示で本文を大きく読めます';
  var fullscreenButton=document.createElement('button');
  fullscreenButton.type='button';
  fullscreenButton.className='btn';
  fullscreenButton.id='tFullscreen';
  fullscreenButton.setAttribute('aria-pressed','false');
  fullscreenButton.textContent='フル画面';
  pager.querySelector('.in').appendChild(fullscreenButton);

  var sheets=slides.map(function(slide){
    var sheet=document.createElement('div');
    sheet.className='cm-slide-sheet';
    while(slide.firstChild)sheet.appendChild(slide.firstChild);
    slide.appendChild(sheet);
    return sheet;
  });
  document.body.classList.add('cm-fit-ready');

  function setFullscreen(on){
    document.body.classList.toggle('cm-fullscreen',on);
    fullscreenButton.setAttribute('aria-pressed',String(on));
    fullscreenButton.textContent=on?'フル画面を終了':'フル画面';
    window.scrollTo(0,0);
    requestSlideFit();
  }
  fullscreenButton.addEventListener('click',function(){
    if(document.body.classList.contains('cm-fullscreen')){
      setFullscreen(false);
      if(document.fullscreenElement&&document.exitFullscreen)document.exitFullscreen().catch(function(){});
      return;
    }
    if(document.body.classList.contains('list'))toggleList(false);
    setFullscreen(true);
    if(document.documentElement.requestFullscreen&&!document.fullscreenElement){
      document.documentElement.requestFullscreen().catch(function(){});
    }
  });
  document.addEventListener('fullscreenchange',function(){setFullscreen(!!document.fullscreenElement);});

  var fitFrame=0;
  function requestSlideFit(){
    cancelAnimationFrame(fitFrame);
    fitFrame=requestAnimationFrame(fitSlide);
  }
  function fitSlide(){
    if(document.body.classList.contains('list'))return;
    var slide=slides[idx],sheet=sheets[idx];
    var deckStyle=getComputedStyle(deck);
    var availableWidth=deck.clientWidth-parseFloat(deckStyle.paddingLeft)-parseFloat(deckStyle.paddingRight);
    cap.style.setProperty('--cm-caption-bottom',pager.offsetHeight+'px');
    var captionHeight=cap.classList.contains('show')?cap.offsetHeight+8:0;
    var availableHeight=pager.getBoundingClientRect().top-slide.getBoundingClientRect().top-8-captionHeight;
    var width=Math.min(availableWidth,Math.max(100,availableHeight)*16/9);
    deck.style.setProperty('--cm-fitted-width',Math.floor(width)+'px');
    var maxWidth=slide.clientWidth;
    sheet.style.width=Math.max(maxWidth,Math.min(740,maxWidth*1.28))+'px';
    var scale=Math.min(1,(maxWidth-2)/Math.max(sheet.offsetWidth,sheet.scrollWidth),
      (slide.clientHeight-2)/Math.max(sheet.offsetHeight,sheet.scrollHeight));
    sheet.style.setProperty('--cm-sheet-scale',String(Math.max(.025,scale)));
  }
  if(window.ResizeObserver){
    var fitObserver=new ResizeObserver(requestSlideFit);
    sheets.forEach(function(sheet){fitObserver.observe(sheet);});
    fitObserver.observe(pager);
    if(controls)fitObserver.observe(controls);
  }
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(requestSlideFit);
  window.addEventListener('resize',requestSlideFit);
  deck.addEventListener('toggle',requestSlideFit,true);

  /* --- start --- */
  slides.forEach(function(slide){slide.tabIndex=0;});
  function pageFromHash(){var m=location.hash.match(/^#s?(\d+)$/);return m?Math.min(Math.max(parseInt(m[1],10)-1,0),slides.length-1):0}
  window.addEventListener('hashchange',function(){show(pageFromHash())});
  show(pageFromHash(),true);
})();
