import {startEscapeAudio} from '../systems/audioSystem';
import {gameKey} from '../systems/keyboardSystem';
import {useEffect,useRef,useState} from 'react';
import {advanceEscape,restoreEscape} from '../systems/escapeSystem';
export {advanceEscape} from '../systems/escapeSystem';
export default function EscapeGame({snapshot,onCheckpoint,onCaught,onComplete,paused,onPause}){
 const canvas=useRef(null),keys=useRef(new Set()),taps=useRef(new Set()),sim=useRef(restoreEscape(snapshot)),callbacks=useRef({}),ended=useRef(false),[status,setStatus]=useState(sim.current);
 useEffect(()=>startEscapeAudio(),[]);
 callbacks.current={onCheckpoint,onCaught,onComplete,paused,onPause};
 // Give real WebView keyboard input a connected target after the cinematic/pause unmounts.
 useEffect(()=>{keys.current.clear();taps.current.clear();if(paused)return;const id=requestAnimationFrame(()=>canvas.current?.focus({preventScroll:true}));return()=>cancelAnimationFrame(id);},[paused]);
 useEffect(()=>{
  const images={};let animation,last,checkpoint=0,ready=false;
  const files=['wagon','player-idle','player-walk-1','player-walk-2','shadow-idle','shadow-walk-1','shadow-walk-2','hand-open','hand-closed'];
  Promise.all(files.map(name=>new Promise(resolve=>{const im=new Image();im.onload=resolve;im.onerror=resolve;im.src='media/pixel/'+name+(name==='wagon'?'.jpg':'.png');images[name]=im;}))).then(()=>ready=true);
  const key=gameKey;
  const down=e=>{const k=key(e);if(['arrowup','arrowdown','arrowleft','arrowright','w','a','s','d'].includes(k)){e.preventDefault();if(!callbacks.current.paused){if(!keys.current.has(k))taps.current.add(k);keys.current.add(k);}}if(k==='escape'){e.preventDefault();keys.current.clear();taps.current.clear();callbacks.current.onPause();}};
  const up=e=>keys.current.delete(key(e));
  const blur=()=>{if(document.hasFocus()&&!document.hidden)return;keys.current.clear();taps.current.clear();callbacks.current.onCheckpoint(sim.current);callbacks.current.onPause();};
  const visibility=()=>{if(document.hidden)blur();};
  window.addEventListener('keydown',down);window.addEventListener('keyup',up);window.addEventListener('blur',blur);document.addEventListener('visibilitychange',visibility);
  function frame(time){const dt=last?Math.min((time-last)/1000,.05):0;last=time;let s=sim.current;
   if(callbacks.current.paused){keys.current.clear();taps.current.clear();}
   if(ready&&!callbacks.current.paused&&!ended.current){const k=new Set([...keys.current,...taps.current]);taps.current.clear();const next=advanceEscape(s,dt,{x:(k.has('d')||k.has('arrowright')?1:0)-(k.has('a')||k.has('arrowleft')?1:0),y:(k.has('s')||k.has('arrowdown')?1:0)-(k.has('w')||k.has('arrowup')?1:0)});sim.current=next;s=next;
    if(time-checkpoint>250){checkpoint=time;callbacks.current.onCheckpoint(s);setStatus({...s});}
    if(s.phase==='complete'){ended.current=true;callbacks.current.onCheckpoint(s);callbacks.current.onComplete();}
    if(s.phase==='caught'&&s.phaseTime>=3){ended.current=true;callbacks.current.onCaught();}
   }
   if(canvas.current)canvas.current.dataset.position=JSON.stringify({x:s.x,y:s.y,wagon:s.wagon,hands:s.hands,phase:s.phase});
   const ctx=canvas.current?.getContext('2d');if(ctx){ctx.imageSmoothingEnabled=false;ctx.fillStyle='#000';ctx.fillRect(0,0,360,640);
    const draw=(key,x,y,w,h)=>{const im=images[key];if(im?.complete&&im.naturalWidth)ctx.drawImage(im,x,y,w,h);};
    draw('wagon',0,0,360,640);
    for(const h of s.hands){if(h.phase==='signal'){ctx.fillStyle='#f4e8dc';ctx.fillRect(h.side==='left'?108:246,h.y-2,6,4);}if(h.reach>0){ctx.save();if(h.side==='right'){ctx.translate(360,0);ctx.scale(-1,1);}ctx.beginPath();ctx.rect(0,h.y-20,185,40);ctx.clip();draw(h.phase==='grab'?'hand-closed':'hand-open',105+80*h.reach-150,h.y-22,150,47);ctx.restore();}}
    const walking=s.phase==='run'&&s.walking?'walk-'+(Math.floor(s.activeTime/.15)%2+1):'idle';draw('player-'+walking,s.x-14,s.y-20,28,39);
    if(s.elapsed>=2)draw(s.phase==='run'?'shadow-walk-'+(Math.floor(s.activeTime/.18)%2+1):'shadow-idle',s.sx-15,s.sy-21,30,41);
    if(s.phase==='enter'||s.phase==='transition'){ctx.fillStyle='rgba(0,0,0,'+(s.phase==='enter'?Math.max(0,1-s.phaseTime/.8):Math.min(1,s.phaseTime/.75))+')';ctx.fillRect(0,0,360,640);}
   }
   animation=requestAnimationFrame(frame);
  }
  animation=requestAnimationFrame(frame);
  return()=>{cancelAnimationFrame(animation);window.removeEventListener('keydown',down);window.removeEventListener('keyup',up);window.removeEventListener('blur',blur);document.removeEventListener('visibilitychange',visibility);};
 },[]);
 return <section className="escape-game" data-wagon={status.wagon} data-phase={status.phase} aria-label="Perseguição por cinco vagões"><canvas ref={canvas} tabIndex={0} onPointerDown={()=>canvas.current?.focus({preventScroll:true})} width="360" height="640" aria-label="Murilo sobe pelo corredor, desviando de mãos e do vulto"/><div className="escape-hud">VAGÃO {status.wagon} / 5</div><p className="escape-controls">WASD / SETAS · SUBA ATÉ A PORTA</p>{status.elapsed<2&&status.phase!=='caught'&&<p className="escape-opening">Você não pode fugir do passado.</p>}{status.phase==='caught'&&<div className="escape-death"><span>Murilo</span><p>Não existe recomeço.</p></div>}</section>;
}
