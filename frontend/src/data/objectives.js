import { FILES } from './files.js';
// Stable order determines permanent page placement. Never include solutions here.
export const OBJECTIVES = [
  {id:'access',text:'Talvez aquele computador guarde alguma resposta.',available:s=>s.journal.collected,complete:s=>s.notebookAuthenticated},
  {id:'voices',text:'Talvez uma conversa ajude a entender o que está acontecendo.',available:s=>s.journal.collected,complete:s=>s.flags.v2Exhausted||s.flags.learnedClassCode||s.flags.bibleSeen||s.flags.explorerUnlocked||s.flags.captchaSolved||s.flags.escapeComplete||s.flags.gameComplete},
  {id:'read',text:'Preciso entender o que ficou escrito aqui.',available:s=>s.notebookAuthenticated,complete:s=>FILES.every(f=>s.readFiles[f.id])},
  {id:'locked',text:'Ainda pode haver algo entre esses arquivos.',available:s=>FILES.every(f=>s.readFiles[f.id]),complete:s=>s.flags.attemptedClassFolder},
  {id:'witness',text:'Alguém deve saber mais do que está dizendo.',available:s=>s.flags.attemptedClassFolder,complete:s=>s.flags.bibleSeen},
  {id:'security',text:'Preciso entender o que foi escondido nesses documentos.',available:s=>s.flags.bibleSeen,complete:s=>s.flags.explorerUnlocked},
  {id:'time',text:'Talvez ainda exista um instante de recomeço.',available:s=>s.flags.explorerUnlocked,complete:s=>s.flags.timeReturned},
  {id:'identity',text:'Essa verificação pode deixar de me impedir.',available:s=>s.flags.explorerUnlocked,complete:s=>s.flags.captchaSolved},
  {id:'messages',text:'Preciso ouvir o que ficou nessas conversas.',available:s=>s.flags.captchaSolved,complete:s=>s.flags.messageExitRequested||s.flags.escapeComplete},
  {id:'escape',text:'Fuja da sombra.',available:s=>s.flags.deserted||s.flags.escapeComplete,complete:s=>s.flags.escapeComplete},
  {id:'piano',text:'Reconhecer a música que ficou na memória.',available:s=>s.flags.pianoInspected,complete:s=>s.continuation.pianoSolved||s.flags.gameComplete},
];
export const JOURNAL_PAGE_SIZE=2;
