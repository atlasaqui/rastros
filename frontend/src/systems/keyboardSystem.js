// JavaFX WebView can deliver trusted Windows key events with empty key/code.
// Keep modern physical WASD and normalize the native numeric fallback in one place.
const physical={KeyW:'w',KeyA:'a',KeyS:'s',KeyD:'d',KeyE:'e',ArrowUp:'arrowup',ArrowDown:'arrowdown',ArrowLeft:'arrowleft',ArrowRight:'arrowright',Escape:'escape'};
const legacy={87:'w',65:'a',83:'s',68:'d',69:'e',38:'arrowup',40:'arrowdown',37:'arrowleft',39:'arrowright',27:'escape'};
export function gameKey(event){return physical[event.code]||((event.key&&event.key!=='Unidentified')?event.key.toLowerCase():legacy[event.keyCode||event.which]||'');}
