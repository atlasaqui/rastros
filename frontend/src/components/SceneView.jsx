import TablePickupPatch from './TablePickupPatch';
import {ART} from "../data/art";
import cleanWhiteCar from "../assets/gamejam/cenários/vagão dois branco relógio.jpg";
import { useState, useEffect } from "react";
import { sceneVariant, objective } from "../systems/narrativeSystem";
export const DEBUG_HOTSPOTS =
  import.meta.env.DEV &&
  new URLSearchParams(location.search).get("debugHotspots") === "1";
export default function SceneView({ scene, save, stage, blocked, onHotspot }) {
  const [loadedBackground,setLoadedBackground]=useState(null);
  const background=scene.backgrounds[sceneVariant(save)];
  const [prompt, setPrompt] = useState("");
  const [hintPosition,setHintPosition]=useState({left:"50%",top:"80%"});
  function hint(h){
    setPrompt((h.type==='npc'?'Conversar · ':'')+h.label);
    let left=h.x>55?h.x-2:h.x+h.w+2,top=h.y+h.h+2,transform=h.x>55?'translateX(-100%)':'none',maxWidth='min(300px,32vw)';
    if(h.type==='npc'){
      top=Math.max(5,h.y-11);
      if(h.x<30){left=2;transform='none';maxWidth='min(230px,28vw)';}
      else if(h.x<50){left=52;top=h.y+2;transform='none';}
      else{left=Math.min(96,h.x+h.w);transform='translateX(-100%)';}
    }
    if(h.type==='door'){left=52;top=h.y;transform='none';}
    setHintPosition({left:Math.max(2,Math.min(96,left))+"%",top:Math.max(5,Math.min(85,top))+"%",transform,maxWidth});
  }
  useEffect(() => setPrompt(""), [scene.id, stage]);
  return (
    <div
      className={
        "scene-view" +
        (["notebook", "leaveNotebook"].includes(stage)
          ? " notebook-background"
          : "")
      }
      data-car={scene.id}
      data-variant={sceneVariant(save)}
    >
      <div
        className={
          "scene-image-wrap " +
          (stage === "focusNotebook" ? "focus-notebook" : "")
        }
      >
        <img
          className="scene-image"
          style={save.flags.deserted&&!save.flags.finalRoom?{filter:"grayscale(1)"}:undefined}
          key={background}
          src={background}
          onLoad={()=>setLoadedBackground(background)}
          alt={scene.label + " — interior do trem, desenho em traços"}
        />
        {/* Replace only the original curtains, whose white artwork contains a baked-in shadow. */}
        {scene.id==="vagao2"&&!save.flags.deserted&&sceneVariant(save)==="white"&&<img className="scene-image clean-window" src={cleanWhiteCar} style={{position:"absolute",inset:0,clipPath:"inset(0 0 0 80%)"}} alt="" aria-hidden="true"/>}
        {scene.id==='vagao2'&&!save.flags.deserted&&save.journal?.collected&&loadedBackground===background&&<TablePickupPatch variant={sceneVariant(save)}/>}
        {scene.id==="vagao2"&&!save.flags.deserted&&(save.flags.shadowRevealed||save.flags.shadowSeen)&&!save.flags.curtainExamined&&<img className={"scene-sprite shadow-visible"+(save.activeDialogue?.id==="first_shadow"&&save.activeDialogue.index===0?" shadow-scare":"")} style={{inset:0,width:"100%",height:"100%"}} src={ART.shadow[sceneVariant(save)]} alt="Sombra atrás da cortina"/>}
        {scene.id==="vagao2"&&!save.flags.deserted&&save.flags.shadowSeen&&<button className="scene-hotspot" aria-label="Examinar vulto" onMouseEnter={()=>hint({type:"curtain",label:"Examinar vulto",x:83,y:11,w:16,h:55})} onMouseLeave={()=>setPrompt("")} onFocus={()=>hint({type:"curtain",label:"Examinar vulto",x:83,y:11,w:16,h:55})} onBlur={()=>setPrompt("")} disabled={blocked||stage!=="scene"} style={{left:"83%",top:"11%",width:"16%",height:"55%"}} onClick={()=>onHotspot({type:"curtain"})}/>}
        {scene.hotspots.filter(h=>!(h.objectId==='notepad'&&save.journal?.collected)).map((h) => (
          <button
            key={h.id}
            aria-label={h.objectId==='notepad'&&save.journal?.collected?'Consultar bloco recolhido':h.label}
            disabled={stage !== "scene" || blocked}
            className={
              "scene-hotspot hotspot-" +
              h.type +
              (DEBUG_HOTSPOTS ? " debug" : "")
            }
            data-cursor={h.type==="inspect"?"grab":"point"}
            style={{
              left: h.x + "%",
              top: h.y + "%",
              width: h.w + "%",
              height: h.h + "%",
            }}
            onMouseEnter={() => hint(h)}
            onMouseLeave={() => setPrompt("")}
            onFocus={() => hint(h)}
            onBlur={() => setPrompt("")}
            onClick={() => onHotspot(h)}
          >
            <span className="hotspot-corners" aria-hidden="true"/>{DEBUG_HOTSPOTS && h.id}
          </button>
        ))}
        {prompt&&stage==="scene"&&!blocked&&<div className="interaction-prompt" style={hintPosition}>{prompt}</div>}
      </div>
      {<div className="scene-caption">
        <small>OBJETIVO</small><span>{objective(save)}</span>
      </div>}
      {stage === "scene" && <div className="scene-location" aria-label="Localização atual">{scene.label}</div>}
      {scene.previous && stage === "scene" && !save.flags.finalRoom && (
        <button
          className="scene-back"
          disabled={blocked}
          onClick={() => onHotspot({ type: "door", targetCar: scene.previous })}
        >
          ← Voltar ao {scene.previous.replace("vagao", "Vagão ")}
        </button>
      )}

    </div>
  );
}
