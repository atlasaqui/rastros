// A/B are asset identifiers, not musical octave names. One mapping for UI and input.
export const PIANO_KEYS=[
 ...['G4','A4','B4','C5','D5','E5','F5','G5'].map((note,i)=>({id:'A'+(i+1),note})),
 ...['G#4','A#4','C#5','D#5','F#5','G#5','A#5'].map((note,i)=>({id:'B'+(i+1),note})),
];
// Both chorus phrases supplied by the user; existing pitches, no transposition.
export const PIANO_PHRASES=[['A3','A5','A3','A2'],['A3','A5','A6','A5','A3']];
export const PIANO_SEQUENCE=PIANO_PHRASES.flat();
export function advancePiano(input,id){
 const next=[...input,id];
 // Keep a valid prefix after a mistake so the next attempt can start immediately.
 for(let length=Math.min(next.length,PIANO_SEQUENCE.length);length>0;length--){
  const suffix=next.slice(-length);if(suffix.every((key,i)=>key===PIANO_SEQUENCE[i]))return suffix;
 }
 return [];
}

export const PIANO_NOTE_IDS=Object.fromEntries(PIANO_KEYS.map(k=>[k.note,k.id]));
export const PIANO_NOTES=PIANO_SEQUENCE.map(id=>PIANO_KEYS.find(k=>k.id===id).note);

export const PIANO_NOTE_PHRASES=PIANO_PHRASES.map(phrase=>phrase.map(id=>PIANO_KEYS.find(k=>k.id===id).note));
