import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {AUDIO} from '../src/data/audioCatalog.js';
import {GLITCH_CUES,INTRO_CUES} from '../src/data/audioCues.js';
import {KEY_REGIONS} from '../src/data/pianoRegions.js';
import {MEDIA} from '../src/data/mediaAssets.js';
import {freshSave,loadSave,SAVE_KEY} from '../src/save/saveSystem.js';
import {collectJournal} from '../src/systems/journalSystem.js';
import {finishEscape} from '../src/systems/continuationSystem.js';

test('os tempos documentados cabem na duração real dos efeitos',()=>{
 assert.deepEqual(Object.values(GLITCH_CUES).map(c=>c.delay),[2500,1500,4000,500]);
 for(const cue of Object.values(GLITCH_CUES))assert.ok(AUDIO[cue.sound].duration*1000>=cue.delay);
 assert.deepEqual(INTRO_CUES,{text:4000,textFade:1000,reveal:9000,music:9500,scene:10000,end:14000});
});
test('cada tecla e cada áudio apontam para arquivos distribuídos',()=>{
 assert.equal(Object.keys(KEY_REGIONS).length,15);
 for(const [id,r] of Object.entries(KEY_REGIONS)){
  assert.ok(r[2]>r[0]&&r[3]>r[1]);assert.equal(AUDIO['note-'+id].duration,5.5);
 }
 for(const asset of Object.values(AUDIO))assert.ok(existsSync(new URL('../../src/main/resources/audio/runtime/'+asset.file,import.meta.url)),asset.file);
 for(const asset of Object.values(MEDIA))assert.ok(existsSync(new URL('../public/'+asset,import.meta.url)),asset);
});
test('reabrir bloco recolhido conserva a anotação original e o progresso',()=>{
 const base=freshSave();base.flags.inspectedPhysicalNotepad=true;const s=collectJournal(base);
 const restored=loadSave({getItem:key=>key===SAVE_KEY?JSON.stringify(s):null});
 assert.equal(restored.journal.collected,true);assert.equal(restored.journal.originalNote,s.journal.originalNote);
 assert.match(restored.journal.originalNote,/04\/06/);
});
test('migra a alucinação final e normaliza o ponto de retomada da introdução',()=>{
 const s=finishEscape(freshSave());delete s.narrativeStage;s.introElapsed='inválido';
 const restored=loadSave({getItem:()=>JSON.stringify(s)});
 assert.equal(restored.currentCarId,'vagao4');assert.equal(restored.narrativeStage,5);assert.equal(restored.introElapsed,0);
});

