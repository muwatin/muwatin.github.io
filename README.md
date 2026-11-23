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
  - the submitted papers (names, titles, abstracts), the participants' names and bios, and the programme, all as data at the top of the file;
  - the hero animation: threads drawn on a canvas that scatter, gather, and twist into a cable, plus the title coming forward. It plays once when the page opens, respects the reduced-motion setting, and stops itself when it has finished.
  - the five rubrics are not here: they are written out in the concept note in `index.html`.
- `assets/`: the Muwatin emblem and the full Muwatin / Birzeit lockup (transparent backgrounds), the participants' photos in `assets/people/`, and the PDFs the download buttons link to.

## Things to know

- **Fonts** are hosted in `assets/fonts` (Cairo for headings, Tajawal for text), so the page makes no third-party requests. Cairo is a stand-in: when the preferred display font is available, add it there and change `--font-display` in `styles.css`.
- **Caching:** `styles.css` is linked with `?v=80` and `main.js` with `?v=101` (the same `?v=` on `index.html`, `privacy.html` and `disclaimer.html`, so the three pages share one cached copy of the stylesheet). Raise the number whenever you publish an update, or visitors keep the old file.
- **Photos** are WebP (`assets/people/`), about a tenth the weight of the PNGs they replaced, with the transparent cutout preserved exactly. They also load as the reader approaches the Participants section rather than all at once on the first screen.
- **Smoothness:** the hero draws on a canvas with a pixel budget, thins its effects automatically if frames get slow, and the top bar has no blur effect (it is expensive while scrolling).
- **Programme** is a draft: the papers are grouped into sessions and given placeholder times. Edit the `DAYS` list in `main.js`.
- **Hero layout** depends on `--cable-y` in `styles.css` matching `Y0` in `main.js` (both 56% of the screen height on desktop).
- **Logo** images are small; replace them in `assets/` with higher-resolution or vector versions when available.

## Still to decide

- Final program (days, times, sessions) and which speakers are in each.
- Speaker photos and the remaining bios. Add each person to `PROFILES` in `main.js`: `name` (ar/en), `bio` (ar/en), and `photo` + `cutout: true` for a transparent-background image in `assets/people/`. Save it as WebP to match the others (from a PNG cutout: `ffmpeg -i photo.png -c:v libwebp -quality 95 -preset picture photo.webp`). Anyone with a photo gets the full card in the main grid; people without one stay as placeholder cards in the same grid until their photo is added.
- Links to the papers, if they will be shared.
- **The Abstracts and Participants download buttons have no PDF yet.** `index.html` links to `assets/abstracts-ar.pdf`, `abstracts-en.pdf`, `participants-ar.pdf` and `participants-en.pdf`, and none of those files exist — the buttons will give a "not found" page on the server. Either add the four PDFs to `assets/`, or delete the four `<p class="section-download">` lines from the Abstracts and Participants sections. (The Concept Note and Programme PDFs are there and work.)

## Handing the files to whoever uploads the site

Upload the whole folder as it is, keeping the structure: `index.html` at the top, with `privacy.html`, `disclaimer.html`, `styles.css`, `main.js` and the `assets/` folder beside it. There is no build step and nothing to install.

Two server settings are worth asking for, and they are the only ones that matter:

- **Turn on gzip or brotli compression** for `.html`, `.css` and `.js`. These files are mostly text (much of it Arabic, which is heavy in bytes): `main.js` goes from 150 KB to 48 KB, `styles.css` from 55 KB to 13 KB, and `index.html` from 45 KB to 13 KB. (Do not compress the images, fonts or PDFs — they are already compressed.)
- **Set a long cache time for `assets/`** (a year is fine: the fonts, photos and logos never change under the same name). Keep `index.html` itself uncached or short-lived, so a new version is picked up straight away.
