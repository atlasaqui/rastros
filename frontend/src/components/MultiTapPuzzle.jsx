import { useState, useEffect, useRef } from "react";
import { PHONE_KEYS, decodeMultitap } from "../systems/puzzleSystem";
// TODO NARRATIVE / ART: componente preparado, não conectado ao roteiro; falta wallpaper/pista final.
export default function MultiTapPuzzle({ onSolved, delay = 1200 }) {
  const [groups, setGroups] = useState([]),
    [pending, setPending] = useState(""),
    [message, setMessage] = useState("");
  const timer = useRef(null);
  function confirm() {
    if (pending) {
      setGroups((g) => [...g, pending]);
      setPending("");
    }
  }
  function tap(key) {
    if (!PHONE_KEYS[key]) return;
    setMessage("");
    if (pending && pending[0] !== key) {
      setGroups((g) => [...g, pending]);
      setPending(key);
    } else
      setPending((p) => (p.length >= PHONE_KEYS[key].length ? "" : p) + key);
  }
  useEffect(() => {
    clearTimeout(timer.current);
    if (pending) timer.current = setTimeout(confirm, delay);
    return () => clearTimeout(timer.current);
  }, [pending, delay]);
  const letters = decodeMultitap([...groups, ...(pending ? [pending] : [])]);
  return (
    <div
      className="multitap-puzzle"
      onKeyDown={(e) => {
        if (PHONE_KEYS[e.key]) {
          e.preventDefault();
          tap(e.key);
        }
      }}
    >
      <p>Teclado de múltiplos toques</p>
      <output aria-label="Palavra formada">{letters || "____"}</output>
      <div>
        {Object.entries(PHONE_KEYS).map(([key, text]) => (
          <button key={key} onClick={() => tap(key)}>
            {key} {text}
          </button>
        ))}
      </div>
      <button onClick={confirm}>Confirmar letra</button>
      <button
        onClick={() => {
          if (pending) setPending((p) => p.slice(0, -1));
          else setGroups((g) => g.slice(0, -1));
        }}
      >
        Apagar
      </button>
      <button
        onClick={() => {
          setGroups([]);
          setPending("");
          setMessage("");
        }}
      >
        Reiniciar
      </button>
      <button
        onClick={() => {
          const all = [...groups, ...(pending ? [pending] : [])];
          if (
            decodeMultitap(all) === "FIXO" &&
            all.join("") === "33344499666"
          ) {
            setMessage("Correto.");
            onSolved?.();
          } else setMessage("Sequência incorreta.");
        }}
      >
        Verificar
      </button>
      <p role="status">{message}</p>
    </div>
  );
}
