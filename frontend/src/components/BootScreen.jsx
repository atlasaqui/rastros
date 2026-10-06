import { useEffect, useState } from "react";
export default function BootScreen({ onFinish }) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const timer = setInterval(() => {
      const p = Math.min(100, (Date.now() - start) / 24);
      setProgress(p);
      if (p === 100) {
        clearInterval(timer);
        onFinish();
      }
    }, 80);
    return () => clearInterval(timer);
  }, [onFinish]);
  return (
    <div className="boot-screen" aria-label="Inicializando notebook">
      <small>PORTABLE SYSTEMS • BIOS 2.03</small>
      <h2>
        Iwakura OS <sup>2000</sup>
      </h2>
      <p>
        Memória 128 MB ... OK
        <br />
        Disco local ... OK
      </p>
      <div className="boot-bar-track">
        <div style={{ width: progress + "%" }} />
      </div>
      <p>Inicializando ambiente pessoal...</p>
    </div>
  );
}
