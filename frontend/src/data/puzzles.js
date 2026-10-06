import {PIANO} from './continuation.js';
export const PUZZLES = {
  notebook_login: {
    id: "notebook_login",
    type: "date",
    solution: "04062000",
    active: true,
  },
  class_folder: {
    id: "class_folder",
    type: "password",
    solution: "415",
    active: true,
    contentPending: false,
  },
  // TODO NARRATIVE / ART: segunda etapa confirmada; faltam encaixe, pista e wallpaper final.
  fixo: {
    id: "fixo",
    type: "multitap",
    solution: "33344499666",
    word: "FIXO",
    active: false,
    priority: 3,
  },
  safe: {
    id: "safe",
    active: false,
    priority: 3,
    type: "password",
    solution: null,
  },
  piano: {
    id: "piano",
    active: true,
    priority: 3,
    type: "sequence",
    solution: PIANO.notes,
  },
  clock: {
    id: "clock",
    active: true,
    priority: 2,
    type: "clock",
    solution: {hour:0,minute:14},
  },
  memory: {id:"memory",active:true,type:"pairs",pairs:4},
  alchemy: {
    id: "alchemy",
    active: false,
    priority: 0,
    type: "recipe",
    solution: null,
  },
  hangman: {
    id: "hangman",
    active: false,
    priority: 0,
    type: "word",
    solution: null,
  },
};
