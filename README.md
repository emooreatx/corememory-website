# corememory.works

The website for **Core Memory Works** — a computer workshop, museum floor and
restoration service in Roselle, Illinois.

It is a plain static site: hand-written HTML, one stylesheet, ~3 KB of optional
JavaScript, and self-hosted fonts. No framework, no build step. Everything under
`public/` is what gets served, byte for byte.

---

## Deploying

The site runs on **Cloudflare Workers static assets**, configured in
`wrangler.jsonc`. There is no Worker script — Cloudflare just serves `public/`
from its edge.

```bash
npm install          # once
npm run dev          # local preview on http://localhost:8787
npm run deploy       # push live
```

`npm run deploy` needs a Cloudflare login. Either run `npx wrangler login` once
on your machine, or set `CLOUDFLARE_API_TOKEN` (and `CLOUDFLARE_ACCOUNT_ID`) in
the environment for CI.

Other useful commands:

| Command | What it does |
| --- | --- |
| `npm run preview` | Uploads a version and gives you a preview URL without changing the live site |
| `npm run tail` | Streams live request logs |

### First deploy checklist

1. `npx wrangler login`
2. `npm run deploy` — this creates the Worker and gives you a
   `corememory-website.<your-subdomain>.workers.dev` URL to check.
3. Attach the real domain: Cloudflare dashboard → Workers & Pages →
   `corememory-website` → **Settings → Domains & Routes → Add custom domain** →
   `corememory.works` and `www.corememory.works`. The domain has to be on the
   same Cloudflare account; DNS records are created for you.

### Routing behaviour

Set in `wrangler.jsonc`:

- `html_handling: "auto-trailing-slash"` — `/visit` and `/visit/` both work, and
  `/visit/index.html` redirects to the clean URL.
- `not_found_handling: "404-page"` — unknown paths get `public/404.html` with a
  real 404 status.

`public/_redirects` and `public/_headers` are picked up automatically:
`_redirects` keeps `/restoration`, `/quote` and `/donate` pointing at the right
pages; `_headers` sets cache lifetimes and a few baseline security headers.

---

## Layout

```
public/
  index.html            home
  visit/                hours, the floor, finding us
  classes/              class + event schedule
  services/             restoration & data recovery (the paid side)
  shop/                 what's sold at the counter
  about/                the two-halves story, people, supporting the floor
  contact/              quote request + general enquiry
  404.html
  assets/css/site.css   every style on the site, tokens at the top
  assets/js/site.js     form handling, nothing else
  assets/fonts/         self-hosted woff2 (see LICENSE.md there)
  assets/img/           photos, logo, social card
  _headers  _redirects  robots.txt  sitemap.xml  favicon.svg
wrangler.jsonc          Cloudflare config
```

### Editing

Each page is self-contained HTML — the header, nav and footer are repeated in
each file. If you change the nav, change it in all eight files (the seven pages
plus `404.html`). Note that `404.html` is served from any path, so **its links
are root-absolute (`/visit/`)** while every other page uses relative links
(`../visit/`).

Colours, fonts and spacing are CSS custom properties at the top of
`assets/css/site.css`. Change them there, not in the page markup.

---

## Forms

The site has no backend, so both contact forms and the notify-me box currently
**compose a prefilled email** via `mailto:` when submitted. The addresses are on
the form elements themselves (`data-mailto`), and the contact page also shows
them as plain links so nothing depends on JavaScript.

To switch to a real endpoint, set `FORM_ENDPOINT` at the top of
`assets/js/site.js` to a path (e.g. `/api/enquiry`) and add a Worker route or a
form service that accepts a JSON `POST`. The same markup will then post as JSON
and fall back to `mailto:` only if the request fails.

---

## Content notes

Things that are deliberately provisional, to fill in before or at opening:

- **Address.** The site says "address at opening" in several places
  (`visit/`, `contact/`, the footer). Search for `Address at opening`.
- **Hours.** `visit/index.html` shows "Opening soon" for public hours.
- **People.** `about/index.html` has three placeholder cards — names, roles and
  photos go in there, replacing the grey `PHOTO` blocks.
- **Class schedule.** `classes/index.html` is labelled "sample schedule" and the
  dates are examples.
- **Donate button.** `about/index.html` points at the contact page; swap the
  `href` for a real payment link when there is one.
- **Social handles.** None are linked yet; the footer has email only.

## Images

- `sel-810a-pipeline-racks.jpg` and `vcf-midwest-micros.jpg` are show photos.
- `restoration-bay.jpg` is the Roselle space mid-move. The previous tenant's
  signage and ceiling lantern were removed from the wall before publishing.
- `og-card.jpg` (1200×630) is the link preview card used by every page's
  Open Graph and Twitter tags. Regenerate it if the wordmark or tagline changes.
