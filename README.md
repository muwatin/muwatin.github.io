# Muwatin's 31st Annual Conference — website

The website of Muwatin Institute's 31st Annual Conference, *Solidarity: From Sympathy with the Victim to Unification of Global Struggle*, Birzeit University, 15–16 December 2026.

It is a static site: plain HTML, CSS and JavaScript. It needs no build step, database, server-side code or third-party services, and nothing has to be installed. It is in Arabic by default, with an English version behind the EN / ع button in the top bar.

## Uploading to the server

Copy the whole folder to the web server as it is, keeping its structure:

```
index.html        the conference page
privacy.html      privacy policy
disclaimer.html   disclaimer
styles.css        all styling
main.js           the conference page's content and behaviour
legal.js          language switch for the two legal pages
assets/           fonts, logos, photos, book covers, and the PDFs the download buttons link to
```

Every link inside the site is relative. That means the site works at a domain's root (`https://conference.example.edu/`) and in a subfolder (`https://www.example.edu/muwatin/conference/`) alike, with no configuration.

**Don't upload these:** `README.md`, `.gitignore` and `.nojekyll` (`.nojekyll` is only used by GitHub Pages). Also leave out any `.git` or `.claude` folder if you received a copy of the repository.

### Server settings

Any web server that can serve static files works (Apache, nginx, IIS). The only things to check:

- **File types.** Make sure the server sends the correct Content-Type for these files:

  | Extension | Content-Type |
  | --- | --- |
  | `.webp` | `image/webp` |
  | `.woff2` | `font/woff2` |
  | `.pdf` | `application/pdf` |

  Recent server versions already know them; older ones may not.
- **HTTPS.** The "share link" button copies to the clipboard, which browsers only allow on HTTPS pages. On plain HTTP it falls back to an older method that still works in most browsers.
- **Compression (recommended).** Turn on gzip or brotli for `.html`, `.css` and `.js`. They are mostly text, and much of it is Arabic: `main.js` shrinks from about 170 KB to about 50 KB. Don't compress images, fonts or PDFs, which are already compressed.
- **Caching (recommended).**
  - Give `assets/`, `styles.css` and `main.js` a long cache time (a year is fine).
  - Keep the `.html` pages uncached or short-lived, so visitors get each update straight away.

There is nothing else to configure:

- There are no redirects or rewrite rules.
- There are no forms.
- There are no cookies. The only thing stored in the visitor's browser is their language choice, kept in `localStorage`.

## Links that open a specific abstract or participant

Each abstract and participant popup has a share button. The link it gives looks like this:

```
https://<site address>/?lang=en#abstract-kumar
https://<site address>/?lang=ar#participant-tamara-tamimi
```

The browser handles the part after `#` and `?lang=` in JavaScript. The server only has to serve `index.html` as usual for the site's address, so no server rule is needed.

## Updating the content

All the conference content is near the top of `main.js`, as plain data:

| Content | Where it lives in `main.js` |
| --- | --- |
| Papers: titles, speakers, abstracts | `ABSTRACTS` |
| Participants' names and bios | `PROFILES` and `NAMES` |
| Hosts and chairs without a paper | `OTHER_PARTICIPANTS` |
| The programme | `DAYS` |

The concept note, the "how to attend" row and the footer are in `index.html`. Each piece of text there appears twice, once marked `data-i18n="ar"` and once `data-i18n="en"`.

To replace a PDF, keep the same file name in `assets/`.

**Version numbers.** After changing `styles.css` or `main.js`, raise the number after `?v=` where `index.html` links to them. Do the same in `privacy.html` and `disclaimer.html` for `styles.css`, which all three pages share. Otherwise visitors whose browsers cached the old file keep seeing it. Do the same for a replaced PDF.

To add a person's photo:

1. Make a transparent-background cutout and save it as WebP in `assets/people/`.
2. In `PROFILES`, add `photo: 'assets/people/<name>.webp'` and `cutout: true` to their entry.

## Previewing locally

Open `index.html` in a browser. Or, for the exact behaviour of a web server, run a static server in this folder. Examples:

```
npx serve .
python -m http.server
```
