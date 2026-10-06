import { FILES } from '../data/files.js';
export const LOGIN_THOUGHT = {id:'login', text:'(Então era isto)'};
export const FOLDER_THOUGHT = {id:'folder', text:'(Revise os seus pecados...)'};
export function enqueueThought(save, event) {
  if (save.seenThoughts?.[event.id] || save.thoughtQueue?.some(t => t.id === event.id)) return save;
  return {...save, thoughtQueue:[...(save.thoughtQueue || []), event]};
}
export function acknowledgeThought(save) {
  const event = save.thoughtQueue?.[0];
  if (!event) return save;
  return {...save, thoughtQueue:save.thoughtQueue.slice(1),
    seenThoughts:{...save.seenThoughts, [event.id]:true},
    flags:{...save.flags, ...(event.id === 'login' ? {loginThoughtSeen:true} : {})}};
}
export function readDocument(save, id) {
  const file = FILES.find(f=>f.id===id);
  if (!file || save.readFiles[id]) return save;
  return enqueueThought({...save, readFiles:{...save.readFiles,[id]:true}}, {id:'document:'+id,text:file.reaction});
}
export function attemptFolder(save) {
  return enqueueThought({...save,flags:{...save.flags,attemptedClassFolder:true}}, FOLDER_THOUGHT);
}
