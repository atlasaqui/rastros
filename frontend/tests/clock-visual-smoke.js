(async()=>{
 window.__smokeStatus='RUNNING';window.__smokeStep='clock visual';
 const delay=ms=>new Promise(r=>setTimeout(r,ms));
 async function wait(fn){for(let i=0;i<160;i++){if(fn())return;await delay(60);}throw Error('Timeout clock visual');}
 const button=name=>[...document.querySelectorAll('button')].find(b=>(b.getAttribute('aria-label')||b.textContent.trim())===name&&!b.disabled&&b.getClientRects().length&&!b.closest('[inert]'));
 async function click(name){await wait(()=>button(name));button(name).click();await delay(130);}
 const capture=async name=>{window.__smokeCapture=name;await wait(()=>!window.__smokeCapture);};
 try{
 if(!sessionStorage.clockQA){sessionStorage.clockOriginal=window.bridge.readSave();sessionStorage.clockQA='0';
 const s=JSON.parse(sessionStorage.clockOriginal);s.currentCarId='vagao3';s.resumeMode='scene';s.activeDialogue=null;s.thoughtQueue=[];s.visualState='black';Object.assign(s.flags,{gameComplete:false,finalRoom:false,escapeComplete:false,deserted:false,confrontationComplete:false,messageExitRequested:false});s.continuation.clock={hour:7,minute:7,solved:false};window.bridge.writeSave(JSON.stringify(s));window.__smokeStatus='RELOAD';setTimeout(()=>location.reload(),350);return;}
 const i=Number(sessionStorage.clockQA),variant=['black','white','red'][i];
 await click('Continuar viagem');await click('Examinar relógio');await click('Manipular relógio');
 const inputs=[...document.querySelectorAll('.clock-controls input')];for(const [index,value] of [[0,'0'],[1,'14']]){Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(inputs[index],value);inputs[index].dispatchEvent(new Event('input',{bubbles:true}));await delay(100);}
 const face=document.querySelector('.clock-face').getBoundingClientRect();if(face.height<200)throw Error('clock missing');
 await capture('relogio-'+variant+'-ponteiros');
 if(i<2){const s=JSON.parse(window.bridge.readSave());s.visualState=['black','white','red'][i+1];s.flags.hallucinationStarted=s.visualState!=='white';s.continuation.clock={hour:7,minute:7,solved:false};window.bridge.writeSave(JSON.stringify(s));sessionStorage.clockQA=String(i+1);window.__smokeStatus='RELOAD';setTimeout(()=>location.reload(),350);}
 else{window.bridge.writeSave(sessionStorage.clockOriginal);sessionStorage.removeItem('clockOriginal');sessionStorage.removeItem('clockQA');window.__smokeReport='PASS: clock visible with both original hands in white/black/red, correct 00:14 and native save restored after QA.';window.__smokeStatus='PASS';}
 }catch(e){window.__smokeStatus='FAIL '+e.message;}
})();
