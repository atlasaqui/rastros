import {playSound} from '../../systems/audioSystem';
import {SchoolExplorer} from "../ContinuationApps";
import RetroIcon from "../RetroIcon";
import OsPopup from "../OsPopup";
import {readDocument, attemptFolder} from "../../systems/thoughtSystem";
import { useState, useLayoutEffect, useRef } from "react";
import { FILES, FOLDERS } from "../../data/files";
import { PUZZLES } from "../../data/puzzles";
import { validateAnswer } from "../../systems/puzzleSystem";
import { allDocumentsRead } from "../../systems/narrativeSystem";
import {unlockArchives} from '../../systems/visualTransitionSystem';
export function EmailApp() {
  return (
    <article>
      <h3>Caixa de entrada</h3>
      <p>Nenhuma mensagem.</p>
    </article>
  );
}
export function DocumentsApp({ save, update, active, onOpenFolder }) {
  const state = save.appState.documents || {},
    file = FILES.find((f) => f.id === state.selected) || FILES[0],
    index = FILES.indexOf(file);
  const area = useRef(null),
    [atEnd, setAtEnd] = useState(false);
  useLayoutEffect(() => {
    const el = area.current;
    el.scrollTop = state.scroll?.[file.id] || 0;
    const measure = () =>
      setAtEnd(el.scrollTop + el.clientHeight >= el.scrollHeight - 8);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [file.id, active]);
  function select(id) {
    update((s) => ({
      ...s,
      appState: {
        ...s.appState,
        documents: { ...s.appState.documents, selected: id },
      },
    }));
  }
  function mark() {
    if (active && atEnd)
      update((s) => readDocument(s, file.id));
  }
  return (
    <div className="script-documents">
      <div className="document-tabs">
        {FILES.map((f, i) => (
          <button
            key={f.id}
            disabled={i > 0 && !save.readFiles[FILES[i - 1].id]}
            aria-pressed={file.id === f.id}
            onClick={() => select(f.id)}
          >
            {f.title}
            {save.readFiles[f.id] ? " ✓" : ""}
          </button>
        ))}
      </div>
      <h3>{file.title}</h3>
      <div
        ref={area}
        className="script-text"
        tabIndex={0}
        aria-label={"Conteúdo de " + file.title}
        onScroll={(e) => {
          const el = e.currentTarget;
          setAtEnd(el.scrollTop + el.clientHeight >= el.scrollHeight - 8);
          const top = el.scrollTop;
          update((s) => ({
            ...s,
            appState: {
              ...s.appState,
              documents: {
                ...s.appState.documents,
                scroll: { ...s.appState.documents?.scroll, [file.id]: top },
              },
            },
          }));
        }}
      >
        {file.body}
      </div>
      <div className="document-controls">
        {!save.readFiles[file.id] ? (
          <button
            disabled={!atEnd || !active || !save.flags.loginThoughtSeen}
            onClick={mark}
          >
            {atEnd ? "Concluir leitura" : "Role até o fim para concluir"}
          </button>
        ) : index < FILES.length - 1 ? (
          <button onClick={() => select(FILES[index + 1].id)}>
            Próximo arquivo →
          </button>
        ) : (
          <button onClick={onOpenFolder}>Explorar pasta de arquivos →</button>
        )}
        <small>
          {index + 1} / {FILES.length}
        </small>
      </div>
    </div>
  );
}
export function FilesApp({ save, update, onDocuments }) {
  const [password, setPassword] = useState(""),
    [result, setResult] = useState("");
  if (save.flags.explorerUnlocked) return <SchoolExplorer save={save} update={update}/>;
  if (!allDocumentsRead(save))
    return (
      <article>
        <h3>Documentos</h3>
        <p>Continue a leitura das entradas do bloco de notas.</p>
        <button onClick={onDocuments}>Abrir bloco de notas</button>
      </article>
    );
  if (!save.flags.attemptedClassFolder)
    return (
      <article>
        <h3>Arquivos</h3>
        <button
          className="file-row"
          aria-label="Explorador de arquivos · acesso restrito"
          onClick={() => update(attemptFolder)}
        >
          <RetroIcon id="locked" /> {FOLDERS[0].title} · protegida
        </button>
      </article>
    );
  return (
    <form
      className="password-dialog"
      onSubmit={(e) => {
        e.preventDefault();
          if (!password.trim()) return;
          update(s=>({...s,flags:{...s.flags,classPasswordSubmitted:true}}));
         if(validateAnswer(PUZZLES.class_folder,password)){playSound('18');update(unlockArchives);}else playSound('19');
        setResult(
          validateAnswer(PUZZLES.class_folder, password)
            ? "Acesso autorizado."
            : "Senha incorreta. Confira a pista e tente novamente.",
        );
      }}
    >
      <div className="protected-heading"><RetroIcon id="locked" size={38} /><h3>Pasta de arquivos</h3></div>
      <p>Revise os seus pecados</p>
      <label>
        Senha
        <input
          aria-label="Senha da pasta"
          placeholder="_ _ _"
          maxLength={3}
          autoComplete="off"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <button type="submit">Verificar senha</button>
      {result && <OsPopup text={result} success={result.startsWith('Acesso autorizado')} onClose={()=>setResult('')}/>}
      
    </form>
  );
}
export function NotesApp({ save, update }) {
  return (
    <div className="notes-app">
      <label htmlFor="notes">Anotações pessoais — salvas automaticamente</label>
      <textarea
        id="notes"
        value={save.notes}
        placeholder="Anote suas pistas aqui..."
        onChange={(e) => {
          const value = e.target.value;
          update((s) => ({ ...s, notes: value }));
        }}
      />
    </div>
  );
}
export function CasesApp({ save }) {
  return (
    <article>
      <h3>Pistas encontradas</h3>
      <ul>
        {save.flags.inspectedPhysicalNotepad && (
          <li>M. Pedrosa · 04/06/2000 - motivação?</li>
        )}
        {save.flags.readNewspaper && (
          <li>Jornal Vila Nova · 24/10/2000 · mortes no início de junho.</li>
        )}
        {save.flags.attemptedClassFolder && (
          <li>Pasta: A turma do colégio dela.</li>
        )}
        {save.flags.learnedClassCode && <li>Turma: 77E.</li>}
      </ul>
    </article>
  );
}
