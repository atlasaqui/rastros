import test from 'node:test';
import assert from 'node:assert/strict';
import {PIANO_KEYS,PIANO_SEQUENCE,PIANO_NOTES,PIANO_NOTE_IDS,advancePiano} from '../src/data/piano.js';
test('quinze teclas clicáveis têm notas e assets consistentes',()=>{
 assert.equal(PIANO_KEYS.length,15);assert.equal(new Set(PIANO_KEYS.map(k=>k.id)).size,15);
 for(const k of PIANO_KEYS)assert.equal(PIANO_NOTE_IDS[k.note],k.id);
 assert.deepEqual(PIANO_NOTES.map(n=>PIANO_NOTE_IDS[n]),PIANO_SEQUENCE);
});
test('tentativa errada pode ser seguida da sequência certa sem reiniciar',()=>{
 let input=[];for(const id of ['A1','B3',...PIANO_SEQUENCE])input=advancePiano(input,id);assert.deepEqual(input,PIANO_SEQUENCE);
 input=advancePiano(['A3','A5','A3'],'A3');assert.deepEqual(input,['A3']);
});

test('frase musical fornecida pelo usuário permanece exata',()=>assert.deepEqual(PIANO_NOTES,['B4','D5','B4','A4','B4','D5','E5','D5','B4']));

test('frase antiga não resolve a nova melodia',()=>{
 let input=[];for(const id of ['A2','A3','A6','A2','A3','A6'])input=advancePiano(input,id);assert.notDeepEqual(input,PIANO_SEQUENCE);
});
test('as duas frases usam as notas existentes sem transposição',()=>{
 assert.deepEqual(PIANO_SEQUENCE,['A3','A5','A3','A2','A3','A5','A6','A5','A3']);
 assert.equal(PIANO_SEQUENCE.length,9);
});
test('a primeira frase sozinha não resolve o piano',()=>{
 let input=[];for(const id of ['A3','A5','A3','A2'])input=advancePiano(input,id);
 assert.notDeepEqual(input,PIANO_SEQUENCE);assert.equal(input.length,4);
});

import {readFileSync} from 'node:fs';
import {loadSave} from '../src/save/saveSystem.js';
test('save concluído da versão 1.0.1 permanece concluído',()=>{
 const raw=readFileSync(new URL('./ending-registros-fixture.json',import.meta.url),'utf8');
 const save=loadSave({getItem:()=>raw});
 assert.equal(save.continuation.pianoSolved,true);assert.equal(save.flags.gameComplete,true);
 assert.equal(save.ending.position,137);assert.equal(save.flags.arrivalVisionSeen,true);
});

import {readChat} from '../src/systems/continuationSystem.js';
import {freshSave} from '../src/save/saveSystem.js';
test('reler Tata após examinar piano registra partitura e persiste no save',()=>{let s=freshSave();s.flags.captchaSolved=true;s=readChat(s,'tata');assert.equal(!!s.flags.scoreReviewedAfterPiano,false);s.flags.pianoInspected=true;s=readChat(s,'tata');assert.equal(s.flags.scoreReviewedAfterPiano,true);const restored=loadSave({getItem:()=>JSON.stringify(s)});assert.equal(restored.flags.scoreReviewedAfterPiano,true);assert.deepEqual(readChat(s,'tata'),s);});

