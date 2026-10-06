import com.seuteam.chatgame.SaveStore;
import java.nio.file.*;
public class SaveStoreCheck {
  public static void main(String[] args) throws Exception {
    Path dir=Files.createTempDirectory("rastros-save-check-");
    SaveStore store=new SaveStore(dir);
    String first="{\"version\":3,\"flags\":{},\"notes\":\"primeiro\"}";
    String next="{\"version\":3,\"flags\":{},\"notes\":\"segundo\"}";
    if(!store.write(first)||!store.write(next)||!new SaveStore(dir).read().equals(next)) throw new AssertionError("reopen");
    if(store.write("bad")||!store.read().equals(next)) throw new AssertionError("invalid overwrote save");
    Files.writeString(dir.resolve("progress.json"),"truncated");
    if(!new SaveStore(dir).read().equals(first)) throw new AssertionError("backup recovery");
    Path blocked=dir.resolve("not-a-directory");Files.writeString(blocked,"test");
    if(new SaveStore(blocked).write(first)) throw new AssertionError("write failure hidden");
    System.out.println("PASS: native reopen, invalid data rejected, backup recovery, write failure surfaced");
  }
}
