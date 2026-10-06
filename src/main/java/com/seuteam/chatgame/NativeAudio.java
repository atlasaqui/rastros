package com.seuteam.chatgame;

import java.nio.file.Path;
import java.util.*;
import javafx.animation.*;
import javafx.beans.property.SimpleDoubleProperty;
import javafx.scene.media.*;
import javafx.util.Duration;

/** Local PCM effects and streamed music. All calls originate on the FX thread. */
public final class NativeAudio {
    private Path root;
    private double master = .7;
    private boolean muted;
    private final Map<String,AudioClip> clips = new HashMap<>();
    private final Map<String,Voice> music = new HashMap<>();
    private final List<Map<String,Object>> events = new ArrayList<>();
    private final long epoch = System.nanoTime();
    private class Voice {
        final MediaPlayer player;
        final SimpleDoubleProperty envelope = new SimpleDoubleProperty(1);
        double gain = 1;
        boolean ready, pending, ended;
        double offset;
        Timeline fade;
        Voice(MediaPlayer p) { player=p; envelope.addListener((o,a,b)->apply()); }
        void apply(){ player.setVolume(muted?0:master*gain*envelope.get()); }
        void dispose(){ if(fade!=null)fade.stop();player.stop();player.dispose(); }
    }
    public void setRoot(Path value){root=value.toAbsolutePath().normalize();}
    private String uri(String name){
        if(root==null || !name.matches("[A-Za-z0-9-]+\\.(wav|mp3)")) throw new IllegalArgumentException("Invalid audio asset");
        return root.resolve(name).toUri().toString();
    }
    private void event(String key,String action){
        if(events.size()>=3000)events.remove(0);
        events.add(Map.of("id",key,"action",action,"ms",(System.nanoTime()-epoch)/1_000_000.0));
    }
    public boolean prepare(String key,String name,boolean streaming){
        try{
            if(streaming){
                if(!music.containsKey(key)){
                    Voice v=new Voice(new MediaPlayer(new Media(uri(name))));music.put(key,v);
                    v.player.setOnReady(()->{v.ready=true;event(key,"ready");if(v.pending){v.player.seek(Duration.seconds(v.offset));v.player.play();}});
                    v.player.setOnPlaying(()->event(key,"playing"));
                    v.player.setOnEndOfMedia(()->{if(v.player.getCycleCount()==1){v.ended=true;event(key,"ended");}});
                    v.player.setOnError(()->event(key,"error:"+v.player.getError()));
                }
            } else if(!clips.containsKey(key)){ clips.put(key,new AudioClip(uri(name)));event(key,"ready"); }
            return true;
        }catch(RuntimeException e){event(key,"error:"+e.getMessage());return false;}
    }
    public boolean ready(String key){return clips.containsKey(key)||(music.containsKey(key)&&music.get(key).ready);}
    public boolean play(String key,String name,boolean streaming,boolean loop,double gain,int fadeMs){
        if(!prepare(key,name,streaming))return false;
        event(key,"requested");
        if(!streaming){if(!muted&&master>0)clips.get(key).play(Math.max(0,Math.min(1,gain*master)));return true;}
        Voice v=music.get(key);if(v.fade!=null)v.fade.stop();v.gain=gain;
        v.offset=0;v.ended=false;v.player.setCycleCount(loop?MediaPlayer.INDEFINITE:1);v.player.seek(Duration.ZERO);
        v.envelope.set(fadeMs>0?0:1);v.apply();v.pending=true;
        if(v.ready)v.player.play();
        if(fadeMs>0){v.fade=new Timeline(new KeyFrame(Duration.millis(fadeMs),new KeyValue(v.envelope,1)));v.fade.play();}
        return true;
    }
    public void stop(String key,int fadeMs){
        AudioClip clip=clips.get(key);if(clip!=null)clip.stop();
        Voice v=music.get(key);if(v==null)return;v.pending=false;
        if(v.fade!=null)v.fade.stop();
        // A menu/reload can stop preloading voices before READY. Stopping such a
        // player suppresses its READY event and strands subsequent cue preparation.
        // Clearing pending is enough to prevent playback while loading completes.
        if(!v.ready)return;
        if(fadeMs<=0){v.player.stop();event(key,"stopped");return;}
        v.fade=new Timeline(new KeyFrame(Duration.millis(fadeMs),new KeyValue(v.envelope,0)));
        v.fade.setOnFinished(e->{v.player.stop();event(key,"stopped");});v.fade.play();
    }
    public double position(String key){Voice v=music.get(key);if(v==null)return -1;return v.ended?v.player.getTotalDuration().toSeconds():v.player.getCurrentTime().toSeconds();}
    public void seek(String key,double seconds){Voice v=music.get(key);if(v!=null){v.offset=Math.max(0,seconds);if(v.ready)v.player.seek(Duration.seconds(v.offset));event(key,"seek:"+v.offset);}}
    public void settings(double volume,boolean silent){
        master=Math.max(0,Math.min(1,volume));muted=silent;
        for(Voice v:music.values())v.apply();
        if(silent||master==0)for(AudioClip clip:clips.values())clip.stop();
    }
    public List<Map<String,Object>> events(){return List.copyOf(events);}
    public void stopAll(){for(String key:music.keySet())stop(key,0);for(AudioClip c:clips.values())c.stop();}
    public void close(){stopAll();for(Voice v:music.values())v.dispose();music.clear();clips.clear();}
}
