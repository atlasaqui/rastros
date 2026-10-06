import { enqueueThought, LOGIN_THOUGHT } from "./thoughtSystem.js";
import { NPCS, thought } from "../data/npcs.js";
import { FILES } from "../data/files.js";
import { setCurrentCar } from "../save/saveSystem.js";
export function dialogue(s, id, lines, endFlags = [], after = null) {
  const index = Math.min(s.dialogueProgress[id]?.index || 0, lines.length - 1);
  return { ...s, activeDialogue: { id, lines, index, endFlags, after } };
}
export function advanceDialogue(s) {
  const d = s.activeDialogue;
  if (!d) return s;
  if (d.index < d.lines.length - 1)
    return {
      ...s,
      activeDialogue: { ...d, index: d.index + 1 },
      dialogueProgress: {
        ...s.dialogueProgress,
        [d.id]: { index: d.index + 1 },
      },
    };
  const flags = { ...s.flags };
  for (const id of d.endFlags || []) flags[id] = true;
  if(d.id==='curtain' && !s.flags.curtainExamined) flags.curtainGlitchPending=true;
  return {
    ...s,
    ...(flags.curtainGlitchPending?{glitchStartedAt:Date.now()}:{}),
    flags,
    activeDialogue: null,
    dialogueProgress: {
      ...s.dialogueProgress,
      [d.id]: { index: 0, complete: true },
    },
  };
}
export function encounter(s, id) {
  const npc = NPCS[id] || (id === "religiosa" ? {label:"Silhueta religiosa"} : null);
  if (!npc) return s;
  if (id === "religiosa") return (s.flags.attemptedClassFolder||s.flags.shadowSeen) ? dialogue(s,"bible",BIBLE_LINES,["bibleSeen"],"handsBible") : dialogue(s,"religiosa_first",RELIGIOUS_FIRST);
  if(s.currentCarId==="vagao1" && s.flags.shadowSeen) return dialogue(s,"sinners",[{speaker:"Silhueta",text:"Pecador. Pecador. Pecador..."},thought("(????)")]);
  if(s.currentCarId==="vagao2" && s.flags.shadowSeen && ["isolada1","isolada2"].includes(id)) return dialogue(s,id+"_shadow",id==="isolada1"?[{speaker:"Silhueta isolada 1",text:"Hmm? Não, não vi nada na janela."},thought("(estou aluncinando?)")]:[{speaker:"Silhueta isolada 2",text:"Do lado de fora? Estamos em um trem em movimento, como isso seria possível?"},thought("(É...isso não é possível, não é...)")]);
  if (
    ["isolada1", "isolada2"].includes(id) &&
    s.flags.inspectedPhysicalNotepad
  ) {
    const other = id === "isolada1" ? "isolada2" : "isolada1";
    const lines = [...npc.afterTable];
    const flags = ["questioned_" + id];
    if (s.flags["questioned_" + other] && !s.flags.v2Exhausted) {
      lines.push(thought("(Nada de útil por aqui)"));
      flags.push("v2Exhausted");
    }
    return dialogue(s, id + "_table", lines, flags);
  }
  const v3 = ["casal_v3", "isolada3", "isolada4"];
  if (v3.includes(id)) {
    if (v3.every((n) => s.flags["questioned_" + n]))
      return dialogue(s, "v3_exhausted", [
        thought("(não tenho nada a perguntar)"),
      ]);
    return dialogue(s, id + "_first", npc.lines, ["questioned_" + id]);
  }
  return dialogue(s, id + "_first", npc.lines);
}
export function discoverTable(s, after = null) {
  if (s.flags.inspectedPhysicalNotepad) return s;
  return dialogue(
    s,
    "table",
    [
      thought("(Quem deixaria algo tão caro exposto assim?...!)"),
      {
        speaker: "Bloco de notas",
        text: "M. Pedrosa\n04/06/2000 - motivação?",
        kind: "object",
        imageId: "notepad",
      },
      thought("..."),
      {
        speaker: "Notebook",
        text: "Uma sessão de usuário protegida por senha.",
        kind: "description",
      },
      thought(
        "(Pedrosa?....Alguém aqui sabe quem eu sou?Essa é nossa única chance... Não posso deixar que estraguem)",
      ),
    ],
    ["inspectedPhysicalNotepad"],
    after,
  );
}
export function enterCar(s, id) {
  const next = setCurrentCar(s, id);
  if (id === "vagao2" && !s.visitedCars.includes(id))
    return dialogue(next, "v2_entry", [
      thought(
        "(Agora sim, um pouco de paz, não ter que ver este maldito lugar).",
      ),
    ]);
  return next;
}
export function authenticate(s) {
  if (s.notebookAuthenticated) return s;
  return enqueueThought({
    ...s, notebookAuthenticated:true, visualState:'black',
    flags:{...s.flags, hallucinationStarted:true, hallucinationPending:false},
    solvedPuzzles:{...s.solvedPuzzles, notebook_login:true},
    appState:{...s.appState, documents:{selected:FILES[0].id,scroll:{}}},
    windows:[{id:'documents',x:14,y:5,maximized:true}]
  }, LOGIN_THOUGHT);
}
export function leaveNotebook(s) {
  let next = { ...s, resumeMode: "scene", flags: { ...s.flags } };
  if (s.flags.shadowRevealed && !s.flags.shadowSeen)
    next = dialogue(
      {...next,flags:{...next.flags,shadowRevealed:true}},
      "first_shadow", SHADOW_LINES, ["shadowSeen"]
    );
  return next;
}
export const allDocumentsRead = (s) => FILES.every((f) => s.readFiles[f.id]);
export function objective(s) {
  if (s.flags.gameComplete) return "Não há recomeço sem ela.";
  if(s.flags.pianoInspected&&!s.continuation.pianoSolved)return s.flags.scoreReviewedAfterPiano?"Tocar a música que ficou.":"Reconhecer a música que ficou na memória.";
  if (s.flags.finalRoom) return "Uma música ficou por terminar.";
  if (s.flags.captchaSolved) return "Preciso entender essas conversas.";
  if (s.flags.explorerUnlocked) return "Talvez ainda haja um recomeço.";
  if (s.flags.attemptedClassFolder)
    return "Revise os seus pecados.";
  if (s.notebookAuthenticated) return "Investigue o computador.";
  if (s.flags.readNewspaper) return "Investigue o computador.";
  if (s.flags.inspectedPhysicalNotepad)
    return "Investigue o computador.";
  return s.currentCarId === "vagao1"
    ? "Encontre um local para sentar durante a viagem."
    : "Investigue o vagão.";
}
// All three supplied wagons now have matching visual variants.
// Red has no narrative trigger yet; preview is DEV-only in SceneView/App.
export const sceneVariant = (s) =>
  s.visualState === 'red' ? 'red' :
  (s.visualState === 'black' || s.flags.hallucinationStarted) ? 'black' : 'white';

