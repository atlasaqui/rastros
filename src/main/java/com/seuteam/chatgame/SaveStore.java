package com.seuteam.chatgame;

import com.google.gson.JsonParser;
import java.nio.file.*;
import java.nio.channels.FileChannel;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;

/** Native persistence independent of WebKit quota and installation location. */
public final class SaveStore {
    private final Path directory;
    public SaveStore(Path directory) { this.directory = directory; }
    private boolean valid(String json) {
        try { var obj = JsonParser.parseString(json).getAsJsonObject();
            return obj.get("version").getAsInt() == 3 && obj.get("flags").isJsonObject();
        } catch (Exception e) { return false; }
    }
    public String read() {
        for (String name : new String[]{"progress.json", "progress.backup.json"}) {
            try { String json = Files.readString(directory.resolve(name)); if (valid(json)) return json; }
            catch (Exception ignored) { }
        }
        return "";
    }
    public synchronized boolean write(String json) {
        if (!valid(json)) return false;
        Path pending = directory.resolve("progress.pending.json");
        Path target = directory.resolve("progress.json");
        try {
            Files.createDirectories(directory);
            try (var channel = FileChannel.open(pending, StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING, StandardOpenOption.WRITE)) {
                ByteBuffer bytes = StandardCharsets.UTF_8.encode(json);
                while (bytes.hasRemaining()) channel.write(bytes);
                channel.force(true);
            }
            if (Files.exists(target) && valid(Files.readString(target)))
                Files.copy(target, directory.resolve("progress.backup.json"), StandardCopyOption.REPLACE_EXISTING);
            try { Files.move(pending, target, StandardCopyOption.ATOMIC_MOVE, StandardCopyOption.REPLACE_EXISTING); }
            catch (AtomicMoveNotSupportedException e) { Files.move(pending, target, StandardCopyOption.REPLACE_EXISTING); }
            return true;
        } catch (Exception e) { System.err.println("Rastros save: " + e.getMessage()); return false; }
    }
}
