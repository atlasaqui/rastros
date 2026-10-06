import test from 'node:test';
import assert from 'node:assert/strict';
import {freshEscape,advanceEscape,restoreEscape,LEVELS,playerHitsSeat,moveEscapePlayer,SEATS} from '../src/systems/escapeSystem.js';
import {freshSave,loadSave} from '../src/save/saveSystem.js';
import {endingFrame} from '../src/systems/endingSystem.js';
const step=(s,count,input)=>{for(let i=0;i<count;i++)s=advanceEscape(s,.05,input);return s;};
test('vulto espera dois segundos ativos e captura jogador parado',()=>{let s=step(freshEscape(),16,{});s=step(s,39,{});assert.equal(s.sy,625);s=step(s,50,{});assert.equal(s.phase,'caught');});
test('diagonais normalizadas, paredes e transições seguras',()=>{let a=step(freshEscape(),17,{});let b=advanceEscape(a,.05,{x:1,y:-1});assert.ok(Math.abs(Math.hypot(b.x-a.x,b.y-a.y)-7.25)<1e-8);b=step(a,100,{x:1});assert.ok(b.x<=218);assert.equal(playerHitsSeat(b.x,b.y),false);});
test('cinco vagões são vencíveis com desvio lateral e dificuldade crescente',()=>{
 let s=freshEscape(),seen=new Set();for(let i=0;i<6000&&s.phase!=='complete';i++){
  seen.add(s.wagon);const next=s.hands.filter(h=>h.y<s.y+35).sort((a,b)=>b.y-a.y)[0];const target=next?(next.side==='left'?215:155):180;
  const x=s.x<target-6?1:s.x>target+6?-1:0,y=Math.abs(s.x-target)<12||!next||s.y-next.y>140?-1:0;s=advanceEscape(s,.025,{x,y});assert.notEqual(s.phase,'caught','wagon '+s.wagon+' y '+s.y);
 }assert.equal(s.phase,'complete');assert.equal(seen.size,5);assert.deepEqual(LEVELS.map(l=>l.hands),[1,2,3,4,5]);
});
test('mãos atingem a lateral ameaçada e deixam a oposta livre',()=>{let s=freshEscape();s.phase='run';s.elapsed=2;s.x=151;s.y=350;s.sy=625;s.hands[0].phase='extend';s.hands[0].time=1.35;assert.equal(advanceEscape(s,.01,{}).phase,'caught');s.x=218;assert.equal(advanceEscape(s,.01,{}).phase,'run');});
test('save preserva perseguição sem contar tempo fora do aplicativo',()=>{let s=freshSave();s.resumeMode='chase';s.chase=step(freshEscape(4),35,{y:-1});const restored=loadSave({getItem:()=>JSON.stringify(s)});assert.deepEqual(restored.chase,s.chase);assert.equal(restoreEscape({version:1}).wagon,1);});
test('migração corrige apenas a pista original e preserva texto personalizado',()=>{let s=freshSave();s.journal.originalNote='M. Pedrosa\n04/06 - motivação?';assert.match(loadSave({getItem:()=>JSON.stringify(s)}).journal.originalNote,/04\/06\/2000/);s.journal.originalNote='Minha anotação';assert.equal(loadSave({getItem:()=>JSON.stringify(s)}).journal.originalNote,'Minha anotação');});

import {gameKey} from '../src/systems/keyboardSystem.js';
test('JavaFX key/code vazios reconhecem WASD, setas, Escape e E',()=>{for(const [code,key] of [[87,'w'],[65,'a'],[83,'s'],[68,'d'],[38,'arrowup'],[40,'arrowdown'],[37,'arrowleft'],[39,'arrowright'],[27,'escape'],[69,'e']])assert.equal(gameKey({key:'',code:'',keyCode:code}),key);assert.equal(gameKey({code:'KeyW',key:'z'}),'w');assert.equal(gameKey({key:'ArrowUp'}),'arrowup');assert.equal(gameKey({key:'Unidentified',which:87}),'w');assert.equal(gameKey({}),'');});

test('bancos bloqueiam jogador e corredor fica livre',()=>{for(const r of SEATS){const y=r.y+40;let p={x:180,y};for(let i=0;i<100;i++)p=moveEscapePlayer(p.x,p.y,r.x<180?-7:7,0);assert.equal(playerHitsSeat(p.x,p.y),false);assert.ok(p.x>=151&&p.x<=218);}for(let y=80;y<=550;y++)assert.equal(playerHitsSeat(180,y),false);});
