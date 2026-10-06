import {useRef} from 'react';
import useModalFocus from '../hooks/useModalFocus';
import RetroIcon from './RetroIcon';
export default function OsPopup({text,success,onClose}) {
 const ref=useRef(null);
 useModalFocus(ref);
 return <div className="os-popup-shade" onKeyDown={e=>{e.stopPropagation();if(e.key==='Escape'){e.preventDefault();onClose();}}}>
   <section className="os-popup" ref={ref} role="dialog" aria-modal="true" aria-label={success?'Senha reconhecida':'Acesso restrito'} tabIndex={-1}>
     <header><span>{success?'Senha reconhecida':'Acesso restrito'}</span><button type="button" aria-label="Fechar aviso" onClick={onClose}><RetroIcon id="close" size={20}/></button></header>
     <div className="os-popup-message"><RetroIcon id={success?'success':'error'} size={38}/><p>{text}</p></div>
     <footer><button type="button" autoFocus onClick={onClose}>OK</button></footer>
   </section>
 </div>;
}
