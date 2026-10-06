import {gameKey} from '../systems/keyboardSystem';
import {useRef,useState,useEffect} from 'react';
import {clockDraft} from '../systems/clockDraft';
import {MEDIA} from '../data/mediaAssets';
import {sceneVariant} from '../systems/narrativeSystem';
import {setClock} from '../systems/continuationSystem';
import {clockSound,playSound} from '../systems/audioSystem';
import useModalFocus from '../hooks/useModalFocus';
export default function ClockPuzzle({save,update,onClose,onSolved}){
 const [editing,setEditing]=useState(false),ref=useRef(null),face=useRef(null),[drag,setDrag]=useState(null),[error,setError]=useState(''),lastTick=useRef(0);
 const [draft,setDraft]=useState(()=>save.continuation.clock),draftRef=useRef(draft),settle=useRef(null);
 useModalFocus(ref);const c={...draft,solved:save.continuation.clock.solved},v=sceneVariant(save),pending=!!save.flags.clockTransitionPending,color={white:'branco',black:'preto',red:'vermelho'}[v];
 useEffect(()=>{if(!pending)return;const elapsed=Math.max(0,Date.now()-(save.flags.clockTransitionStartedAt||Date.now()));if(elapsed<5000)clockSound({offset:elapsed/1000});const timer=setTimeout(()=>{update(s=>({...s,flags:{...s.flags,clockTransitionPending:false}}));onSolved();},Math.max(0,5000-elapsed));return()=>clearTimeout(timer);},[pending,update,onSolved]);
 useEffect(()=>{playSound('9',{gain:.4});},[]);
 function commit(){clearTimeout(settle.current);update(s=>clockDraft(s,draftRef.current));}
 function close(){commit();onClose();}
 useEffect(()=>{
  const flush=e=>{e.detail.transforms.push(s=>clockDraft(s,draftRef.current));};
  window.addEventListener('rastros:flush',flush);
  return()=>{clearTimeout(settle.current);window.removeEventListener('rastros:flush',flush);};
 },[]);
 function change(h,m,kind){
  if(c.solved||pending||!Number.isFinite(h)||!Number.isFinite(m))return;
  h=((Math.trunc(h)%12)+12)%12;m=((Math.trunc(m)%60)+60)%60;
  if(h===draftRef.current.hour&&m===draftRef.current.minute)return;
  const next={hour:h,minute:m,solved:false};draftRef.current=next;setDraft(next);setError('');
  if(performance.now()-lastTick.current>150){playSound(kind==='hour'?'29':'30',{gain:.55});lastTick.current=performance.now();}
  // Only commit after the hand rests. Drag frames never rerender the entire game or write disk.
  clearTimeout(settle.current);settle.current=setTimeout(commit,500);
 }
 function confirm(){
  clearTimeout(settle.current);const {hour,minute}=draftRef.current;
  if(hour!==0||minute!==14){commit();setError('Os ponteiros continuam girando.');return;}
  update(s=>{const next=setClock(s,hour,minute);return {...next,flags:{...next.flags,clockTransitionPending:true,clockTransitionStartedAt:Date.now()}};});
 }
 function point(e){if(!drag||c.solved)return;const r=face.current.getBoundingClientRect();if(!r.width||!r.height)return;const scale=Math.min(r.width/3840,r.height/2160),x=(e.clientX-r.left-(r.width-3840*scale)/2)/scale-2016.5,y=(e.clientY-r.top-(r.height-2160*scale)/2)/scale-1096.2,angle=(Math.atan2(y,x)*180/Math.PI+450)%360;if(drag==='minute')change(c.hour,Math.round(angle/6)%60,'minute');else change(Math.round((angle-c.minute*.5)/30+12)%12,c.minute,'hour');}
 return <div className={'clock-world full-art-clock '+(editing?'editing':'inspecting')+(pending?' resolving':'')} ref={ref} tabIndex={-1} role="dialog" aria-modal="true" aria-label="Relógio do Vagão 3" onKeyDown={e=>{e.stopPropagation();if(gameKey(e.nativeEvent||e)==='escape'&&!pending)close();}}>
  {!editing?<><img className="clock-full-background" src={MEDIA['cenários/relógio vagão três '+color+'.jpg']} alt="Relógio na parede do vagão"/><button className="clock-art-target" aria-label="Manipular relógio" onClick={()=>setEditing(true)} data-cursor="grab"/><p className="clock-art-thought">O relógio parece quebrado.</p></>:<><div className="clock-full-canvas" ref={face} onPointerMove={point} onPointerUp={()=>{setDrag(null);commit();}} onPointerCancel={()=>{setDrag(null);commit();}} onLostPointerCapture={()=>{setDrag(null);commit();}}>
   <svg className="clock-zoom-art" viewBox="0 0 3840 2160"><image href={MEDIA['cenários/relógio zoom '+color+'.jpg']} width="3840" height="2160"/>
    {['hour','minute'].map(kind=><g key={kind} className={'clock-hand-svg '+kind} role="button" aria-label={kind==='hour'?'Ponteiro das horas':'Ponteiro dos minutos'} tabIndex={c.solved?-1:0} data-cursor="grab" transform={'translate(2016.5 1096.2) rotate('+(kind==='hour'?c.hour*30+c.minute*.5:c.minute*6)+')'} onKeyDown={e=>{if(['arrowright','arrowup'].includes(gameKey(e.nativeEvent||e))){e.preventDefault();change(c.hour+(kind==='hour'?1:0),c.minute+(kind==='minute'?1:0),kind);}if(['arrowleft','arrowdown'].includes(gameKey(e.nativeEvent||e))){e.preventDefault();change(c.hour-(kind==='hour'?1:0),c.minute-(kind==='minute'?1:0),kind);}}} onPointerDown={e=>{if(c.solved)return;e.preventDefault();setDrag(kind);face.current.setPointerCapture(e.pointerId);}}>
     <path d={kind==='hour'?'M0 12V-580':'M0 12V-850'} stroke={v==='white'?'#111':v==='black'?'#fff':'#9f1616'} strokeWidth="12" opacity="0"/>
     {kind==='hour'?<svg x="-35" y="-600" width="70" height="600" viewBox="-70 -820 140 820" preserveAspectRatio="none"><image href={MEDIA['objetos/ponteiro pequeno '+(v==='white'?'preto':v==='black'?'branco':'vermelho')+'.png']} x="-2080" y="-2056" width="4096" height="4096" transform="rotate(-130)"/></svg>:<svg x="-26" y="-890" width="52" height="890" viewBox="1980 980 130 1000" preserveAspectRatio="none"><image href={MEDIA['objetos/ponteiro grande '+(v==='white'?'preto':v==='black'?'branco':'vermelho')+'.png']} width="4096" height="4096"/></svg>}
     <path d={kind==='hour'?'M0 15V-600':'M0 15V-890'} stroke="transparent" strokeWidth="95"/>
    </g>)}
   </svg></div><aside className="clock-controls"><small>O INSTANTE</small><output>{String(c.hour).padStart(2,'0')}:{String(c.minute).padStart(2,'0')}:00</output><label>Horas<input aria-label="Horas do relógio" type="number" min="0" max="11" value={c.hour} disabled={c.solved} onBlur={commit} onChange={e=>change(Number(e.target.value),c.minute,'hour')}/></label><label>Minutos<input aria-label="Minutos do relógio" type="number" min="0" max="59" value={c.minute} disabled={c.solved} onBlur={commit} onChange={e=>change(c.hour,Number(e.target.value),'minute')}/></label><label>Segundos<input aria-label="Segundos do relógio" value="00" readOnly/></label><button disabled={c.solved} onClick={confirm}>Confirmar horário</button><p role="status">{c.solved?'O tempo parou.':error}</p></aside></>}
  <button className="art-back" disabled={pending} onClick={close}>Voltar ao vagão</button>{pending&&<div className="clock-resolution" role="status" aria-label="O relógio interrompe o tempo"/>}
 </div>;
}



