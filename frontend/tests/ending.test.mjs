import test from 'node:test';
import assert from 'node:assert/strict';
import {endingFrame,beginEnding,checkpointEnding,completeEnding,CREDITS,ENDING_TIMES} from '../src/systems/endingSystem.js';
import {freshSave,loadSave,SAVE_KEY} from '../src/save/saveSystem.js';
import {objective} from '../src/systems/narrativeSystem.js';
import {collectJournal,journalEntries} from '../src/systems/journalSystem.js';
test('piano leva direto ao diálogo sem repetir mãos ou pensamentos',()=>{assert.equal(endingFrame(0).phase,'pianoFade');assert.equal(endingFrame(2).phase,'dialogue');for(let t=0;t<=137;t+=.1)assert.ok(!['hands','ellipsis'].includes(endingFrame(t).phase));});
test('cada uma das seis falas tem dois segundos totalmente legíveis',()=>{
 for(let i=0;i<6;i++){const start=1.5+i*2.7;assert.equal(endingFrame(start+.36).opacity,1);assert.equal(endingFrame(start+2.34).opacity,1);assert.equal(endingFrame(start+1).index,i);}
 assert.equal(endingFrame(18).phase,'silence');assert.equal(endingFrame(20).phase,'credit');
});
test('créditos corretos e continuar bloqueado durante toda a música completa',()=>{
 assert.deepEqual(CREDITS.map(c=>c[1]),['Amanda Queiroz','Luana Meneghini','Matheus Medeiros','Victor Monteiro']);
 assert.equal(endingFrame(136.99).canContinue,false);assert.equal(endingFrame(137).canContinue,true);
});
test('retoma a cinemática sem repetir piano e encerra sem apagar o progresso',()=>{
 let s=beginEnding(freshSave());s=checkpointEnding(s,19.2);const saved=loadSave({getItem:k=>k===SAVE_KEY?JSON.stringify(s):null});assert.equal(saved.ending.position,19.2);assert.equal(saved.flags.pianoEndingPending,true);assert.equal(saved.continuation.pianoSolved,true);
 s=completeEnding(s);assert.equal(s.flags.gameComplete,true);assert.equal(s.flags.pianoEndingPending,false);assert.equal(s.ending.position,137);
});
test('objetivo indireto atualizado coincide entre cenário e caderno',()=>{
 const s=freshSave();s.flags.inspectedPhysicalNotepad=true;let j=collectJournal(s);j.flags.pianoInspected=true;assert.equal(objective(j),'Reconhecer a música que ficou na memória.');j.journal.known.push('piano');j.flags.scoreReviewedAfterPiano=true;assert.equal(objective(j),'Tocar a música que ficou.');assert.equal(journalEntries(j.journal,5,j)[0].text,objective(j));
});
test('save final antigo vira créditos prontos e valores corrompidos são normalizados',()=>{
 const s=freshSave();s.flags.gameComplete=true;assert.equal(loadSave({getItem:()=>JSON.stringify(s)}).ending.position,137);s.ending={position:'ruim'};assert.equal(loadSave({getItem:()=>JSON.stringify(s)}).ending.position,0);
});

test('chegada interrompida persiste e final antigo migra sem repetir pensamentos',()=>{
 let s=freshSave();s.arrivalElapsed=7500;s.flags.escapeComplete=true;s.flags.finalRoom=true;
 let loaded=loadSave({getItem:()=>JSON.stringify(s)});assert.equal(loaded.arrivalElapsed,7500);assert.ok(!loaded.flags.arrivalVisionSeen);
 s.flags.arrivalVisionSeen=true;loaded=loadSave({getItem:()=>JSON.stringify(s)});assert.equal(loaded.flags.arrivalVisionSeen,true);
 s.ending={version:1,position:15};s.flags.pianoEndingPending=true;loaded=loadSave({getItem:()=>JSON.stringify(s)});assert.equal(loaded.ending.position,6);assert.equal(loaded.flags.arrivalVisionSeen,true);assert.equal(loadSave({getItem:()=>JSON.stringify(loaded)}).ending.position,6);
});
