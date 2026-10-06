package com.seuteam.chatgame;

import com.google.gson.Gson;
import javafx.scene.web.WebEngine;
import javafx.scene.media.AudioClip;

import java.util.List;
import java.util.Map;

/**
 * Ponte entre o Java (JavaFX WebView) e o front-end React.
 * Em vez de chamar funções JS específicas, dispara CustomEvents no window —
 * isso desacopla o Java de como o React renderiza a UI.
 *
 * Exposto ao JS via engine.getLoadWorker()... + JSObject window.bridge,
 * de forma que o React consiga chamar window.bridge.onChoice(index).
 */
public class JavaBridge {

    private final WebEngine engine;
    private final DialogueEngine dialogueEngine;
    private final Gson gson = new Gson();
    private SaveStore saveStore;
    private javafx.stage.Stage stage;
    public void setStage(javafx.stage.Stage value){stage=value;}
    public boolean isFullscreen(){return stage!=null&&stage.isFullScreen();}
    public void toggleFullscreen(){javafx.application.Platform.runLater(()->{if(stage!=null)stage.setFullScreen(!stage.isFullScreen());});}
    private final NativeAudio audio = new NativeAudio();
    public void setAudioRoot(java.nio.file.Path root){audio.setRoot(root);}
    public boolean audioPrepare(String id,String file,boolean music){return audio.prepare(id,file,music);}
    public boolean audioReady(String id){return audio.ready(id);}
    public boolean audioPlay(String id,String file,boolean music,boolean loop,double gain,int fade){return audio.play(id,file,music,loop,gain,fade);}
    public void audioStop(String id,int fade){audio.stop(id,fade);}
    public double audioPosition(String id){return audio.position(id);}
    public void audioSeek(String id,double seconds){audio.seek(id,seconds);}
    public void audioSettings(double volume,boolean mute){audio.settings(volume,mute);}
    public String audioEvents(){return gson.toJson(audio.events());}
    public void audioStopAll(){audio.stopAll();}
    public void closeAudio(){audio.close();}
    public void quitGame(){javafx.application.Platform.exit();}
    private AudioClip clockClip;
    public void playClock(double volume) {
        try {
            if (clockClip == null) clockClip = new AudioClip(JavaBridge.class.getResource("/audio/clock.wav").toExternalForm());
            clockClip.play(Math.max(0, Math.min(1, volume)));
        } catch (RuntimeException ex) { System.err.println("Clock audio unavailable: " + ex.getMessage()); }
    }
    public void setSaveStore(SaveStore store) { saveStore = store; }
    public String readSave() { return saveStore.read(); }
    public boolean writeSave(String json) { return saveStore.write(json); }

    public JavaBridge(WebEngine engine, DialogueEngine dialogueEngine) {
        this.engine = engine;
        this.dialogueEngine = dialogueEngine;
    }

    /** Chamado pelo React (window.bridge.onChoice(i)) quando o jogador escolhe uma opção. */
    public void onChoice(int index) {
        dialogueEngine.selectChoice(index);
    }

    /** Envia uma mensagem de diálogo para a UI React. */
    public void dispatchMessage(DialogueNode node) {
        String json = gson.toJson(Map.of("text", node.getText(), "delay", node.getDelay()));
        engine.executeScript("window.dispatchEvent(new CustomEvent('gameMessage', {detail: " + json + "}))");
    }

    /** Envia a lista de escolhas disponíveis para a UI React. */
    public void dispatchChoices(List<Choice> choices) {
        String json = gson.toJson(choices);
        engine.executeScript("window.dispatchEvent(new CustomEvent('gameChoices', {detail: " + json + "}))");
    }
}
