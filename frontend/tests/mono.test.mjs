import test from 'node:test';
import assert from 'node:assert/strict';
import {keyMagenta} from '../src/systems/retroPixels.js';
import {clockDraft} from '../src/systems/clockDraft.js';
import {freshSave,loadSave} from '../src/save/saveSystem.js';
test('magenta e borda JPEG somem sem apagar branco ou tinta do ícone',()=>{
 const pixels=new Uint8ClampedArray([255,0,255,255,220,30,217,255,255,255,255,255,0,0,0,255,240,237,238,255]);
 keyMagenta(pixels);assert.equal(pixels[3],0);assert.equal(pixels[7],0);assert.deepEqual([...pixels.slice(8,12)],[255,255,255,255]);assert.deepEqual([...pixels.slice(12,16)],[0,0,0,255]);assert.equal(pixels[19],255);
});
test('ajuste local do relógio preserva progresso e solução após reabrir',()=>{
 const save=freshSave();save.flags.bibleSeen=true;const next=clockDraft(save,{hour:0,minute:14});assert.equal(next.flags,save.flags);assert.equal(next.continuation.clock.solved,false);assert.equal(loadSave({getItem:()=>JSON.stringify(next)}).continuation.clock.minute,14);
 next.continuation.clock.solved=true;assert.equal(clockDraft(next,{hour:5,minute:30}),next);
});
test('ajuste inválido ou repetido não gera novo estado nem gravação',()=>{
 const save=freshSave();assert.equal(clockDraft(save,save.continuation.clock),save);for(const draft of [{hour:NaN,minute:14},{hour:12,minute:14},{hour:2,minute:-1},null])assert.equal(clockDraft(save,draft),save);
});
