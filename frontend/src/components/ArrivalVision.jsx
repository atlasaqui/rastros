import {useEffect,useRef,useState} from 'react';
import {playSound} from '../systems/audioSystem';
const DURATION=12000;
export default function ArrivalVision({save,update}){
 const initial=useRef(save.arrivalElapsed||0),root=useRef(null);
 const [elapsed,setElapsed]=useState(initial.current);
 useEffect(()=>{root.current?.focus();if(initial.current===0)playSound('7',{gain:.78});const start=performance.now()-initial.current;let checkpoint=-1;
 const timer=setInterval(()=>{const t=Math.min(DURATION,performance.now()-start);setElapsed(t);const second=Math.floor(t/1000);if(second!==checkpoint){checkpoint=second;update(s=>({...s,arrivalElapsed:t,flags:{...s.flags,...(t>=DURATION?{arrivalVisionSeen:true}:{})}}));}},40);
 return()=>clearInterval(timer);},[update]);
 const phase=elapsed<1500?'fade':elapsed<6500?'hands':elapsed<8800?'ellipsis':'thought';
 const opacity=phase==='hands'?Math.min(1,(elapsed-1500)/800,(6500-elapsed)/800):1;
 return <section className="arrival-vision" data-phase={phase} ref={root} tabIndex={-1} role="dialog" aria-modal="true" aria-label="Pensamentos de Murilo ao chegar ao Vagão 4" onKeyDown={e=>{if(['Escape','Enter',' '].includes(e.key)){e.preventDefault();e.stopPropagation();}}}>
 {phase==='hands'&&<div className="ending-hands" style={{opacity}}><img src="media/mao-sangrenta-final.png" alt="Murilo olha as próprias mãos ensanguentadas"/></div>}
 {['ellipsis','thought'].includes(phase)&&<div className="ending-card"><span>Murilo</span><p>{phase==='ellipsis'?'...':'Eu não queria isso. Eu nunca quis isso.'}</p></div>}
 </section>;
}
