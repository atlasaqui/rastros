import {useEffect} from 'react';
export default function SoundWarning({onAccept}){
 useEffect(()=>{const timer=setTimeout(onAccept,1000);return()=>clearTimeout(timer);},[onAccept]);
 return <main className="sound-warning automatic-warning" role="status"><section><svg className="warning-triangle" viewBox="0 0 100 90" aria-hidden="true"><path d="M50 6 96 84H4Z" fill="#e7bd4e"/><path d="M50 27v29m0 12v5" stroke="#141410" strokeWidth="7"/></svg><small>ANTES DA VIAGEM</small><h1>Aviso sonoro</h1><p>Este jogo contém sons agudos e perturbadores.</p></section></main>;
}

