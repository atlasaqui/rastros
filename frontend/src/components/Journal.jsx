import {PIANO_NOTE_PHRASES} from '../data/piano';
import {useEffect,useRef,useState} from 'react';
import useModalFocus from '../hooks/useModalFocus';
import {journalEntries,journalPageCount,markJournal} from '../systems/journalSystem';
export function JournalGlyph(){return <svg viewBox="0 0 48 52" aria-hidden="true"><path d="M10 7 41 5 43 46 11 49 6 44 5 10Z" fill="currentColor" stroke="currentColor" strokeWidth="2"/><path d="M11 9 39 7 41 44 13 47Z" fill="var(--journal-paper,#ede8dc)" stroke="#252620" strokeWidth="1.8"/>{[15,23,31,39].map(x=><path key={x} d={`M${x} 10q-6 -12 0 -12q5 0 0 12`} fill="none" stroke="#252620" strokeWidth="2.5"/>)}<path d="m18 17 16 -1m-15 8 15 -1m-15 8 15 -1m-14 8 14 -1" fill="none" stroke="#252620" strokeWidth="1.3"/></svg>}
export default function Journal({save,update,onClose}) {
  const ref=useRef(null),j=save.journal, entries=journalEntries(j,j.page,save);
  const [count,setCount]=useState(0),[closing,setClosing]=useState(false),[turn,setTurn]=useState(0);
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pending=entries.find(o=>!j.revealed.includes(o.id));
  useModalFocus(ref);
  useEffect(()=>{setCount(0);if(!pending)return;
    if(reduced){update(s=>markJournal(s,[pending.id]));return;}
    let n=0;const timer=setInterval(()=>{n++;setCount(n);if(n>=pending.text.length){clearInterval(timer);update(s=>markJournal(s,[pending.id]));}},28);
    return()=>clearInterval(timer);
  },[pending?.id,j.page,reduced,update]);
  const completions=entries.filter(o=>j.completed.includes(o.id)&&j.revealed.includes(o.id)&&!j.completionShown.includes(o.id)).map(o=>o.id).join(',');
  useEffect(()=>{if(!completions)return;const timer=setTimeout(()=>update(s=>markJournal(s,completions.split(','),true)),reduced?0:650);return()=>clearTimeout(timer);},[completions,reduced,update]);
  useEffect(()=>{if(!closing)return;const timer=setTimeout(onClose,reduced?0:170);return()=>clearTimeout(timer);},[closing,onClose,reduced]);
  function page(delta){if(closing)return;setTurn(t=>t+1);update(s=>({...s,journal:{...s.journal,page:s.journal.page+delta}}));}
  const pages=journalPageCount(j),newPages=Array.from({length:pages},(_,p)=>p).filter(p=>p!==j.page&&journalEntries(j,p).some(o=>!j.revealed.includes(o.id)||(j.completed.includes(o.id)&&!j.completionShown.includes(o.id))));
  return <div className={'journal-shade'+(closing?' closing':'')} onKeyDown={e=>{e.stopPropagation();if(e.key==='Escape'){e.preventDefault();setClosing(true);}if(e.key==='ArrowRight'&&j.page+1<pages)page(1);if(e.key==='ArrowLeft'&&j.page>0)page(-1);}}>
    <section className="journal-book" ref={ref} role="dialog" aria-modal="true" aria-label="Bloco de notas — objetivos" tabIndex={-1}>
      <div className="journal-rings" aria-hidden="true">{Array.from({length:8},(_,i)=><i key={i}/>)}</div>
      <header className="journal-header"><div><small>M. PEDROSA</small><h2>O que ainda me falta</h2></div><button aria-label="Fechar bloco de notas" onClick={()=>setClosing(true)}>×</button></header>
      <div key={turn} className={'journal-page'+(turn?' turning':'')}>
        <aside className="journal-original-note"><small>Anotação já existente</small><p>{j.originalNote||"M. Pedrosa\n04/06/2000 - motivação?"}</p></aside><p className="journal-date">Anotações da viagem <span>— {String(j.page+1).padStart(2,'0')}</span></p>
        <ol className="journal-entries">{entries.map(o=>{
          const revealed=j.revealed.includes(o.id),done=j.completed.includes(o.id),shown=j.completionShown.includes(o.id);
          return <li key={o.id} data-objective={o.id} className={(done&&revealed?' complete':'')+(done&&revealed&&!shown?' newly-complete':'')}>
            <span className="journal-check" aria-hidden="true">{done&&revealed?'✓':'○'}</span>
            <div><div className="journal-line"><span className="journal-spacer" aria-hidden="true">{o.text}</span><span className="journal-ink" aria-label={o.text}>{revealed?o.text:pending?.id===o.id?o.text.slice(0,count):''}{!revealed&&pending?.id===o.id&&<i className="journal-pencil" aria-hidden="true"/>}</span></div><small>{done&&revealed?'Concluído':revealed?'A investigar':'Anotando…'}</small></div>
          </li>;
        })}</ol>
        <>{save.flags.scoreReviewedAfterPiano&&<aside className="journal-score" aria-label="Partitura anotada"><strong>A música que ficou</strong>{PIANO_NOTE_PHRASES.map((phrase,i)=><p key={i}>{phrase.join(" – ")}</p>)}</aside>}</>{save.flags.chapterComplete&&j.page===pages-1&&<p className="journal-end">Por enquanto, é tudo o que consegui reunir.</p>}
      </div>
      <footer className="journal-footer"><div className="journal-writing"><button disabled={!pending} onClick={()=>update(s=>markJournal(s,entries.map(o=>o.id)))}>Mostrar tudo</button><span role="status">{newPages.length?'Nova anotação · página '+newPages.map(p=>p+1).join(', '):' '}</span></div><nav aria-label="Páginas do bloco"><button disabled={j.page===0} onClick={()=>page(-1)} aria-label="Página anterior">← Anterior</button><span>Página {j.page+1} de {pages}</span><button disabled={j.page+1===pages} onClick={()=>page(1)} aria-label="Próxima página">Próxima →</button></nav></footer>
    </section>
  </div>;
}
