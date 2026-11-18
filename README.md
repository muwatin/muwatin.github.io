# Muwatin's 31st Annual Conference website (draft)

Static site, no build step. Arabic by default, with an EN / ع toggle in the top bar.

## Open it

Double-click `index.html`, or drag it into a browser window.

For auto-refresh while editing, install the "Live Server" extension in VS Code and choose "Open with Live Server" on `index.html`. Or run `npx serve .` in this folder.

## Files

- `index.html`: all sections and text, in both languages (each block is a pair marked `data-i18n="ar"` / `data-i18n="en"`).
- `styles.css`: colors and the display font at the top (as variables), layout, and the mobile layout.
- `main.js`:
  - language toggle (remembered in the browser);
  - the five rubrics, the submitted papers (names, titles, one-line summaries), and the draft program, all as data at the top of the file;
  - the hero animation: threads drawn on a canvas that scatter, gather, and twist into a cable as you scroll, plus the title coming forward. It respects the reduced-motion setting and is static on phones.
- `assets/`: the Muwatin emblem and the full Muwatin / Birzeit lockup (transparent backgrounds), and the concept note PDFs the download icon links to: `concept-note-ar.pdf` and `concept-note-en.pdf`.

## Things to know

- **Fonts** are hosted in `assets/fonts` (Cairo for headings, Tajawal for text), so the page makes no third-party requests. Cairo is a stand-in: when the preferred display font is available, add it there and change `--font-display` in `styles.css`.
- **Caching:** `styles.css` and `main.js` are linked with `?v=4`. Change the number in `index.html` whenever you publish an update so visitors' browsers fetch the new files. On the host, set long cache times for `assets/` (fonts and images never change).
- **Smoothness:** the hero draws on a canvas with a pixel budget, thins its effects automatically if frames get slow, and the top bar has no blur effect (it is expensive while scrolling).
- **Programme** is a draft: the papers are grouped into sessions and given placeholder times. Edit the `DAYS` list in `main.js`.
- **Hero layout** depends on `--cable-y` in `styles.css` matching `Y0` in `main.js` (both 56% of the screen height on desktop).
- **Logo** images are small; replace them in `assets/` with higher-resolution or vector versions when available.

## Still to decide

- Final program (days, times, sessions) and which speakers are in each.
- Speaker photos and the remaining bios. Add each person to `PROFILES` in `main.js`: `name` (ar/en), `bio` (ar/en), and `photo` + `cutout: true` for a transparent-background PNG in `assets/people/`. Anyone with a photo gets the full card in the main grid; people without one stay as small cards underneath until their photo is added.
- Links to the papers, if they will be shared.
