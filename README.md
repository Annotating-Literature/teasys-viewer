# TEASys Viewer

A self-contained web application for viewing and annotating literary texts with multi-level annotations. Built for the TEASys (Teaching and Exploring Annotated Structures) project.

## Features

- **Multi-level annotations** — Three annotation levels (surface → context → interpretation) with category tagging (Language, Form, Intratextuality, Intertextuality, Context, Interpretation, Textual Variants, Questions)
- **Multiple text types** — Poetry (with stanza/line handling), prose (chapters/paragraphs), and drama (acts/scenes/stage directions)
- **Inline annotation editor** — Select text to create annotations with a Markdown body, works cited, and cross-references to other annotations
- **Admin dashboard** — Manage texts and users with role-based access control (admin/editor)
- **TEI XML export** — Auto-generates TEI-compatible XML from annotations
- **File-based content** — Texts and annotations stored as JSON files under `content/texts/`, making it easy to version-control your corpus
- **Authentication** — Simple username/password auth with session cookies and SQLite-backed user storage

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9

### Installation

```bash
git clone <your-repo-url>
cd teasys-viewer
npm install
```

### Development

```bash
npm run dev
```

The app starts at [http://localhost:5173](http://localhost:5173).

A default admin account is created on first run: **username `admin`, password `admin`**. Change this immediately.

### Production Build

```bash
npm run build
node build/index.js
```

Uses `@sveltejs/adapter-node` for standalone deployment.

## Content Structure

Texts and annotations live in `content/texts/`:

```
content/texts/
├── the-red-wheelbarrow/
│   ├── metadata.json       # Title, author, year, type, category
│   ├── text.txt             # Full plain text of the work
│   └── annotations/
│       ├── ann1.json        # Individual annotation files
│       └── ann2.json
└── dickens-signal-man/
    ├── metadata.json
    ├── text.txt
    └── annotations/
        └── ...
```

### Adding a Text

Add texts via the Admin dashboard at `/admin/texts`.

Or, if you prefer, you can add texts manually:

1. Create a directory under `content/texts/` with a URL-friendly name
2. Add `metadata.json`:

   ```json
   {
     "id": "my-text",
     "title": "My Text",
     "author": "Author Name",
     "year": 1923,
     "category": "Imagism",
     "type": "poetry",
     "createdAt": "2024-01-01T00:00:00Z",
     "updatedAt": "2024-01-01T00:00:00Z"
   }
   ```

3. Add `text.txt` with the full text content
4. Annotations can be created through the web UI

## Tech Stack

- **[SvelteKit](https://kit.svelte.dev/)** (Svelte 5) — Full-stack framework
- **[Tailwind CSS v4](https://tailwindcss.com/)** — Styling
- **[better-sqlite3](https://github.com/WiseLibs/better-sqlite3)** — User/session storage
- **[EB Garamond](https://github.com/georgd/EB-Garamond)** — Serif reading font (bundled locally)
- **[marked](https://github.com/markedjs/marked)** — Markdown rendering in annotations

## License

MIT
