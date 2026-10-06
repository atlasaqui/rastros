package com.seuteam.chatgame;

import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.web.WebEngine;
import javafx.scene.web.WebView;
import javafx.stage.Stage;
import netscape.javascript.JSObject;

import java.io.File;
import java.nio.file.Path;

/**
 * Ponto de entrada JavaFX. Carrega o build do React
 * (src/main/resources/web/index.html) dentro do WebView
 * e expõe o JavaBridge como window.bridge no JS.
 *
 * Esqueleto mínimo — ajuste conforme sua aplicação real
 * (tamanho de janela, título, etc.).
 */
public class Main extends Application {
    static boolean packaged() { return Boolean.getBoolean("rastros.packaged"); }
    static Path appDirectory() {
        try { return Path.of(Main.class.getProtectionDomain().getCodeSource().getLocation().toURI()).getParent(); }
        catch (Exception e) { throw new IllegalStateException("Não foi possível localizar os arquivos de Rastros", e); }
    }
    static Path smokeScript() {
        return packaged() ? appDirectory().resolve("tests/webview-smoke.js") : Path.of("frontend/tests/webview-smoke.js");
    }
    static Path smokeOutput() {
        return packaged() ? appDirectory().resolve("test-results") : Path.of("frontend/test-results");
    }
    // Referência forte: objetos expostos ao JS não podem depender apenas de variável local.
    private JavaBridge bridge;

    @Override
    public void start(Stage stage) {
        WebView webView = new WebView();
        webView.setContextMenuEnabled(false);
        webView.addEventFilter(javafx.scene.input.KeyEvent.KEY_PRESSED, e -> {
            if (e.getCode() == javafx.scene.input.KeyCode.F5 || ((e.isControlDown() || e.isMetaDown()) && e.getCode() == javafx.scene.input.KeyCode.R)) e.consume();
        });
        WebEngine engine = webView.getEngine();
        boolean resumeTest = getParameters().getRaw().contains("--smoke-resume");
        boolean smoke = getParameters().getRaw().contains("--smoke") || resumeTest;
        engine.setConfirmHandler(message -> {
            if (smoke) return true;
            javafx.scene.control.Alert alert = new javafx.scene.control.Alert(javafx.scene.control.Alert.AlertType.CONFIRMATION, message);
            alert.initOwner(stage);
            return alert.showAndWait().orElse(javafx.scene.control.ButtonType.CANCEL) == javafx.scene.control.ButtonType.OK;
        });
        String localData = System.getenv("LOCALAPPDATA");
        if (localData == null || localData.isBlank()) localData = System.getProperty("user.home");
        File storage = packaged()
            ? (smoke ? appDirectory().resolve("test-save").toFile() : Path.of(localData, "Rastros", "save").toFile())
            : new File(smoke ? ".chatgame-smoke" : ".chatgame-webview");
        storage.mkdirs();
        engine.setUserDataDirectory(storage);

        DialogueEngine dialogueEngine = new DialogueEngine();
        bridge = new JavaBridge(engine, dialogueEngine);
        bridge.setStage(stage);
        bridge.setSaveStore(new SaveStore(storage.toPath()));
        bridge.setAudioRoot(packaged()?appDirectory().resolve("audio"):Path.of("src/main/resources/audio/runtime"));
        stage.setOnCloseRequest(e->{
            try { engine.executeScript("window.rastrosSaveNow && window.rastrosSaveNow()"); }
            catch (RuntimeException ex) { System.err.println("Final save unavailable: " + ex.getMessage()); }
            bridge.closeAudio();
        });
        dialogueEngine.setBridge(bridge);

        engine.getLoadWorker().stateProperty().addListener((obs, oldState, newState) -> {
            if (newState == javafx.concurrent.Worker.State.SUCCEEDED) {
                JSObject window = (JSObject) engine.executeScript("window");
                window.setMember("bridge", bridge);
                engine.executeScript("window.startRastros && window.startRastros()");
                dialogueEngine.start();
                if (smoke) {
                    engine.executeScript("window.__persistenceResume=" + resumeTest);
                    SmokeCheck.run(engine, webView, stage);
                }
            }
        });

        File indexFile = packaged() ? appDirectory().resolve("web/index.html").toFile() : new File("src/main/resources/web/index.html");
        engine.load(indexFile.toURI().toString());

        stage.setScene(new Scene(webView, 1280, 720));
        stage.setFullScreenExitKeyCombination(javafx.scene.input.KeyCombination.NO_MATCH);
        stage.setFullScreenExitHint("F11: alternar tela cheia");
        stage.getScene().addEventFilter(javafx.scene.input.KeyEvent.KEY_PRESSED,e->{
            if(e.getCode()==javafx.scene.input.KeyCode.F11){stage.setFullScreen(!stage.isFullScreen());e.consume();}
        });
        stage.fullScreenProperty().addListener((obs,oldValue,newValue)->{
            try{engine.executeScript("window.dispatchEvent(new Event('rastros-fullscreen'))");}catch(RuntimeException ignored){}
        });
        stage.setMinWidth(800);
        stage.setMinHeight(600);
        stage.setTitle("Rastros — 1.0.3");
        stage.show();
    }

    public static void main(String[] args) {
        launch(args);
    }
    @Override public void stop(){if(bridge!=null)bridge.closeAudio();}
}
