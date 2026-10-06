// Opt-in manual Windows keyboard regression. Use only with --smoke and keyboard-fixture.json in test-save.
// No synthetic KeyboardEvent: drive the focused executable with native keys, then F8 to finish.
(async()=>{
 window.__smokeStatus='RUNNING';window.__smokeStep='native keyboard';
 const delay=ms=>new Promise(r=>setTimeout(r,ms));
 const click=name=>[...document.querySelectorAll('button')].find(b=>(b.getAttribute('aria-label')||b.textContent.trim())===name&&!b.disabled)?.click();
 for(let i=0;i<200&&!document.querySelector('.main-menu');i++)await delay(100);
 click('Continuar viagem');
 window.__keyboardResults=[];window.__keyboardUps=[];window.addEventListener('keyup',e=>window.__keyboardUps.push({key:e.key,code:e.code,keyCode:e.keyCode}));
 const position=()=>{try{return JSON.parse(document.querySelector('.escape-game canvas').dataset.position);}catch{return null;}};
 window.addEventListener('keydown',e=>{
  const key=({87:'w',65:'a',83:'s',68:'d',38:'arrowup',37:'arrowleft',40:'arrowdown',39:'arrowright',119:'f8'}[e.keyCode]||String(e.key||'').toLowerCase()),before=position();
  if(key==='f8'){
   const required=['w','a','s','d','arrowup','arrowleft','arrowdown','arrowright'];
   const good=required.every(k=>window.__keyboardResults.some(r=>r.key===k&&r.trusted&&r.moved));
   window.__smokeReport=JSON.stringify({presses:window.__keyboardResults,releases:window.__keyboardUps},null,2);
   window.__smokeStatus=good?'PASS':'FAIL native input '+window.__smokeReport;return;
  }
  if(!before||!['w','a','s','d','arrowup','arrowleft','arrowdown','arrowright'].includes(key))return;
  const raw={key:e.key,code:e.code,keyCode:e.keyCode},trusted=e.isTrusted,focused=document.activeElement?.tagName,paused=!!document.querySelector('.pause-overlay');
  setTimeout(()=>{const after=position();const moved=after&&(['w','arrowup'].includes(key)?after.y<before.y:['s','arrowdown'].includes(key)?after.y>before.y:['a','arrowleft'].includes(key)?after.x<before.x:after.x>before.x);window.__keyboardResults.push({key,raw,trusted,focused,paused,before,after,moved:!!moved});window.__smokeCapture='native-'+key;},150);
 });
})();
