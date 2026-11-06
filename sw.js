/* Playerun offline-first service worker — same-origin emulator runtime cache */
const VERSION = "playerun-shell-v13";
const CORE = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon.svg",
  "./icon-maskable.svg",
  "./playrun-enhancements.js",
  "./playerun-v4.js",
  "./emulators/player.js",
  "./emulators/engines.json",
  "./covers/battle-4tris.svg",
  "./catalog/games.json",
  "./games-html/pong.html",
  "./games-html/snake.html",
  "./games-html/breakout.html"
];
self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(VERSION);
    await Promise.allSettled(CORE.map(async path => {
      try { const response = await fetch(path, {cache:"reload"}); if(response.ok) await cache.put(path,response); }
      catch(error){ console.warn("Playerun: recurso não pré-armazenado",path,error); }
    }));
    await self.skipWaiting();
  })());
});
self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const keys=await caches.keys();
    await Promise.all(keys.filter(key=>key.startsWith("playerun-")&&key!==VERSION).map(key=>caches.delete(key)));
    await self.clients.claim();
  })());
});
self.addEventListener("message",event=>{if(event.data?.type==="PLAYERUN_SKIP_WAITING")self.skipWaiting();});
async function cacheSameOrigin(request){
  const cache=await caches.open(VERSION),cached=await cache.match(request);
  try{
    const response=await fetch(request);
    if(response&&response.ok)await cache.put(request,response.clone());
    return response;
  }catch(error){
    if(cached)return cached;
    if(request.mode==="navigate")return (await cache.match("./index.html"))||Response.error();
    return Response.error();
  }
}
self.addEventListener("fetch",event=>{
  const request=event.request;if(request.method!=="GET")return;
  const url=new URL(request.url);
  if(url.origin===self.location.origin){event.respondWith(cacheSameOrigin(request));return;}
});
