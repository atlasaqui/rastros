import {useEffect} from 'react';
import {createPortal} from 'react-dom';
import {GLITCH_CUES} from '../data/audioCues';
import {playSound,stageMusic,prepareAudio} from '../systems/audioSystem';
export default function GlitchTransition({onFinish,kind='login',startedAt}) {
  useEffect(()=>{
    const origin=startedAt||Date.now();const cue=GLITCH_CUES[kind];prepareAudio([String(22+cue.stage)]);const elapsed=Math.max(0,Date.now()-origin);if(elapsed<cue.delay)playSound(cue.sound,{offset:elapsed/1000});
    const timing={origin,scheduled:Date.now(),elapsed};if(window.__smokeStatus!==undefined)window.__glitchTiming=timing;
    let frame,done=false;const finish=()=>{if(done)return;done=true;cancelAnimationFrame(frame);timing.fired=Date.now();stageMusic(cue.stage);timing.music=Date.now();onFinish();};
    const tick=()=>{if(Date.now()>=origin+cue.delay)finish();else frame=requestAnimationFrame(tick);};frame=requestAnimationFrame(tick);
    const timer=setTimeout(finish,Math.max(0,cue.delay-(Date.now()-origin)));
    return ()=>{done=true;clearTimeout(timer);cancelAnimationFrame(frame);};
  },[onFinish,kind,startedAt]);
  return createPortal(<div className="glitch-transition" role="status" aria-label="Uma ruptura atravessa a tela">
    <div className="glitch-scan" />
    {Array.from({length:8},(_,i)=><i key={i} style={{top:(i*13-2)+'%',height:(i%4===0?10:2+i%3)+'%', '--direction':i%2?-1:1, '--delay':(i%5*27)+'ms', '--duration':(1450+i%4*70)+'ms'}} />)}
  </div>, document.body);
}




