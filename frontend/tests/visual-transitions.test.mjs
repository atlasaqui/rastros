import test from 'node:test';
import assert from 'node:assert/strict';
import {freshSave,writeSave,loadSave} from '../src/save/saveSystem.js';
import {authenticate,leaveNotebook,encounter,advanceDialogue,sceneVariant} from '../src/systems/narrativeSystem.js';
import {unlockArchives,finishVisualGlitch} from '../src/systems/visualTransitionSystem.js';
import {finishEscape} from '../src/systems/continuationSystem.js';
test('sequência branco, login preto, arquivos branco com sombra, cortina preto, fuga vermelho',()=>{
 let s=freshSave();assert.equal(sceneVariant(s),'white');assert.ok(!s.flags.shadowRevealed);
 s=authenticate(s);assert.equal(sceneVariant(s),'black');s={...s,flags:{...s.flags,attemptedClassFolder:true,classPasswordSubmitted:true}};
 assert.ok(!leaveNotebook(s).flags.shadowRevealed);assert.equal(encounter(s,'religiosa').activeDialogue.id,'bible');
 s=unlockArchives(s);assert.equal(sceneVariant(s),'black');assert.equal(s.flags.archivesGlitchPending,true);
 const data={};const storage={getItem:k=>data[k],setItem:(k,v)=>data[k]=v};writeSave(s,storage);s=loadSave(storage);assert.equal(s.flags.archivesGlitchPending,true);
 s=finishVisualGlitch(s,'archivesGlitch');assert.equal(sceneVariant(s),'white');assert.equal(s.flags.shadowRevealed,true);assert.equal(s.activeDialogue.id,'first_shadow');
 while(s.activeDialogue)s=advanceDialogue(s);assert.equal(s.flags.shadowSeen,true);
 s={...s,activeDialogue:{id:'curtain',index:0,lines:[{text:'Cortina fechada'}],endFlags:['curtainExamined']}};s=advanceDialogue(s);assert.equal(s.flags.curtainGlitchPending,true);assert.equal(sceneVariant(s),'white');
 s=finishVisualGlitch(s,'curtainGlitch');assert.equal(sceneVariant(s),'black');assert.equal(s.flags.curtainExamined,true);assert.equal(s.flags.curtainGlitchPending,false);
 assert.ok(!unlockArchives(s).flags.archivesGlitchPending);s=finishEscape(s);assert.equal(sceneVariant(s),'red');assert.equal(s.flags.redGlitchPending,true);s=finishVisualGlitch(s,'redGlitch');assert.equal(s.flags.redGlitchPending,false);
});
