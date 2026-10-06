import {useEffect,useRef,useState} from 'react';
import {MEDIA} from '../data/mediaAssets';
import {BOUNDS} from '../data/mediaBounds';
import {prepareAudio,endingMusic,audioPosition,stopMenu,fadeMusic,playSound} from '../systems/audioSystem';
import {endingFrame,checkpointEnding,completeEnding,CREDITS,ENDING_DURATION} from '../systems/endingSystem';
export default function EndingCinematic({save,update,onMenu}){
 const initial=useRef(save.ending?.position??(save.flags.gameComplete?ENDING_DURATION:0)),last=useRef(initial.current),checkpoint=useRef(-1),root=useRef(null),button=useRef(null);
 const [position,setPosition]=useState(initial.current),[ready,setReady]=useState(initial.current>=ENDING_DURATION),[leaving,setLeaving]=useState(false);
 const frame=endingFrame(position),b=BOUNDS['piano/piano.png'];
 useEffect(()=>{let cancelled=false,interval;root.current?.focus();prepareAudio(['28']).then(()=>{if(cancelled)return;stopMenu();if(initial.current<ENDING_DURATION)endingMusic('28',{offset:initial.current});setReady(true);interval=setInterval(()=>{const measured=audioPosition('28');if(measured>=0)last.current=Math.max(last.current,Math.min(ENDING_DURATION,measured));setPosition(last.current);const second=Math.floor(last.current);if(second!==checkpoint.current){checkpoint.current=second;update(s=>checkpointEnding(s,last.current));}},40);});return()=>{cancelled=true;clearInterval(interval);};},[update]);
 useEffect(()=>{if(frame.canContinue)button.current?.focus();},[frame.canContinue]);
 useEffect(()=>{if(!leaving)return;fadeMusic(1500);const timer=setTimeout(()=>{update(completeEnding);onMenu();},1500);return()=>clearTimeout(timer);},[leaving,update,onMenu]);
 return <section ref={root} tabIndex={-1} className={'ending-cinematic'+(leaving?' leaving':'')} data-phase={frame.phase} data-time={position.toFixed(2)} role="dialog" aria-modal="true" aria-label="Encerramento de Rastros" onKeyDown={e=>{if(e.key==='Escape'||e.key===' '||e.key==='Enter'){if(!frame.canContinue||e.target!==button.current){e.preventDefault();e.stopPropagation();}}}}>
 {ready&&frame.phase==='pianoFade'&&<div className="ending-piano" style={{opacity:frame.opacity}}><svg viewBox={`${b[0]} ${b[1]} ${b[2]-b[0]} ${b[3]-b[1]}`}><image href={MEDIA['piano/piano.png']} width="4096" height="3072"/></svg></div>}
 {ready&&frame.phase==='dialogue'&&<div className="ending-card" key={frame.phase+frame.index} style={{opacity:frame.opacity}}><span>{frame.speaker}</span><p>{frame.text}</p></div>}
 {frame.phase==='credit'&&<div className="ending-credit" style={{opacity:frame.opacity}}><span>{frame.role}</span><p>{frame.name}</p></div>}
 {frame.phase==='credits'&&<div className="ending-credits"><h1>Rastros<span>.</span></h1><div>{CREDITS.map(([role,name])=><p key={role}><span>{role}</span><strong>{name}</strong></p>)}</div>{frame.canContinue&&!leaving&&<button ref={button} data-audio="none" onClick={()=>setLeaving(true)}>Continuar</button>}</div>}
 </section>;
}
