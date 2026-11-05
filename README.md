# Playerun

Playerun is a retro game library and browser emulator PWA. The interface is an original Playerun design; games run in an isolated internal player using EmulatorJS.

## Current playable catalogue
- Apotris — Game Boy Advance homebrew, GPL-3.0. ROM and cover are served from the community-maintained GBA Homebrew Hub.
- Attack on Voxelburg — Game Boy Advance homebrew, GPL-3.0-or-later. ROM and cover are served from the GBA Homebrew Hub.
- Battle 4Tris — Sega Mega Drive homebrew, MIT. ROM is offered by the original project's GitHub release; if browser CORS blocks automatic loading, download it from the source and import it. The release also contains a ZIP pack with six Mega Drive homebrew games; download it from the app and import the ZIP to add the collection to your local library.

## Supported emulator systems
NES, SNES, Game Boy / Color, Game Boy Advance, Nintendo 64, Nintendo DS, Sega Mega Drive / Genesis, Master System, Saturn, PlayStation 1, PSP and Arcade (core support and performance vary).

## Native HTML games
- Pong, Snake Arena and Breakout are original, self-contained HTML5 games in `games-html/`.
- They run in a sandboxed iframe inside the Playerun player; no external game site is opened.
- Users can also import their own `.html` / `.htm` files into the HTML Games library. For safety, imported HTML runs sandboxed without top-level navigation or same-origin access.

## Personal ROM library
Users can import ROM files from their device. Files are stored in the browser's IndexedDB on that device. The app does not upload ROMs to a server. For multi-file disc images, BIOS files, or systems with special requirements, consult the EmulatorJS documentation.

PSP uses the PPSSPP core and requires SharedArrayBuffer / cross-origin isolation. Vercel headers are configured for COOP and COEP. Actual PSP compatibility and performance vary by browser and device.

## PWA and offline
The service worker caches the Playerun application shell and the bundled HTML games. It does not pre-cache third-party emulator cores or remote ROMs. Imported ROMs remain in local IndexedDB; emulator cores are fetched from the EmulatorJS CDN when needed.

## Third-party components and content
See THIRD_PARTY_NOTICES.md. The original Playerun interface is MIT licensed. Third-party games and emulators retain their own licenses.
