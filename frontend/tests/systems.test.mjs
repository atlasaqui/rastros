import assert from "node:assert/strict";
import { test } from "node:test";
import {removeOuterPaper,cleanDetailedIcon} from '../src/systems/iconBackground.js';
import {syncJournal,collectJournal,markJournal,openJournal,journalPageCount,journalUnread,journalEntries} from '../src/systems/journalSystem.js';
import {OBJECTIVES} from '../src/data/objectives.js';
test('máscara específica remove fundo cinza claro e preserva branco fechado',()=>{
 const pixels=new Uint8ClampedArray(9*9*4).fill(255);
 for(let p=0;p<81;p++){pixels[p*4]=pixels[p*4+1]=pixels[p*4+2]=216;}
 for(let y=2;y<=6;y++)for(let x=2;x<=6;x++){const p=(y*9+x)*4;const v=x===2||x===6||y===2||y===6?25:255;pixels[p]=pixels[p+1]=pixels[p+2]=v;}
 cleanDetailedIcon(pixels,9,9);
 assert.equal(pixels[3],0);assert.equal(pixels[(4*9+4)*4+3],255);assert.equal(pixels[(4*9+4)*4],255);assert.equal(pixels[(2*9+2)*4],25);
});
test('diário só pode ser recolhido após concluir a inspeção; coleta idempotente',()=>{
 let s=freshSave();assert.equal(collectJournal(s),s);
 s=finish(discoverTable(s));s=collectJournal(s);
 assert.ok(s.journal.collected);assert.deepEqual(s.journal.known,['access','voices']);
 assert.equal(collectJournal(s),s);assert.deepEqual(s.journal.completed,[]);
});
test('objetivos seguem flags reais sem completar por visita ou abertura',()=>{
 let s=collectJournal(finish(discoverTable(freshSave())));
 s=syncJournal(enterCar(s,'vagao3'));s=openJournal(s);assert.deepEqual(s.journal.completed,[]);
 s=syncJournal(authenticate(s));assert.deepEqual(s.journal.completed,['access']);assert.ok(s.journal.known.includes('read'));
 for(const f of FILES)s.readFiles[f.id]=true;s=syncJournal(s);
 assert.ok(s.journal.completed.includes('read'));assert.ok(s.journal.known.includes('locked'));
 s=syncJournal({...s,flags:{...s.flags,attemptedClassFolder:true}});assert.ok(s.journal.known.includes('witness'));
 assert.ok(!s.journal.completed.includes('witness'));assert.ok(!s.journal.completed.includes('voices'));
 s=syncJournal({...s,flags:{...s.flags,bibleSeen:true,v2Exhausted:true}});assert.ok(s.journal.completed.includes('witness'));assert.ok(s.journal.completed.includes('voices'),'late revelation resolves the conversation objective on alternative routes');
});
test('paginação estável e apresentação persistente sem reescrever histórico',()=>{
 let s=collectJournal(finish(discoverTable(freshSave())));s=syncJournal(authenticate(s));
 s=openJournal(s);assert.equal(journalPageCount(s.journal),2);assert.deepEqual(journalEntries(s.journal,0).map(o=>o.id),['access','voices']);
 s=markJournal(s,['access','voices']);s=markJournal(s,['access'],true);
 s={...s,journal:{...s.journal,page:1}};const st=storage();writeSave(s,st);s=loadSave(st);
 assert.equal(openJournal(s).journal.page,1);assert.deepEqual(s.journal.revealed,['access','voices']);assert.deepEqual(s.journal.completionShown,['access']);assert.ok(journalUnread(s.journal));
});
test('save antigo migra diário só se inspeção foi concluída, sem animações antigas',()=>{
 const st=storage();let old=freshSave();delete old.journal;old.visitedCars.push('vagao2');writeSave(old,st);assert.equal(loadSave(st).journal.collected,false);
 old.flags.inspectedPhysicalNotepad=true;old.notebookAuthenticated=true;writeSave(old,st);const s=loadSave(st);
 assert.ok(s.journal.collected);assert.deepEqual(s.journal.revealed,s.journal.known);assert.deepEqual(s.journal.completionShown,s.journal.completed);
});
test('save novo com inspeção mas sem coleta continua sem diário ao recarregar',()=>{
 const st=storage(),s=finish(discoverTable(freshSave()));writeSave(s,st);assert.equal(loadSave(st).journal.collected,false);
});
test('anotações não incluem códigos nem localização de pistas',()=>{
 for(const o of OBJECTIVES)assert.ok(!/77E|04\/06|FIXO|vagão\s*\d/i.test(o.text));
});
test('transparência remove só fundo exterior e preserva branco interno',()=>{
  const pixels=new Uint8ClampedArray(7*7*4).fill(255);
  for(let y=1;y<6;y++)for(let x=1;x<6;x++)if(x===1||x===5||y===1||y===5){const p=(y*7+x)*4;pixels[p]=pixels[p+1]=pixels[p+2]=20;}
  removeOuterPaper(pixels,7,7);
  assert.equal(pixels[3],0);
  assert.deepEqual([...pixels.slice((3*7+3)*4,(3*7+3)*4+4)],[255,255,255,255]);
  assert.equal(pixels[(1*7+1)*4+3],255);
});
test('save nativo funciona mesmo sem acesso a localStorage', () => {
  let disk = '';
  globalThis.window = {bridge:{readSave:()=>disk,writeSave:value=>{disk=value;return true;}}};
  Object.defineProperty(globalThis,'localStorage',{configurable:true,get(){throw Error('Quota/WebKit unavailable');}});
  try {
    const save=freshSave(); save.notes='persistência nativa';
    assert.equal(writeSave(save),true);
    assert.equal(loadSave().notes,'persistência nativa');
    window.bridge.writeSave=()=>false;
    assert.equal(writeSave(save),false);
    assert.equal(loadSave().notes,'persistência nativa');
  } finally { delete globalThis.window; delete globalThis.localStorage; }
});
import {
  freshSave,
  loadSave,
  writeSave,
  SAVE_KEY,
  LEGACY_KEY,
} from "../src/save/saveSystem.js";
import {
  encounter,
  advanceDialogue,
  discoverTable,
  enterCar,
  authenticate,
  leaveNotebook,
  sceneVariant,
  allDocumentsRead,
} from "../src/systems/narrativeSystem.js";
import { PUZZLES } from "../src/data/puzzles.js";
import { FILES } from "../src/data/files.js";
import {
  validateAnswer,
  decodeMultitap,
  solvePuzzle,
} from "../src/systems/puzzleSystem.js";
import { clampWindow, WINDOW_SIZE } from "../src/systems/screenLayout.js";
const finish = (s) => {
  while (s.activeDialogue) s = advanceDialogue(s);
  return s;
};
const storage = () => {
  const map = new Map();
  return {
    getItem: (k) => map.get(k) || null,
    setItem: (k, v) => map.set(k, v),
  };
};
test("demo legada não contamina Murilo e permanece intacta", () => {
  const st = storage();
  st.setItem(LEGACY_KEY, '{"flags":{"vagao1_complete":true}}');
  assert.equal(loadSave(st), null);
  writeSave(freshSave(), st);
  assert.equal(loadSave(st).flags.vagao1_complete, undefined);
  assert.ok(st.getItem(LEGACY_KEY));
});
test("save inválido e falha de escrita são recuperáveis", () => {
  const st = storage();
  st.setItem(SAVE_KEY, "bad");
  assert.equal(loadSave(st), null);
  assert.equal(
    writeSave(freshSave(), {
      setItem() {
        throw Error();
      },
    }),
    false,
  );
  st.setItem(
    SAVE_KEY,
    JSON.stringify({
      version: 3,
      flags: [],
      currentCarId: "oops",
      windows: [null, { id: "documents", x: Infinity }],
      activeDialogue: { lines: [] },
    }),
  );
  const s = loadSave(st);
  assert.equal(s.currentCarId, "vagao1");
  assert.deepEqual(s.flags, {});
  assert.equal(s.activeDialogue, null);
});
test("diálogo retoma nó após serialização sem adiantar flag", () => {
  let s = discoverTable(freshSave());
  s = advanceDialogue(s);
  const st = storage();
  writeSave(s, st);
  s = loadSave(st);
  assert.equal(s.activeDialogue.index, 1);
  assert.equal(s.flags.inspectedPhysicalNotepad, undefined);
  s = finish(s);
  assert.equal(s.flags.inspectedPhysicalNotepad, true);
});
test("dois NPCs distintos necessários para pensamento de esgotamento", () => {
  let s = finish(discoverTable(freshSave()));
  s = finish(encounter(s, "isolada1"));
  s = finish(encounter(s, "isolada1"));
  assert.equal(s.flags.v2Exhausted, undefined);
  s = finish(encounter(s, "isolada2"));
  assert.equal(s.flags.v2Exhausted, true);
});
test("3 NPCs do terceiro vagão e nova fala após pasta", () => {
  let s = freshSave();
  for (const id of ["casal_v3", "isolada3", "isolada4"])
    s = finish(encounter(s, id));
  assert.match(
    encounter(s, "isolada3").activeDialogue.lines[0].text,
    /nada a perguntar/,
  );
  s.flags.attemptedClassFolder = true;
    assert.equal(leaveNotebook(s).flags.shadowRevealed, undefined);
    s.flags.shadowRevealed = true;
  s = finish(encounter(s, "casal_v3"));
  assert.equal(s.flags.learnedClassCode, undefined);
  assert.equal(s.flags.chapterComplete, undefined);
});
test("login aceita só data canônica, não FIXO nem 77E", () => {
  for (const good of ["04/06/2000", "04062000"])
    assert.ok(validateAnswer(PUZZLES.notebook_login, good));
  for (const bad of ["04/06/2001", "33344499666", "3496", "77E", "04a06a2000"])
    assert.equal(validateAnswer(PUZZLES.notebook_login, bad), false);
});
test("boot não transforma: primeiro login transforma imediatamente uma vez", () => {
  let s = { ...freshSave(), currentCarId: "vagao2", notebookBooted: true };
  assert.equal(sceneVariant(leaveNotebook(s)), "white");
  s = authenticate(s);
  assert.equal(sceneVariant(s), "black");
  assert.deepEqual(authenticate(s), s);
  s = leaveNotebook(s);
  assert.equal(sceneVariant(s), "black");
  assert.equal(sceneVariant(s, "vagao3"), "black");
  assert.equal(sceneVariant(s, "vagao1"), "black");
  assert.equal(leaveNotebook(s).flags.hallucinationPending, false);
});
test("saída precoce permite retomar documentos e completar trecho", () => {
  let s = enterCar(freshSave(), "vagao2");
  s = finish(s);
  s = authenticate(s);
  s = leaveNotebook(s);
  assert.equal(allDocumentsRead(s), false);
  for (const f of FILES) s.readFiles[f.id] = true;
  s.flags.attemptedClassFolder = true;
  assert.equal(leaveNotebook(s).flags.shadowRevealed, undefined);
  s.flags.shadowRevealed = true;
  s = finish(leaveNotebook(s));
  s = enterCar(s, "vagao3");
  s = finish(encounter(s, "casal_v3"));
  const st = storage();
  writeSave(s, st);
  assert.equal(loadSave(st).flags.shadowSeen, true);
  assert.equal(loadSave(st).currentCarId, "vagao3");
  assert.equal(sceneVariant(loadSave(st)), "black");
});
test("explorador usa 415, rejeita senha legada e FIXO", () => {
 assert.equal(validateAnswer(PUZZLES.class_folder,"415"),true);
 for(const value of ["77E","0415","FIXO"])assert.equal(validateAnswer(PUZZLES.class_folder,value),false);
 assert.equal(solvePuzzle(freshSave(),PUZZLES.class_folder,"415").save.solvedPuzzles.class_folder,true);
});
test("FIXO multi-tap usa 333|444|99|666, não 3496", () => {
  assert.equal(decodeMultitap(["333", "444", "99", "666"]), "FIXO");
  assert.equal(decodeMultitap(["3", "4", "9", "6"]), "DGWM");
  assert.equal(validateAnswer(PUZZLES.fixo, "3496"), false);
  assert.equal(
    solvePuzzle(freshSave(), PUZZLES.fixo, "33344499666").save.solvedPuzzles
      .fixo,
    undefined,
  );
});
test("cinco documentos preservam repetição e ordem", () => {
  assert.equal(FILES.length, 5);
  assert.equal(
    FILES[0].body.split("\n").filter((l) => l === "Não é puro").length,
    7,
  );
  assert.equal(FILES[1].body.split("\n").filter((l) => l === "não").length, 6);
  assert.equal(FILES[4].title, "04/06-12:15.txt");
});
test("janelas de saves antigos ficam dentro do LCD e acima da barra", () => {
  for (const [width, height] of [
    [990, 540],
    [760, 420],
    [1482, 810],
  ]) {
    for (const win of [
      { x: 25, y: 21 },
      { x: -5, y: 300 },
      { x: NaN, y: Infinity },
    ]) {
      const p = clampWindow(win, width, height);
      assert.ok(p.x >= 0 && p.y >= 0);
      assert.ok(p.x + WINDOW_SIZE.width <= 100);
      assert.ok(
        ((p.y + WINDOW_SIZE.height) * height) / 100 <= height - 32 + 0.001,
      );
    }
  }
});
test("rebranding preserva save v3, autenticação, leituras e notas", () => {
  const st = storage();
  const before = {
    ...freshSave(),
    currentCarId: "vagao2",
    resumeMode: "notebook",
    notebookBooted: true,
    notebookAuthenticated: true,
    notes: "Pista anotada",
    flags: { hallucinationActive: true },
    readFiles: { outubro: true },
    windows: [{ id: "notes", x: 25, y: 21 }],
  };
  st.setItem("chatgame_murilo_v3", JSON.stringify(before));
  const after = loadSave(st);
  assert.equal(after.notes, before.notes);
  assert.equal(after.notebookAuthenticated, true);
  assert.deepEqual(after.readFiles, before.readFiles);
  assert.deepEqual(after.flags, before.flags);
  assert.equal(after.windows[0].id, "notes");
});

