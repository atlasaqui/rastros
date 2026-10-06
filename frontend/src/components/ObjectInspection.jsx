import {useRef,useState} from 'react';
import useModalFocus from '../hooks/useModalFocus';
import {playSound} from '../systems/audioSystem';
import {useEffect} from 'react';
import {ART} from '../data/art';
// The first notepad encounter and all repeat/newspaper inspections share this layout.
export default function ObjectInspection({imageId,title,text,variant,onNext,onClose,nextLabel}) {
 const ref=useRef(null),[failed,setFailed]=useState(false);
 useModalFocus(ref);useEffect(()=>{if(imageId==='notepad')playSound('13');else if(imageId==='newspaper')playSound('15');},[imageId]);
 return <div className={'npc-overlay object-inspection variant-'+variant}>
   <div className="inspection-stack" ref={ref} role="dialog" aria-modal="true" aria-label={title} tabIndex={-1}>
     <div className="inspection-art-area">{failed ? <p>Não foi possível exibir a imagem. O texto está disponível abaixo.</p> : <img className="inspection-art" src={ART[imageId][variant]} alt={title} onError={()=>setFailed(true)}/>}</div>
     <section className="npc-overlay-box object">
       <header><span>{title}</span><button aria-label="Fechar diálogo" onClick={onClose}>×</button></header>
       <p>{text}</p>
       <div className="npc-overlay-choices"><button autoFocus onClick={onNext}>{nextLabel}</button></div>
     </section>
   </div>
 </div>;
}
