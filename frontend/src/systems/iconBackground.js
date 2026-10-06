// Only neutral near-white pixels connected to the crop perimeter are removed.
export function removeOuterPaper(data, width, height) {
  const visited=new Uint8Array(width*height), queue=new Uint32Array(width*height);
  let head=0, tail=0;
  function visit(p) {
    if(visited[p]) return;
    visited[p]=1;
    const i=p*4, r=data[i], g=data[i+1], b=data[i+2];
    if(Math.min(r,g,b)<225 || Math.max(r,g,b)-Math.min(r,g,b)>24) return;
    queue[tail++]=p;
  }
  for(let x=0;x<width;x++){visit(x);visit((height-1)*width+x);}
  for(let y=0;y<height;y++){visit(y*width);visit(y*width+width-1);}
  while(head<tail){
    const p=queue[head++], x=p%width, y=Math.floor(p/width);
    data[p*4+3]=0;
    if(x>0)visit(p-1);if(x+1<width)visit(p+1);
    if(y>0)visit(p-width);if(y+1<height)visit(p+width);
  }
  return data;
}

// The chat/trash crops have JPEG fringe and narrow diagonal exterior gaps.
// An 8-connected exterior mask removes those gaps; enclosed fills are untouched.
export function cleanDetailedIcon(data,width,height) {
  const outside=new Uint8Array(width*height),queue=new Uint32Array(width*height);
  let head=0,tail=0;
  function visit(x,y){
    if(x<0||y<0||x>=width||y>=height)return;
    const p=y*width+x;if(outside[p])return;
    const i=p*4,min=Math.min(data[i],data[i+1],data[i+2]),max=Math.max(data[i],data[i+1],data[i+2]);
    if(min<207||max-min>32)return;
    outside[p]=1;queue[tail++]=p;
  }
  for(let x=0;x<width;x++){visit(x,0);visit(x,height-1);}
  for(let y=0;y<height;y++){visit(0,y);visit(width-1,y);}
  while(head<tail){const p=queue[head++],x=p%width,y=Math.floor(p/width);data[p*4+3]=0;
    for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)if(dx||dy)visit(x+dx,y+dy);
  }
  // Decontaminate only antialiased perimeter pixels touching the outside.
  // Interior colours (including white) and solid dark outlines are unchanged.
  for(let y=1;y<height-1;y++)for(let x=1;x<width-1;x++){
    const p=y*width+x,i=p*4;if(outside[p])continue;
    if(![p-1,p+1,p-width,p+width].some(n=>outside[n]))continue;
    const min=Math.min(data[i],data[i+1],data[i+2]);
    if(min<110)continue;
    const alpha=Math.max(.25,Math.min(1,(242-min)/132));
    for(let c=0;c<3;c++)data[i+c]=Math.max(0,Math.min(255,(data[i+c]-242*(1-alpha))/alpha));
    data[i+3]=Math.round(255*alpha);
  }
  return data;
}
