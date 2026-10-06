// Automated compatibility regression in the actual packaged WebView.
// These are synthetic legacy-format events; this is NOT the manual Windows input test.
(async()=>{
 window.__smokeStatus='RUNNING';window.__smokeStep='legacy WebView keyboard';
 const delay=ms=>new Promise(r=>setTimeout(r,ms));
 const button=name=>[...document.querySelectorAll('button')].find(b=>(b.getAttribute('aria-label')||b.textContent.trim())===name&&!b.disabled);
 const assert=(ok,text)=>{if(!ok)throw Error(text);};
 const position=()=>JSON.parse(document.querySelector('.escape-game canvas').dataset.position);
 const key=(type,code)=>{const event=new KeyboardEvent(type,{key:'',code:'',keyCode:code,bubbles:true,cancelable:true});if(event.keyCode!==code)Object.defineProperty(event,'keyCode',{value:code});(document.activeElement||window).dispatchEvent(event);};
 try{
  for(let n=0;n<200&&!document.querySelector('.main-menu');n++)await delay(100);
  button('Continuar viagem').click();await delay(300);button('Continuar viagem').click();await delay(400);
  const checks=[];
  for(const [code,axis,direction] of [[87,'y',-1],[65,'x',-1],[83,'y',1],[68,'x',1],[38,'y',-1],[37,'x',-1],[40,'y',1],[39,'x',1]]){
   const before=position();key('keydown',code);key('keyup',code);await delay(150);const after=position();assert((after[axis]-before[axis])*direction>0,'quick tap '+code);checks.push({code,before:before[axis],after:after[axis]});
  }
  const before=position();key('keydown',87);await delay(150);key('keyup',87);await delay(100);const stopped=position();await delay(150);assert(stopped.y<before.y,'held W moves');assert(position().y===stopped.y,'release stops movement');
  key('keydown',27);key('keyup',27);await delay(100);assert(document.querySelector('.pause-overlay'),'legacy Escape pauses');const frozen=JSON.stringify(position());await delay(250);assert(JSON.stringify(position())===frozen,'paused state frozen');button('Continuar viagem').click();await delay(100);assert(document.activeElement.tagName==='CANVAS','focus restored');
  window.__smokeReport='Legacy-format WebView input passed: eight quick taps, held W, key release, Escape pause, frozen state and focus restoration. Events synthetic, not Windows-native. '+JSON.stringify(checks);window.__smokeStatus='PASS';
 }catch(error){window.__smokeStatus='FAIL '+error.message;}
})();
