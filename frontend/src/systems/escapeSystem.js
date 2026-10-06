export const LEVELS=[
 {hands:1,shadow:78,telegraph:.65,extend:.75,hold:.45,retract:.65},
 {hands:2,shadow:82,telegraph:.6,extend:.7,hold:.5,retract:.6},
 {hands:3,shadow:86,telegraph:.55,extend:.65,hold:.55,retract:.55},
 {hands:4,shadow:90,telegraph:.5,extend:.6,hold:.6,retract:.5},
 {hands:5,shadow:94,telegraph:.45,extend:.55,hold:.65,retract:.5},
];
export const FIELD={width:360,height:640,left:125,right:235,start:550,exit:80,speed:145};
// Seat bounds in the 360x640 canvas, shared by all five wagons.
export const SEATS=[...Array(5)].flatMap((_,i)=>[{x:78,y:105+i*89,width:64,height:82},{x:227,y:105+i*89,width:48,height:82}]);
export function playerHitsSeat(x,y){return SEATS.some(r=>x+9>r.x&&x-9<r.x+r.width&&y+8>r.y&&y-8<r.y+r.height);}
export function moveEscapePlayer(x,y,dx,dy){
 if(playerHitsSeat(x,y))x=Math.max(151,Math.min(218,x));
 const nx=Math.max(FIELD.left,Math.min(FIELD.right,x+dx));
 if(!playerHitsSeat(nx,y))x=nx;
 const ny=Math.max(65,Math.min(FIELD.start,y+dy));
 if(!playerHitsSeat(x,ny))y=ny;
 return {x,y};
}
export function freshEscape(wagon=1){return {version:2,wagon,x:180,y:550,sx:180,sy:625,elapsed:0,phase:'enter',phaseTime:0,walking:false,activeTime:0,hands:Array.from({length:LEVELS[wagon-1].hands},(_,i)=>({side:i%2?'right':'left',y:(wagon===1?350:455)-i*(320/Math.max(1,LEVELS[wagon-1].hands-1)),time:0,cycle:0,reach:0,phase:'idle'}))};}
export function restoreEscape(raw){if(raw?.version!==2||!Number.isInteger(raw.wagon)||raw.wagon<1||raw.wagon>5||!['enter','run','transition','caught','complete'].includes(raw.phase)||!['x','y','sx','sy','elapsed','phaseTime','activeTime'].every(k=>Number.isFinite(raw[k]))||!Array.isArray(raw.hands)||raw.hands.length!==LEVELS[raw.wagon-1].hands||!raw.hands.every(h=>['left','right'].includes(h.side)&&['y','time','cycle','reach'].every(k=>Number.isFinite(h[k]))))return freshEscape();return {...raw,x:Math.max(125,Math.min(235,raw.x)),y:Math.max(65,Math.min(550,raw.y)),hands:raw.hands.map(h=>({...h}))};}
export function advanceEscape(state,dt,input={}){
 const s={...state,hands:state.hands.map(h=>({...h}))},step=Math.max(0,Math.min(dt,.05)),level=LEVELS[s.wagon-1];s.phaseTime+=step;
 if(s.phase==='caught'||s.phase==='complete')return s;
 if(s.phase==='enter'){if(s.phaseTime>=.8){s.phase='run';s.phaseTime=0;}return s;}
 if(s.phase==='transition')return s.phaseTime>=.75?freshEscape(s.wagon+1):s;
 s.elapsed+=step;s.activeTime+=step;let dx=input.x||0,dy=input.y||0;const length=Math.hypot(dx,dy);if(length){dx/=length;dy/=length;}s.walking=length>0;
 Object.assign(s,moveEscapePlayer(s.x,s.y,dx*FIELD.speed*step,dy*FIELD.speed*step));
 if(s.elapsed>=2){const distance=Math.hypot(s.x-s.sx,s.y-s.sy);if(distance){s.sx+=(s.x-s.sx)/distance*level.shadow*step;s.sy+=(s.y-s.sy)/distance*level.shadow*step;}if(distance<25){s.phase='caught';s.phaseTime=0;return s;}}
 for(const h of s.hands){
  if(h.phase==='idle'&&Math.abs(s.y-h.y)<200){h.phase='signal';h.time=0;}
  if(h.phase==='idle')continue;h.time+=step;
  const total=level.telegraph+level.extend+level.hold+level.retract,period=total+1.2,t=h.time%period;
  if(t<level.telegraph){h.phase='signal';h.reach=0;}
  else if(t<level.telegraph+level.extend){h.phase='extend';h.reach=(t-level.telegraph)/level.extend;}
  else if(t<level.telegraph+level.extend+level.hold){h.phase='grab';h.reach=1;}
  else if(t<total){h.phase='retract';h.reach=1-(t-level.telegraph-level.extend-level.hold)/level.retract;}
  else{h.phase='signal';h.reach=0;}
  const tip=h.side==='left'?105+80*h.reach:255-80*h.reach;
  if(h.reach>.05&&Math.abs(s.y-h.y)<18&&(h.side==='left'?s.x-9<tip:s.x+9>tip)){s.phase='caught';s.phaseTime=0;return s;}
 }
 if(s.y<=FIELD.exit){s.phase=s.wagon===5?'complete':'transition';s.phaseTime=0;}
 return s;
}
