// Bridge legada preservada. O vertical slice usa systems/dialogueSystem como autoridade.
export function sendChoice(index) {
  window.bridge?.onChoice(index);
}
function listen(name, callback) {
  const handler = (e) => callback(e.detail);
  window.addEventListener(name, handler);
  return () => window.removeEventListener(name, handler);
}
export const onGameMessage = (callback) => listen("gameMessage", callback);
export const onGameChoices = (callback) => listen("gameChoices", callback);
