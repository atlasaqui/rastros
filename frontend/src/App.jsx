import ArrivalVision from './components/ArrivalVision';
import {gameKey} from './systems/keyboardSystem';
import PauseMenu from './components/PauseMenu';
import EndingCinematic from './components/EndingCinematic';
import TimedIntro from './components/TimedIntro';

import {installInterfaceAudio,applySettings,menuMusic,stageMusic,playSound,endingMusic,prepareAudio} from './systems/audioSystem';
import ClockPuzzle from "./components/ClockPuzzle";
import {finishVisualGlitch} from './systems/visualTransitionSystem';
import SoundWarning from './components/SoundWarning';
import HandsVision from "./components/HandsVision";
import EscapeGame from "./components/EscapeGame";
import PianoPuzzle from "./components/PianoPuzzle";
import GlitchTransition from "./components/GlitchTransition";
import {retryEscape,finishEscape,canLeaveForConfrontation,checkpointExit} from "./systems/continuationSystem";
import {CONFRONTATION,SHADOW_LINES} from "./systems/narrativeSystem";
import { ART } from "./data/art";
import { OS_SPRITES } from "./data/osAssets";
import ObjectNotice from "./components/ObjectNotice";
import ObjectInspection from './components/ObjectInspection';
import Journal,{JournalGlyph} from './components/Journal';
import {syncJournal,collectJournal,openJournal,journalUnread} from './systems/journalSystem';
import { useEffect, useState, useCallback,useRef } from "react";
import MainMenu from "./components/MainMenu";
import SceneView from "./components/SceneView";
import NpcDialogueOverlay from "./components/NpcDialogueOverlay";
import NotebookView from "./components/NotebookView";
import { SCENES } from "./data/scenes";
import { OBJECTS } from "./data/files";
import { thought } from "./data/npcs";
import {
  freshSave,
  loadSave,
  writeSave,
  hasLegacySave,
} from "./save/saveSystem";
import {
  dialogue,
  advanceDialogue,
  encounter,
  discoverTable,
  enterCar,
  leaveNotebook,
  sceneVariant,
} from "./systems/narrativeSystem";
export default function App() {
  const [save, setSave] = useState(loadSave),
    [stage, setStage] = useState("warning"),
    [dialogueOpen, setDialogueOpen] = useState(false),
    [notice, setNotice] = useState(null),
    [saveError, setSaveError] = useState(false),
    [destination, setDestination] = useState(null),
    [journalOpen,setJournalOpen]=useState(false),
    [collectOffer,setCollectOffer]=useState(null),
    [worldModal,setWorldModal]=useState(null),
    [paused,setPaused]=useState(false);
  const latestSave=useRef(save);latestSave.current=save;
  useEffect(()=>{
    const flush=()=>{
      if(!latestSave.current)return true;
      const detail={transforms:[]};window.dispatchEvent(new CustomEvent('rastros:flush',{detail}));
      const current=detail.transforms.reduce((s,fn)=>fn(s),latestSave.current);
      const ok=writeSave(current);setSaveError(!ok);return ok;
    };
    window.rastrosSaveNow=flush;
    window.addEventListener('pagehide',flush);
    return()=>{delete window.rastrosSaveNow;window.removeEventListener('pagehide',flush);};
  },[]);
  const update = useCallback((fn) => setSave(s=>syncJournal(typeof fn==='function'?fn(s):fn)), []);
  const returnFromEnding=useCallback(()=>{setWorldModal(null);setDialogueOpen(false);setStage('menu');},[]);
  const acceptWarning=useCallback(()=>setStage('menu'),[]);
  const finishIntro=useCallback(()=>{update(s=>({...s,resumeMode:'scene',narrativeStage:1,activeDialogue:null}));setStage('scene');setDialogueOpen(false);},[update]);
  useEffect(()=>{applySettings();prepareAudio(['6','4','22','23','24','25','26','27','28','31','glitch-1-2','glitch-2-3','glitch-3-4','glitch-4-5']);return installInterfaceAudio();},[]);
  useEffect(()=>{if(stage==='menu')menuMusic();else if(worldModal!=='piano'&&!['warning','intro','chase'].includes(stage)&&save&&!save.flags.loginGlitchPending&&!save.flags.archivesGlitchPending&&!save.flags.curtainGlitchPending&&!save.flags.redGlitchPending){if(!save.flags.gameComplete&&!save.flags.pianoEndingPending)stageMusic(save.narrativeStage===4?3:(save.narrativeStage||1));}},[stage,worldModal,save?.narrativeStage,save?.flags.gameComplete,save?.flags.pianoEndingPending]);
  const closeJournal=useCallback(()=>setJournalOpen(false),[]);
  const finishWorldGlitch=useCallback(()=>{const kind=worldModal;if(kind==='archivesGlitch')playSound('6',{gain:.7});update(s=>finishVisualGlitch(s,kind));setWorldModal(null);if(kind==='archivesGlitch'){setStage('scene');setDialogueOpen(true);}},[worldModal,update]);
  useEffect(()=>{if(!save||['warning','menu'].includes(stage)||worldModal)return;
    if(save.flags.archivesGlitchPending)setWorldModal('archivesGlitch');
    else if(save.flags.curtainGlitchPending&&!save.activeDialogue)setWorldModal('curtainGlitch');
    else if(save.flags.redGlitchPending)setWorldModal('redGlitch');
  },[stage,worldModal,save?.flags.archivesGlitchPending,save?.flags.curtainGlitchPending,save?.flags.redGlitchPending,save?.activeDialogue]);
  const finishClock=useCallback(()=>{setWorldModal(null);update(s=>dialogue(s,'clock_return',[thought('(Um click. Os ponteiros não se movem mais.)')]));setDialogueOpen(true);},[update]);
  const journalKnown=useRef(save?.journal?.known?.join(',')||'');
  useEffect(()=>{const next=save?.journal?.known?.join(',')||'';if(save?.journal?.collected&&next!==journalKnown.current)playSound('14');journalKnown.current=next;},[save?.journal?.known?.join(',')]);
  const wasJournalOpen=useRef(false);
  useEffect(()=>{if(!journalOpen&&wasJournalOpen.current)document.querySelector('.journal-access')?.focus();wasJournalOpen.current=journalOpen;},[journalOpen]);
  function showJournal(){playSound('13');update(openJournal);setJournalOpen(true);}
  function finishCollection(take){if(take)update(collectJournal);const after=collectOffer?.after;setCollectOffer(null);if(after==='notebook')setStage('focusNotebook');}
  useEffect(() => {
    if (save) setSaveError(!writeSave(save));
  }, [save]);
  // Load the current setting only. Decoding every 4K scene and object at launch
  // retained hundreds of MB before those images were ever shown.
  useEffect(()=>{
    if(!save)return;
    const scene=SCENES[save.currentCarId];
    const image=new Image();image.src=scene.backgrounds[sceneVariant(save)];
  },[save?.currentCarId,save?.visualState]);
  useEffect(() => {
    if (!["focusNotebook", "leaveNotebook", "travel"].includes(stage)) return;
    const timer = setTimeout(
      () => {
        if (stage === "focusNotebook") {
          update((s) => ({ ...s, resumeMode: "notebook" }));
          setStage("notebook");
        } else if (stage === "leaveNotebook") {
          update((s) => leaveNotebook(s));
          setDialogueOpen(true);
          setStage("scene");
        } else {
          update((s) => enterCar(s, destination));
          setDialogueOpen(true);
          setStage("scene");
        }
      },
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? 0
        : stage === "travel"
          ? 650
          : 260,
    );
    return () => clearTimeout(timer);
  }, [stage, destination, update]);
  const exit = useCallback(() => {
    if (journalOpen || stage !== "notebook" || save?.thoughtQueue?.length || document.querySelector(".glitch-transition")) return;
    if(canLeaveForConfrontation(save))update(checkpointExit);
    else setStage("leaveNotebook");
  }, [stage, save,journalOpen,update]);
  function closeNotice() {
    if(notice?.next==="piano")setWorldModal("piano");
    if (notice?.imageId === 'newspaper') update(s=>({...s,flags:{...s.flags,readNewspaper:true}}));
    setNotice(null);
  }
  const arriving = stage==='scene'&&save?.flags.escapeComplete&&save?.flags.finalRoom&&!save?.flags.arrivalVisionSeen&&!save?.flags.pianoEndingPending&&!save?.flags.gameComplete;
  const blocked = arriving || paused || !!worldModal || journalOpen || !!collectOffer || !!notice || (dialogueOpen && !!save?.activeDialogue);
  function openNotebook() {
    if (!save.flags.inspectedPhysicalNotepad) {
      update((s) => discoverTable(s, "notebook"));
      setDialogueOpen(true);
    } else setStage("focusNotebook");
  }
  useEffect(() => {
    function key(e) {
      const pressed=gameKey(e);
      if(paused||arriving)return;
      if(journalOpen||worldModal)return;
      if(collectOffer){if(pressed==='escape')finishCollection(false);return;}
      if (pressed === "escape") {
        if (notice) closeNotice();
        else if (dialogueOpen) setDialogueOpen(false);
        else if(stage==="notebook"&&!save?.thoughtQueue?.length&&!document.querySelector(".glitch-transition"))setPaused(true);
        else if(stage==="scene")setPaused(true);
      } else if (
        pressed === "e" &&
        stage === "scene" &&
        !blocked &&
        save?.currentCarId === "vagao2"
      )
        openNotebook();
    }
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  });
  function hotspot(h) {
    if (stage !== "scene" || blocked) return;
    if(h.type==='returnComputer'){update(s=>({...s,currentCarId:'vagao2',resumeMode:'notebook',flags:{...s.flags,finalRoom:false,messageExitRequested:false,deserted:false},windows:[{id:'chat',x:0,y:0,maximized:true}]}));setStage('notebook');return;}
    if (h.type === "computer") openNotebook();
    if (h.type === "npc") {
      update((s) => encounter(s, h.npcId));
      setDialogueOpen(true);
    }
    if (h.type === "seat") {
      update((s) =>
        dialogue(
          { ...s, flags: { ...s.flags, seatExamined: true } },
          s.flags.seatExamined ? "seat_again" : "seat",
          [
            thought(
              s.flags.seatExamined
                ? "Quantas chances levam até a segunda que muda tudo?"
                : "(Eu não quero olhar para essa cidade mais uma vez sequer).",
            ),
          ],
        ),
      );
      setDialogueOpen(true);
    }
    if (h.type === "clock") setWorldModal("clock");
    if (h.type === "piano") {update(s=>({...s,flags:{...s.flags,pianoInspected:true}}));setNotice({title:"Teclado",body:"(Eu acho que já vi isso em algum lugar.)",imageId:"piano",next:"piano"});}
    if (h.type === "curtain") {
      update(s=>s.flags.shadowSeen ? dialogue(s,"curtain",[{speaker:"",kind:"description",text:"Murilo olha novamente para o vulto. Mas não há nada ali."},thought("(c-como?)")],["curtainExamined"]) : dialogue(s,"first_shadow",SHADOW_LINES,["shadowSeen"]));
      setDialogueOpen(true);
    }
    if (h.type === "door") {
      if(save.flags.shadowRevealed&&!save.flags.shadowSeen){update(s=>dialogue(s,"first_shadow",SHADOW_LINES,["shadowSeen"],"travel:"+h.targetCar));setDialogueOpen(true);return;}
      playSound('5');setDestination(h.targetCar);
      setStage("travel");
    }
    if (h.type === "inspect") {
      if(h.objectId==='notepad'&&save.journal.collected){showJournal();}
      else if(h.objectId==='notepad'&&save.flags.inspectedPhysicalNotepad){setCollectOffer({after:null});}
      else if (h.objectId === "notepad" && !save.flags.inspectedPhysicalNotepad) {
        update((s) => discoverTable(s));
        setDialogueOpen(true);
      } else {
        setNotice(OBJECTS[h.objectId]);

      }
    }
  }
  function nextDialogue() {
    const d = save.activeDialogue,
      done = d.index === d.lines.length - 1;
    update(advanceDialogue);
    if (done) {
      setDialogueOpen(false);
      if(d.after==="handsBible"){setWorldModal("handsBible");}
      else if(d.after==="handsEscape"){setWorldModal("handsEscape");}
      else if(d.after?.startsWith("travel:")){setDestination(d.after.slice(7));setStage("travel");}
      else if(d.id==='table'&&!save.journal.collected)setCollectOffer({after:d.after});
      else if (d.after === "notebook") setStage("focusNotebook");
    }
  }
  useEffect(()=>{
    if(!save||["menu","warning"].includes(stage))return;
    if(stage==="notebook"&&save.flags.messageExitRequested&&canLeaveForConfrontation(save)){
      update(s=>dialogue({...s,resumeMode:"scene",currentCarId:"vagao2",thoughtQueue:[],seenThoughts:{...s.seenThoughts,messages_end:true},flags:{...s.flags,deserted:true,retryPending:false}},"confrontation",s.seenThoughts.messages_end?CONFRONTATION:[thought("...Quando eu chegar em casa..."),...CONFRONTATION],["confrontationComplete"],"handsEscape"));setDialogueOpen(true);setStage("scene");
    }
    if(stage==="scene"&&!save.activeDialogue&&!worldModal){
      if(save.flags.clockTransitionPending)setWorldModal("clock");
      else if(save.flags.bibleSeen&&!save.flags.handsBibleSeen)setWorldModal("handsBible");
      else if(save.flags.confrontationComplete&&!save.flags.escapeComplete)setWorldModal("handsEscape");
    }
  },[stage,save?.flags.messageExitRequested,save?.flags.clockTransitionPending,save?.flags.pianoEndingPending,save?.flags.bibleSeen,save?.flags.handsBibleSeen,save?.flags.confrontationComplete,save?.activeDialogue,worldModal,update]);
  const checkpointChase=useCallback(snapshot=>update(s=>s?.resumeMode==='chase'?{...s,chase:snapshot}:s),[update]);
  function backToMenu(){setPaused(false);setJournalOpen(false);setNotice(null);setDialogueOpen(false);setStage('menu');}
  const pauseControl=paused?<PauseMenu onResume={()=>setPaused(false)} onMenu={backToMenu}/>:null;
  if(stage==='chase')return <main className="game chase-shell" data-theme="red"><EscapeGame snapshot={save.chase} onCheckpoint={checkpointChase} paused={paused} onPause={()=>setPaused(true)} onCaught={()=>{update(retryEscape);setPaused(false);setStage('notebook');}} onComplete={()=>{update(finishEscape);setStage('scene');setWorldModal('redGlitch');}}/>{pauseControl}</main>;
  if (stage === "warning") return <SoundWarning onAccept={acceptWarning}/>;
  if (stage === "menu")
    return (
      <MainMenu
        canContinue={!!save}
        legacy={hasLegacySave()}
        onContinue={() => {
          setPaused(save.resumeMode==="chase");
          setStage(save.resumeMode==="final"?"scene":save.resumeMode);
          setDialogueOpen(true);
        }}
        onNewGame={() => {
          setSave({ ...freshSave(), resumeMode: "intro" });
          setStage("intro");
          setNotice(null);
          setDialogueOpen(false);
          setJournalOpen(false);setCollectOffer(null);
        }}
      />
    );
  if (stage === "intro")
    return <main className="game" data-theme="white"><SceneView scene={SCENES.vagao1} save={save} stage="intro" blocked onHotspot={()=>{}}/><TimedIntro save={save} update={update} onFinish={finishIntro}/></main>;
  if(stage==='scene'&&(save.flags.pianoEndingPending||save.flags.gameComplete))return <main className='game cinematic-game' data-theme='red'><EndingCinematic save={save} update={update} onMenu={returnFromEnding}/></main>;
  const previewVariant = import.meta.env.DEV && new URLSearchParams(location.search).get('previewVariant');
  const visualSave = ['white','black','red'].includes(previewVariant) ? {...save, visualState:previewVariant, flags:{...save.flags,hallucinationStarted:previewVariant!=='white'}} : save;
  const journalControl=save.journal.collected?<button className="journal-access" aria-label="Abrir bloco de notas" onClick={showJournal}><JournalGlyph/><span>Bloco de notas{journalUnread(save.journal)&&<small>Nova anotação ·</small>}</span></button>:null;
  return (
    <main className="game" data-theme={sceneVariant(visualSave)} data-glitch={worldModal||undefined}>
      <div className="game-layer" inert={arriving||paused||journalOpen||worldModal?'':undefined} aria-hidden={arriving||paused||journalOpen||worldModal?true:undefined}>
      <SceneView
        scene={save.flags.finalRoom?SCENES.vagao4:save.flags.deserted?{...SCENES.vagao2,backgrounds:ART.empty,hotspots:[]}:SCENES[save.currentCarId]}
        save={visualSave}
        stage={stage}
        blocked={blocked}
        onHotspot={hotspot}
      />
      {stage === "travel" && (
        <div className="travel-fade" aria-label="Transição entre vagões" />
      )}
      {stage === "scene" && !blocked && (
        <nav className="world-actions">
          {save.activeDialogue && !dialogueOpen && (
            <button onClick={() => setDialogueOpen(true)}>
              Retomar diálogo
            </button>
          )}
          {save.flags.escapeComplete&&!save.flags.finalRoom&&<button onClick={()=>{update(s=>({...s,currentCarId:"vagao4",resumeMode:"final",flags:{...s.flags,finalRoom:true}}));setStage("scene");}}>Voltar ao Vagão 4</button>}
        </nav>
      )}
      {dialogueOpen && save.activeDialogue && stage === "scene" && (
        <NpcDialogueOverlay
          save={save}
          onNext={nextDialogue}
          onClose={() => setDialogueOpen(false)}
        />
      )}
      {["notebook", "leaveNotebook"].includes(stage) && (
        <NotebookView
          save={visualSave}
          update={update}
          onExit={exit}
          leaving={stage === "leaveNotebook"}
          externalBlocked={journalOpen||paused}
          journalControl={journalControl}
        />
      )}
      {stage==='scene'&&(!blocked||journalOpen)&&journalControl}
      {collectOffer&&<ObjectInspection imageId="notepad" title="Bloco de notas" text="Posso levar estas páginas comigo." variant={sceneVariant(visualSave)} nextLabel="Recolher bloco de notas" onNext={()=>finishCollection(true)} onClose={()=>finishCollection(false)}/>}
      {notice && (
        <ObjectNotice
          notice={notice}
          variant={sceneVariant(visualSave)}
          onClose={closeNotice}
        />
      )}
      {saveError && (
        <div role="alert" className="save-error">
          Não foi possível gravar o progresso. Verifique o espaço livre e a permissão de escrita.
        </div>
      )}
      </div>
      {worldModal==="clock"&&<ClockPuzzle save={save} update={update} onClose={()=>setWorldModal(null)} onSolved={finishClock}/>}
      {["handsBible","handsEscape"].includes(worldModal)&&<HandsVision save={save} update={update} beforeEscape={worldModal==="handsEscape"} onFinish={()=>{if(worldModal==="handsEscape"){update(s=>({...s,resumeMode:"chase"}));setStage("chase");}else update(s=>({...s,flags:{...s.flags,handsBibleSeen:true}}));setWorldModal(null);}}/>}
      {["archivesGlitch","curtainGlitch","redGlitch"].includes(worldModal)&&<GlitchTransition startedAt={save.glitchStartedAt} kind={worldModal} onFinish={finishWorldGlitch}/>}
      {worldModal==="piano"&&<PianoPuzzle save={save} update={update} onClose={()=>setWorldModal(null)}/>}


      {journalOpen&&<Journal save={save} update={update} onClose={closeJournal}/>}
      {arriving&&!worldModal&&!save.flags.redGlitchPending&&<ArrivalVision save={save} update={update}/>}
      {pauseControl}
    </main>
  );
}




