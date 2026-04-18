# TEASys Viewer

A fast web application for reading and annotating literary texts with multi-level scholarly annotations. Built for the TEASys (Teaching and Exploring Annotated Structures) project. Runs on Cloudflare Pages with D1 (database) and R2 (image storage).

## Features

- **Multi-level annotations** — Three annotation levels (surface → context → interpretation) with category tagging (Language, Form, Intratextuality, Intertextuality, Context, Interpretation, Textual Variants, Questions).
- **Multiple text types** — Poetry (with stanza/line handling), prose (chapters/paragraphs), drama (acts/scenes/stage directions), and Collections (multi-part works).
- **Reading UI** — Distraction-free reading view with a sticky side panel for annotations. Overlapping annotations are handled with a click-to-cycle UX.
- **Rich Annotation Editor** — Select text to create annotations with a Markdown body, works cited, and cross-references to other annotations using `[[id]]` syntax. Automatic linkification of DOIs.
- **Author Profiles & Index** — Groups texts by author with dedicated author pages, portraits, and biographies.
- **Admin Dashboard & CMS** — Manage texts, authors, static pages, and users with role-based access control.
- **TEI XML Export** — Auto-generates TEI-compatible XML from annotations on every save.
- **Dark Mode** — Built-in, user-toggled dark mode.
- **Authentication** — Username/password auth with session cookies, backed by Cloudflare D1.

## Getting Started

### Prerequisites

- **Node.js** ≥ 18 and **npm** ≥ 9
- **Wrangler CLI**: `npm install -g wrangler` and a Cloudflare account

### Installation

```bash
git clone <your-repo>
cd teasys-viewer
npm install
```

### Local Development

Wrangler emulates D1 and R2 locally. Apply migrations on first run:

```bash
npx wrangler d1 execute teasys-db --local --file=migrations/001_initial.sql
npm run dev
```

The app starts at [http://localhost:5173](http://localhost:5173).

A default admin account is seeded on first run: **username `admin`, password `admin`**. Change this immediately at `/admin/users`.

### Deploying to Cloudflare Pages

1. Create the D1 database and R2 bucket (first time only):

   ```bash
   npx wrangler d1 create teasys-db
   npx wrangler r2 bucket create teasys-portraits
   ```

2. Update `database_id` in `wrangler.toml` with the ID returned above.

3. Apply migrations to production:

   ```bash
   npx wrangler d1 execute teasys-db --remote --file=migrations/001_initial.sql
   ```

4. Deploy:

   ```bash
   npm run build
   npx wrangler pages deploy
   ```

   Or connect the repo to Cloudflare Pages in the dashboard for automatic deploys on push.

## Content Management

All content (texts, annotations, authors, pages) is stored in Cloudflare D1 and managed through the admin dashboard at `/admin`. Portrait images are stored in Cloudflare R2.

### Adding Texts

Use the visual editor at `/admin/texts`. Fill in title, author, year, category, and type, then paste the full text content.

**Handling long texts (Collections):** For multi-act plays or multi-chapter novels, create a parent text with type `collection`, then add individual texts (acts, chapters) with the parent assigned and an `order` value. The collection page lists them in order without loading everything into one DOM.

### Static Pages & Navigation

Create non-literary pages (About, FAQs, etc.) at `/admin/pages`. They support Markdown and are accessible at their URL slug (e.g., `/about-us`).

To add pages to the navigation bar, edit the `MAIN_NAV` array in `src/lib/config/navigation.ts`.

### Annotation Taxonomy

Annotations have up to three levels. L1 is required before L2, and L2 before L3. **Interpretation** may never appear on L1.

| Category | Description |
|---|---|
| Language | Meaning of words and phrases |
| Form | Literariness: meter, rhyme, narrative structure |
| Intratextuality | Relation to the rest of the primary text |
| Intertextuality | References to other texts or artworks |
| Context | Cultural, historical, or biographical background |
| Interpretation | Synthesis of findings (L2+ only) |
| Textual Variants | Differences between versions |
| Questions | Unresolved research questions |

## Tech Stack

- **[SvelteKit](https://kit.svelte.dev/)** (Svelte 5) — Full-stack framework with `adapter-cloudflare`.
- **[Cloudflare Pages](https://pages.cloudflare.com/)** — Hosting and edge runtime.
- **[Cloudflare D1](https://developers.cloudflare.com/d1/)** — SQLite-compatible edge database for content, users, and sessions.
- **[Cloudflare R2](https://developers.cloudflare.com/r2/)** — Object storage for portrait images.
- **[Tailwind CSS v4](https://tailwindcss.com/)** — Utility-first styling.
- **[marked](https://github.com/markedjs/marked)** — Markdown rendering for annotation bodies.
- **[DOMPurify](https://github.com/cure53/DOMPurify)** — Client-side HTML sanitization.
- **[Gentium Plus](https://software.sil.org/gentium/)** — Serif typeface for body text (bundled locally).

## License

MIT
