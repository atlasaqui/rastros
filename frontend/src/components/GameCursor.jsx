import {useEffect} from 'react';
// Small native cursors avoid moving filtered SVG layers and decoding 4K images.
export default function GameCursor({variant}){
 useEffect(()=>{const root=document.documentElement,color={white:'preto',black:'branco',red:'vermelho'}[variant]||'preto';
 for(const mode of ['cursor','pegar']){const url=new URL('media/runtime-cursors/'+mode+'-'+color+'.png',document.baseURI).href;root.style.setProperty(mode==='cursor'?'--rastros-cursor':'--rastros-grab',`url("${url}") 4 2, ${mode==='cursor'?'default':'pointer'}`);}
 return()=>{root.style.removeProperty('--rastros-cursor');root.style.removeProperty('--rastros-grab');};
 },[variant]);return null;
}
