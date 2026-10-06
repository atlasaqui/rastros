import {useEffect,useState} from 'react';
const active=()=>window.bridge?.isFullscreen?window.bridge.isFullscreen():!!document.fullscreenElement;
export default function FullscreenButton(){
 const [full,setFull]=useState(active),[error,setError]=useState('');
 useEffect(()=>{const sync=()=>setFull(active());window.addEventListener('rastros-fullscreen',sync);document.addEventListener('fullscreenchange',sync);return()=>{window.removeEventListener('rastros-fullscreen',sync);document.removeEventListener('fullscreenchange',sync);};},[]);
 async function toggle(){setError('');try{if(window.bridge?.toggleFullscreen)window.bridge.toggleFullscreen();else if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{setError('Não foi possível alternar a tela cheia. Tente F11.');}}
 return <><button onClick={toggle}>{full?'Sair da tela cheia':'Tela cheia'} · F11</button>{error&&<p role="status">{error}</p>}</>;
}
