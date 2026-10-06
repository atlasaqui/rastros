import {useRef,useState,useEffect} from 'react';
import {playSound} from '../systems/audioSystem';
import {ART} from '../data/art';
import useModalFocus from '../hooks/useModalFocus';
export default function HandsVision({beforeEscape,onFinish,save,update}){
 const [step,setStep]=useState(0),[ready,setReady]=useState(false),ref=useRef(null);useModalFocus(ref);
 useEffect(()=>{if(beforeEscape?step===1:step===0){const event=beforeEscape?'handsEscape':'handsBible';const previous=save.psychologicalEvents?.[event];const gain=previous?.gain??(beforeEscape?.62:.38);playSound('7',{gain});if(!previous)update(s=>({...s,psychologicalEvents:{...s.psychologicalEvents,[event]:{seen:true,gain}}}));}setReady(false);const timer=setTimeout(()=>setReady(true),700);return()=>clearTimeout(timer);},[step]);
 const text=beforeEscape?(step===0?'Até onde você vai para ter um recomeço? Reconheça o que fez!':'Eles a machucaram...Nossos pais...Seus colegas....Eu tive que fazer o que fiz...Mas ela...NÃO, NÃO É VERDADE.'):(step===0?'Algo não parece certo.':'(não...Não há tempo...Preciso continuar)');
 const label=step===0?'Olhar novamente':beforeEscape?'Fugir':'Seguir viagem';
 function advance(){if(!ready)return;step===0?setStep(1):onFinish();}
 return <div className={'hands-vision cinematic-hands '+(step===0?'distorted':'')} ref={ref} tabIndex={-1} role="dialog" aria-modal="true" aria-label="As mãos de Murilo" onKeyDown={e=>{e.stopPropagation();if(e.key==='Enter'||e.key===' '){e.preventDefault();advance();}}}><div className="hands-art" key={step}><svg viewBox="150 20 1620 1060" preserveAspectRatio="xMidYMid meet"><image href={beforeEscape?(step===0?ART.hands.clean:ART.hands.blood):(step===0?ART.hands.blood:ART.hands.clean)} width="1920" height="1080"/></svg></div><div className="hands-caption" key={'caption'+step}><p>{text}</p><button aria-label={label} disabled={!ready} onClick={advance}>{label} <span aria-hidden="true">→</span></button></div></div>;
}
