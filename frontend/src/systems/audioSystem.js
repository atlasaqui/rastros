import {PIANO_NOTE_IDS} from '../data/piano.js';
import {AUDIO} from '../data/audioCatalog.js';
const webVoices=new Map(),notes=new Set();let musicId=null,hoverAt=0;
export const audioTrace=[];
export function getSoundSettings(){try{const s=JSON.parse(localStorage.getItem('rastros_sound')||'{}');return {volume:Number.isFinite(s.volume)?Math.max(0,Math.min(1,s.volume)):.7,muted:s.muted===true};}catch{return {volume:.7,muted:false};}}
export function setSoundSettings(s){try{localStorage.setItem('rastros_sound',JSON.stringify(s));}catch{}applySettings(s);}
export function applySettings(s=getSoundSettings()){window.bridge?.audioSettings?.(s.volume,s.muted);for(const a of webVoices.values())a.volume=s.muted?0:s.volume*(a.rastrosGain||1);window.dispatchEvent?.(new CustomEvent('rastros-sound',{detail:s}));}
function trace(id,action){audioTrace.push({id,action,ms:performance.now()});if(audioTrace.length>500)audioTrace.shift();}
export function prepareAudio(ids){
 for(const id of ids){const a=AUDIO[id];if(!a)continue;if(window.bridge?.audioPrepare)window.bridge.audioPrepare(id,a.file,a.kind!=='effect');else if(!webVoices.has(id)){const el=new Audio('../audio/'+a.file);el.preload='auto';webVoices.set(id,el);el.load();}}
 return new Promise(resolve=>{const start=performance.now();function check(){if(ids.every(id=>!AUDIO[id]||(window.bridge?.audioReady?window.bridge.audioReady(id):webVoices.get(id)?.readyState>=2))||performance.now()-start>5000){resolve();return;}setTimeout(check,30);}check();});
}
export function playSound(id,{gain=.7,loop=false,fade=0,offset=0}={}){
 const asset=AUDIO[id];if(!asset)return false;trace(id,'requested');const s=getSoundSettings();
 if(window.bridge?.audioPlay){window.bridge.audioSettings(s.volume,s.muted);const ok=window.bridge.audioPlay(id,asset.file,asset.kind!=='effect',loop,gain,fade);if(offset)window.bridge.audioSeek?.(id,offset);return ok;}
 let el=webVoices.get(id);if(!el){el=new Audio('../audio/'+asset.file);webVoices.set(id,el);}el.rastrosGain=gain;el.loop=loop;el.volume=s.muted?0:s.volume*gain;el.currentTime=offset;el.play().then(()=>trace(id,'playing')).catch(()=>trace(id,'unavailable'));return true;
}
export function stopSound(id,fade=0){window.bridge?.audioStop?.(id,fade);webVoices.get(id)?.pause();trace(id,'stopped');}
export function stageMusic(stage,fade=350,offset=0){const id=String(22+stage);if(musicId===id)return;if(musicId)stopSound(musicId,fade);musicId=id;playSound(id,{loop:true,gain:.45,fade,offset});}
export function audioPosition(id){return window.bridge?.audioPosition?window.bridge.audioPosition(id):webVoices.get(id)?.currentTime??-1;}
export function fadeMusic(ms){if(musicId)stopSound(musicId,ms);}
export function endingMusic(id='28',options={}){if(musicId===id)return;if(musicId)stopSound(musicId,700);musicId=id;playSound(id,{gain:.45,fade:700,...options});}
export function menuMusic(){stopEverything();musicId='21';playSound('21',{loop:true,gain:.4,fade:300});}
export function stopEverything(){window.bridge?.audioStopAll?.();for(const a of webVoices.values())a.pause();musicId=null;notes.clear();}
export function stopMenu(){if(musicId==='21'){stopSound('21',150);musicId=null;}}
export function hoverSound(){const now=performance.now();if(now-hoverAt<90)return;hoverAt=now;playSound('1',{gain:.35});}
export function clickSound(){playSound('2',{gain:.45});}
export function clockSound(options={}){if(window.bridge?.playClock&&!window.bridge?.audioPlay){const s=getSoundSettings();if(!s.muted&&s.volume>0)window.bridge.playClock(s.volume);return;}playSound('31',options);}
export const NOTE_IDS=PIANO_NOTE_IDS;
export function playKey(id,volume=.7){notes.add(id);playSound('note-'+id,{gain:volume});}
export function playNote(id,volume=.7){id=NOTE_IDS[id]||id;notes.add(id);playSound('note-'+id,{gain:Math.min(.8,volume)});}
export function stopNote(id){notes.delete(NOTE_IDS[id]||id);}
export function stopAll(){for(const id of notes)stopSound('note-'+id);notes.clear();}
export function installInterfaceAudio(){
 const over=e=>{if(e.target.closest('.piano-world'))return;const b=e.target.closest('button,a,input,select');if(b&&b.dataset.audio!=='none'&&!b.disabled&&!b.closest('[inert]')&&!b.contains(e.relatedTarget))hoverSound();};
 const click=e=>{if(e.target.closest('.piano-world'))return;const b=e.target.closest('button');if(!b||b.disabled||b.closest('[inert]')||b.dataset.audio==='none')return;const n=b.getAttribute('aria-label')||b.textContent.trim();if(n.startsWith('Tocar '))return;playSound(n==='Fechar diálogo'||(n==='Voltar'&&b.closest('.npc-overlay'))?'11':/Fechar|Voltar|Anterior|Afastar/.test(n)?'3':/Continuar|Concluir histórico/.test(n)?'10':'2',{gain:.45});};
 const type=e=>{if(e.target.matches('input:not([type=range]):not([readonly]),textarea:not([readonly])')&&e.key.length===1){const color=document.querySelector('.game')?.dataset.theme||'white';playSound('typing-'+({white:1,black:2,red:3}[color]),{gain:.35});}};
 document.addEventListener('pointerover',over);document.addEventListener('click',click);document.addEventListener('keydown',type);
 return ()=>{document.removeEventListener('pointerover',over);document.removeEventListener('click',click);document.removeEventListener('keydown',type);};
}



// Stage 4 belongs to the pixel-art escape, not to the earlier curtain reveal.
export function startEscapeAudio(){
 let cancelled=false,timer;
 if(musicId){stopSound(musicId,150);musicId=null;}
 prepareAudio(['glitch-3-4','26']).then(()=>{if(cancelled)return;playSound('glitch-3-4');timer=setTimeout(()=>{if(!cancelled)stageMusic(4,0);},4000);});
 return()=>{cancelled=true;clearTimeout(timer);stopSound('glitch-3-4');if(musicId==='26'){stopSound('26',150);musicId=null;}};
}
