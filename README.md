# TEASys Viewer

A web application for reading and annotating literary texts with multi-level scholarly annotations. Built for the [TEASys](https://annotating-literature.org) (Teaching and Exploring Annotated Structures) project.

Supports two deployment targets:
- **Cloudflare Pages + D1 + R2** (recommended)
- **Node.js / PM2** with SQLite + local file storage

## Features

- **Multi-level annotations** — Three annotation levels (surface → context → interpretation) with category tagging (Language, Form, Intratextuality, Intertextuality, Context, Interpretation, Textual Variants, Questions).
- **Multiple text types** — Poetry (stanza/line handling), prose (chapters/paragraphs), drama (acts/scenes/stage directions), and Collections (multi-part works).
- **Reading UI** — Distraction-free reading view with sticky annotation panel. Overlapping annotations handled via click-to-cycle.
- **Rich Annotation Editor** — Select text to create annotations with a Markdown body, works cited, and cross-references using `[[id]]` syntax. Automatic DOI linkification.
- **Author Profiles & Index** — Groups texts by author with dedicated pages, portraits, and biographies.
- **Admin Dashboard** — Manage texts, authors, pages, and users with role-based access control.
- **TEI XML Export** — Auto-generates TEI-compatible XML on every annotation save.
- **Dark Mode** — User-toggled dark mode.
- **Authentication** — Session-cookie auth backed by the database.

## Tech Stack

- **[SvelteKit](https://kit.svelte.dev/)** (Svelte 5) — Full-stack framework
- **[Tailwind CSS v4](https://tailwindcss.com/)** — Utility-first styling
- **[marked](https://github.com/markedjs/marked)** — Markdown rendering
- **[DOMPurify](https://github.com/cure53/DOMPurify)** — HTML sanitization
- **Cloudflare** (optional): Pages + D1 (SQLite-compatible edge DB) + R2 (object storage)
- **Node.js** (optional): built-in `node:sqlite` (Node 22+) + local filesystem storage

## Prerequisites

- **Node.js** ≥ 22 and **npm** ≥ 9
- For Cloudflare deployment: [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/) and a Cloudflare account

## Installation

```bash
git clone <repo-url>
cd teasys-viewer
npm install
```

---

## Deploying to Cloudflare Pages

### 1. Create resources (first time only)

```bash
wrangler d1 create teasys-db
wrangler r2 bucket create teasys-portraits
```

Update `database_id` in `wrangler.toml` with the ID returned above.

### 2. Apply schema to production

```bash
wrangler d1 execute teasys-db --remote --file=schema.sql
```

### 3. Seed an admin user

Use the Wrangler D1 console or write a one-off SQL insert with a bcrypt-hashed password:

```bash
# Generate a hash locally, then paste it
node -e "require('bcryptjs').hash('changeme', 10).then(h => console.log(h))"
wrangler d1 execute teasys-db --remote --command \
  "INSERT INTO users (username, password_hash, role) VALUES ('admin', '<hash>', 'admin')"
```

### 4. Deploy

```bash
npm run deploy           # builds + wrangler pages deploy
```

Or connect the repo to Cloudflare Pages in the dashboard (build command: `npm run build`).

### Local Cloudflare dev

```bash
wrangler d1 execute teasys-db --local --file=schema.sql
npm run dev:cf
```

---

## Deploying to Node.js / PM2

### 1. Initialize the database

```bash
npm run db:init-node -- --username=admin --password=changeme
```

Creates `data/teasys.db` from `schema.sql` and optionally seeds an admin user. File uploads are stored in `data/storage/`.

### 2. Build for Node

```bash
npm run build:node       # sets ADAPTER=node, outputs to build/
```

### 3. Configure environment

Copy `.env.example` to `.env` and set:

```
SESSION_SECRET=<32+ character random string>
PORT=3000
```

Generate a secret: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

### 4. Start

```bash
# With PM2
pm2 start ecosystem.config.cjs
pm2 save && pm2 startup

# Or directly
node build/index.js
```

### Local Node dev

`ADAPTER=node` tells the dev server to use SQLite instead of expecting Cloudflare bindings:

```bash
npm run db:init-node -- --username=admin --password=dev
ADAPTER=node npm run dev
```

---

## Configuration

### Site identity

Edit `src/lib/config/site.ts` before deploying. `siteUrl` is required for canonical URLs, Open Graph tags, and the sitemap:

```ts
export const SITE = {
  name: 'TEASys Viewer',   // first word is bold, rest is light in the wordmark
  siteUrl: 'https://your-domain.com',  // no trailing slash; required for SEO
  description: '...',      // default meta description
  logoMark: 'Θ',           // symbol shown in the header badge and footer (fallback)
  logoImage: '/logo.svg',  // optional — place file in static/ to use an image instead
  version: 'v3β',
  copyrightHolder: 'Your Institution',
  copyrightFrom: 2024,
  impressumSlug: 'impressum',   // set to '' to hide the footer link
  tagline: 'A tool for collaborative multi-level annotation of literary texts.',
};
```

### Attribution page

`/attribution` is a static page that lists the open-source software and typefaces used. Edit `src/routes/attribution/+page.svelte` to add credits for the texts, images, and other content you publish through the app.

### Fonts

Edit `src/lib/config/fonts.ts` to change or swap the typeface.

**Self-hosted** (default, no external requests): install a `@fontsource` package, add the `@import` lines to `layout.css`, and update `FONTS.serif.family` and the matching `--font-serif` value in `layout.css`.

**Google Fonts**: set `source: 'google'` and `googleUrl` to your Google Fonts stylesheet URL, then comment out the `@fontsource` imports in `layout.css`. The `<link>` tag is injected automatically. A privacy notice is added to the Attribution page.

```ts
serif: {
  source: 'google',
  family: '"Lora", Georgia, serif',
  googleUrl: 'https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,700;1,400;1,700&display=swap',
},
```

### Navigation

Edit `MAIN_NAV` in `src/lib/config/navigation.ts` to change the top nav links.

### Session cookies

The login action sets `secure: true` on the session cookie. In local dev over plain HTTP this means the cookie won't be sent back and login will silently fail. Use `npm run dev:cf` (HTTPS via Wrangler) or set `secure: false` in `src/routes/login/+page.server.ts` for local Node dev.

---

## Content Management

All content is managed through the admin dashboard at `/admin`.

### Adding Texts

Use `/admin/texts`. For multi-part works (plays, novels), create a parent text with type `collection`, then add parts with the parent set and an `order` value.

### Static Pages & Navigation

Create pages at `/admin/pages` (Markdown supported). To add them to the nav bar, edit `MAIN_NAV` in `src/lib/config/navigation.ts`.

### Syncing Content (Cloudflare ↔ filesystem)

```bash
npm run db:sync-down     # D1 → local content/ files
npm run db:sync-up       # local content/ files → D1
```

### Annotation Taxonomy

| Category | Description |
|---|---|
| Language | Meaning of words and phrases |
| Form | Meter, rhyme, narrative structure |
| Intratextuality | Relation to the rest of the primary text |
| Intertextuality | References to other texts or artworks |
| Context | Cultural, historical, or biographical background |
| Interpretation | Synthesis of findings (L2+ only) |
| Textual Variants | Differences between versions |
| Questions | Unresolved research questions |

Annotations have up to three levels. L1 is required before L2, L2 before L3. **Interpretation** may not appear on L1.

## License

**MIT License with Attribution Requirement.**

You are free to use, modify, and redistribute this software, including for commercial purposes, provided that:

1. The copyright notice and licence text are included in all copies.
2. Any publicly accessible deployment displays a visible link to the original repository ([https://github.com/noc-tae/teasys-viewer](https://github.com/noc-tae/teasys-viewer)) — for example in the footer, about page, or attribution page.

The `/attribution` route (linked from the footer) satisfies condition 2 out of the box. Do not remove it without adding another way to comply with condition 2.

See [`LICENSE`](./LICENSE) for the full text.
