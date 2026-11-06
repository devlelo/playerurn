/* Playerun focused home — PSP / Sega / Browser */
(() => {
  "use strict";
  const $ = id => document.getElementById(id);
  const esc = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const css = document.createElement("style");
  css.textContent = `
    :root{--pu-lime:#d8ff4f;--pu-muted:#9aa5b5;--pu-line:#ffffff1a}
    .hero{min-height:420px;border:1px solid var(--pu-line);overflow:hidden}
    .hero h1{font-size:clamp(58px,8vw,104px);line-height:.86;letter-spacing:-.045em;max-width:700px}
    .hero .kicker{color:var(--pu-lime);letter-spacing:.22em}
    .hero-copy>p{max-width:560px;line-height:1.65}
    .hero-actions button{border-radius:4px;min-height:48px;padding:0 22px}
    .pu-home{padding:12px 0 46px}
    .pu-platforms{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin:26px 0 36px}
    .pu-platform{min-height:132px;padding:18px;text-align:left;background:linear-gradient(145deg,#151d2a,#0c111a);border:1px solid var(--pu-line);border-radius:6px;color:#f7f8fb;cursor:pointer}
    .pu-platform:hover{border-color:#d8ff4f88;transform:translateY(-2px)}
    .pu-platform small{display:block;color:var(--pu-lime);font-size:9px;font-weight:900;letter-spacing:.2em}
    .pu-platform strong{display:block;font:800 28px/.95 "Barlow Condensed",sans-serif;margin:12px 0 7px}
    .pu-platform span{color:var(--pu-muted);font-size:11px;line-height:1.4}
    .pu-rail{margin:0 0 38px}
    .pu-rail-head{display:flex;justify-content:space-between;align-items:end;margin:0 0 13px}
    .pu-rail-head h2{margin:0;font:800 29px/1 "Barlow Condensed",sans-serif;text-transform:uppercase}
    .pu-rail-head p{margin:5px 0 0;color:var(--pu-muted);font-size:11px}
    .pu-track{display:grid;grid-auto-flow:column;grid-auto-columns:minmax(145px,190px);gap:12px;overflow-x:auto;padding:3px 2px 14px;scroll-snap-type:x mandatory;scrollbar-width:thin}
    .pu-card{min-width:0;scroll-snap-align:start;cursor:pointer}
    .pu-cover{position:relative;aspect-ratio:3/4;border-radius:5px;overflow:hidden;background:linear-gradient(145deg,#253247,#111722);border:1px solid var(--pu-line)}
    .pu-cover img{width:100%;height:100%;object-fit:cover}
    .pu-cover:after{content:"";position:absolute;inset:35% 0 0;background:linear-gradient(transparent,#05070cf2)}
    .pu-cover strong{position:absolute;z-index:1;left:11px;right:11px;bottom:12px;font:800 22px/.95 "Barlow Condensed",sans-serif;text-transform:uppercase}
    .pu-card-meta{padding:8px 2px;color:var(--pu-muted);font-size:10px}
    .pu-empty{min-height:170px;border:1px dashed #ffffff2c;border-radius:5px;display:grid;place-items:center;text-align:center;padding:20px;color:var(--pu-muted);font-size:12px}
    .pu-actions{display:flex;gap:10px;flex-wrap:wrap;margin:8px 0 35px}
    .pu-primary{background:var(--pu-lime);color:#10140a;border:0;border-radius:4px;min-height:48px;padding:0 20px;font-weight:900}
    .pu-secondary{background:#141b27;color:#f4f6fa;border:1px solid var(--pu-line);border-radius:4px;min-height:48px;padding:0 20px;font-weight:800}
    .stats{display:none!important}
    #consolas{display:none!important}
    @media(max-width:700px){.hero{min-height:390px;margin-top:10px}.hero-copy{padding:24px 19px}.hero h1{font-size:62px}.pu-platforms{grid-template-columns:repeat(2,minmax(0,1fr));gap:7px;margin:20px 0 28px}.pu-platform{padding:12px;min-height:120px}.pu-platform strong{font-size:20px}.pu-platform span{font-size:9px}.pu-track{grid-auto-columns:142px;gap:9px}.pu-rail-head h2{font-size:25px}.topright .roundbtn{display:none}}
  `;
  document.head.append(css);
  const local = () => { try { return Array.isArray(imported) ? imported : []; } catch { return []; } };
  const kind = game => {
    const p=String(game.platform||"").toLowerCase();
    if(p==="psp")return "PSP";
    if(p==="ps1"||p==="playstation"||p==="playstation 1")return "PS1";
    if(p.includes("mega")||p.includes("sega")||p==="master system"||p==="sms"||p==="game gear"||p==="sg-1000")return "SEGA";
    if(p==="html"||game.mode==="html"||/\.html?$/i.test(game.file?.name||game.url||""))return "HTML";
    return "";
  };
  const gameCard = game => {
    const k=kind(game),cover=game.cover?'<img loading="lazy" src="'+esc(game.cover)+'" alt="">':"";
    const subtitle=k==="HTML"?"HTML5 · PLAYERUN":k==="PSP"?"PSP · PPSSPP":"SEGA · SANDOPOLIS";
    return '<article class="pu-card" data-local="'+esc(game.id)+'"><div class="pu-cover">'+cover+'<strong>'+esc(game.title||game.file?.name||"Jogo")+'</strong></div><div class="pu-card-meta">'+subtitle+'</div></article>';
  };
  const catalogCard = game => {
    const cover=game.cover?'<img loading="lazy" src="'+esc(game.cover)+'" alt="">':"";
    const label=game.mode==="download"?"HOMEbrew / DOWNLOAD":game.mode==="html"?"JOGO HTML5":"INFORMAÇÃO";
    return '<article class="pu-card" data-catalog="'+esc(game.platform)+'"><div class="pu-cover">'+cover+'<strong>'+esc(game.title)+'</strong></div><div class="pu-card-meta">'+label+'</div></article>';
  };
  const rail=(title,desc,id,items,renderer=gameCard)=>'<section class="pu-rail"><div class="pu-rail-head"><div><h2>'+title+'</h2><p>'+desc+'</p></div></div><div class="pu-track" id="'+id+'">'+(items.length?items.map(renderer).join(""):'<div class="pu-empty">Ainda não há jogos nesta coleção.<br>Importa os teus ficheiros para começar.</div>')+'</div></section>';
  function catalogRail(title,desc,id,platforms){
    let list=[];try{list=STORE.filter(g=>platforms.includes(String(g.platform||""))&&(g.mode==="download"||g.mode==="html"||g.mode==="info"))}catch{}
    return rail(title,desc,id,list,catalogCard);
  }
  function refresh(){
    const host=$("playerunHome");if(!host)return;
    const games=local(),psp=games.filter(g=>kind(g)==="PSP"),ps1=games.filter(g=>kind(g)==="PS1"),sega=games.filter(g=>kind(g)==="SEGA"),html=games.filter(g=>kind(g)==="HTML");
    for(const [id,list] of [["pu-psp",psp],["pu-ps1",ps1],["pu-sega",sega],["pu-html",html]]){const node=$(id);if(node)node.innerHTML=list.length?list.map(gameCard).join(""):'<div class="pu-empty">Ainda não há jogos nesta coleção.</div>';}
    const cats=[["pu-discover-psp",["PSP"]],["pu-discover-ps1",["PS1"]],["pu-discover-sega",["Mega Drive","MASTER SYSTEM","Game Gear","SG-1000"]],["pu-discover-html",["HTML","PC / Browser","PC"]]];
    for(const [id,platforms] of cats){const node=$(id);if(node){let list=[];try{list=STORE.filter(g=>platforms.includes(String(g.platform||""))&&(g.mode==="download"||g.mode==="html"||g.mode==="info"))}catch{}node.innerHTML=list.length?list.slice(0,12).map(catalogCard).join(""):'<div class="pu-empty">A coleção será apresentada aqui.</div>';}}
  }
  function render(){
    const hero=$("inicio");if(!hero||$("playerunHome"))return;
    const host=document.createElement("div");host.id="playerunHome";host.className="pu-home";
    const games=local(),psp=games.filter(g=>kind(g)==="PSP"),sega=games.filter(g=>kind(g)==="SEGA"),html=games.filter(g=>kind(g)==="HTML");
    host.innerHTML=
      '<div class="pu-platforms">'+
      '<button class="pu-platform" data-platform="PSP"><small>01 · SONY</small><strong>PSP</strong><span>Emulador dedicado PPSSPP</span></button>'+
      '<button class="pu-platform" data-platform="PS1"><small>02 · SONY</small><strong>PLAYSTATION</strong><span>Emulador PlayStation integrado</span></button>'+
      '<button class="pu-platform" data-platform="SEGA"><small>03 · SEGA</small><strong>SEGA CLASSICS</strong><span>Mega Drive e Master System</span></button>'+
      '<button class="pu-platform" data-platform="HTML"><small>04 · BROWSER</small><strong>JOGOS HTML5</strong><span>Executados dentro do Playerun</span></button>'+
      '</div>'+
      rail("CONTINUAR A JOGAR","A tua biblioteca local","pu-continue",games.slice(0,10))+
      rail("PLAYSTATION PORTABLE","A tua coleção PSP","pu-psp",psp)+
      rail("PLAYSTATION","A tua coleção PS1","pu-ps1",ps1)+
      rail("SEGA CLASSICS","Mega Drive e Master System","pu-sega",sega)+
      rail("JOGOS DE NAVEGADOR","HTML5 sem instalação","pu-html",html)+
      catalogRail("DESCOBRIR PSP","Homebrew, demos e jogos independentes","pu-discover-psp",["PSP"])+
      catalogRail("DESCOBRIR PLAYSTATION","Demos e homebrew PS1","pu-discover-ps1",["PS1"])+
      catalogRail("DESCOBRIR SEGA","Clássicos e jogos independentes","pu-discover-sega",["Mega Drive","MASTER SYSTEM"])+
      catalogRail("JOGOS PARA O BROWSER","Experiências HTML5","pu-discover-html",["HTML","PC / Browser","PC"])+
      '<div class="pu-actions"><button class="pu-primary" id="pu-my-games">VER OS MEUS JOGOS</button><button class="pu-secondary" id="pu-import">IMPORTAR JOGOS</button><button class="pu-secondary" id="pu-explore">EXPLORAR CATÁLOGO</button></div>';
    hero.insertAdjacentElement("afterend",host);
    const kicker=hero.querySelector(".kicker"),heading=hero.querySelector("h1"),copy=hero.querySelector(".hero-copy>p");
    if(kicker)kicker.textContent="PLAYERUN · PSP / SEGA / BROWSER";
    if(heading)heading.innerHTML="Três mundos.<br>Um só Playerun.";
    if(copy)copy.textContent="A tua biblioteca online e local, com páginas próprias para PSP, PlayStation, Sega e jogos HTML5. Cada sistema reconhece a sua pasta e abre os jogos dentro do Playerun.";
    $("browse")?.replaceWith(Object.assign(document.createElement("button"),{id:"browse",className:"primary",textContent:"EXPLORAR JOGOS →"}));
    $("browse").onclick=()=>goPage("store");
    $("addHero").textContent="＋ IMPORTAR JOGOS";$("addHero").onclick=()=>goPage("settings");
    $("pu-my-games").onclick=()=>goPage("collection");
    $("pu-import").onclick=()=>goPage("settings");
    $("pu-explore").onclick=()=>goPage("store");
    const nav=$("inicio").closest(".app")?.querySelector(".nav");
    if(nav)nav.innerHTML='<a href="#inicio" data-page="home" class="active">Início</a><a href="#descobrir" data-page="store">Explorar</a><a href="#biblioteca" data-page="collection">Os meus jogos</a><a href="#adicionar" data-page="settings">Importar</a>';
    $("random")?.addEventListener("click",()=>{const list=local();if(list.length)launch(list[Math.floor(Math.random()*list.length)]);});
    host.addEventListener("click",event=>{
      const card=event.target.closest("[data-local]");
      if(card){const game=local().find(g=>String(g.id)===card.dataset.local);if(game)launch(game);return;}
      const catalog=event.target.closest("[data-catalog]");
      if(catalog){storeFilter=catalog.dataset.catalog;goPage("store");return;}
      const platform=event.target.closest("[data-platform]");
      if(platform){const p=platform.dataset.platform;if(p==="HTML")goPage("emu-html");else if(p==="PSP")goPage("emu-psp");else if(p==="PS1")goPage("emu-ps1");else goPage("emu-mega-drive");}
    });
    refresh();
    const gamesNode=$("games");if(gamesNode)new MutationObserver(refresh).observe(gamesNode,{childList:true,subtree:true});
    const storeNode=$("storeGames");if(storeNode)new MutationObserver(refresh).observe(storeNode,{childList:true,subtree:true});
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",render,{once:true});else render();
})();