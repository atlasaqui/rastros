import { meets, effects } from "./flagSystem.js";
export function validateAnswer(puzzle, answer) {
  if (!puzzle || puzzle.solution == null) return false;
  const text = String(answer).trim();
  if (puzzle.type === "date")
    return (
      /^(\d{2}\/\d{2}\/\d{4}|\d{8})$/.test(text) &&
      text.replaceAll("/", "") === puzzle.solution
    );
  if (puzzle.type === "sequence")
    return JSON.stringify(answer) === JSON.stringify(puzzle.solution);
  return text.toUpperCase() === String(puzzle.solution).toUpperCase();
}
export function solvePuzzle(save, puzzle, answer) {
  if (!puzzle?.active || !meets(puzzle, save))
    return { save, error: "Este puzzle ainda não está disponível." };
  if (!validateAnswer(puzzle, answer))
    return {
      save,
      error: "Senha incorreta. Confira a pista e tente novamente.",
    };
  // Validação preparada. A narrativa termina antes de abrir a pasta.
  if (puzzle.contentPending) return { save, pending: true, error: null };
  return {
    save: {
      ...effects(save, puzzle.effects),
      solvedPuzzles: { ...save.solvedPuzzles, [puzzle.id]: true },
    },
    error: null,
  };
}
export const PHONE_KEYS = {
  2: "ABC",
  3: "DEF",
  4: "GHI",
  5: "JKL",
  6: "MNO",
  7: "PQRS",
  8: "TUV",
  9: "WXYZ",
};
export function decodeMultitap(groups) {
  return groups
    .map((group) => {
      const letters = PHONE_KEYS[group[0]];
      if (
        !letters ||
        ![...group].every((c) => c === group[0]) ||
        group.length > letters.length
      )
        return "?";
      return letters[group.length - 1];
    })
    .join("");
}
