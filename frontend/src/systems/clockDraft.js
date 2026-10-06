// Committing a local preview must never undo a solved clock, flags or narrative progress.
export function clockDraft(save,draft){
 const previous=save.continuation.clock;
 if(previous.solved||!draft||!Number.isInteger(draft.hour)||!Number.isInteger(draft.minute))return save;
 if(draft.hour<0||draft.hour>11||draft.minute<0||draft.minute>59)return save;
 if(previous.hour===draft.hour&&previous.minute===draft.minute)return save;
 return {...save,continuation:{...save.continuation,clock:{...previous,hour:draft.hour,minute:draft.minute}}};
}
