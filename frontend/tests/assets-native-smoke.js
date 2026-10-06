(async()=>{
 window.__smokeStatus='RUNNING';window.__smokeStep='asset QA';
 const delay=ms=>new Promise(r=>setTimeout(r,ms)),assert=(v,m)=>{if(!v)throw Error(m);};
 async function wait(fn,label,limit=12000){window.__smokeStep=label;for(let n=0;n<limit/60;n++){if(fn())return;await delay(60);}throw Error('Timeout '+label);}
 const state=()=>JSON.parse(window.bridge.readSave());
 const button=n=>[...document.querySelectorAll('button')].find(b=>(b.getAttribute('aria-label')||b.textContent.trim())===n&&!b.disabled&&b.getClientRects().length&&!b.closest('[inert]'));
 async function click(n){await wait(()=>button(n),n);button(n).click();await delay(120);}
 async function capture(n){window.__smokeCapture=n;await wait(()=>!window.__smokeCapture,'capture '+n);}
 function reload(s,phase){window.bridge.writeSave(JSON.stringify(s));sessionStorage.assetsPhase=String(phase);window.__smokeStatus='RELOAD';setTimeout(()=>location.reload(),200);}
 function seed(color){const s=JSON.parse(sessionStorage.assetsOriginal);s.currentCarId='vagao3';s.visualState=color;s.narrativeStage={white:3,black:4,red:5}[color];s.resumeMode='scene';s.activeDialogue=null;s.thoughtQueue=[];Object.assign(s.flags,{hallucinationStarted:color!=='white',gameComplete:false,finalRoom:false,escapeComplete:false,deserted:false,confrontationComplete:false,messageExitRequested:false,pianoEndingPending:false,clockTransitionPending:false,loginGlitchPending:false,archivesGlitchPending:false,curtainGlitchPending:false,redGlitchPending:false});s.continuation.clock={hour:7,minute:7,solved:false};return s;}
 try{
 if(!sessionStorage.assetsOriginal){sessionStorage.assetsOriginal=window.bridge.readSave();reload(seed('white'),0);return;}
 const phase=Number(sessionStorage.assetsPhase);
 await wait(()=>document.querySelector('.main-menu'),'menu');
 if(phase<3){
  const color=['white','black','red'][phase];
  if(phase===0){await click('Som');const volume=document.querySelector('.menu-sound input[type=range]');Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(volume,'0.35');volume.dispatchEvent(new Event('input',{bubbles:true}));await delay(100);assert(JSON.parse(localStorage.rastros_sound).volume===.35,'volume persisted');const mute=document.querySelector('.menu-sound input[type=checkbox]');mute.click();assert(JSON.parse(localStorage.rastros_sound).muted,'mute persisted');mute.click();Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(volume,'0.7');volume.dispatchEvent(new Event('input',{bubbles:true}));}
  await click('Continuar viagem');await click('Examinar relógio');assert(document.querySelector('.clock-world.inspecting'),'first full clock artwork');await capture('clock-inspection-'+color);await click('Manipular relógio');
  assert(document.querySelectorAll('.clock-hand-svg').length===2,'two original hands');
  const hand=document.querySelector('.clock-hand-svg.minute');hand.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}));await delay(100);assert(state().continuation.clock.minute===8,'keyboard moves hand');
  const input=document.querySelector('input[aria-label="Minutos do relógio"]');Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(input,'14');input.dispatchEvent(new Event('input',{bubbles:true}));await delay(100);
  for(const size of ['1280x720','1366x768','1920x1080','820x900']){window.__smokeResize=size;await wait(()=>!window.__smokeResize,'resize');await delay(130);const r=document.querySelector('.clock-controls').getBoundingClientRect();assert(r.left>=0&&r.right<=innerWidth+1&&r.bottom<=innerHeight+1,'clock controls fit '+size);await capture('clock-'+color+'-'+size);}
  assert(document.querySelector('input[aria-label="Segundos do relógio"]').readOnly,'seconds fixed');
  if(phase<2){reload(seed(['black','red'][phase]),phase+1);return;}
  const s=seed('red');s.currentCarId='vagao4';s.flags.finalRoom=true;s.flags.escapeComplete=true;s.continuation.pianoSolved=false;reload(s,3);return;
 }
 if(phase===3){await click('Continuar viagem');await click('Examinar teclado');await click('Tocar piano');await wait(()=>document.querySelector('.piano-world'),'piano');
  assert(document.querySelectorAll('.piano-art-key').length===15,'15 original keys');
  for(const key of document.querySelectorAll('.piano-art-key')){key.dispatchEvent(new MouseEvent('click',{bubbles:true,detail:0}));await delay(90);assert(key.classList.contains('pressed'),'pressed art '+key.dataset.key);await delay(180);}
  for(const size of ['1280x720','1366x768','1920x1080','820x900']){window.__smokeResize=size;await wait(()=>!window.__smokeResize,'piano resize');await delay(150);const r=document.querySelector('.piano-artboard').getBoundingClientRect();assert(r.left>=0&&r.right<=innerWidth+1&&r.bottom<=innerHeight+1,'piano fits');await capture('piano-art-'+size);}
  const events=JSON.parse(window.bridge.audioEvents());assert(!events.some(e=>e.action.startsWith('error')),'native errors');assert([...Array.from({length:8},(_,i)=>'A'+(i+1)),...Array.from({length:7},(_,i)=>'B'+(i+1))].every(id=>events.some(e=>e.id==='note-'+id&&e.action==='requested')),'all key samples requested');
  const s=seed('black');s.continuation.clock={hour:0,minute:14,solved:true};s.flags.clockTransitionPending=true;s.flags.clockTransitionStartedAt=Date.now()-4000;reload(s,4);return;
 }
 if(phase===4){await click('Continuar viagem');await wait(()=>!state().flags.clockTransitionPending,'resume clock blackout',4000);assert(state().continuation.clock.solved,'clock resumed');const s=seed('white');s.resumeMode='intro';s.introElapsed=9200;reload(s,5);return;}
 if(phase===5){const start=performance.now();await click('Continuar viagem');await wait(()=>!document.querySelector('.timed-intro')&&document.querySelector('.scene-view'),'resume intro',3500);assert(performance.now()-start<3000,'intro resumes remaining time');const s=seed('white');s.currentCarId='vagao2';s.flags.curtainGlitchPending=true;s.glitchStartedAt=Date.now()-3000;reload(s,6);return;}
 if(phase===6){await click('Continuar viagem');await wait(()=>state().flags.curtainExamined&&!state().flags.curtainGlitchPending,'resume curtain',3500);assert(state().visualState==='black','curtain resumed black');window.bridge.writeSave(sessionStorage.assetsOriginal);sessionStorage.removeItem('assetsOriginal');sessionStorage.removeItem('assetsPhase');window.__smokeReport='PASS: all 15 piano art states and real samples; white/black/red original clock hands and keyboard; four resolutions; menu volume/mute; interrupted clock, introduction and curtain resumed; isolated original final save restored.';window.__smokeStatus='PASS';}
 }catch(e){window.__smokeStatus='FAIL '+e.message;}
})();


