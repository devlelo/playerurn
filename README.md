# Playerun

Playerun is a browser-first game hub with a Netflix-inspired catalogue, installable PWA shell, local favorites/history and browser-based retro emulation.

## Included
- Responsive catalogue with search and category filters
- Community catalogue sourced from [sausi-7/games](https://github.com/sausi-7/games) (142 browser games at time of integration)
- Built-in Snake, Pong and Memory games
- Favorites and recent games stored locally in the browser
- Additional game libraries linked from the hub:
  - [GameDoh Showcase](https://gamedoh.jskidz.au) — MIT HTML5/Canvas game collection
  - [Web Games](https://mashukui.github.io/web-games/) — MIT collection of 48 single-file HTML5 games
  - [Arcade Portal](https://github.com/greenmoach/arcade-portal) — 110 mini-games, browse upstream project
- EmulatorJS integration for user-supplied ROMs
- PWA manifest and service worker for the app shell

## Run and deploy
Static site; no backend or build step is required. Serve this directory over HTTPS or localhost. Vercel can deploy the repository as a static project.

## Licensing and content notes
- The original Playerun interface and original mini-game code are MIT licensed (see LICENSE).
- EmulatorJS is GPL-3.0 and is loaded from its official CDN; it is not relicensed under MIT.
- External libraries and games are served by their respective maintainers and remain under their own licenses. This hub links to or embeds upstream games; it does not claim ownership of them.
- ROMs and BIOS files are not included. Use only game files you are legally entitled to use.
- The service worker caches the Playerun shell only; external game content and emulator cores require internet access.

## License
The original Playerun interface and original mini-game code are provided under the MIT License. Third-party projects retain their own licenses.
