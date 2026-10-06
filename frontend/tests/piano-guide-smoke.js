(async()=>{
 window.__smokeStatus='RUNNING';const delay=ms=>new Promise(r=>setTimeout(r,ms));
 const assert=(v,m)=>{if(!v)throw Error(m)};const state=()=>JSON.parse(window.bridge.readSave());const events=()=>JSON.parse(window.bridge.audioEvents());
 async function wait(fn,label){window.__smokeStep=label;for(let i=0;i<240;i++){if(fn())return;await delay(50)}throw Error('Timeout '+label+' '+document.body.innerText)}
 const button=name=>[...document.querySelectorAll('button')].find(b=>(b.getAttribute('aria-label')||b.textContent.trim())===name&&!b.disabled&&b.getClientRects().length);
 async function click(name){await wait(()=>button(name),name);button(name).dispatchEvent(new MouseEvent('click',{bubbles:true,detail:1,button:0}));await delay(100)}
 try{
  await wait(()=>document.querySelector('.main-menu'),'menu');await click('Continuar viagem');await click('Examinar teclado');await click('Tocar piano');
  assert(document.querySelector('.piano-score-scrap')?.textContent.includes('B4 – D5 – E5 – D5 – B4'),'paper guide visible');assert([...document.querySelectorAll('.piano-key-label')].every(x=>!x.querySelector('.piano-note-name')),'only musical names visible');
  for(const name of ['A4','B4','E5','A4','B4','E5','A4','B4','E5'])await click('Tocar '+name);
  assert(!state().continuation.pianoSolved,'old sequence rejected');assert(document.querySelector('.piano-compact-footer p').textContent.includes('Algo não está certo'),'error after nine notes');await click('Recomeçar sequência');
  const audioStart=events().length;await delay(700);const sequence=['B4','D5','B4','A4','B4','D5','E5','D5','B4'];const ids={B4:'A3',D5:'A5',E5:'A6',A4:'A2'};const footer=document.querySelector('.piano-compact-footer p').textContent;
  for(let i=0;i<sequence.length;i++){
   const name=sequence[i],id='note-'+ids[name];const before=events().filter(e=>e.id===id&&e.action==='requested').length;
   await click('Tocar '+name);if(i===3)await delay(12000);assert(events().filter(e=>e.id===id&&e.action==='requested').length===before+1,'one mouse click = one note '+i);
   if(i<8){assert(events().slice(audioStart).filter(e=>e.action==='requested').every(e=>e.id.startsWith('note-')),'only piano audio');assert(!state().continuation.pianoSolved,'no early completion '+i);assert(document.querySelector('.piano-compact-footer p').textContent===footer,'no correctness hints')}
  }
  await wait(()=>document.querySelector('.ending-cinematic'),'ending');assert(state().continuation.pianoSolved&&state().flags.pianoEndingPending,'completion persisted');
  assert(events().filter(e=>e.id==='28'&&e.action==='requested').length<=1,'single ending');
  window.__smokeReport='PASS: ordinary MouseEvent click detail=1, no pointer events/capture/held keys; one click produces exactly one correct note. Old melody rejected, both phrases required, nine sequential mouse clicks solve and persist completion, ending starts once; visible labels are musical notes only.';window.__smokeStatus='PASS';
 }catch(e){window.__smokeStatus='FAIL '+e.message}
})();
