# Playerurn

A browser-first arcade and retro games hub with a Netflix-inspired catalogue and installable PWA shell.

## Features
- Responsive catalogue and search
- Built-in Snake, Pong and Memory mini-games
- EmulatorJS integration for user-supplied ROM files
- PWA manifest and service worker for installability and offline shell
- Local-first; no account or backend required

## Run
Serve this directory over HTTPS or localhost. A static host such as GitHub Pages or Vercel is enough.

## Important limitations
- The included service worker caches the app shell, not third-party game assets or emulator cores.
- Retro games require ROMs supplied by the user and lawfully obtained. No commercial ROMs or BIOS files are included.
- EmulatorJS is loaded from its official CDN and is GPL-3.0. See https://github.com/EmulatorJS/EmulatorJS for its source and license.
- The external community game catalogue opens on its own website; it is not copied into this repository.

## Community libraries used as references
- https://github.com/sausi-7/games — collection of 142 browser games (check its current contents and license before redistributing).
- https://github.com/freemany/gamedoh — MIT-licensed HTML5/Canvas game collection and engine.
- https://github.com/EmulatorJS/EmulatorJS — browser emulator frontend, GPL-3.0.

## License
The original Playerurn interface and mini-game code in this repository are provided under the MIT License. EmulatorJS and external games remain under their respective licenses.