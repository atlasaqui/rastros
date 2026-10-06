import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import {resolve,dirname,extname,sep} from 'node:path';
const index=fileURLToPath(new URL('../../src/main/resources/web/index.html',import.meta.url));
const port=Number(process.env.PORT)||5173;
createServer((req,res)=>{
 if(req.url==='/favicon.ico'){res.writeHead(204);res.end();return;}
 if(req.url.startsWith('/media/')||req.url.startsWith('/assets/')||req.url.startsWith('/audio/')){
  const folder=req.url.startsWith('/media/')?'media':req.url.startsWith('/assets/')?'assets':'../audio/runtime',root=resolve(dirname(index),folder);
  try{
   const file=resolve(root,decodeURIComponent(req.url.split('?')[0].slice(req.url.startsWith('/assets/')?8:7)));
   if(!file.startsWith(root+sep)){res.writeHead(403);res.end();return;}
   res.writeHead(200,{'Content-Type':{'.png':'image/png','.jpg':'image/jpeg','.wav':'audio/wav','.mp3':'audio/mpeg'}[extname(file)]||'application/octet-stream'});res.end(readFileSync(file));
  }catch{res.writeHead(404);res.end();}return;
 }
 res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'});
 res.end(readFileSync(index));
}).listen(port,'127.0.0.1',()=>console.log('Rastros preview: http://127.0.0.1:'+port));
