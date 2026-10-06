import {INTRO_CUES} from '../data/audioCues';
import {AUDIO} from '../data/audioCatalog';
import {useEffect,useState,useRef} from 'react';
import {prepareAudio,playSound,stopMenu,stageMusic,stopSound} from '../systems/audioSystem';
export default function TimedIntro({onFinish,save,update}){
 const [phase,setPhase]=useState('loading'),initial=useRef(Math.min(INTRO_CUES.end,Math.max(0,save?.introElapsed||0)));
 useEffect(()=>{let cancelled=false,finished=false;const timers=[];
 prepareAudio(['4','9','22','23']).then(()=>{if(cancelled)return;stopMenu();const position=initial.current,epoch=performance.now()-position;window.__introEpoch=epoch;
  setPhase(position>=INTRO_CUES.scene?'settle':position>=INTRO_CUES.reveal?'reveal':position>=INTRO_CUES.text?'text'+(position>=INTRO_CUES.text+INTRO_CUES.textFade?' resumed':''):'black');
  if(position<AUDIO['4'].duration*1000)playSound('4',{offset:position/1000});
  if(position>=INTRO_CUES.text&&position<INTRO_CUES.end)playSound('22',{gain:.6,offset:(position-INTRO_CUES.text)/1000});
  if(position>=INTRO_CUES.music)stageMusic(1,350,(position-INTRO_CUES.music)/1000);
  const at=(ms,fn)=>{if(ms>=position)timers.push(setTimeout(()=>{if(!cancelled)fn();},Math.max(0,ms-(performance.now()-epoch))));};
  at(INTRO_CUES.text,()=>{setPhase('text');playSound('22',{gain:.6});playSound('9',{gain:.25});});
  at(INTRO_CUES.reveal,()=>setPhase('reveal'));at(INTRO_CUES.music,()=>stageMusic(1,350));at(INTRO_CUES.scene,()=>setPhase('settle'));at(INTRO_CUES.end,()=>{finished=true;onFinish();});
  timers.push(setInterval(()=>{if(!cancelled)update(s=>({...s,introElapsed:Math.min(INTRO_CUES.end,Math.round(performance.now()-epoch))}));},500));
 });
 return()=>{cancelled=true;timers.forEach(t=>{clearTimeout(t);clearInterval(t);});if(!finished){stopSound('4');stopSound('22');}};
 },[onFinish,update]);
 return <div className={'timed-intro '+phase} role="status" aria-label="A viagem começa"><div className="intro-card"><span>Murilo</span><p>{phase==='settle'?'A viagem vai ser longa, é melhor eu me acomodar em algum lugar.':'O que esperar de um recomeço?'}</p></div></div>;
}

