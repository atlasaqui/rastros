import {KEY_REGIONS} from '../data/pianoRegions';
import {useEffect,useRef,useState} from 'react';
import {PIANO_KEYS,PIANO_SEQUENCE,PIANO_NOTE_PHRASES} from '../data/piano';
import {gameKey} from '../systems/keyboardSystem';
import {beginEnding} from '../systems/endingSystem';
import {MEDIA} from '../data/mediaAssets';
import {BOUNDS} from '../data/mediaBounds';
import {playKey,stopAll,stopEverything} from '../systems/audioSystem';
import useModalFocus from '../hooks/useModalFocus';
function stateImage(id){return 'media/runtime-piano/'+id+'.png';}
export default function PianoPuzzle({save,update,onClose}){
 const [pressed,setPressed]=useState([]),[playing,setPlaying]=useState(false),[feedback,setFeedback]=useState("Uma música ficou na memória.");
 const sequence=useRef([]);
 const ref=useRef(null),timers=useRef([]),completed=useRef(false);useModalFocus(ref);

 const b=BOUNDS['piano/piano.png'],view=b[0]+' '+b[1]+' '+(b[2]-b[0])+' '+(b[3]-b[1]);
 useEffect(()=>{stopEverything();return()=>{timers.current.forEach(clearTimeout);if(!completed.current)stopAll();};},[]);
 useEffect(()=>{const blur=()=>{if(!playing)setPressed([]);};window.addEventListener('blur',blur);return()=>window.removeEventListener('blur',blur);},[playing]);
 function play(id){if(completed.current||playing)return;playKey(id,.65);setPressed([id]);timers.current.push(setTimeout(()=>setPressed(p=>p.filter(key=>key!==id)),160));const next=[...sequence.current,id];sequence.current=next;
  if(next.length===PIANO_SEQUENCE.length){if(next.every((key,i)=>key===PIANO_SEQUENCE[i])){setPlaying(true);completed.current=true;update(beginEnding);}else{sequence.current=[];setFeedback("Algo não está certo. Tente tocar a música novamente.");}}
 }
 function keyDown(e){e.stopPropagation();if(gameKey(e.nativeEvent||e)==='escape'&&!playing){e.preventDefault();onClose();}}
 return <div className="piano-world" onKeyDown={keyDown} ref={ref} tabIndex={-1} role="dialog" aria-modal="true" aria-label="Piano">
 <header className="piano-compact-header"><span>VAGÃO 04 · A MÚSICA QUE FICOU</span><button disabled={playing} onClick={onClose}>Voltar ao vagão</button></header>
 <>{save.flags.scoreReviewedAfterPiano&&<aside className="piano-score-scrap" aria-label="Partitura anotada"><small>ANOTADO NO CADERNO</small>{PIANO_NOTE_PHRASES.map((phrase,i)=><p key={i}>{phrase.join(" – ")}</p>)}</aside>}<div className="piano-artboard" aria-label="Piano frontal: oito teclas A e sete teclas B"><svg className="piano-base-art" viewBox={view}><image href={MEDIA['piano/piano.png']} width="4096" height="3072"/>
 {pressed.slice().sort().map(id=>{const r=KEY_REGIONS[id];return <g key={id}><defs><clipPath id={'key-'+id}><rect x={r[0]} y={r[1]} width={r[2]-r[0]} height={r[3]-r[1]}/></clipPath></defs><image href={stateImage(id)} x={r[0]} y={r[1]} width={r[2]-r[0]} height={r[3]-r[1]} clipPath={'url(#key-'+id+')'}/></g>;})}
 </svg>
 {['A','B'].flatMap(group=>Array.from({length:group==='A'?8:7},(_,i)=>{const id=group+(i+1),r=KEY_REGIONS[id];return <button key={id} className={'piano-art-key '+group+(pressed.includes(id)?' pressed':'')} data-key={id} data-audio="none" aria-label={'Tocar '+PIANO_KEYS.find(k=>k.id===id).note} data-cursor="grab" style={{left:((r[0]-b[0])/(b[2]-b[0])*100)+'%',top:((r[1]-b[1])/(b[3]-b[1])*100)+'%',width:((r[2]-r[0])/(b[2]-b[0])*100)+'%',height:((r[3]-r[1])/(b[3]-b[1])*100)+'%'}} onClick={()=>play(id)}><span className="piano-key-label" aria-hidden="true">{PIANO_KEYS.find(k=>k.id===id).note}</span></button>;}))}
 </div><p className="piano-controls-guide">Clique nas teclas do piano para tocar. Cada tecla mostra sua nota musical. Toque uma tecla de cada vez, na ordem da partitura; não é necessário segurar teclas nem tocar notas simultâneas. Siga as notas da partitura encontrada no computador.</p><footer className="piano-compact-footer"><p role="status">{feedback}</p><button disabled={playing} onClick={()=>{stopAll();sequence.current=[];setPressed([]);setFeedback("Uma música ficou na memória.");}}>Recomeçar sequência</button></footer></>
 </div>;
}



