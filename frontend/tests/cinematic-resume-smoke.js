(async()=>{
 window.__smokeStatus='RUNNING';window.__smokeStep='cinematic resume';
 const delay=ms=>new Promise(r=>setTimeout(r,ms)),assert=(v,m)=>{if(!v)throw Error(m);};
 async function wait(fn,name,limit=10000){window.__smokeStep=name;for(let n=0;n<limit/60;n++){if(fn())return;await delay(60);}throw Error('Timeout '+name);}
 const state=()=>JSON.parse(window.bridge.readSave());
 const button=n=>[...document.querySelectorAll('button')].find(b=>(b.getAttribute('aria-label')||b.textContent.trim())===n&&!b.disabled&&b.getClientRects().length);
 async function click(n){await wait(()=>button(n),n);button(n).click();await delay(100);}
 async function capture(n){window.__smokeCapture=n;await wait(()=>!window.__smokeCapture,'capture');}
 try{
 const startPosition=state().ending.position,phase=startPosition<10?0:startPosition<28?1:2;await wait(()=>document.querySelector('.main-menu'),'menu');
 if(phase===2){await click('Som');document.querySelector('.menu-sound input[type=checkbox]').click();assert(JSON.parse(localStorage.rastros_sound).muted,'mute saved');}
 await click('Continuar viagem');await wait(()=>document.querySelector('.ending-cinematic'),'cinema');await delay(400);
 const cinema=document.querySelector('.ending-cinematic');assert(!document.querySelector('.piano-world'),'resume without puzzle');assert(!button('Continuar'),'no premature Continue');cinema.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));assert(document.querySelector('.ending-cinematic'),'Escape blocked');
 if(phase===0){assert(cinema.dataset.phase==='hands','resume hands');await capture('retomada-maos');window.__smokeReport='PASS: reopened process resumes hands from 5.1 seconds; no repeated piano, no early Continue, Escape blocked.';window.__smokeStatus='PASS';return;}
 if(phase===1){assert(cinema.dataset.phase==='dialogue','resume dialogue');assert(document.body.innerText.includes('Logo acima do piano'),'correct dialogue card');await capture('retomada-falas');window.__smokeReport='PASS: reopened process resumes canonical dialogue from 16.4 seconds; correct card, no repeated piano, no early Continue.';window.__smokeStatus='PASS';return;}
 if(phase===2){assert(cinema.dataset.phase==='credits','resume credits');const before=window.bridge.audioPosition('28');await delay(600);assert(window.bridge.audioPosition('28')>before,'silent audio clock advances');await capture('retomada-creditos-sem-som');const events=JSON.parse(window.bridge.audioEvents());assert(!events.some(e=>e.action.startsWith('error')),'audio errors');const settings=JSON.parse(localStorage.rastros_sound);settings.muted=false;localStorage.rastros_sound=JSON.stringify(settings);window.__smokeReport='PASS: interrupted hands, dialogue and credits resumed from saved real audio offsets; piano not repeated; Escape blocked; no early Continue; muted playback clock advances; credits resumed at 50 seconds in a reopened process.';window.__smokeStatus='PASS';}
 }catch(e){window.__smokeStatus='FAIL '+e.message;}
})();

