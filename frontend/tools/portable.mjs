import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync, watch, cpSync } from "node:fs";
import { createServer } from "node:http";
import { resolve, dirname } from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
const require = createRequire(import.meta.url);
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
process.chdir(root);
const mode = process.argv[2] || "build";
const out = resolve(root, "../src/main/resources/web");
const scratch = resolve(root, ".portable");
const binary =
  process.platform === "win32"
    ? require.resolve("@esbuild/win32-" + process.arch + "/esbuild.exe")
    : require.resolve(
        "@esbuild/" + process.platform + "-" + process.arch + "/bin/esbuild",
      );
function build() {
  mkdirSync(out, { recursive: true });
  mkdirSync(scratch, { recursive: true });
  cpSync(resolve(root,'public/media'),resolve(out,'media'),{recursive:true});
  const args = [
    "src/main.jsx",
    "--bundle",
    "--format=iife",
    "--jsx=automatic",
    "--target=es2020",
    "--loader:.png=file",
    "--loader:.jpg=file",
    "--loader:.jpeg=file",
    "--asset-names=assets/[name]-[hash]",
    "--outfile=" + resolve(scratch, "game.js"),
    "--define:import.meta.env.DEV=" + (mode === "dev"),
    "--define:process.env.NODE_ENV=" +
      JSON.stringify(mode === "dev" ? "development" : "production"),
  ];
  if (mode !== "dev") args.push("--minify");
  const result = spawnSync(binary, args, {
    stdio: "inherit",
    windowsHide: true,
  });
  if (result.status !== 0)
    throw new Error("Compilação esbuild falhou: " + result.status);
  cpSync(resolve(scratch,"assets"),resolve(out,"assets"),{recursive:true});
  const js = readFileSync(resolve(scratch, "game.js"), "utf8").replace(
    /<\/script/gi,
    "<\\/script",
  );
  const css = readFileSync(resolve(scratch, "game.css"), "utf8");
  const reload =
    mode === "dev"
      ? '<script>new EventSource("/events").onmessage=()=>location.reload()</script>'
      : "";
  writeFileSync(
    resolve(out, "index.html"),
    '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Rastros</title><style>' +
      css +
      '</style></head><body><div id="root"></div><script>' +
      js +
      "</script>" +
      reload +
      "</body></html>",
  );
  console.log("Build portátil concluído: " + out);
}
build();
if (mode === "dev") {
  const clients = new Set();
  const server = createServer((req, res) => {
    if (req.url === "/events") {
      res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      });
      res.write(": connected\n\n");
      clients.add(res);
      req.on("close", () => clients.delete(res));
      return;
    }
    if (req.url === "/favicon.ico") {
      res.writeHead(204);
      res.end();
      return;
    }
    if(req.url.startsWith('/media/')||req.url.startsWith('/assets/')||req.url.startsWith('/audio/')){const file=resolve(!req.url.startsWith('/audio/')?out:resolve(out,'../audio/runtime'),!req.url.startsWith('/audio/')?decodeURIComponent(req.url.slice(1)):decodeURIComponent(req.url.slice(7)));try{res.end(readFileSync(file));}catch{res.writeHead(404);res.end();}return;}
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(readFileSync(resolve(out, "index.html")));
  });
  server.listen(Number(process.env.PORT || 5173), "127.0.0.1", () =>
    console.log("Rastros dev: http://127.0.0.1:" + (process.env.PORT || 5173)),
  );
  let debounce;
  watch(resolve(root, "src"), { recursive: true }, () => {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      try {
        build();
        for (const client of clients) client.write("data: reload\n\n");
      } catch (e) {
        console.error(e);
      }
    }, 250);
  });
}