import {enqueueThought, acknowledgeThought, readDocument, attemptFolder} from '../src/systems/thoughtSystem.js';
test('pensamentos aguardam confirmação e sobrevivem reload sem duplicar',()=>{
 const st=storage(); let s=authenticate(freshSave());
 assert.equal(s.thoughtQueue[0].id,'login');
 writeSave(s,st);s=loadSave(st); assert.equal(s.thoughtQueue.length,1);
 s=acknowledgeThought(s); assert.ok(s.flags.loginThoughtSeen);
 s=readDocument(s,FILES[0].id);s=readDocument(s,FILES[0].id);
 assert.equal(s.thoughtQueue.length,1);s=acknowledgeThought(s);
 assert.equal(readDocument(s,FILES[0].id).thoughtQueue.length,0);
 s=attemptFolder(s);s=attemptFolder(s);assert.equal(s.thoughtQueue.length,1);
 writeSave(s,st); assert.equal(loadSave(st).thoughtQueue[0].id,'folder');
});
test('save anterior autenticado migra sem repetir leituras ou susto',()=>{
 const st=storage();const s={...freshSave(),notebookAuthenticated:true,readFiles:{outubro:true},flags:{loginThoughtSeen:true,hallucinationPending:true}};
 delete s.presentationVersion;delete s.visualState;delete s.thoughtQueue;delete s.seenThoughts;
 writeSave(s,st);const migrated=loadSave(st);
 assert.equal(sceneVariant(migrated),'black');assert.equal(migrated.thoughtQueue.length,0);
 assert.ok(migrated.seenThoughts['document:outubro']);
 assert.deepEqual(authenticate(migrated),migrated);
});
test('vermelho não nasce da autenticação nem da troca de vagão',()=>{
 let s=authenticate(freshSave());for(const id of ['vagao1','vagao2','vagao3']) assert.equal(sceneVariant(enterCar(s,id)),'black');
 assert.equal(sceneVariant({...s,visualState:'red'}),'red');
});
