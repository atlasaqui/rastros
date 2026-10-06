import { useRef, useState } from "react";
import useModalFocus from "../hooks/useModalFocus";
import {getSoundSettings,setSoundSettings} from '../systems/audioSystem';
export default function MainMenu({
  onContinue,
  onNewGame,
  canContinue,
  legacy,
}) {
  const [confirm, setConfirm] = useState(false),
    modal = useRef(null);
  const [soundOpen,setSoundOpen]=useState(false),[sound,setSound]=useState(getSoundSettings);
  function adjustSound(patch){const next={...sound,...patch};setSound(next);setSoundSettings(next);}
  useModalFocus(modal, confirm);
  return (
    <main className="main-menu">
      <div className="menu-sound"><button onClick={()=>setSoundOpen(!soundOpen)} aria-expanded={soundOpen}>Som</button>{soundOpen&&<section><label>Volume do jogo<input type="range" aria-label="Volume do jogo" min="0" max="1" step="0.05" value={sound.volume} onChange={e=>adjustSound({volume:Number(e.target.value)})}/></label><label><input type="checkbox" checked={sound.muted} onChange={e=>adjustSound({muted:e.target.checked})}/> Sem som</label></section>}</div>
      <div className="menu-art" aria-hidden="true" />
      <div className="menu-copy">
        <p className="eyebrow">UMA VIAGEM SEM RECOMEÇO</p>
        <h1>
          Rastros<span aria-hidden="true">.</span>
        </h1>
        <div className="menu-rule" aria-hidden="true" />
        <p className="menu-subtitle">O que esperar de um recomeço?</p>
        <nav className="menu-actions" aria-label="Menu principal">
          <button
            aria-label="Continuar viagem"
            disabled={!canContinue}
            onClick={onContinue}
          >
            <span className="action-index" aria-hidden="true">
              01
            </span>
            <span>Continuar viagem</span>
            <span aria-hidden="true">↗</span>
          </button>
          <button
            aria-label="Novo jogo"
            onClick={() => (canContinue ? setConfirm(true) : onNewGame())}
          >
            <span className="action-index" aria-hidden="true">
              02
            </span>
            <span>Novo jogo</span>
            <span aria-hidden="true">→</span>
          </button>
        </nav>
        {legacy && !canContinue && (
          <p className="legacy-notice">
            O save da versão demonstrativa foi preservado. Comece esta história
            em Novo jogo.
          </p>
        )}
        <p className="menu-save">
          <span aria-hidden="true">○</span>{" "}
          {canContinue
            ? "Progresso salvo. Sua viagem continua."
            : "O progresso é salvo automaticamente."}
        </p>
      </div>
      <footer className="menu-footer">
        <span>
          Explore com o mouse ou <kbd>Tab</kbd> + <kbd>Enter</kbd>
        </span>
        <span>
          <kbd>E</kbd> Notebook <i /> <kbd>Esc</kbd> Voltar
        </span>
      </footer>
      {confirm && (
        <div
          className="confirm-overlay"
          onKeyDown={(e) => {
            if (e.key === "Escape") setConfirm(false);
          }}
        >
          <section
            ref={modal}
            className="confirm-box"
            role="dialog"
            aria-modal="true"
            aria-labelledby="new-game-title"
            tabIndex={-1}
          >
            <p className="eyebrow">NOVO JOGO</p>
            <h2 id="new-game-title">Recomeçar a viagem?</h2>
            <p>
              O progresso desta história será substituído por uma nova partida.
            </p>
            <div className="confirm-actions">
              <button autoFocus onClick={() => setConfirm(false)}>
                Manter progresso
              </button>
              <button onClick={onNewGame}>Começar de novo →</button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
