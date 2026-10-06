import FullscreenButton from './FullscreenButton';
import {useRef,useState} from 'react';
import useModalFocus from '../hooks/useModalFocus';
import {getSoundSettings,setSoundSettings} from '../systems/audioSystem';
export default function PauseMenu({onResume,onMenu}){
 const root=useRef(null),[confirm,setConfirm]=useState(false),[sound,setSound]=useState(getSoundSettings);useModalFocus(root);
 function adjust(patch){const next={...sound,...patch};setSound(next);setSoundSettings(next);}
 return <div className="pause-overlay"><section ref={root} className="pause-card" tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="pause-title" onKeyDown={e=>{e.stopPropagation();if(e.key==='Escape'){e.preventDefault();confirm?setConfirm(false):onResume();}}}>
 <small>RASTROS · VIAGEM EM PAUSA</small><h2 id="pause-title">{confirm==='quit'?'Você tem certeza que quer encerrar o jogo?':confirm?'Você tem certeza que quer voltar ao menu?':'Uma pausa na viagem'}</h2>
 {confirm?<div className="pause-actions"><button autoFocus onClick={()=>setConfirm(false)}>Não</button><button onClick={()=>{if(confirm==='quit'){if(window.rastrosSaveNow?.()!==false)window.bridge.quitGame();}else onMenu();}}>Sim</button></div>:<><button autoFocus onClick={onResume}>Continuar viagem</button><FullscreenButton/><label>Volume do jogo <output>{Math.round(sound.volume*100)}%</output><input aria-label="Volume do jogo" type="range" min="0" max="1" step=".05" value={sound.volume} onChange={e=>adjust({volume:Number(e.target.value)})}/></label><label className="pause-mute"><input type="checkbox" checked={sound.muted} onChange={e=>adjust({muted:e.target.checked})}/> Sem som</label><button onClick={()=>setConfirm('menu')}>Voltar ao menu inicial</button>{window.bridge?.quitGame&&<button onClick={()=>setConfirm('quit')}>Encerrar jogo</button>}</>}
 </section></div>;
}
