// Sprite rendering, not a white-background eraser. All neutral internal whites stay opaque.
export function keyMagenta(data,opaque=false){
 for(let i=0;i<data.length;i+=4){
  const r=data[i],g=data[i+1],b=data[i+2];
  const chroma=Math.min(r,b)-g;
  if(!opaque&&chroma>36&&r>75&&b>75){data[i+3]=0;continue;}
  // Use green: JPEG magenta spill contains no green, unlike the white artwork.
  const ink=g>=145?255:0;data[i]=data[i+1]=data[i+2]=ink;
 }
 return data;
}
