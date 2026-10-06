import {useEffect,useRef} from 'react';
// Render the pickup patch with an exact palette, without GPU color filters.
export default function TablePickupPatch({variant}){
 const canvas=useRef(null);
 useEffect(()=>{let cancelled=false;const image=new Image();image.onload=()=>{if(cancelled||!canvas.current)return;const ctx=canvas.current.getContext('2d');ctx.clearRect(0,0,3840,2160);ctx.drawImage(image,3245*image.naturalWidth/3840,1410*image.naturalHeight/2160,425*image.naturalWidth/3840,280*image.naturalHeight/2160,3245,1410,425,280);if(variant!=='white'){const pixels=ctx.getImageData(3245,1410,425,280),d=pixels.data,color=variant==='red'?[179,15,15]:[255,255,255];for(let i=0;i<d.length;i+=4){const ink=1-(d[i]+d[i+1]+d[i+2])/765;d[i]=Math.round(ink*color[0]);d[i+1]=Math.round(ink*color[1]);d[i+2]=Math.round(ink*color[2]);}ctx.putImageData(pixels,3245,1410);}canvas.current.dataset.ready='true';};image.src='media/mesa-sem-bloco.png';return()=>{cancelled=true;};},[variant]);
 return <canvas key={variant} ref={canvas} width="3840" height="2160" className="pickup-table-patch" aria-hidden="true" data-collected="true" style={{border:0,outline:"none",boxShadow:"none",background:"transparent"}}/>;
}
