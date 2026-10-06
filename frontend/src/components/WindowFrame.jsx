import RetroIcon from "./RetroIcon";
import { useRef, useLayoutEffect, useState } from "react";
import { clampWindow } from "../systems/screenLayout";
export default function WindowFrame({
  title,
  children,
  window: win,
  onChange,
  onClose,
  onFocus,
  onMinimize,
  zIndex,
}) {
  const drag = useRef(null),
    frame = useRef(null);
  const [areaSize, setAreaSize] = useState({ width: 800, height: 450 });
  useLayoutEffect(() => {
    const area = frame.current.closest(".desktop");
    const measure = () =>
      setAreaSize({ width: area.clientWidth, height: area.clientHeight });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(area);
    return () => observer.disconnect();
  }, []);
  const [preview,setPreview]=useState(null);
  const position = preview || clampWindow(win, areaSize.width, areaSize.height);
  function finishDrag(){if(preview)onChange(preview);drag.current=null;setPreview(null);}
  return (
    <section
      ref={frame}
      role="dialog"
      aria-label={title}
      className={"win-window " + (win.maximized ? "maximized" : "")}
      style={{
        left: win.maximized ? 0 : position.x + "%",
        top: win.maximized ? 0 : position.y + "%",
        zIndex,
        display: win.minimized ? "none" : undefined,
      }}
      onPointerDown={onFocus}
      onFocusCapture={onFocus}
    >
      <div
        className="win-titlebar"
        onPointerDown={(e) => {
          if (e.target.closest("button") || win.maximized) return;
          const area = e.currentTarget
            .closest(".desktop")
            .getBoundingClientRect();
          drag.current = {
            x: e.clientX,
            y: e.clientY,
            left: position.x,
            top: position.y,
            w: area.width,
            h: area.height,
          };
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (!drag.current) return;
          const d = drag.current;
          setPreview(
            clampWindow(
              {
                x: d.left + ((e.clientX - d.x) / d.w) * 100,
                y: d.top + ((e.clientY - d.y) / d.h) * 100,
              },
              d.w,
              d.h,
            ),
          );
        }}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
      >
        <span>{title}</span>
        <button aria-label={"Minimizar " + title} onClick={onMinimize}>
          <RetroIcon id="minimize" size={20}/>
        </button>
        <button
          aria-label={(win.maximized ? "Restaurar " : "Maximizar ") + title}
          onClick={() => onChange({ maximized: !win.maximized })}
        >
          <RetroIcon id={win.maximized ? "restore" : "maximize"} size={20}/>
        </button>
        <button aria-label={"Fechar " + title} onClick={onClose}>
          <RetroIcon id="close" size={20}/>
        </button>
      </div>
      <div className="win-menubar">Iwakura OS / {title}</div>
      <div className="win-content">{children}</div>
      <div className="win-status">Iwakura OS • Ambiente pessoal</div>
    </section>
  );
}
