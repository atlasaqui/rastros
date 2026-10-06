import sw from "../assets/gamejam/cenários/tela branca vagão.jpg";
import sb from "../assets/gamejam/cenários/tela preta vagão.jpg";
import sr from "../assets/gamejam/cenários/tela vermelha vagão.jpg";
import nw from "../assets/gamejam/objetos/notebook branco.png";
import nb from "../assets/gamejam/objetos/notebook preto.png";
import pw from "../assets/gamejam/objetos/bloco de notas branco.png";
import pb from "../assets/gamejam/objetos/bloco de notas preto.png";
import jw from "../assets/gamejam/objetos/jornal amassado branco.png";
import jb from "../assets/gamejam/objetos/jornal amassado preto.png";
import nr from "../assets/gamejam/objetos/notebook vermelho.png";
import pr from "../assets/gamejam/objetos/bloco de notas vermelho.png";
import jr from "../assets/gamejam/objetos/jornal amassado vermelho.png";
import cw from "../assets/gamejam/objetos/relógio branco.png";
import cb from "../assets/gamejam/objetos/relógio preto.png";
import cr from "../assets/gamejam/objetos/relógio vermelho.png";
import lw from "../assets/gamejam/objetos/ponteiro grande branco.png";
import lb from "../assets/gamejam/objetos/ponteiro grande preto.png";
import lr from "../assets/gamejam/objetos/ponteiro grande vermelho.png";
import hw from "../assets/gamejam/objetos/ponteiro pequeno branco.png";
import hb from "../assets/gamejam/objetos/ponteiro pequeno preto.png";
import hr from "../assets/gamejam/objetos/ponteiro pequeno vermelho.png";
import pwiano from "../assets/gamejam/objetos/piano branco.png";
import pbiano from "../assets/gamejam/objetos/piano preto.png";
import priano from "../assets/gamejam/objetos/piano vermelho.png";
import clean from "../assets/gamejam/personagem/mão sem sangue.png";
import blood from "../assets/gamejam/personagem/mão com sangue.png";
import shadow from "../assets/gamejam/NPCs/sombra.png";
import religiousW from "../assets/gamejam/NPCs/npc dez branco.png";
import religiousB from "../assets/gamejam/NPCs/npc dez preto.png";
import religiousR from "../assets/gamejam/NPCs/npc dez vermelho.png";
import empty from "../assets/gamejam/cenários/vagão quatro alucinação.jpg";
import ciw from '../assets/gamejam/cenários/relógio vagão três branco.jpg';
import cib from '../assets/gamejam/cenários/relógio vagão três preto.jpg';
import cir from '../assets/gamejam/cenários/relógio vagão três vermelho.jpg';
import {MEDIA} from './mediaAssets';
export const ART = {
  notebookScreen: { white: sw, black: sb, red: sr },
  notebook: { white: nw, black: nb, red: nr },
  notepad: { white: pw, black: pb, red: pr },
  newspaper: { white: jw, black: jb, red: jr },
  clock:{white:cw,black:cb,red:cr},
  clockInspection:{white:ciw,black:cib,red:cir},
  longHand:{white:lw,black:lb,red:lr},
  shortHand:{white:hw,black:hb,red:hr},
  piano:{white:MEDIA['objetos/piano branco.png'],black:MEDIA['objetos/piano preto.png'],red:MEDIA['objetos/piano vermelho.png']},
  hands:{clean,blood},
  religious:{white:religiousW,black:religiousB,red:religiousR},
  shadow:{white:shadow,black:shadow,red:shadow},
  empty:{white:empty,black:empty,red:empty},
};
