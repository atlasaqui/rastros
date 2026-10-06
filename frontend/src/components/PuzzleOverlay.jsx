import { useState, useRef, useEffect } from "react";
import { solvePuzzle } from "../systems/puzzleSystem";
// Sequência reutilizável. TODO ART: teclado diagramático, sem arte final.
export default function PuzzleOverlay({ puzzle, save, update, onClose }) {
  const [answer, setAnswer] = useState([]),
    [error, setError] = useState("");
  const audio = useRef(null);
  useEffect(
    () => () => {
      audio.current?.close();
    },
    [],
  );
  function note(key) {
    const next = [...answer, key];
    setAnswer(next);
    const Audio = window.AudioContext || window.webkitAudioContext;
    if (Audio) {
      audio.current ||= new Audio();
      audio.current.resume();
      const oscillator = audio.current.createOscillator(),
        gain = audio.current.createGain();
      oscillator.frequency.value = {
        C: 261.63,
        D: 293.66,
        E: 329.63,
        F: 349.23,
        G: 392,
        A: 440,
        B: 493.88,
      }[key];
      gain.gain.setValueAtTime(0.12, audio.current.currentTime);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        audio.current.currentTime + 0.3,
      );
      oscillator.connect(gain);
      gain.connect(audio.current.destination);
      oscillator.start();
      oscillator.stop(audio.current.currentTime + 0.3);
    }
    if (next.length === puzzle.solution.length) {
      const result = solvePuzzle(save, puzzle, next);
      setError(
        result.error
          ? "Sequência incorreta. Tente novamente."
          : "Sequência resolvida.",
      );
      if (!result.error) update(() => result.save);
      setAnswer([]);
    }
  }
  return (
    <div className="notice-overlay">
      <section role="dialog" aria-label="Puzzle de sequência">
        <h2>{puzzle.title || "Sequência sonora"}</h2>
        <p>{puzzle.hint || "Reproduza a sequência indicada pelas pistas."}</p>
        <div>
          {["C", "D", "E", "F", "G", "A", "B"].map((key) => (
            <button key={key} onClick={() => note(key)}>
              {key}
            </button>
          ))}
        </div>
        <p>{answer.join(" · ")}</p>
        <p role="status">{error}</p>
        <button onClick={onClose}>Voltar ao vagão</button>
      </section>
    </div>
  );
}
