import {restoreEscape} from '../systems/escapeSystem.js';
// A demo v1/v2 permanece armazenada; nunca importar suas flags para Murilo.
import {freshContinuation,migrateContinuation} from '../systems/continuationSystem.js';
import {freshJournal,migrateJournal} from '../systems/journalSystem.js';
export const SAVE_KEY = "chatgame_murilo_v3";
export const LEGACY_KEY = "chatgame_save_v1";
export const freshSave = () => ({
  version: 3,
  presentationVersion: 2,
  narrativeStage:1,
  introElapsed:0,
  chase:null,
  ending:null,
  arrivalElapsed:0,
  journal:freshJournal(),
  continuation:freshContinuation(),
  visualState: "white",
  thoughtQueue: [],
  seenThoughts: {},
  currentCarId: "vagao1",
  visitedCars: ["vagao1"],
  flags: {},
  unlockedFolders: {},
  readFiles: {},
  readEmails: {},
  dialogueProgress: {},
  conversations: {},
  choices: [],
  solvedPuzzles: {},
  passwords: {},
  psychologicalEvents: {},
  appState: {},
  notebookBooted: false,
  notebookAuthenticated: false,
  notes: "",
  windows: [],
  activeContact: null,
  updatedAt: null,
  resumeMode: "scene",
  activeDialogue: null,
});
const record = (v) => v && typeof v === "object" && !Array.isArray(v);
export function gameStorage() {
  if (globalThis.window?.bridge?.readSave) return {
    getItem(key) {
      if (key !== SAVE_KEY) return null;
      const native = window.bridge.readSave();
      if (native) return native;
      // Import existing WebView saves when available; never replace a native save.
      try { const legacy = localStorage.getItem(key); if (legacy && window.bridge.writeSave(legacy)) return legacy; } catch {}
      return null;
    },
    setItem(key, value) {
      if (key !== SAVE_KEY || !window.bridge.writeSave(value)) throw Error('Native save failed');
    },
  };
  return globalThis.localStorage;
}
export function loadSave(storage) {
  try {
    storage ??= gameStorage();
    const raw = JSON.parse(storage.getItem(SAVE_KEY));
    if (!record(raw) || raw.version !== 3) return null;
    const result = { ...freshSave(), ...raw };
    for (const key of [
      "seenThoughts",
      "flags",
      "unlockedFolders",
      "readFiles",
      "readEmails",
      "dialogueProgress",
      "conversations",
      "solvedPuzzles",
      "passwords",
      "psychologicalEvents",
      "appState",
    ])
      if (!record(result[key])) result[key] = {};
    for (const key of ["visitedCars", "choices", "windows"])
      if (!Array.isArray(result[key])) result[key] = [];
    if (!["vagao1", "vagao2", "vagao3", "vagao4"].includes(result.currentCarId))
      result.currentCarId = "vagao1";
    if (typeof result.notes !== "string") result.notes = "";
    result.notebookBooted = result.notebookBooted === true;
    result.notebookAuthenticated = result.notebookAuthenticated === true;
    if (!["scene", "notebook", "intro", "chase", "final"].includes(result.resumeMode))
      result.resumeMode = "scene";
    if (result.resumeMode === "notebook" && result.currentCarId !== "vagao2")
      result.resumeMode = "scene";
    result.windows = result.windows
      .filter(record)
      .filter((w) => typeof w.id === "string")
      .map((w) => ({
        ...w,
        x: Number.isFinite(w.x) ? Math.max(0, Math.min(25, w.x)) : 14,
        y: Number.isFinite(w.y) ? Math.max(0, Math.min(21, w.y)) : 5,
      }));
    if(!raw.narrativeStage)result.narrativeStage=result.flags.escapeComplete?5:result.flags.curtainExamined?4:result.flags.shadowRevealed||result.flags.shadowSeen?3:result.notebookAuthenticated?2:1;
    if(result.flags.finalRoom)result.currentCarId='vagao4';
    result.introElapsed=Number.isFinite(result.introElapsed)?Math.max(0,Math.min(14000,result.introElapsed)):0;
    result.arrivalElapsed=Number.isFinite(result.arrivalElapsed)?Math.max(0,Math.min(12000,result.arrivalElapsed)):0;
    if(result.flags.pianoEndingPending||result.flags.gameComplete)result.flags.arrivalVisionSeen=true;
    const d = result.activeDialogue;
    if (
      !record(d) ||
      !Array.isArray(d.lines) ||
      !d.lines.length ||
      !d.lines.every((l) => record(l) && typeof l.text === "string") ||
      !Number.isInteger(d.index) ||
      d.index < 0 ||
      d.index >= d.lines.length
    )
      result.activeDialogue = null;
    for (const key of Object.keys(result.conversations))
      if (!Array.isArray(result.conversations[key]))
        result.conversations[key] = [];
    // Migrate authenticated saves without replaying the first-login scare.
    if (!['white','black','red'].includes(result.visualState)) result.visualState='white';
    if (raw.presentationVersion !== 2) {
      result.visualState = result.notebookAuthenticated || result.flags.hallucinationStarted ? 'black' : 'white';
      result.seenThoughts = {...result.seenThoughts};
      if(result.flags.loginThoughtSeen) result.seenThoughts.login=true;
      for(const id of Object.keys(result.readFiles)) if(result.readFiles[id]) result.seenThoughts['document:'+id]=true;
      if(result.flags.attemptedClassFolder) result.seenThoughts.folder=true;
      result.thoughtQueue = result.notebookAuthenticated && !result.flags.loginThoughtSeen
        ? [{id:'login',text:'(Então era isto)'}] : [];
    }
    if(result.activeDialogue?.id === 'table') result.activeDialogue={...result.activeDialogue,lines:result.activeDialogue.lines.map(line=>
      line.speaker==='Notebook' && line.kind==='description' ? {...line,text:'Uma sessão de usuário protegida por senha.'} : line)};
    result.presentationVersion=2;
    result.thoughtQueue=Array.isArray(result.thoughtQueue) ? result.thoughtQueue.filter((t,i,a)=>
      record(t) && typeof t.id==='string' && typeof t.text==='string' && !result.seenThoughts[t.id] && a.findIndex(v=>v?.id===t.id)===i) : [];
    result.ending=record(raw.ending)?{version:2,position:Number.isFinite(raw.ending.position)?Math.max(0,Math.min(137,raw.ending.position-(raw.ending.version===2||raw.ending.position>=137?0:9))):0}:result.flags.gameComplete?{version:2,position:137}:result.flags.pianoEndingPending?{version:2,position:0}:null;
    result.chase=result.resumeMode==='chase'?restoreEscape(raw.chase):null;
    return migrateJournal(migrateContinuation(result,raw),raw);
  } catch {
    return null;
  }
}
export const hasSave = () => !!loadSave();
export function hasLegacySave(storage) {
  try {
    storage ??= gameStorage();
    return !!storage.getItem(LEGACY_KEY);
  } catch {
    return false;
  }
}
export function writeSave(save, storage) {
  try {
    storage ??= gameStorage();
    storage.setItem(
      SAVE_KEY,
      JSON.stringify({ ...save, updatedAt: Date.now() }),
    );
    return true;
  } catch {
    return false;
  }
}
export const setCurrentCar = (s, id) => ({
  ...s,
  currentCarId: id,
  visitedCars: [...new Set([...s.visitedCars, id])],
});
export const setFlag = (s, id, value = true) => ({
  ...s,
  flags: { ...s.flags, [id]: value },
});
