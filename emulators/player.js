/* Dedicated same-origin emulator launchers for Playerun.
   The emulator applications are proxied under /engines/*, never opened as external pages. */
(() => {
  "use strict";
  const $ = id => document.getElementById(id);
  const routes = {
    psp: { title: "PPSSPP · PlayStation Portable", url: "/engines/psp/", input: "#libraryImportFile", note: "Motor independente PPSSPP WebAssembly. O primeiro carregamento exige internet; depois os recursos podem ficar em cache para uso offline." },
    sega: { title: "SANDOPOLIS · SEGA", url: "/engines/sega/", input: "#rom-input", note: "Motor Sega independente Sandopolis. Compatibilidade em desenvolvimento; usa a tua ROM local." }
  };
  let active = null;
  function stopOldRuntime() {
    try { if (typeof window.EJS_terminate === "function") window.EJS_terminate(); } catch (_) {}
  }
  function deliverFile(frame, file, selector, attempt = 0) {
    if (!file || attempt > 24) return;
    try {
      const doc = frame.contentDocument;
      const input = doc && doc.querySelector(selector);
      if (input) {
        const transfer = new DataTransfer();
        transfer.items.add(file);
        input.files = transfer.files;
        input.dispatchEvent(new Event("change", { bubbles: true }));
        return;
      }
    } catch (error) {
      console.warn("Playerun: não foi possível enviar o ficheiro ao motor", error);
      return;
    }
    setTimeout(() => deliverFile(frame, file, selector, attempt + 1), 300);
  }
  function open(game, kind) {
    const config = routes[kind];
    if (!config) return;
    stopOldRuntime();
    active = { game, kind };
    const player = $("player");
    const stage = $("stage");
    if (!player || !stage) return;
    $("playingTitle").textContent = game.title || config.title;
    $("asideTitle").textContent = config.title;
    $("asideDesc").textContent = "Emulador próprio da plataforma, executado dentro do Playerun.";
    $("playerNotice").textContent = config.note;
    $("controlNote").textContent = kind === "psp"
      ? "Controlos tácteis e gamepad disponíveis no PPSSPP. No computador, usa teclado ou comando compatível."
      : "Teclado: setas + A/S/D + Z/X/C + Enter. Comando USB/Bluetooth quando suportado.";
    stage.innerHTML = '<div class="engine-frame-wrap"><div class="engine-loading" id="engineLoading">A preparar o emulador…</div><iframe class="engine-frame" id="dedicatedEngineFrame" title="'+config.title+'" src="'+config.url+'" allow="fullscreen; gamepad; autoplay; clipboard-read; clipboard-write" referrerpolicy="same-origin"></iframe></div>';
    const frame = $("dedicatedEngineFrame");
    frame.addEventListener("load", () => {
      const loading = $("engineLoading");
      if (loading) loading.remove();
      if (game.file) deliverFile(frame, game.file, config.input);
    }, { once: true });
    player.classList.add("open");
    player.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    if (!game.file) {
      $("playerNotice").textContent += " Seleciona o ficheiro no próprio emulador para começar.";
    }
  }
  function close() {
    const frame = $("dedicatedEngineFrame");
    if (frame) frame.src = "about:blank";
    active = null;
  }
  document.addEventListener("click", event => {
    if (event.target.closest("#close")) close();
  });
  const style = document.createElement("style");
  style.textContent = `
    .engine-frame-wrap{position:relative;width:100%;height:100%;min-height:420px;background:#05070b;overflow:hidden}
    .engine-frame{display:block;width:100%;height:100%;min-height:420px;border:0;background:#05070b}
    .engine-loading{position:absolute;z-index:2;inset:0;display:grid;place-items:center;color:#d8ff4f;background:#080a0f;font:700 13px system-ui;pointer-events:none}
    #player .playerbody{min-height:0}
    #player .stage{min-width:0;min-height:0}
    @media(max-width:760px){#player .playerbody{display:block}#player .stage{height:calc(100dvh - 68px);min-height:0}#player .engine-frame-wrap,#player .engine-frame{height:100%;min-height:0}#player .playeraside{max-height:26vh;overflow:auto}}
  `;
  document.head.append(style);
  window.PlayerunEngines = { open, close };
})();