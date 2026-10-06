import {OS_SPRITES} from '../data/osAssets';
import {useEffect,useRef} from 'react';
import {keyMagenta} from '../systems/retroPixels';
const sheets=new Map(), crops=new Map();
function sheet(src) {
 if(!sheets.has(src)) sheets.set(src,new Promise((resolve,reject)=>{
  const image=new Image(); image.onload=()=>resolve(image); image.onerror=reject; image.src=src;
 }));
 return sheets.get(src);
}
function renderCrop(id,sprite) {
 if(!crops.has(id)) crops.set(id,sheet(sprite.src).then(image=>{
  const [x,y,w,h]=sprite.rect,sx=image.naturalWidth/1824,sy=image.naturalHeight/1361;
  const canvas=document.createElement('canvas'); canvas.width=Math.round(w*sx);canvas.height=Math.round(h*sy);
  const context=canvas.getContext('2d',{willReadFrequently:true});
  context.drawImage(image,x*sx,y*sy,w*sx,h*sy,0,0,canvas.width,canvas.height);
  const pixels=context.getImageData(0,0,canvas.width,canvas.height);
  keyMagenta(pixels.data,sprite.opaque);context.putImageData(pixels,0,0);
  return canvas;
 }));
 return crops.get(id);
}
export default function RetroIcon({id,size=34}) {
 const ref=useRef(null),sprite=OS_SPRITES[id]||OS_SPRITES.file;
 useEffect(()=>{let active=true;renderCrop(id,sprite).then(crop=>{
  if(!active||!ref.current)return;
  const canvas=ref.current,edge=Math.max(48,Math.round(size*2));canvas.width=edge;canvas.height=edge;
  const ctx=canvas.getContext('2d');ctx.imageSmoothingEnabled=false;
  const scale=(edge-4)/Math.max(crop.width,crop.height),w=Math.round(crop.width*scale),h=Math.round(crop.height*scale);
  ctx.drawImage(crop,Math.floor((edge-w)/2),Math.floor((edge-h)/2),w,h);
  const result=ctx.getImageData(0,0,edge,edge);keyMagenta(result.data,true);ctx.putImageData(result,0,0);canvas.dataset.ready='true';
 }).catch(()=>{if(ref.current)ref.current.dataset.ready='error';});return()=>{active=false;};},[id,sprite,size]);
 return <canvas ref={ref} data-icon={id} className="os-sprite" aria-hidden="true" style={{width:size,height:size,objectFit:'contain'}}/>;
}
