import {PIANO_NOTES,PIANO_NOTE_PHRASES} from './piano.js';
// Canonical narrative: complete 17-page screenplay. Provisional additions are marked.
export const SCHOOL_FILES = [
 {id:'guardian',title:'Declaração de guardião legal.pdf',reaction:'(Para ter um arquivo assim, é alguém do governo?)',body:'Renata Pedrosa, identidade xxxx-xxx-x, filha de Priscila Pedrosa e Gerâncio Pedrosa, identidades xxxx-xxx-x. A responsabilidade por seu zelo físico, mental, social e educacional é transferida a seu irmão Murilo Pedrosa, identidade xxxx-xxx-x.'},
 {id:'enrollment',title:'Matrícula escolar — Renata Pedrosa.pdf',reaction:'(o que....O que isso significa...Por que querem esses documentos?!...)',body:'Renata Pedrosa\nMatrícula: 9º ano, turma A.\n\nAnotação à margem:\n00:14 — um minuto antes de não haver recomeço.'},
 // Fictional supplementary timetable presentation approved in the UI revision prompt.
 {id:'scheduleA',title:'Horário escolar 9ºA',reaction:'(...)',body:'Horários de início, fim de aulas e intervalos da turma do 9ºA.\nA folha reúne a rotina escolar de Renata.'},
 {id:'scheduleB',title:'Horário escolar 9ºB',reaction:'(Não faz sentido...)',body:'Horários de início, fim de aulas e intervalos da turma do 9ºB.'},
 {id:'warning',title:'Advertência Escolar(4).pdf',body:'Renata Pedrosa\n\nAdvertências por comportamento considerado inapropriado com amigas no banheiro feminino e por brigas com colegas de outra turma.\n\nO colégio declara ser uma instituição que visa pelos valores familiares e divinos.'},
];
export const CHATS = [
 {id:'gerancio',name:'Gerâncio',lines:[['Gerâncio','Tu deshonra tua familia quando defende pecadoras. Se torna um deles ao protege-la do castigo divino. Afasta-te e serás poupado.'],['Murilo','Não te pouparei.']]},
 {id:'priscila',name:'Priscila',lines:[['Priscila','Oro por vocês todos os dias. Que ilumnine seus pensamentos, que vocês possam ver com clareza e voltem para casa.'],['Murilo','Meus pensamentos não poderiam estar mais claros.'],['Priscila','Só desejamos o melhor para você e para Renata.'],['Murilo','Desejo o mesmo.']]},
 {id:'tata',name:'Tata',lines:[['','Uma imagem de partitura foi enviada.'],['Murilo','Parece que alguém esqueceu a partitura para o ensaio.'],['Renata','Ah! Me distrai, com tudo que veem acontecendo.'],['Murilo','Está tudo bem certo? Não tem mais ninguém te incomodando né?'],['Renata','Não, é só...triste.'],['Murilo','É trágico, mas ao menos mereceram.'],['Renata','Como pode achar isso, eles não eram bons comigo, mas não mereciam morrer. Acho que todos merecem uma segunda chance, um recomeço.'],['Murilo','Quantas vezes te machucaram por ser quem é? Quantas vezes mais teriam que te ferir para ser a segunda?'],['Renata','...Você realmente acredita nisso? Quando eu chegar em casa a gente se fala.']]},
];
export const GALLERY = [
 ['Dois meninos empurram uma menina. Os adolescentes parecem pertencer ao mesmo colégio.','Registro 01'],
 ['Eles puxam o cabelo da menina.','Registro 02'],
 ['Eles viram um balde de água sobre ela. No canto da imagem: “pagarão”.','Registro 03'],
 ['Parte de uma partitura.','Partitura'],
];
// Approved phrase is defined once in piano.js and shared with the score and puzzle.
export const PIANO = {notes:PIANO_NOTES,phrases:PIANO_NOTE_PHRASES,duration:420};
export const ESCAPE_LINES = [
 ['Sombra','O que ela achou do que você fez?'],
 ['Murilo','Ela- NÃO, nós discutimos mas...'],
 ['Sombra','O que você viu quando chego em casa?'],
 ['Murilo','EU NUNCA A MACHUCARIA.'],
 ['Sombra','Mas e ela? A culpa, o peso de todas aquelas vidas em seu nome....'],
 ['Murilo','Não......'],
 ['Murilo','NÃO!!!'],
];
export const ENDING = [
 ['Sombra','O que você viu quando chegou em casa?'],
 ['Murilo','Ela estava no ceu...balançando...Logo acima do piano...Não consegui ver a sua apresentação...'],
 ['Sombra','Não há recomeço sem ela'],
 ['Murilo','Não há recomeço sem ela'],
];
