# Inhale · Approved Glass v2

Open `index.html` in a browser. This is the current approved design, inspired by translucent glass surfaces. Its canonical description is `../docs/features/mindful-breathing/approved-design.md`.

- Glass is the only design and prototype. `app.js` owns timing, journal, language/theme selection, pause/resume, stop/reset and settings behavior.
- `glass.css` adds a light lavender/sea-glass background, translucent surfaces with backdrop blur, subtle reflective edges, a floating bottom navigation surface and restrained controls.
- Mobile-first layout and safe-area padding remain in place. CSS includes blur fallbacks and reduced-transparency/reduced-motion styles.
- Settings has a Light/Dark selector (Світла/Темна in Ukrainian). Theme applies immediately without discarding unsaved timing inputs, persists under `inhale-glass-theme` when storage works, and restores before first paint. Light remains the default. Switching theme still works for the current visit when browser storage is unavailable.
- Language/theme selection uses styled glass radio segments rather than native dropdowns. Cycle cards and calculations are centered.
- Browser storage keeps sessions and language/theme preferences locally when available.

Validation: run `node --check prototype-glass/app.js` and `node prototype-glass/verify.cjs` from the repository root. Browser visual verification was unavailable because the browser tool blocks the file URL scheme. Actual iPhone/Android visual validation remains to be done.
