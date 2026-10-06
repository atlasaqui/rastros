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
 await wait(()=>document.querySelector('.main-menu'),'menu');await click('Continuar viagem');await car('vagao3');
 await wait(()=>getComputedStyle(document.documentElement).getPropertyValue('--rastros-cursor').includes('runtime-cursors'),'native cursor ready');assert(!document.querySelector('.game-cursor'),'no moving SVG cursor layer');
 for(let i=0;i<3;i++){await click('Examinar relógio');await click('Manipular relógio');input('[aria-label="Minutos do relógio"]',String(i+1));await delay(100);await click('Voltar ao vagão');await wait(()=>!document.querySelector('.clock-world'),'clock closes');}
 await click('Examinar relógio');await click('Manipular relógio');for(let i=0;i<60;i++)input('[aria-label="Minutos do relógio"]',String(i));await delay(600);await click('Confirmar horário');assert(!state().continuation.clock.solved,'wrong time remains editable');
 const hand=document.querySelector('.clock-hand-svg.minute');hand.focus();hand.dispatchEvent(new KeyboardEvent('keydown',{bubbles:true,key:'',keyCode:39}));await delay(100);assert(document.querySelector('[aria-label="Minutos do relógio"]').value==='0','native arrow wraps minute');
 input('[aria-label="Horas do relógio"]','0');input('[aria-label="Minutos do relógio"]','14');await delay(100);await click('Confirmar horário');await wait(()=>!document.querySelector('.clock-world'),'clock resolution finishes');await drain();assert(state().continuation.clock.solved,'clock saved');
 await click('Voltar ao Vagão 4');await car('vagao4');await capture('vermelho-cursor-nativo');await click('Examinar teclado');await click('Tocar piano');
 assert(document.querySelectorAll('.piano-key-label').length===15,'15 guide labels');
 for(const size of ['1280x720','820x900']){await resize(size);await capture('guia-piano-'+size);const box=document.querySelector('.piano-compact-footer').getBoundingClientRect();assert(box.bottom<=innerHeight,'guide fits '+size);}
 for(const id of ['A1','A2','A3','A4','A5','A6','A7','A8','B1','B2','B3','B4','B5','B6','B7']){document.querySelector('.piano-art-key[data-key="'+id+'"]').dispatchEvent(new MouseEvent('click',{bubbles:true,detail:1,button:0}));await delay(250);}
 const ev=()=>JSON.parse(window.bridge.audioEvents());assert(!ev().some(e=>e.action.startsWith('error')),'audio loads');assert(['A1','A2','A3','A4','A5','A6','A7','A8','B1','B2','B3','B4','B5','B6','B7'].every(id=>ev().some(e=>e.id==='note-'+id&&e.action==='requested')),'all 15 supplied sounds');
 await click('Recomeçar sequência');button('Recomeçar sequência').focus();
 for(const id of ['A3','A5','A3','A2','A3','A5','A6','A5','A3']){const key=document.querySelector('.piano-art-key[data-key="'+id+'"]');key.dispatchEvent(new MouseEvent('click',{bubbles:true,detail:1,button:0}));await delay(100);await delay(100);}
 await wait(()=>document.querySelector('.ending-cinematic'),'mouse sequence solves');
 window.__smokeReport='PASS: clock open/close/reopen, 60 rapid edits, wrong/correct answer, legacy native arrow key and completed transition; native cursor PNG without moving overlay; 15 supplied piano sounds; guide at two resolutions; mouse chorus B4 D5 B4 A4 / B4 D5 E5 D5 B4 solves.';window.__smokeStatus='PASS';
 }catch(e){try{await capture('failure-checkup');}catch{}window.__smokeStatus='FAIL '+e.message;}
})();
