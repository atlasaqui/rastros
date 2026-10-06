// Roteiro GJ, páginas 1–8. IDs narrativos independem dos nomes dos sprites.
const thought = (text) => ({ speaker: "Murilo", text, kind: "thought" });
const said = (speaker, text) => ({ speaker, text });
export const NPCS = {
  casal_v1: {
    label: "Casal de passageiros",
    lines: [
      said(
        "Silhueta de um casal",
        "Também está se mudando?Compreensível,depois de tudo o que aconteceu na cidade... Não poderiamos criar nossa filha aqui.",
      ),
      thought("(Não há nada para mim neste lugar.)"),
    ],
  },
  suspeita: {
    label: "Silhueta junto à porta",
    lines: [
      said(
        "Silhueta suspeita",
        "Viu alguém da pólicia por aqui?Não... está tudo bem. Há um computador só no outro vagão... Está lá a um tempo, com tudo que vem acontecendo quem se importaria se ele sumir não é?",
      ),
      thought("(O que determina quem merece ser punido?)"),
    ],
  },
  isolada1: {
    label: "Passageiro à esquerda",
    lines: [
      said(
        "Silhueta isolada 1",
        "É terrivel todas essas mortes em tão pouco tempo... Imagina que vim passar as férias aqui e tudo isso acontece?",
      ),
      thought("(Pessoas morrem e o que te preocupa é com tuas férias...)"),
    ],
    afterTable: [
      said(
        "Silhueta isolada 1",
        "Não, cheguei aqui a pouco, não sei de quem são as coisas na mesa.",
      ),
    ],
  },
  isolada2: {
    label: "Passageiro à direita",
    lines: [
      said(
        "Silhueta isolada 2",
        "Eu conhecia algumas das vítimas, de ínicio achei que fosse um justiceiro, algumas mereceram....Isto foi meio errado, esquece.",
      ),
      thought("(...)"),
    ],
    afterTable: [
      said(
        "Silhueta isolada 2",
        "Até tentei usar, mas tinha senha, não faço ideia a quem pertença.",
      ),
    ],
  },
  casal_v3: {
    label: "Passageiros enlutados",
    lines: [
      {
        speaker: "",
        kind: "description",
        text: "As silhuetas abafam o própio choro.",
      },
      said(
        "Silhuetas tristes",
        "Foram tão cedo...Por que...? Meu filho não merecia isso.",
      ),
      thought("(o quão longe eles iriam para proteger ele?)"),
    ],
    final: [
      said(
        "Silhuetas tristes",
        "Como? Sim... era o nosso menininho...Quem? Sua irmã?Meus pêsames.Por mais que queira que peguem esse monstro, não aguentamos mais essa cidade, as lembranças.A turma? 77E, Por que?Entendo, obrigada, mas agora nos deixe só... falar sobre é muito difícil.",
      ),
    ],
  },
  isolada3: {
    label: "Passageiro em primeiro plano, à esquerda",
    lines: [
      said("Silhueta isolada 3", "Te conheço? Não, não sei nada sobre isso."),
    ],
  },
  isolada4: {
    label: "Passageiro ao fundo, à direita",
    lines: [
      {
        speaker: "",
        kind: "description",
        text: "O homen o olha de cima a baixo.",
      },
      said(
        "Silhueta isolada 4",
        "Não sei do que esta falando...Recomendo que pare de incomodar, quero viajar em paz.",
      ),
      thought("(talvez seja ele que esteja investigando...)"),
    ],
  },
};
export { thought };
