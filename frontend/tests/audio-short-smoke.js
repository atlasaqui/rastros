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
 async function messagesExit(){await click('Afastar-se novamente');await drain();await hands();}
 try{
 await wait(()=>document.querySelector('.sound-warning'),'sound warning');await capture('aviso-sonoro');assert(!document.querySelector('.sound-warning button'),'splash automatic without buttons');await wait(()=>document.querySelector('.main-menu'),'automatic menu');
 if(window.__persistenceResume){await click('Continuar viagem');await wait(()=>document.querySelector('.final-title'),'restored ending');assert(state().flags.gameComplete,'ending saved');assert(state().continuation.clock.solved&&state().flags.captchaSolved,'puzzles saved');assert(state().continuation.attempts>=1,'retry saved');assert(!document.querySelector('.save-error'),'no save error');await capture('final-reopened');window.__smokeReport='PASS: native save reopened in second executable process; final, clock, memory, retry and journal persisted.';window.__smokeStatus='PASS';return;}
 await click('Novo jogo');if(button('Começar de novo →'))await click('Começar de novo →');await wait(()=>!document.querySelector('.timed-intro')&&document.querySelector('.scene-view'),'timed intro',16000);await drain();
 await talk('Silhueta lendo a Bíblia');assert(!state().flags.bibleSeen,'initial Bible is not clue encounter');
 await click('Ir ao Vagão 2');await car('vagao2');assert(!document.querySelector('.shadow-visible'),'initial window clean');assert(document.querySelector('.clean-window'),'clean curtains layer');await capture('janela-inicial-sem-sombra');await talk('Examinar bloco de notas');await click('Recolher bloco de notas');assert(document.querySelector('.pickup-table-patch'),'notepad removed from table');await capture('mesa-sem-bloco');
 await click('Abrir bloco de notas');await click('Mostrar tudo');assert(document.body.innerText.includes('04/06 - motivação?'),'original note retained');await capture('diario-topo');const rings=document.querySelector('.journal-rings').getBoundingClientRect(),book=document.querySelector('.journal-book').getBoundingClientRect();assert(rings.width>rings.height&&rings.top<book.top+10,'rings on top');
 await click('Fechar bloco de notas');await wait(()=>!document.querySelector('.journal-book'),'journal closes');
 assert(!state().journal.completed.includes('voices'),'conversation objective pending before Bible');await notebook();
 input('[aria-label="Senha do notebook"]','wrong');await click('Entrar');assert(!state().notebookAuthenticated,'wrong login');
 input('[aria-label="Senha do notebook"]','04/06/2000');await click('Entrar');await wait(()=>document.querySelector('.glitch-transition'),'login glitch');assert(state().flags.loginGlitchPending&&state().visualState==='white','login changes color after glitch');await capture('glitch-login');await wait(()=>!document.querySelector('.glitch-transition')&&state().visualState==='black','glitch ended');await thought();
 window.__smokeReport='AUDIO_SHORT '+window.bridge.audioEvents();window.__smokeStatus='PASS';
 }catch(e){window.__smokeStatus='FAIL '+e.message+' AUDIO '+window.bridge.audioEvents();}
})();
