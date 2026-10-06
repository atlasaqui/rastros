import RetroIcon from "./components/RetroIcon";
import { CONTACTS } from "./data/contacts";
import { meets } from "./systems/flagSystem";
import { useDialogue } from "./systems/useDialogue";
import { displayMessage } from "./systems/dialogueSystem";
import TypingIndicator from "./components/TypingIndicator";
import { useState } from "react";
function Conversation({ actor, save, update }) {
  const d = useDialogue(actor, save, update);
  const [draft, setDraft] = useState(""),
    [feedback, setFeedback] = useState("");
  function submit(e) {
    e.preventDefault();
    const choice = d.choices.find(
      (c) => c.text.toLowerCase() === draft.trim().toLowerCase(),
    );
    if (choice && !d.pending) {
      d.select(choice);
      setDraft("");
      setFeedback("");
    } else
      setFeedback(
        "Use uma das respostas disponíveis para continuar a investigação.",
      );
  }
  return (
    <div className="conversation">
      <div className="messenger-toolbar">
        Para: <b>{actor.label}</b> • {actor.status}
      </div>
      <div className="message-history">
        {d.messages.map((m) => {
          const text = displayMessage(m, d.now);
          return text === null ? null : (
            <p key={m.id}>
              <small>
                {new Date(m.at).toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
              </small>
              <b className={m.sender === "Você" ? "sent" : ""}>
                {m.sender} diz:
              </b>
              <br />
              {text}
            </p>
          );
        })}
      </div>
      {d.pending && <TypingIndicator name={actor.label} />}
      <div className="message-compose">
        <label>Respostas disponíveis</label>
        {!d.pending &&
          d.choices.map((c) => (
            <button
              key={c.text}
              onClick={() => {
                d.select(c);
                setFeedback("");
              }}
            >
              {c.text} ↵
            </button>
          ))}
        {!d.pending && !d.choices.length && <p>Nenhuma resposta pendente.</p>}
        <form onSubmit={submit}>
          <input
            aria-label="Mensagem"
            placeholder="Digite uma resposta disponível"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          <button disabled={d.pending || !draft.trim()} type="submit">
            Enviar
          </button>
        </form>
        {feedback && <small role="status">{feedback}</small>}
      </div>
    </div>
  );
}
export default function ChatApp({ save, update }) {
  const contacts = Object.values(CONTACTS).filter((c) => meets(c, save));
  const actor =
    contacts.find((c) => c.id === save.activeContact) || contacts[0];
  if (!actor)
    return (
      <div className="messenger messenger-empty">
        <aside><header><RetroIcon id="messengerUser" size={46}/><b>Usuário</b><small>Sessão local</small></header><div className="contact-group">CONTATOS (0)</div><p>Nenhum contato disponível.</p></aside>
        <div className="messenger-welcome"><RetroIcon id="chat" size={64}/><h3>Mensagens</h3><p>Nenhuma conversa disponível.</p><span>Iwakura Messenger</span></div>
      </div>
    );
  return (
    <div className="messenger">
      <aside>
        <header>
          Conexão pessoal
          <br />
          <b>Você • Online</b>
        </header>
        <small>CONTATOS ({contacts.length})</small>
        {contacts.map((c) => (
          <button
            key={c.id}
            className={actor.id === c.id ? "selected" : ""}
            onClick={() => update((s) => ({ ...s, activeContact: c.id }))}
          >
            <i className={"status " + c.status} />
            <span>
              {c.label}
              <small>{c.status}</small>
            </span>
          </button>
        ))}
      </aside>
      <Conversation key={actor.id} actor={actor} save={save} update={update} />
    </div>
  );
}
