import {playSound} from '../systems/audioSystem';
import ObjectInspection from "./ObjectInspection";
import { useEffect, useRef } from "react";
import useModalFocus from "../hooks/useModalFocus";
import { ART } from "../data/art";
import { sceneVariant } from "../systems/narrativeSystem";
export default function NpcDialogueOverlay({ save, onNext, onClose }) {
  const d = save.activeDialogue,
    next = useRef(null),
    modal = useRef(null);
  useModalFocus(modal, !d?.lines[d.index]?.imageId);
  useEffect(() => {
    next.current?.focus();
  }, [d.id, d.index]);
  useEffect(()=>{const line=d?.lines[d.index];if(!line||!line.speaker)return;playSound(line.kind==='thought'||line.speaker==='Murilo'?'9':'npc-'+(1+[...String(line.speaker)].reduce((n,c)=>n+c.charCodeAt(0),0)%3),{gain:.4});},[d?.id,d?.index]);
  if (!d) return null;
  const line = d.lines[d.index];
  if(line.imageId) return <ObjectInspection imageId={line.imageId} title={line.speaker} text={line.text}
    variant={sceneVariant(save)} onNext={onNext} onClose={onClose}
    nextLabel={d.index < d.lines.length-1 ? 'Continuar' : 'Voltar'}/>;
  return (
    <div className="npc-overlay" role="presentation">
      {line.imageId && (
        <img
          className="dialogue-object-art"
          src={ART[line.imageId][sceneVariant(save)]}
          alt="Bloco de notas sobre a mesa"
        />
      )}
      <section
        ref={modal}
        tabIndex={-1}
        className={"npc-overlay-box " + (line.kind || "speech")}
        role="dialog"
        aria-modal="true"
        aria-label={line.speaker || "Descrição"}
      >
        <header>
          <span>
            {line.speaker || "Descrição"}
            {line.kind === "thought" ? " · pensamento" : ""}
          </span>
          <button aria-label="Fechar diálogo" onClick={onClose}>
            ×
          </button>
        </header>
        <p key={d.id + d.index}>{line.text}</p>
        <div className="npc-overlay-choices">
          <button ref={next} onClick={onNext}>
            {d.index < d.lines.length - 1 ? "Continuar" : "Voltar"}
          </button>
        </div>
      </section>
    </div>
  );
}
