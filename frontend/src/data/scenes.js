import v1r from "../assets/gamejam/cenários/vagão um vermelho.jpg";
import v1w from "../assets/gamejam/cenários/vagão um branco.jpg";
import v1b from "../assets/gamejam/cenários/vagão um preto.jpg";
import v2r from "../assets/gamejam/cenários/vagão dois vermelho.jpg";
import v2w from "../assets/gamejam/cenários/vagão dois branco.jpg";
import v2b from "../assets/gamejam/cenários/vagão dois preto.jpg";
import v3r from "../assets/gamejam/cenários/vagão três vermelho.jpg";
import v3w from "../assets/gamejam/cenários/vagão três branco.jpg";
import v3b from "../assets/gamejam/cenários/vagão três preto.jpg";
export const FIRST_SCENE_ID = "vagao1";
const npc = (id, npcId, label, x, y, w, h) => ({
  id,
  type: "npc",
  npcId,
  label,
  x,
  y,
  w,
  h,
});
const door = (targetCar) => ({
  id: "porta",
  type: "door",
  targetCar,
  label: "Ir ao " + targetCar.replace("vagao", "Vagão "),
  x: 35.5,
  y: 29,
  w: 5,
  h: 23,
});
// Coordenadas percentuais do canvas 3840×2160. JPGs já compostos, sem duplicar PNGs.
// O interlocutor à mesa representa as silhuetas tristes; isolada3 está em primeiro plano à esquerda.
import {MEDIA} from './mediaAssets';
export const SCENES = {
  vagao4:{id:'vagao4',label:'Vagão 4',backgrounds:{white:MEDIA['cenários/vagão quatro alucinação.jpg'],black:MEDIA['cenários/vagão quatro alucinação.jpg'],red:MEDIA['cenários/vagão quatro alucinação.jpg']},hotspots:[{id:'piano',type:'piano',label:'Examinar teclado',x:26,y:77,w:12,h:21},{id:'computerReturn',type:'returnComputer',label:'Voltar ao computador · procurar partitura',x:36,y:30,w:5,h:24}]},
  vagao1: {
    id: "vagao1",
    label: "Vagão 1",
    backgrounds: { white: v1w, black: v1b, red: v1r },
    hotspots: [
      npc("casal_a", "casal_v1", "Casal de passageiros", 19.5, 33, 9, 38),
      npc("casal_b", "casal_v1", "Outro passageiro do casal", 6.5, 29, 5.5, 12),
      npc("religiosa","religiosa","Silhueta lendo a Bíblia",62,38,22,54),
      npc("suspeita", "suspeita", "Silhueta junto à porta", 36.5, 31.5, 5, 26),
      {
        id: "assento",
        type: "seat",
        label: "Examinar assento",
        x: 1,
        y: 54,
        w: 15,
        h: 42,
      },
      { ...door("vagao2"), x: 34.5, y: 27, w: 8, h: 6 },
    ],
  },
  vagao2: {
    id: "vagao2",
    label: "Vagão 2",
    previous: "vagao1",
    backgrounds: { white: v2w, black: v2b, red: v2r },
    hotspots: [
      npc("isolada1", "isolada1", "Passageiro à esquerda", 21, 34, 4.5, 6),
      npc("isolada2", "isolada2", "Passageiro à direita", 54, 34, 5, 6),
      {
        id: "notebook",
        type: "computer",
        label: "Usar notebook",
        x: 67.5,
        y: 48,
        w: 18,
        h: 30,
      },
      {
        id: "notepad",
        type: "inspect",
        objectId: "notepad",
        label: "Examinar bloco de notas",
        x: 85,
        y: 66,
        w: 6,
        h: 11,
      },
      door("vagao3"),
    ],
  },
  vagao3: {
    id: "vagao3",
    label: "Vagão 3",
    previous: "vagao2",
    backgrounds: { white: v3w, black: v3b, red: v3r },
    hotspots: [
      {id:"clock",type:"clock",label:"Examinar relógio",x:35.2,y:21,w:6,h:8},
      npc("enlutados", "casal_v3", "Passageiros enlutados", 53, 42, 20, 22),
      npc(
        "isolada3",
        "isolada3",
        "Passageiro em primeiro plano, à esquerda",
        0,
        27,
        11,
        69,
      ),
      npc(
        "isolada4",
        "isolada4",
        "Passageiro ao fundo, à direita",
        66,
        26,
        9,
        13,
      ),
      // TODO ART: jornal está sobre a mesa na arte recebida; roteiro o situa no chão.
      {
        id: "newspaper",
        type: "inspect",
        objectId: "newspaper",
        label: "Examinar jornal",
        x: 76,
        y: 61,
        w: 15,
        h: 18,
      },
    ],
  },
};
