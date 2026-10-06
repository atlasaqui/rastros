export const ENDING_DURATION=137;
export const CREDITS=[['Narrativa','Amanda Queiroz'],['Arte 2D','Luana Meneghini'],['Game Design e Sound Design','Matheus Medeiros'],['Programação e UX Design','Victor Monteiro']];
export const FINAL_CARDS=[['Sombra','O que você viu quando chegou em casa?'],['Murilo','Ela estava no céu... balançando...'],['Murilo','Logo acima do piano...'],['Murilo','Não consegui ver a sua apresentação...'],['Sombra','Não há recomeço sem ela'],['Murilo','Não há recomeço sem ela']];
export const ENDING_TIMES={pianoFade:1.5,cardFade:.35,cardHold:2,dialogueEnd:17.7,creditsStart:19.7,creditHold:4,creditsEnd:38.5,continueAt:ENDING_DURATION};
const clamp=x=>Math.max(0,Math.min(1,x));
function envelope(t,fade,hold){return Math.min(clamp(t/fade),clamp((2*fade+hold-t)/fade));}
export function endingFrame(seconds){
 const t=Math.max(0,Math.min(ENDING_DURATION,seconds)),c=ENDING_TIMES;
 if(t<c.pianoFade)return {phase:'pianoFade',opacity:1-t/c.pianoFade};
 if(t<c.dialogueEnd){const p=t-c.pianoFade,index=Math.min(5,Math.floor((p+1e-7)/2.7));return {phase:'dialogue',index,speaker:FINAL_CARDS[index][0],text:FINAL_CARDS[index][1],opacity:envelope(p-index*2.7,.35,2)};}
 if(t<c.creditsStart)return {phase:'silence',opacity:0};
 if(t<c.creditsEnd){const p=t-c.creditsStart,index=Math.min(3,Math.floor((p+1e-7)/4.7));return {phase:'credit',index,role:CREDITS[index][0],name:CREDITS[index][1],opacity:envelope(p-index*4.7,.35,4)};}
 return {phase:'credits',opacity:1,canContinue:t>=c.continueAt};
}
export function beginEnding(s){return {...s,resumeMode:'final',ending:{version:2,position:0,phase:'pianoFade'},continuation:{...s.continuation,pianoSolved:true},flags:{...s.flags,pianoEndingPending:true,endingReturnedToMenu:false}};}
export function checkpointEnding(s,position){const t=Math.max(0,Math.min(ENDING_DURATION,position));return {...s,ending:{version:2,position:t,phase:endingFrame(t).phase},flags:{...s.flags,...(t>=ENDING_TIMES.creditsStart?{gameComplete:true}:{})}};}
export function completeEnding(s){return {...checkpointEnding(s,ENDING_DURATION),activeDialogue:null,thoughtQueue:[],resumeMode:'final',flags:{...s.flags,gameComplete:true,pianoEndingPending:false,endingReturnedToMenu:true}};}