export const RELIGIOUS_FIRST=[{speaker:'Silhueta religiosa',text:'“ambos fizeram abominação; hão de morrer; o seu sangue é sobre eles”'},{speaker:'',kind:'description',text:'A silhueta lê em voz baixa para si mesma.'},thought('(Parece ocupada melhor não incomodar.)')];
export const BIBLE_LINES=[{speaker:'Silhueta religiosa',text:'Finalmente vieste assumir teus pecados e os de sua irmã.'},thought('...'),{speaker:'Silhueta religiosa',text:'Ela já está pagando o preço.'},{speaker:'',kind:'description',text:'Murilo bate a mão na mesa em uma explosão de raiva. A silhueta vira a Bíblia lentamente.'},{speaker:'Bíblia',kind:'description',text:'vais sofrer · vais sofrer · vais sofrer\n\nPedro 4:15 — Se algum de vocês sofre, que não seja como assassino, ladrão, criminoso, ou como quem se intromete em negócios alheios.'},{speaker:'Silhueta religiosa',text:'É sua vez.'}];
export const SHADOW_LINES=[thought('(...!!!)'),{speaker:'Sombra',text:'eNtão ElEs O eNtReGaRÃO...pArA sErEm pErSeGuIdOs e CoNdEnAdOs à MORTE...'},thought('(O que está acontecendo?!)'),{speaker:'',kind:'description',text:'Ao redor ninguém parece reagir.'},{speaker:'Sombra',text:'...E vOcÊS sErão OdIaDos PoR tOdAs aS NaÇÕES PoR MiNha CaUsA.'},thought('(E-eu eu preciso sair daqui)')];
export const CONFRONTATION=[thought('...Quando eu chegar em casa...'),{speaker:'',kind:'description',text:'Todos se foram.'},{speaker:'Sombra',text:'O que te espera do outro lado?'},{speaker:'Murilo',text:'Não! Não... Sai daqui'},{speaker:'Sombra',text:'Quantas chances você deu?'},{speaker:'Sombra',text:'O que te impede de cometer os mesmos erros? Quantas vidas a mais até que você mude?'},{speaker:'Murilo',text:'Não! NÃO! EU NÃO-'}];
