import { effects, meets } from "./flagSystem.js";
export function currentNode(save, actor) {
  const id = save.dialogueProgress[actor.id];
  return actor.nodes[id] ? id : actor.startNode;
}
export function enterNode(
  save,
  actor,
  id = currentNode(save, actor),
  now = Date.now(),
) {
  const key = actor.id + ":" + id;
  if ((save.conversations[actor.id] || []).some((m) => m.nodeKey === key))
    return save.dialogueProgress[actor.id] === id
      ? save
      : {
          ...save,
          dialogueProgress: { ...save.dialogueProgress, [actor.id]: id },
        };
  const node = actor.nodes[id];
  let elapsed = node.fake_typing || 0;
  const messages = (node.messages || [{ text: node.text || "", delay: 0 }]).map(
    (m, i) => {
      elapsed += m.delay || 0;
      return {
        ...m,
        id: key + ":" + i,
        nodeKey: key,
        sender: actor.label,
        at: now + elapsed,
      };
    },
  );
  return {
    ...effects(save, node.effects),
    dialogueProgress: { ...save.dialogueProgress, [actor.id]: id },
    conversations: {
      ...save.conversations,
      [actor.id]: [...(save.conversations[actor.id] || []), ...messages],
    },
  };
}
export function choose(save, actor, choice, now = Date.now()) {
  if (!meets(choice, save)) return save;
  let next = effects(save, choice);
  next = {
    ...next,
    choices: [...next.choices, { actor: actor.id, text: choice.text, at: now }],
    conversations: {
      ...next.conversations,
      [actor.id]: [
        ...(next.conversations[actor.id] || []),
        {
          id: actor.id + ":choice:" + next.choices.length,
          text: choice.text,
          sender: "Você",
          at: now,
        },
      ],
    },
  };
  return enterNode(
    {
      ...next,
      dialogueProgress: {
        ...next.dialogueProgress,
        [actor.id]: choice.next || actor.startNode,
      },
    },
    actor,
    choice.next || actor.startNode,
    now + (actor.status ? 650 : 0),
  );
}
export function displayMessage(message, now) {
  if (now < message.at) return null;
  if (
    message.deleted_after_ms != null &&
    now >= message.at + message.deleted_after_ms
  )
    return "Esta mensagem foi apagada.";
  if (message.self_edit && now >= message.at + message.self_edit.after_ms)
    return message.self_edit.text;
  return message.text;
}
