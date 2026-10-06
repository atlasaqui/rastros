import RetroIcon from "./RetroIcon";
import { useState } from "react";
import WindowFrame from "./WindowFrame";
import {Messenger} from "./ContinuationApps";
import {
  DocumentsApp,
  EmailApp,
  FilesApp,
  NotesApp,
  CasesApp,
} from "./apps/InvestigationApps";
export const APPS = [
  { id: "documents", label: "Bloco de notas", icon: "▤" },
  { id: "computer", label: "Meu computador", icon: "▣" },
  { id: "files", label: "Arquivos", icon: "▱" },
  { id: "email", label: "E-mail", icon: "✉" },
  { id: "chat", label: "Mensagens", icon: "♟" },
  { id: "notes", label: "Notas", icon: "▤" },
  { id: "cases", label: "Casos", icon: "▥" },
  { id: "trash", label: "Lixeira", icon: "▧" },
];
export default function Desktop({ save, update }) {
  const [start, setStart] = useState(false);
  const windows = save.windows.filter((w) => APPS.some((a) => a.id === w.id));
  function open(id) {
    update((s) => {
      const old = s.windows.find((w) => w.id === id);
      return {
        ...s,
        windows: [
          ...s.windows.filter((w) => w.id !== id),
          old
            ? { ...old, minimized: false }
            : {
                id,
                maximized: ['files','chat'].includes(id),
                x: 14 + (s.windows.length % 3) * 3,
                y: 5 + (s.windows.length % 3) * 4,
              },
        ],
      };
    });
    setStart(false);
  }
  function change(id, patch) {
    update((s) => ({
      ...s,
      windows: s.windows.map((w) => (w.id === id ? { ...w, ...patch } : w)),
    }));
  }
  function content(id) {
    if (id === "documents")
      return (
        <DocumentsApp
          save={save}
          update={update}
          active={windows.filter((w) => !w.minimized).slice(-1)[0]?.id === id}
          onOpenFolder={() => open("files")}
        />
      );
    if (id === "chat") return <Messenger save={save} update={update} />;
    if (id === "email") return <EmailApp save={save} update={update} />;
    if (id === "files" || id === "protected")
      return (
        <FilesApp
          save={save}
          update={update}
          onDocuments={() => open("documents")}
        />
      );
    if (id === "notes") return <NotesApp save={save} update={update} />;
    if (id === "cases") return <CasesApp save={save} />;
    if (id === "trash") return <article>A lixeira está vazia.</article>;
    return (
      <div className="explorer-app">
        <div className="explorer-address">Endereço <span>Meu computador</span></div>
        <div className="explorer-body"><aside><RetroIcon id="computer" size={48}/><h3>Meu computador</h3><p>Arquivos e unidades desta sessão.</p><button onClick={()=>open('files')}>Arquivos</button><button onClick={()=>open('documents')}>Bloco de notas</button></aside>
        <div className="drive-grid"><button onClick={()=>open('files')}><RetroIcon id="disk" size={46}/><span>Disco local (C:)</span></button><div><RetroIcon id="optical" size={46}/><span>Unidade óptica (D:)</span><small>Sem disco</small></div></div></div>
      </div>
    );
  }
  return (
    <div className="desktop">
      <div className="desktop-watermark">
        Iwakura OS<span>SISTEMA PESSOAL / 2000</span>
      </div>
      <div className="desktop-icons">
        {APPS.map((a) => (
          <button
            key={a.id}
            aria-label={a.label}
            className="desktop-icon"
            onClick={() => open(a.id)}
          >
            <span className="desktop-icon-glyph">
              <RetroIcon id={a.id} />
            </span>
            <span>{a.label}</span>
          </button>
        ))}
      </div>
      {windows.map((w, i) => (
        <WindowFrame
          key={w.id}
          title={APPS.find((a) => a.id === w.id).label}
          window={w}
          zIndex={10 + i}
          onFocus={() => {
            if (i !== windows.length - 1) open(w.id);
          }}
          onChange={(patch) => change(w.id, patch)}
          onMinimize={() => change(w.id, { minimized: true })}
          onClose={() =>
            update((s) => ({
              ...s,
              windows: s.windows.filter((v) => v.id !== w.id),
            }))
          }
        >
          {content(w.id)}
        </WindowFrame>
      ))}
      {start && (
        <div className="start-menu">
          {APPS.map((a) => (
            <button key={a.id} onClick={() => open(a.id)}>
              <RetroIcon id={a.id} size={22}/> {a.label}
            </button>
          ))}
        </div>
      )}
      <div className="taskbar">
        <button className="start-button" onClick={() => setStart(!start)}>
          ▦ Início
        </button>
        <div className="task-buttons">
          {windows.map((w) => (
            <button key={w.id} onClick={() => open(w.id)}>
              {APPS.find((a) => a.id === w.id).label}
            </button>
          ))}
        </div>
        <span className="session-status">Sessão local</span>
      </div>
    </div>
  );
}
