// Native opt-in test. Seed a fresh save in app/test-save at vagao3 before running.
(async()=>{
 window.__smokeStatus='RUNNING';window.__smokeStep='clock persistence';
 const delay=ms=>new Promise(r=>setTimeout(r,ms));
 const assert=(v,m)=>{if(!v)throw Error(m);};
 const button=t=>[...document.querySelectorAll('button')].find(b=>(b.getAttribute('aria-label')||b.textContent.trim())===t&&!b.disabled);
 const wait=async f=>{for(let i=0;i<150;i++){if(f())return;await delay(60);}throw Error('Timed out: '+document.body.innerText);};
 const click=async t=>{await wait(()=>button(t));button(t).click();await delay(70);};
 const input=(label,v)=>{const el=document.querySelector('[aria-label="'+label+'"]');Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(el,v);el.dispatchEvent(new Event('input',{bubbles:true}));};
 try{
  await click('Continuar viagem');await click('Examinar relógio');await click('Manipular relógio');
  if(window.__persistenceResume){
   assert(document.querySelector('[aria-label="Horas do relógio"]').value==='2','hour reopened');
   assert(document.querySelector('[aria-label="Minutos do relógio"]').value==='37','minute reopened');
   assert(!JSON.parse(window.bridge.readSave()).flags.timeReturned,'partial adjustment not solved');
   window.__smokeReport='PASS: partial clock 02:37 reopened in a second native process without solving the puzzle.';
  }else{
   const before=window.bridge.readSave();input('Horas do relógio','2');input('Minutos do relógio','37');
   assert(window.bridge.readSave()===before,'draft writes nothing immediately');
   assert(window.rastrosSaveNow()===true,'native close flush succeeded');
   const s=JSON.parse(window.bridge.readSave());assert(s.continuation.clock.hour===2&&s.continuation.clock.minute===37,'pending draft flushed');
   assert(!s.continuation.clock.solved&&!s.flags.timeReturned,'flush does not solve clock');
   window.__smokeReport='PASS: close flush persists the pending clock draft before the 500 ms debounce.';
  }
  window.__smokeStatus='PASS';
 }catch(e){window.__smokeStatus='FAIL '+e.message;}
})();
