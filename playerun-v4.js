/* Playerun v4 — focused home for PSP, Sega and HTML5 */
(() => {
  "use strict";
  const $ = id => document.getElementById(id);
  const esc = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const styles = document.createElement("style");
  styles.textContent = `
    :root{--bg:#080a0f;--panel:#111722;--line:#ffffff18;--muted:#9aa5b5;--acid:#d8ff4f}
    body{background:var(--bg)}
    .top{height:68px}.nav a[data-page="systems"],.nav a[data-page="nintendo"],.nav a[data-page="playstation"]{display:none!important}
    .shell{max-width:1500px}
    .hero{min-height:430px;margin-top:20px;border-radius:12px;background:#131a24}
    .hero-art{background:radial-gradient(ellipse at 75% 30%,#d8ff4f24,transparent 35%),linear-gradient(90deg,#080a0f 0%,#080a0fe8 38%,#080a0f50 100%),linear-gradient(0deg,#080a0f 0%,transparent 65%)}
    .hero h1{font-size:clamp(58px,8vw,100px);max-width:640px}
    .hero .kicker{letter-spacing:3px}
    .hero-actions button{border-radius:5px;min-height:48px;padding:0 23px}
    .stream-row{margin:34px 0 42px}
    .stream-head{display:flex;justify-content:space-between;align-items:end;margin-bottom:13px;gap:12px}
    .stream-head h2{font:800 29px/1 "Barlow Condensed";margin:0;text-transform:uppercase}
    .stream-head p{font-size:11px;color:var(--muted);margin:5px 0 0}
    .stream-track{display:grid;grid-auto-flow:column;grid-auto-columns:minmax(150px,190px);gap:12px;overflow-x:auto;padding:3px 2px 14px;scroll-snap-type:x mandatory;scrollbar-width:thin}
    .stream-card{min-width:0;scroll-snap-align:start;cursor:pointer}
    .stream-cover{height:220px;border-radius:7px;overflow:hidden;position:relative;background:linear-gradient(145deg,#263243,#111722);border:1px solid var(--line)}
    .stream-cover img{width:100%;height:100%;object-fit:cover}
    .stream-cover:after{content:"";position:absolute;inset:35% 0 0;background:linear-gradient(transparent,#05070ce8)}
    .stream-cover strong{position:absolute;z-index:1;left:11px;right:11px;bottom:12px;font:800 22px/.95 "Barlow Condensed";text-transform:uppercase}
    .stream-meta{font-size:10px;color:var(--muted);padding:8px 2px}
    .stream-cta{display:inline-flex;align-items:center;justify-content:center;background:var(--acid);color:#10140a;padding:13px 19px;border-radius:5px;font-weight:900;border:0;min-height:46px}
    .stream-empty{height:220px;border:1px dashed #ffffff28;border-radius:7px;display:grid;place-items:center;text-align:center;color:var(--muted);padding:18px;font-size:12px}
    .focus-systems{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:30px 0}
    .focus-system{border:1px solid var(--line);background:linear-gradient(145deg,#151e2b,#0d1119);padding:18px;border-radius:8px;text-align:left;min-height:125px}
    .focus-system b{display:block;font:800 25px "Barlow Condensed";margin:8px 0 3px}
    .focus-system span{font-size:11px;color:var(--muted)}
    .focus-system em{font-style:normal;color:var(--acid);font-size:9px;font-weight:900;letter-spacing:1px}
    .legacy-view{display:none!important}
    @media(max-width:700px){.hero{min-height:420px;margin-top:12px}.hero-copy{padding:25px 20px}.hero h1{font-size:65px}.stream-row{margin:28px 0}.stream-track{grid-auto-columns:145px;gap:9px}.stream-cover{height:195px}.stream-head h2{font-size:25px}.focus-systems{gap:7px}.focus-system{padding:12px;min-height:112px}.focus-system b{font-size:20px}.focus-system span{font-size:9px}.topright .search,.topright .accent{display:none}}
  `;
  document.head.append(styles);

  function localGames(){
    try{return Array.isArray(imported)?imported:[]}catch{return []}
  }
  function platformKey(game){
    const p=String(game.platform||"").toLowerCase();
    if(p==="psp")return "PSP";
    if(p.includes("mega")||p.includes("sega")||p==="master system"||p==="sms")return "SEGA";
    if(p==="html"||game.mode==="html"||/\.html?$/i.test(game.file?.name||game.url||""))return "HTML";
    return "";
  }
  function card(game){
    const key=platformKey(game);
    const cover=game.cover?'<img loading="lazy" src="'+esc(game.cover)+'" alt="">':"";
    const status=key==="HTML"?"HTML5 · EXECUTA NO PLAYERUN":key==="PSP"?"PSP · MOTOR PRÓPRIO EM INTEGRAÇÃO":"SEGA · MOTOR PRÓPRIO EM INTEGRAÇÃO";
    return '<article class="stream-card" data-local-game="'+esc(game.id)+'"><div class="stream-cover">'+cover+'<strong>'+esc(game.title||game.file?.name||"Jogo")+'</strong></div><div class="stream-meta">'+status+'</div></article>';
  }
  function row(id,title,subtitle,items){
    const content=items.length?items.map(card).join(""):'<div class="stream-empty">Ainda não tens jogos desta plataforma.<br>Importa os teus ficheiros para criar a tua coleção.</div>';
    return '<section class="stream-row"><div class="stream-head"><div><h2>'+title+'</h2><p>'+subtitle+'</p></div></div><div class="stream-track" id="'+id+'">'+content+'</div></section>';
  }
  function catalogRow(id,title,subtitle,platforms){
    let catalog=[];try{catalog=Array.isArray(STORE)?STORE.filter(g=>platforms.includes(String(g.platform||""))):[]}catch{}
    const content=catalog.length?catalog.slice(0,14).map(g=>{
      const image=g.cover?'<img loading="lazy" src="'+esc(g.cover)+'" alt="">':"";
      const label=g.mode==="download"?"CATÁLOGO · DESCARREGÁVEL":g.mode==="html"?"HTML5 · CATÁLOGO":"FICHA DO JOGO";
      return '<article class="stream-card" data-catalog-platform="'+esc(g.platform)+'"><div class="stream-cover">'+image+'<strong>'+esc(g.title)+'</strong></div><div class="stream-meta">'+label+'</div></article>';
    }).join(""):'<div class="stream-empty">Estamos a preparar esta coleção.</div>';
    return '<section class="stream-row"><div class="stream-head"><div><h2>'+title+'</h2><p>'+subtitle+'</p></div></div><div class="stream-track" id="'+id+'">'+content+'</div></section>';
  }
  function render(){
    const hero=$("inicio");
    if(!hero||$("playerunV4Home"))return;
    const host=document.createElement("div");host.id="playerunV4Home";
    const games=localGames();
    const psp=games.filter(g=>platformKey(g)==="PSP");
    const sega=games.filter(g=>platformKey(g)==="SEGA");
    const html=games.filter(g=>platformKey(g)==="HTML");
    host.innerHTML=
      '<div class="focus-systems">'+
      '<button class="focus-system" data-focus="PSP"><em>01 · SONY</em><b>PLAYSTATION PORTABLE</b><span>Emulador dedicado PPSSPP WebAssembly</span></button>'+
      '<button class="focus-system" data-focus="SEGA"><em>02 · SEGA</em><b>MEGA DRIVE</b><span>Emulador dedicado Sega / Genesis</span></button>'+
      '<button class="focus-system" data-focus="HTML"><em>03 · BROWSER</em><b>JOGOS HTML5</b><span>Execução nativa isolada dentro do Playerun</span></button>'+
      '</div>'+
      row("v4-psp","PSP EM DESTAQUE","A tua coleção portátil",psp)+
      row("v4-sega","SEGA EM DESTAQUE","Mega Drive e clássicos Sega",sega)+
      row("v4-html","JOGOS DE NAVEGADOR","Abre e joga sem instalar emulador",html)+
      catalogRow("v4-psp-discover","DESCOBRIR PSP","Homebrew, demos e jogos independentes",["PSP"])+
      catalogRow("v4-sega-discover","DESCOBRIR SEGA","Mega Drive e clássicos da Sega",["Mega Drive","MASTER SYSTEM"])+
      catalogRow("v4-browser-discover","JOGOS PARA O BROWSER","Experiências HTML5 e jogos independentes",["HTML","PC / Browser","PC"])+
      '<div style="display:flex;gap:10px;flex-wrap:wrap;margin:25px 0 38px"><button class="stream-cta" id="v4-my-games">VER OS MEUS JOGOS</button><button class="secondary" id="v4-explore">EXPLORAR CATÁLOGO</button></div>';
    hero.insertAdjacentElement("afterend",host);
    $("v4-my-games").onclick=()=>{const target=$("biblioteca");if(target)target.scrollIntoView({behavior:"smooth"});};
    $("v4-explore").onclick=()=>{if(typeof goPage==="function")goPage("store");};
    host.addEventListener("click",event=>{
      const gameCard=event.target.closest("[data-local-game]");
      if(gameCard){const game=localGames().find(g=>String(g.id)===gameCard.dataset.localGame);if(!game)return;
        if(platformKey(game)==="HTML"){if(typeof launch==="function")launch(game);}
        else showEngineNotice(platformKey(game));
      }
      const catalog=event.target.closest("[data-catalog-platform]");
      if(catalog){if(typeof goPage==="function"){if(typeof storeFilter!=="undefined")storeFilter=catalog.dataset.catalogPlatform;goPage("store");if(typeof renderStore==="function")renderStore();}}
      const system=event.target.closest("[data-focus]");
      if(system){const key=system.dataset.focus;if(key==="HTML")$("pickRoms")?.click();else showEngineNotice(key);}
    });
    // The old multi-system navigation is hidden; only the three chosen platforms remain.
    const stats=document.querySelector(".stats");if(stats)stats.style.display="none";
    const oldSections=["consolas","biblioteca","adicionar"];
    oldSections.forEach(id=>{const section=$(id);if(section)section.classList.add("legacy-view");});
    const nav=document.querySelector(".nav");
    if(nav)nav.innerHTML='<a class="active" href="#inicio">Início</a><a href="#biblioteca" id="v4-nav-games">Os meus jogos</a><a href="#adicionar" id="v4-nav-import">Importar</a>';
    $("v4-nav-games")?.addEventListener("click",e=>{e.preventDefault();document.querySelector("#biblioteca")?.classList.remove("legacy-view");$("biblioteca")?.scrollIntoView({behavior:"smooth"});});
    $("v4-nav-import")?.addEventListener("click",e=>{e.preventDefault();document.querySelector("#adicionar")?.classList.remove("legacy-view");$("adicionar")?.scrollIntoView({behavior:"smooth"});});
  }
  function showEngineNotice(platform){
    const names={PSP:"PPSSPP WebAssembly",SEGA:"JGenesis WebAssembly"};
    const message=platform==="HTML"?"Os jogos HTML5 são executados dentro do Playerun.":(names[platform]||"Este emulador")+" ainda não está instalado dentro do Playerun. Não vou abrir um site externo nem fingir que o motor já está integrado.";
    const old=$("playerunEngineNotice");if(old)old.remove();
    const box=document.createElement("div");box.id="playerunEngineNotice";
    box.style.cssText="position:fixed;z-index:99999;left:50%;bottom:22px;transform:translateX(-50%);width:min(92vw,560px);padding:16px 18px;background:#151d29;border:1px solid #d8ff4f66;border-radius:8px;box-shadow:0 15px 50px #000b;color:#f4f6fa;font:600 13px/1.55 system-ui";
    box.textContent=message;document.body.append(box);setTimeout(()=>box.remove(),6500);
  }
  function refresh(){const host=$("playerunV4Home");if(!host)return;const games=localGames();const sets=[["v4-psp",games.filter(g=>platformKey(g)==="PSP")],["v4-sega",games.filter(g=>platformKey(g)==="SEGA")],["v4-html",games.filter(g=>platformKey(g)==="HTML")]];for(const [id,items] of sets){const el=$(id);if(el)el.innerHTML=items.length?items.map(card).join(""):'<div class="stream-empty">Ainda não tens jogos desta plataforma.</div>';}const rows=[["v4-psp-discover","DESCOBRIR PSP","Homebrew, demos e jogos independentes",["PSP"]],["v4-sega-discover","DESCOBRIR SEGA","Mega Drive e clássicos da Sega",["Mega Drive","MASTER SYSTEM"]],["v4-browser-discover","JOGOS PARA O BROWSER","Experiências HTML5 e jogos independentes",["HTML","PC / Browser","PC"]]];for(const [id,title,subtitle,platforms] of rows){const old=$(id);if(!old)continue;const temp=document.createElement("div");temp.innerHTML=catalogRow(id,title,subtitle,platforms);const fresh=temp.querySelector("#"+id);if(fresh)old.innerHTML=fresh.innerHTML;}}
  function boot(){render();const observer=new MutationObserver(()=>refresh());const target=$("games");if(target)observer.observe(target,{childList:true,subtree:true});const catalogTarget=$("storeGames");if(catalogTarget)observer.observe(catalogTarget,{childList:true,subtree:true});window.addEventListener("storage",refresh);window.addEventListener("online",refresh);window.addEventListener("offline",refresh);}
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();