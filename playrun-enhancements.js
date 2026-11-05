(() => {
  "use strict";
  const $ = id => document.getElementById(id);
  const CUSTOM_KEY = "playerun.customCatalog.v1";
  const esc = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const isStandalone = () => window.matchMedia?.("(display-mode: standalone)").matches || window.navigator.standalone === true;

  function toast(message) {
    let node = $("playerunToast");
    if (!node) {
      node = document.createElement("div");
      node.id = "playerunToast";
      node.setAttribute("role", "status");
      node.style.cssText = "position:fixed;left:50%;bottom:22px;transform:translateX(-50%);z-index:9999;max-width:min(92vw,520px);padding:12px 16px;border:1px solid #d5ff4570;border-radius:10px;background:#151b24;color:#f4f5f7;box-shadow:0 12px 36px #0009;font:600 13px/1.5 system-ui;display:none";
      document.body.append(node);
    }
    node.textContent = message;
    node.style.display = "block";
    clearTimeout(node._hideTimer);
    node._hideTimer = setTimeout(() => node.style.display = "none", 4200);
  }

  function getCustom() {
    try {
      const data = JSON.parse(localStorage.getItem(CUSTOM_KEY) || "[]");
      return Array.isArray(data) ? data : [];
    } catch { return []; }
  }

  function mergeCustomCatalog() {
    if (typeof STORE === "undefined" || !Array.isArray(STORE)) return;
    const ids = new Set(STORE.map(game => game.id));
    getCustom().forEach(game => { if (game && game.id && !ids.has(game.id)) { STORE.push(game); ids.add(game.id); } });
  }

  function refreshCatalogViews() {
    if (typeof renderStore === "function") renderStore();
    if (typeof renderCategory === "function") ["psp","nintendo","sega","playstation","pc"].forEach(renderCategory);
    if (typeof emulatorViews !== "undefined" && typeof renderEmulatorPage === "function") Object.keys(emulatorViews).forEach(renderEmulatorPage);
  }

  function ensureStyles() {
    if ($("playerunEnhancementStyles")) return;
    const style = document.createElement("style");
    style.id = "playerunEnhancementStyles";
    style.textContent = `
      .pr-connect{margin:16px 0 28px;padding:16px 18px;border:1px solid #ffffff1c;border-radius:12px;background:linear-gradient(130deg,#171e29,#10141c);display:flex;align-items:center;gap:14px;flex-wrap:wrap}
      .pr-dot{width:10px;height:10px;border-radius:50%;background:#d5ff45;box-shadow:0 0 0 5px #d5ff4518;flex:none}
      .pr-connect.offline .pr-dot{background:#ffb454;box-shadow:0 0 0 5px #ffb45418}
      .pr-connect strong{font-size:13px;display:block}.pr-connect p{margin:3px 0 0;color:#aab3c0;font-size:11px}
      .pr-connect .pr-actions{margin-left:auto;display:flex;gap:8px;flex-wrap:wrap}
      .pr-local{margin:22px 0 34px}.pr-local-head{display:flex;justify-content:space-between;gap:12px;align-items:end;margin-bottom:12px}.pr-local-head h2{font:800 26px/1 "Barlow Condensed";text-transform:uppercase;margin:0}.pr-local-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}
      .pr-local-item{display:flex;align-items:center;gap:10px;min-width:0;padding:10px;border:1px solid #ffffff18;background:#11151e;border-radius:9px}
      .pr-local-item .pr-cover{width:44px;height:56px;border-radius:5px;background:#27303d;display:grid;place-items:center;flex:none;font-size:20px;overflow:hidden}
      .pr-local-item .pr-cover img{width:100%;height:100%;object-fit:cover}
      .pr-local-item strong{display:block;font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .pr-local-item small{display:block;color:#929aaa;font-size:9px;margin-top:3px}
      .pr-local-item button{margin-left:auto;flex:none;border:0;border-radius:5px;padding:7px 9px;background:#d5ff45;color:#111;font-size:10px;font-weight:900}
      .pr-manager{margin-top:20px;padding:20px;border:1px solid #ffffff20;border-radius:12px;background:#11151e}
      .pr-manager h3{font:800 24px "Barlow Condensed";margin:0 0 5px;text-transform:uppercase}.pr-manager p,.pr-manager .pr-help{font-size:11px;color:#aab3c0;line-height:1.55}
      .pr-manager textarea{width:100%;min-height:125px;resize:vertical;background:#090d14;color:#e9edf4;border:1px solid #ffffff25;border-radius:8px;padding:12px;font:12px/1.5 ui-monospace,monospace}
      .pr-manager input[type=file]{max-width:100%;font-size:11px;color:#aab3c0}
      .pr-manager .pr-actions{display:flex;gap:8px;flex-wrap:wrap;margin:12px 0}
      .pr-manager button{border:1px solid #ffffff25;border-radius:7px;background:#ffffff0d;padding:10px 13px;color:#f4f5f7;font-size:11px;font-weight:800}
      .pr-manager button.primary{background:#d5ff45;color:#111;border-color:#d5ff45}
      .pr-status{font-size:11px;color:#d5ff45;min-height:18px;margin-top:8px}
      @media(max-width:700px){.pr-local-grid{grid-template-columns:1fr 1fr}.pr-connect .pr-actions{margin-left:0;width:100%}.pr-local-item{padding:7px;gap:7px}.pr-local-item .pr-cover{width:36px;height:48px}.pr-local-item button{padding:6px}}
    `;
    document.head.append(style);
  }

  function renderLocalHome() {
    const panel = $("playerunLocalHome");
    if (!panel) return;
    const games = typeof imported !== "undefined" && Array.isArray(imported) ? imported : [];
    const offline = !navigator.onLine;
    panel.innerHTML = `
      <div class="pr-local-head"><div><h2>${offline ? "Os teus jogos offline" : "A tua coleção neste dispositivo"}</h2><p style="margin:5px 0 0;color:#929aaa;font-size:11px">${games.length} jogo(s) guardado(s) neste dispositivo. Estes continuam disponíveis sem internet.</p></div><span style="color:#d5ff45;font-size:10px;font-weight:900">${offline ? "MODO OFFLINE" : "BIBLIOTECA LOCAL"}</span></div>
      ${games.length ? '<div class="pr-local-grid">' + games.slice(0,12).map((game,index) => `
        <div class="pr-local-item">
          <div class="pr-cover">${game.cover ? '<img src="'+esc(game.cover)+'" alt="">' : "🎮"}</div>
          <div style="min-width:0"><strong>${esc(game.title || game.file?.name || "Jogo")}</strong><small>${esc(game.platform || "Jogo local")}</small></div>
          <button type="button" data-pr-local="${index}">JOGAR</button>
        </div>`).join("") + '</div>' : '<div class="empty">Ainda não tens jogos guardados neste dispositivo. Importa ROMs ou jogos HTML na secção Biblioteca.</div>'}
    `;
    panel.querySelectorAll("[data-pr-local]").forEach(button => button.addEventListener("click", () => {
      const game = games[Number(button.dataset.prLocal)];
      if (game && typeof launch === "function") launch(game);
    }));
  }

  function renderConnection() {
    const panel = $("playerunConnection");
    if (!panel) return;
    const offline = !navigator.onLine;
    panel.classList.toggle("offline", offline);
    panel.innerHTML = `
      <span class="pr-dot"></span>
      <div><strong>${offline ? "Estás offline — o PlayRun continua contigo" : "Estás online — catálogo disponível"}</strong>
      <p>${offline ? "A página inicial prioriza os jogos guardados neste dispositivo. Downloads e atualizações ficam suspensos." : "Podes explorar o catálogo online e continuar a jogar os teus títulos locais."}</p></div>
      <div class="pr-actions">${offline ? '<button class="secondary" type="button" id="prLocalJump">VER JOGOS LOCAIS ↓</button>' : '<button class="primary" type="button" id="prExplore">EXPLORAR CATÁLOGO ↗</button>'}</div>
    `;
    $("prLocalJump")?.addEventListener("click", () => $("playerunLocalHome")?.scrollIntoView({behavior:"smooth",block:"start"}));
    $("prExplore")?.addEventListener("click", () => { if (typeof goPage === "function") goPage("store"); });
  }

  function installHelp() {
    const standalone = isStandalone();
    if (standalone) { $("install")?.setAttribute("hidden",""); return; }
    const button = $("install");
    if (!button) return;
    button.textContent = "Instalar Playerun";
    button.onclick = async () => {
      if (typeof deferred !== "undefined" && deferred) {
        const promptEvent = deferred;
        deferred = null;
        try {
          await promptEvent.prompt();
          const result = await promptEvent.userChoice;
          if (result?.outcome === "accepted") toast("Pedido de instalação aceite. Aguarda o sistema concluir.");
          else toast("Instalação cancelada. Podes tentar novamente pelo menu do navegador.");
        } catch (error) {
          toast("Não foi possível abrir a instalação. Usa o menu do navegador para instalar.");
        }
        return;
      }
      const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
      const android = /android/i.test(navigator.userAgent);
      const message = ios
        ? "Para instalar: abre esta página no Safari, toca em Partilhar e escolhe «Adicionar ao ecrã principal»."
        : android
          ? "Para instalar: abre o menu ⋮ do Chrome e escolhe «Instalar aplicação» ou «Adicionar ao ecrã principal». Não é necessário ativar notificações."
          : "Para instalar: abre o menu do navegador e escolhe «Instalar Playerun» ou «Instalar aplicação».";
      toast(message);
    };
    window.addEventListener("appinstalled", () => {
      button.setAttribute("hidden","");
      toast("Playerun instalado com sucesso!");
    }, {once:true});
  }

  function addManager() {
    const host = $("adicionar");
    if (!host || $("playerunManager")) return;
    const panel = document.createElement("div");
    panel.id = "playerunManager";
    panel.className = "pr-manager";
    panel.innerHTML = `
      <div class="kicker">PLAYRUN MANAGER</div>
      <h3>Gestor de catálogo</h3>
      <p>Adiciona jogos por um registo JSON ou importa um arquivo <code>games.json</code>. Os registos ficam guardados neste dispositivo. Exporta o catálogo para substituir <code>catalog/games.json</code> no GitHub quando quiseres publicar para todos.</p>
      <label class="pr-help">IMPORTAR ARQUIVO JSON</label><br><input id="prJsonFile" type="file" accept=".json,application/json">
      <div class="pr-actions"><button type="button" id="prImportJson" class="primary">IMPORTAR JSON</button><button type="button" id="prExportJson">EXPORTAR CATÁLOGO</button></div>
      <label class="pr-help" for="prOneGame">OU COLA UM JOGO EM JSON</label>
      <textarea id="prOneGame" spellcheck="false" placeholder='{"id":"gta-psp","title":"GTA: Liberty City Stories","platform":"PSP","mode":"info","source":"https://www.rockstargames.com/"}'></textarea>
      <div class="pr-actions"><button type="button" id="prAddOne" class="primary">ADICIONAR JOGO</button></div>
      <div class="pr-status" id="prManagerStatus" role="status"></div>
      <p class="pr-help">Campos mínimos: id, title e platform. Para jogos jogáveis, acrescenta url. Usa mode «download» apenas para ficheiros que podem ser distribuídos; usa «info» para jogos comerciais que só queres catalogar. Para jogos comerciais sem autorização de distribuição, regista a ficha informativa e deixa o utilizador importar a sua cópia; não coloques links de ROM/ISO não autorizados.</p>
    `;
    host.append(panel);

    const status = message => { $("prManagerStatus").textContent = message; };
    const save = games => {
      const current = getCustom();
      const map = new Map(current.map(game => [game.id, game]));
      games.forEach(game => map.set(game.id, game));
      localStorage.setItem(CUSTOM_KEY, JSON.stringify([...map.values()]));
      mergeCustomCatalog();
      refreshCatalogViews();
      status(games.length + " jogo(s) guardado(s) na biblioteca deste dispositivo.");
    };
    const normalize = game => {
      if (!game || typeof game !== "object" || !game.id || !game.title || !game.platform) throw new Error("Cada jogo precisa de id, title e platform.");
      const clean = {...game};
      clean.id = String(clean.id).trim().toLowerCase().replace(/[^a-z0-9_-]+/g,"-");
      clean.title = String(clean.title).trim();
      clean.platform = String(clean.platform).trim();
      clean.mode = clean.mode || "download";
      if (!["download","html","info"].includes(clean.mode)) throw new Error("mode deve ser download, html ou info.");
      clean.ext = clean.ext || String(clean.url).split("?")[0].split(".").pop().toLowerCase();
      return clean;
    };
    $("prAddOne").addEventListener("click", () => {
      try { const game = normalize(JSON.parse($("prOneGame").value)); save([game]); $("prOneGame").value = ""; }
      catch (error) { status("Erro: " + error.message); }
    });
    $("prImportJson").addEventListener("click", async () => {
      try {
        const file = $("prJsonFile").files[0];
        if (!file) throw new Error("Escolhe primeiro um arquivo JSON.");
        const data = JSON.parse(await file.text());
        const rows = Array.isArray(data) ? data : data.games;
        if (!Array.isArray(rows) || !rows.length) throw new Error("O arquivo precisa conter um array games.");
        save(rows.map(normalize));
      } catch (error) { status("Erro: " + error.message); }
    });
    $("prExportJson").addEventListener("click", () => {
      const games = typeof STORE !== "undefined" && Array.isArray(STORE) ? STORE : getCustom();
      const blob = new Blob([JSON.stringify({version:1,updated:new Date().toISOString().slice(0,10),notice:"Catálogo Playerun. Respeitar licenças e direitos de distribuição de cada jogo.",games},null,2)],{type:"application/json"});
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");a.href=url;a.download="games.json";a.click();
      setTimeout(()=>URL.revokeObjectURL(url),1500);
      status("Catálogo exportado. Coloca o ficheiro em catalog/games.json no GitHub para publicar.");
    });
  }

  function boot() {
    ensureStyles();
    const hero = document.querySelector(".hero");
    if (hero && !$("playerunConnection")) {
      const connection = document.createElement("div");
      connection.id = "playerunConnection";
      connection.className = "pr-connect";
      hero.insertAdjacentElement("afterend", connection);
    }
    const home = document.getElementById("view-home");
    if (home && !$("playerunLocalHome")) {
      const local = document.createElement("section");
      local.id = "playerunLocalHome";
      local.className = "pr-local";
      const stats = document.querySelector(".stats");
      if (stats) stats.insertAdjacentElement("afterend", local);
      else home.append(local);
    }
    addManager();
    mergeCustomCatalog();
    renderConnection();
    renderLocalHome();
    installHelp();
    window.addEventListener("online", () => { renderConnection();renderLocalHome();toast("Ligação recuperada. O catálogo online está disponível."); });
    window.addEventListener("offline", () => { renderConnection();renderLocalHome();toast("Sem internet. A mostrar os jogos guardados neste dispositivo."); });
    window.addEventListener("storage", event => { if (event.key === CUSTOM_KEY) { mergeCustomCatalog();refreshCatalogViews(); } });
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then(registration => registration.update()).catch(() => {});
      navigator.serviceWorker.addEventListener("controllerchange", () => { if (!sessionStorage.getItem("playerun-sw-reloaded")) { sessionStorage.setItem("playerun-sw-reloaded","1"); } });
    }
    if (typeof render === "function" && !window.__playerunRenderWrapped) {
      window.__playerunRenderWrapped = true;
      const originalRender = render;
      render = function(...args) {
        const result = originalRender.apply(this, args);
        renderLocalHome();
        return result;
      };
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot,{once:true});
  else boot();
})();
