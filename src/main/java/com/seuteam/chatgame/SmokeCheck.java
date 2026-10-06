package com.seuteam.chatgame;
import javafx.animation.KeyFrame;
import javafx.animation.Timeline;
import javafx.application.Platform;
import javafx.scene.web.WebEngine;
import javafx.scene.web.WebView;
import javafx.stage.Stage;
import javafx.util.Duration;
import java.nio.file.Files;
import java.nio.file.Path;
import java.awt.image.BufferedImage;
import javax.imageio.ImageIO;
/** Opt-in regression through a real WebView. No hooks enabled in normal gameplay. */
final class SmokeCheck {
 static void run(WebEngine engine, WebView view, Stage stage) {
  try {
   if(view.isContextMenuEnabled())throw new IllegalStateException("Context menu must be disabled");
   var reached=new java.util.concurrent.atomic.AtomicInteger();
   javafx.event.EventHandler<javafx.scene.input.KeyEvent> probe=e->reached.incrementAndGet();
   view.addEventHandler(javafx.scene.input.KeyEvent.KEY_PRESSED,probe);
   view.fireEvent(new javafx.scene.input.KeyEvent(javafx.scene.input.KeyEvent.KEY_PRESSED,"","",javafx.scene.input.KeyCode.F5,false,false,false,false));
   view.fireEvent(new javafx.scene.input.KeyEvent(javafx.scene.input.KeyEvent.KEY_PRESSED,"","",javafx.scene.input.KeyCode.R,false,true,false,false));
   view.fireEvent(new javafx.scene.input.KeyEvent(javafx.scene.input.KeyEvent.KEY_PRESSED,"","",javafx.scene.input.KeyCode.R,true,true,false,false));
   view.removeEventHandler(javafx.scene.input.KeyEvent.KEY_PRESSED,probe);
   if(reached.get()!=0)throw new IllegalStateException("Reload shortcut escaped filter");
   engine.executeScript("window.__nativeReloadProtected=true");
   engine.executeScript(Files.readString(Main.smokeScript()));
  }
  catch(Exception ex){ex.printStackTrace();System.exit(1);}
  long start=System.currentTimeMillis();
  Timeline timeline=new Timeline();
  var capturing=new java.util.concurrent.atomic.AtomicBoolean(false);
  timeline.getKeyFrames().add(new KeyFrame(Duration.millis(150),event->{
   try {
    Object resize=engine.executeScript("window.__smokeResize || ''");
    if(resize instanceof String && !resize.toString().isEmpty()){
     String[] size=resize.toString().split("x");stage.setWidth(Integer.parseInt(size[0])+stage.getWidth()-view.getWidth());stage.setHeight(Integer.parseInt(size[1])+stage.getHeight()-view.getHeight());engine.executeScript("window.__smokeResize='' ");
    }
    Object capture=engine.executeScript("window.__smokeCapture || ''");
    if(capture instanceof String && !capture.toString().isEmpty() && capturing.compareAndSet(false,true)){
     var image=view.snapshot(null,null);var b=new BufferedImage((int)image.getWidth(),(int)image.getHeight(),BufferedImage.TYPE_INT_ARGB);
     int[] pixels=((java.awt.image.DataBufferInt)b.getRaster().getDataBuffer()).getData();
     image.getPixelReader().getPixels(0,0,b.getWidth(),b.getHeight(),javafx.scene.image.PixelFormat.getIntArgbInstance(),pixels,0,b.getWidth());
     Thread writer=new Thread(()->{try {Path dir=Main.smokeOutput();Files.createDirectories(dir);ImageIO.write(b,"png",dir.resolve(capture.toString()+".png").toFile());Platform.runLater(()->{engine.executeScript("window.__smokeCapture='' ");capturing.set(false);});}catch(Exception ex){Platform.runLater(()->{engine.executeScript("window.__smokeStatus='FAIL capture write'");capturing.set(false);});}},"smoke-image-writer");writer.setDaemon(true);writer.start();
    }
    String state=String.valueOf(engine.executeScript("window.__smokeStatus || ''"));
    if(state.equals("RELOAD")){timeline.stop();return;}
    if(state.equals("PASS")){timeline.stop();String report="JAVA_FX_SMOKE PASS: "+engine.executeScript("window.__smokeReport");Files.createDirectories(Main.smokeOutput());Files.writeString(Main.smokeOutput().resolve("report.txt"),report);Files.writeString(Main.smokeOutput().resolve("audio-events.json"),String.valueOf(engine.executeScript("window.bridge.audioEvents()")));System.out.println(report);Platform.exit();}
    if(state.startsWith("FAIL")||System.currentTimeMillis()-start>420000){timeline.stop();String report="JAVA_FX_SMOKE "+state+" STEP "+engine.executeScript("window.__smokeStep");Files.createDirectories(Main.smokeOutput());Files.writeString(Main.smokeOutput().resolve("report.txt"),report);Files.writeString(Main.smokeOutput().resolve("audio-events.json"),String.valueOf(engine.executeScript("window.bridge.audioEvents()")));System.err.println(report);Platform.exit();System.exit(1);}
   }catch(Exception ex){timeline.stop();ex.printStackTrace();System.exit(1);}
  }));
  timeline.setCycleCount(Timeline.INDEFINITE);timeline.play();
 }
}


