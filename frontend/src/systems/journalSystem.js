import {OBJECTIVES,JOURNAL_PAGE_SIZE} from '../data/objectives.js';
export const freshJournal=()=>({version:1,collected:false,originalNote:'M. Pedrosa\n04/06/2000 - motivação?',known:[],completed:[],revealed:[],completionShown:[],page:0,opened:false});
const ids=new Set(OBJECTIVES.map(o=>o.id));
const clean=a=>Array.isArray(a)?[...new Set(a.filter(id=>ids.has(id)))]:[];
export function syncJournal(save) {
  if(!save)return save;
  const old=save.journal, j={...freshJournal(),...old};
  if(j.originalNote==='M. Pedrosa\n04/06 - motivação?')j.originalNote=freshJournal().originalNote;
  j.version=1;j.collected=j.collected===true;j.opened=j.opened===true;
  for(const key of ['known','completed','revealed','completionShown'])j[key]=clean(j[key]);
  if(j.collected) for(const obj of OBJECTIVES) {
    const s={...save,journal:j};
    if(obj.available(s)||obj.complete(s)) {
      if(!j.known.includes(obj.id))j.known.push(obj.id);
      if(obj.complete(s)&&!j.completed.includes(obj.id))j.completed.push(obj.id);
    }
  }
  j.known=OBJECTIVES.filter(o=>j.known.includes(o.id)).map(o=>o.id);
  j.completed=j.completed.filter(id=>j.known.includes(id));
  j.revealed=j.revealed.filter(id=>j.known.includes(id));
  j.completionShown=j.completionShown.filter(id=>j.completed.includes(id));
  j.page=Number.isInteger(j.page)?Math.max(0,Math.min(j.page,journalPageCount(j)-1)):0;
  return JSON.stringify(old)===JSON.stringify(j)?save:{...save,journal:j};
}
export function migrateJournal(save,raw) {
  const legacy=!raw.journal || raw.journal.version!==1;
  let next=syncJournal({...save,journal:legacy?{...freshJournal(),collected:!!save.flags.inspectedPhysicalNotepad}:raw.journal});
  if(legacy&&next.journal.collected) next={...next,journal:{...next.journal,revealed:[...next.journal.known],completionShown:[...next.journal.completed]}};
  return next;
}
export function collectJournal(save) {
  if(!save.flags.inspectedPhysicalNotepad||save.journal?.collected)return save;
  return syncJournal({...save,journal:{...freshJournal(),collected:true}});
}
export const journalPageCount=j=>Math.max(1,...j.known.map(id=>Math.floor(OBJECTIVES.findIndex(o=>o.id===id)/JOURNAL_PAGE_SIZE)+1));
export const journalEntries=(j,page,save)=>OBJECTIVES.slice(page*JOURNAL_PAGE_SIZE,(page+1)*JOURNAL_PAGE_SIZE).filter(o=>j.known.includes(o.id)).map(o=>o.id==='piano'&&save?.flags.scoreReviewedAfterPiano?{...o,text:'Tocar a música que ficou.'}:o);
export const journalUnread=j=>j.known.some(id=>!j.revealed.includes(id))||j.completed.some(id=>!j.completionShown.includes(id));
export function openJournal(save) {
  const j=save.journal;
  const first=OBJECTIVES.findIndex(o=>j.known.includes(o.id)&&!j.completed.includes(o.id));
  return {...save,journal:{...j,opened:true,page:j.opened?j.page:Math.max(0,Math.floor(first/JOURNAL_PAGE_SIZE))}};
}
export function markJournal(save,idsToMark,completion=false) {
  const j=save.journal,key=completion?'completionShown':'revealed',allowed=completion?j.completed:j.known;
  return {...save,journal:{...j,[key]:[...new Set([...j[key],...idsToMark.filter(id=>allowed.includes(id))])]}};
}
