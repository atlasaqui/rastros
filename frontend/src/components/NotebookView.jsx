import { useCallback, useRef, useState,useEffect } from "react";
import Desktop from "./Desktop";
import BootScreen from "./BootScreen";
import RetroIcon from './RetroIcon';
import ThoughtOverlay from './ThoughtOverlay';
import GlitchTransition from './GlitchTransition';
import {acknowledgeThought} from '../systems/thoughtSystem';
import { ART } from "../data/art";
import { PUZZLES } from "../data/puzzles";
import { validateAnswer } from "../systems/puzzleSystem";
import {playSound} from '../systems/audioSystem';
import { authenticate, sceneVariant } from "../systems/narrativeSystem";
import { LCD_RECT } from "../systems/screenLayout";
import useModalFocus from "../hooks/useModalFocus";
function Login({ onLogin }) {
  const [password, setPassword] = useState(''), [error,setError]=useState('');
  return <div className="login-screen">
    <div className="login-brand">Iwakura OS<span>SISTEMA PESSOAL / 2000</span></div>
    <form className="os-panel" onSubmit={e=>{
      e.preventDefault();
      if(validateAnswer(PUZZLES.notebook_login,password)){playSound('18');onLogin();}
      else {playSound('19');setError('Senha incorreta.');}
    }}>
      <header>Iniciar sessão</header>
      <div className="login-account"><RetroIcon id="avatar" size={58}/><div><strong>Pedrosa</strong><small>Conta local</small></div></div>
      <label>Usuário<input aria-label="Usuário" value="Pedrosa" readOnly autoComplete="off"/></label>
      <label>Senha<input autoFocus type="password" aria-label="Senha do notebook" autoComplete="off" value={password} onChange={e=>{setPassword(e.target.value);setError('');}} /></label>
      <div className="login-submit"><span>Iwakura OS</span><button type="submit">Entrar</button></div>
      <div className="login-feedback" role="status">{error && <><RetroIcon id="error" size={22}/>{error}</>}</div>
    </form>
    <span className="login-footer">SESSÃO LOCAL · ACESSO RESTRITO</span>
  </div>;
}
export default function NotebookView({save, update, onExit, leaving,externalBlocked,journalControl}) {
  const modal=useRef(null), [popup,setPopup]=useState(false);
  useEffect(()=>{const observer=new MutationObserver(()=>setPopup(!!modal.current?.querySelector('.os-popup')));observer.observe(modal.current,{childList:true,subtree:true});return()=>observer.disconnect();},[]);
  const event=save.thoughtQueue?.[0],glitch=!!save.flags.loginGlitchPending;
  useModalFocus(modal, !event && !glitch && !externalBlocked);
  const variant=sceneVariant(save);
  const finish=useCallback(()=>update(s=>({...s,notebookBooted:true})),[update]);
  useEffect(()=>{if(!save.notebookBooted)playSound('12');},[save.notebookBooted]);
  const finishGlitch=useCallback(()=>update(s=>({...authenticate(s),flags:{...authenticate(s).flags,loginGlitchPending:false},narrativeStage:2})),[update]);
  const locked=!!event || glitch;
  return <div className={'notebook-overlay variant-'+variant+(leaving?' leaving':'')} data-variant={variant}>
    <div ref={modal} role="dialog" aria-modal={!locked} aria-label="Notebook" tabIndex={-1}
      className={'notebook-interactive'+(locked?' narrative-blocked':'')}
      inert={locked ? '' : undefined} aria-hidden={locked ? true : undefined}>
      <div className="notebook-art-shell">
        <img className="notebook-art" src={ART.notebookScreen[variant]} alt={'Tela frontal do notebook — '+variant}/>
        <div className="lcd frontal-lcd" style={{left:LCD_RECT.left+'%',top:LCD_RECT.top+'%',width:LCD_RECT.width+'%',height:LCD_RECT.height+'%'}}>
          {!save.notebookBooted ? <BootScreen onFinish={finish}/> : !save.notebookAuthenticated ?
            <Login onLogin={()=>{update(s=>({...s,glitchStartedAt:Date.now(),flags:{...s.flags,loginGlitchPending:true}}));}}/> : glitch ?
            <div className="login-screen" aria-hidden="true"><div className="login-brand">Iwakura OS<span>INICIANDO SESSÃO</span></div></div> : <Desktop save={save} update={update}/>}
        </div>
      </div>
      <button className="notebook-exit" onClick={onExit} disabled={leaving || locked}>Afastar-se</button>
      {!locked&&!leaving&&save.notebookBooted&&!popup&&journalControl}
    </div>
    {glitch && <GlitchTransition startedAt={save.glitchStartedAt} onFinish={finishGlitch}/>}
    {!glitch && event && <ThoughtOverlay key={event.id} event={event} onNext={()=>update(acknowledgeThought)}/>}
  </div>;
}
