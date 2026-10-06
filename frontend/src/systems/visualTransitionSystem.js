import {dialogue,SHADOW_LINES} from './narrativeSystem.js';
export function unlockArchives(s) {
  return {...s,glitchStartedAt:Date.now(),flags:{...s.flags,explorerUnlocked:true,archivesGlitchPending:!s.flags.shadowSeen},solvedPuzzles:{...s.solvedPuzzles,class_folder:true},unlockedFolders:{...s.unlockedFolders,security:true}};
}
export function finishVisualGlitch(s,kind) {
  if(kind==='archivesGlitch') return dialogue({...s,resumeMode:'scene',currentCarId:'vagao2',visualState:'white',narrativeStage:3,flags:{...s.flags,archivesGlitchPending:false,shadowRevealed:true,hallucinationStarted:false}},'first_shadow',SHADOW_LINES,['shadowSeen']);
  if(kind==='curtainGlitch') return {...s,visualState:'black',narrativeStage:4,flags:{...s.flags,curtainGlitchPending:false,hallucinationStarted:true}};
  return {...s,narrativeStage:5,visualState:'red',currentCarId:'vagao4',flags:{...s.flags,redGlitchPending:false}};
}
