import {CHATS,PIANO} from '../data/continuation.js';
export const freshContinuation=()=>({version:1,clock:{hour:7,minute:7,solved:false},memory:{deck:[],matched:[]},schoolRead:[],chatsRead:[],gallerySeen:[],chatPositions:{},attempts:0,pianoSolved:false});
export function migrateContinuation(s,raw={}) {
 const old=raw.continuation||{},base=freshContinuation();
 const c={...base,...old,clock:{...base.clock,...old.clock},memory:{...base.memory,...old.memory}};
 for(const key of ['schoolRead','chatsRead','gallerySeen'])c[key]=Array.isArray(c[key])?[...new Set(c[key].filter(x=>typeof x==='string'))]:[];
 c.chatsRead=c.chatsRead.filter(id=>CHATS.some(t=>t.id===id));
 c.chatPositions=c.chatPositions&&typeof c.chatPositions==='object'?c.chatPositions:{};
 c.clock.hour=Number.isInteger(c.clock.hour)?((c.clock.hour%12)+12)%12:7;
 c.clock.minute=Number.isInteger(c.clock.minute)?((c.clock.minute%60)+60)%60:7;
 if(!Array.isArray(c.memory.deck)||c.memory.deck.length!==8||c.memory.deck.some(x=>!Number.isInteger(x)||x<0||x>3)||[0,1,2,3].some(v=>c.memory.deck.filter(x=>x===v).length!==2))c.memory={deck:[],matched:[]};
 c.memory.matched=Array.isArray(c.memory.matched)?[...new Set(c.memory.matched.filter(i=>Number.isInteger(i)&&i>=0&&i<8))]:[];
 const flags={...s.flags};
 // Legacy 77E was a chapter checkpoint, not completion of the new story.
 if(!raw.continuation&&(flags.chapterComplete||flags.attemptedClassFolder)){flags.legacyChapterComplete=!!flags.chapterComplete;delete flags.chapterComplete;delete flags.attemptedClassFolder;delete flags.folderExitThought;}
 const legacyDialogue=!raw.continuation&&['class_revelation','wrong_person','folder_exit'].includes(s.activeDialogue?.id);
 return {...s,activeDialogue:legacyDialogue?null:s.activeDialogue,flags,continuation:c,resumeMode:['chase','final'].includes(raw.resumeMode)?raw.resumeMode:s.resumeMode};
}
export function setClock(s,hour,minute) {
 if(s.continuation.clock.solved)return s;
 const solved=hour===0&&minute===14;
 return {...s,continuation:{...s.continuation,clock:{hour,minute,solved}},solvedPuzzles:{...s.solvedPuzzles,...(solved?{clock:true}:{})},flags:{...s.flags,...(solved?{timeReturned:true}:{})}};
}
export function startMemory(s,random=Math.random) {
 if(s.continuation.memory.deck.length)return s;
 const deck=[0,0,1,1,2,2,3,3];
 for(let i=7;i>0;i--){const j=Math.floor(random()*(i+1));[deck[i],deck[j]]=[deck[j],deck[i]];}
 return {...s,continuation:{...s.continuation,memory:{deck,matched:[]}}};
}
export function matchMemory(s,a,b) {
 const m=s.continuation.memory;
 if(!s.flags.timeReturned||a===b||!Number.isInteger(a)||!Number.isInteger(b)||a<0||b<0||a>7||b>7||m.deck.length!==8||m.matched.includes(a)||m.matched.includes(b)||m.deck[a]!==m.deck[b])return s;
 const matched=[...new Set([...m.matched,a,b])];
 return {...s,continuation:{...s.continuation,memory:{...m,matched}},solvedPuzzles:{...s.solvedPuzzles,...(matched.length===8?{memory:true}:{})},flags:{...s.flags,...(matched.length===8?{captchaSolved:true}:{})}};
}
export const allChatsRead=s=>CHATS.every(c=>s.continuation.chatsRead.includes(c.id));
export function readChat(s,id) {
 if(!s.flags.captchaSolved||!CHATS.some(c=>c.id===id))return s;
 if(s.continuation.chatsRead.includes(id)&&!(id==='tata'&&s.flags.pianoInspected&&!s.flags.scoreReviewedAfterPiano))return s;
 const next={...s,continuation:{...s.continuation,chatsRead:[...new Set([...s.continuation.chatsRead,id])]},flags:{...s.flags,...(id==='tata'?{scoreDiscovered:true,...(s.flags.pianoInspected?{scoreReviewedAfterPiano:true}:{})}:{})}};
 return next;
}
export const canLeaveForConfrontation=s=>!!(s.notebookAuthenticated&&s.flags.explorerUnlocked&&s.flags.timeReturned&&s.flags.captchaSolved&&allChatsRead(s)&&!s.flags.escapeComplete);
export function checkpointExit(s) {
 if(!canLeaveForConfrontation(s))return s;
 return {...s,flags:{...s.flags,messageExitRequested:true},continuation:{...s.continuation,checkpoint:true}};
}
export function retryEscape(s) {
 return {...s,chase:null,currentCarId:'vagao2',resumeMode:'notebook',activeDialogue:null,thoughtQueue:[],windows:[{id:'chat',x:0,y:0,maximized:true}],flags:{...s.flags,messageExitRequested:false,confrontationComplete:false,retryPending:true,deserted:false},continuation:{...s.continuation,attempts:(s.continuation.attempts||0)+1}};
}
export function finishEscape(s) {
 return {...s,arrivalElapsed:0,chase:null,glitchStartedAt:Date.now(),resumeMode:'final',currentCarId:'vagao4',visualState:'red',narrativeStage:5,activeDialogue:null,flags:{...s.flags,escapeComplete:true,finalRoom:true,arrivalVisionSeen:false,retryPending:false,messageExitRequested:false,redGlitchPending:true}};
}
export const matchesPiano=notes=>notes.length===PIANO.notes.length&&notes.every((n,i)=>n===PIANO.notes[i]);
