import { useEffect, useState } from "react";
import { currentNode, enterNode, choose } from "./dialogueSystem";
import { meets } from "./flagSystem";
export function useDialogue(actor, save, update) {
  const [now, setNow] = useState(Date.now());
  const id = currentNode(save, actor),
    node = actor.nodes[id];
  useEffect(() => {
    update((s) => enterNode(s, actor));
    const timer = setInterval(() => setNow(Date.now()), 200);
    return () => clearInterval(timer);
  }, [actor.id, id]);
  const messages = save.conversations[actor.id] || [];
  const pending = messages.some((m) => m.at > now);
  useEffect(() => {
    if (!node.autoNext || pending || !messages.length) return;
    const due =
      Math.max(...messages.map((m) => m.at)) + (node.after_ms || 1000);
    const timer = setTimeout(
      () => update((s) => enterNode(s, actor, node.autoNext)),
      Math.max(0, due - Date.now()),
    );
    return () => clearTimeout(timer);
  }, [actor.id, id, pending, messages.length]);
  return {
    node,
    messages,
    now,
    pending,
    choices: (node.choices || []).filter((c) => meets(c, save)),
    select: (c) => update((s) => choose(s, actor, c)),
  };
}
