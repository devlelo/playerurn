/* Dedicated same-origin emulator launchers for Playerun.
   The emulator applications are proxied under /engines/*, never opened as external pages. */
(() => {
  "use strict";
  const $ = id => document.getElementById(id);
  const routes = {
    psp: { title: "PPSSPP · PlayStation Portable", url: "/engines/psp/index.html", input: "#libraryImportFile", note: "Motor independente PPSSPP WebAssembly. O primeiro carregamento exige internet; depois os recursos podem ficar em cache para uso offline." },
    sega: { title: "SANDOPOLIS · SEGA", url: "/engines/sega/index.html", input: "#rom-input", note: "Motor Sega independente Sandopolis. Compatibilidade em desenvolvimento; usa a tua ROM local." }
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
    stage.innerHTML = '<div class="engine-frame-wrap"><div class="engine-loading" id="engineLoading">A preparar o emulador…</div><iframe class="engine-frame" id="dedicatedEngineFrame" title="'+config.title+'" src="'+config.url+'" allow="fullscreen; gamepad; autoplay; clipboard-read; clipboard-write" referrerpolicy="same-origin"></iframe>'+(kind==="sega"?'<div class="sega-touch" aria-label="Controlos tácteis Sega"><div class="sega-dpad"><button data-key="ArrowUp">▲</button><div><button data-key="ArrowLeft">◀</button><button data-key="ArrowDown">▼</button><button data-key="ArrowRight">▶</button></div></div><div class="sega-actions"><div><button data-key="KeyZ">X</button><button data-key="KeyX">Y</button><button data-key="KeyC">Z</button></div><div><button data-key="KeyA">A</button><button data-key="KeyS">B</button><button data-key="KeyD">C</button><button data-key="Enter">START</button></div></div></div>':"")+'</div>';
    const frame = $("dedicatedEngineFrame");
    frame.addEventListener("load", () => {
      const loading = $("engineLoading");
      if (loading) loading.remove();
      if (game.file) deliverFile(frame, game.file, config.input);
    }, { once: true });
    if(kind==="sega"){
      stage.querySelectorAll(".sega-touch [data-key]").forEach(button=>{
        const key=button.dataset.key;
        const send=(type,event)=>{event.preventDefault();try{const doc=frame.contentDocument;if(doc)doc.dispatchEvent(new KeyboardEvent(type,{key,code:key,bubbles:true,cancelable:true}));}catch(error){console.warn("Touch input:",error)}};
        button.addEventListener("pointerdown",event=>{button.setPointerCapture?.(event.pointerId);send("keydown",event)});
        ["pointerup","pointercancel","lostpointercapture"].forEach(type=>button.addEventListener(type,event=>send("keyup",event)));
      });
    }
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
    .sega-touch{display:none;position:absolute;z-index:5;left:0;right:0;bottom:12px;align-items:end;justify-content:space-between;padding:0 14px;pointer-events:none;touch-action:none}
    .sega-touch button{pointer-events:auto;touch-action:none;border:1px solid #ffffff45;background:#101827c9;color:#fff;border-radius:50%;width:43px;height:43px;font:800 12px system-ui;box-shadow:0 3px 12px #0008;backdrop-filter:blur(5px)}
    .sega-dpad{display:flex;flex-direction:column;align-items:center;gap:2px}
    .sega-dpad>div,.sega-actions>div{display:flex;gap:5px;align-items:center}
    .sega-actions{display:flex;flex-direction:column;align-items:end;gap:5px}
    .sega-actions button:last-child{width:58px;border-radius:20px;font-size:9px}
    #player .playerbody{min-height:0}
    #player .stage{min-width:0;min-height:0}
    @media(hover:none),(pointer:coarse){.sega-touch{display:flex}}
    @media(max-width:760px){#player .playerbody{display:block}#player .stage{height:calc(100dvh - 68px);min-height:0}#player .engine-frame-wrap,#player .engine-frame{height:100%;min-height:0}#player .playeraside{max-height:26vh;overflow:auto}}
  `;
  document.head.append(style);
  window.PlayerunEngines = { open, close };
})();