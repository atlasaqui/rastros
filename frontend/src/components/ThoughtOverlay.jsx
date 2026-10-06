import {useRef} from 'react';
import useModalFocus from '../hooks/useModalFocus';
export default function ThoughtOverlay({event, onNext}) {
  const ref = useRef(null);
  useModalFocus(ref);
  return <div className="npc-overlay os-thought-overlay" onKeyDown={e=>{
    if(e.key==='Escape') {e.preventDefault();e.stopPropagation();}
  }}>
    <section ref={ref} tabIndex={-1} className="npc-overlay-box thought" role="dialog" aria-modal="true" aria-label="Murilo · pensamento">
      <header><span>Murilo · pensamento</span></header>
      <p>{event.text}</p>
      <div className="npc-overlay-choices"><button autoFocus onClick={onNext}>Continuar</button></div>
    </section>
  </div>;
}
