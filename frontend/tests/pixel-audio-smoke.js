(async()=>{
 window.__smokeStatus='RUNNING';window.__smokeStep='start';
 const delay=ms=>new Promise(r=>setTimeout(r,ms)),assert=(v,msg)=>{if(!v)throw Error(msg);};
 const state=()=>JSON.parse(window.bridge.readSave());
 async function wait(fn,label,timeout=12000){window.__smokeStep=label;for(let n=0;n<timeout/60;n++){if(fn())return;await delay(60);}throw Error('Timeout '+label+' | '+document.body.innerText.slice(-1800));}
 const button=name=>[...document.querySelectorAll('button')].find(b=>(b.getAttribute('aria-label')||b.textContent.trim())===name&&!b.disabled&&b.getClientRects().length&&!b.closest('[inert]'));
 async function click(name){await wait(()=>button(name),'button '+name);button(name).click();await delay(100);}
 async function drain(){for(let i=0;i<30&&document.querySelector('.npc-overlay-box');i++){if(button('Recolher bloco de notas'))return;await click(button('Continuar')?'Continuar':'Voltar');}}
 async function thought(){if(document.querySelector('.os-thought-overlay'))await click('Continuar');}
 async function capture(name){await delay(150);window.__smokeCapture=name;await wait(()=>!window.__smokeCapture,'capture '+name);}
 function input(selector,value){const el=document.querySelector(selector);assert(el,'input '+selector);Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(el,value);el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));}
 async function car(id){await wait(()=>document.querySelector('.scene-view')?.dataset.car===id&&!document.querySelector('.travel-fade')&&!document.querySelector('.notebook-overlay'),'car '+id);await drain();}
 async function talk(label){await click(label);await drain();}
 async function notebook(){await click('Usar notebook');await wait(()=>document.querySelector('.login-screen')||document.querySelector('.desktop'),'notebook');}
 async function resize(size){window.__smokeResize=size;await wait(()=>!window.__smokeResize,'resize '+size);await delay(220);}
 async function hands(){await wait(()=>document.querySelector('.hands-vision'),'hands');await delay(850);await capture('hands-'+(state().flags.confrontationComplete?'escape':'bible'));await click('Olhar novamente');await capture('hands-second-'+(state().flags.confrontationComplete?'escape':'bible'));await click(state().flags.confrontationComplete?'Fugir':'Seguir viagem');}
 async function messagesExit(){await click('Afastar-se');await drain();await hands();}
 try{
 await wait(()=>document.querySelector('.main-menu'),'menu');await click('Continuar viagem');
 const events=()=>JSON.parse(window.bridge.audioEvents());
 await wait(()=>events().some(e=>e.id==='26'&&e.action==='playing'),'stage 4 music');
 const req=id=>events().find(e=>e.id===id&&e.action==='requested').ms;
 const gap=req('26')-req('glitch-3-4');assert(Math.abs(gap-4000)<180,'4-second cue '+gap);
 assert(document.querySelector('.escape-game'),'music belongs to pixel art');
 window.bridge.audioSeek('26',100);await wait(()=>window.bridge.audioPosition('26')>99,'seek near end');await wait(()=>window.bridge.audioPosition('26')<5,'native music loop',9000);
 await click('Continuar viagem');
 const seen=new Set();let held=new Set();
 function drive(wanted){for(const key of held)if(!wanted.has(key))window.dispatchEvent(new KeyboardEvent('keyup',{key,bubbles:true}));for(const key of wanted)if(!held.has(key))window.dispatchEvent(new KeyboardEvent('keydown',{key,bubbles:true,cancelable:true}));held=wanted;}
 for(let n=0;n<1600&&document.querySelector('.escape-game');n++){
  const position=document.querySelector('.escape-game canvas')?.dataset.position;const c=position?JSON.parse(position):state().chase;if(c){seen.add(c.wagon);assert(c.phase!=='caught','retry must avoid obstacles');const next=c.hands.filter(h=>h.y<c.y+35).sort((a,b)=>b.y-a.y)[0];const target=next?(next.side==='left'?225:135):180;const wanted=new Set();if(c.x<target-6)wanted.add('ArrowRight');if(c.x>target+6)wanted.add('ArrowLeft');if(Math.abs(c.x-target)<12||!next||c.y-next.y>140)wanted.add('ArrowUp');drive(wanted);}
  await delay(35);
 }
 drive(new Set());assert(seen.size===5,'five wagons '+seen.size);
 
 await wait(()=>state().flags.escapeComplete,'escape finished');await wait(()=>events().some(e=>e.id==='27'&&e.action==='requested'),'next stage music');
 assert(events().some(e=>e.id==='26'&&e.action==='stopped'),'stage 4 music stopped');assert(!events().some(e=>e.action.startsWith('error')),'no audio errors');
 window.__smokeReport='PASS: supplied audio plays in JavaFX, music starts '+Math.round(gap)+' ms after transition, native loop verified by seeking near end, music stops after all five pixel-art wagons and stage 5 starts.';window.__smokeStatus='PASS';
 }catch(e){window.__smokeStatus='FAIL '+e.message;}
})();
