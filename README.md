# TEASys Viewer

A self-contained, lightning-fast web application for reading and annotating literary texts with multi-level scholarly annotations. Built for the TEASys (Teaching and Exploring Annotated Structures) project.

## Features

- **Multi-level annotations** — Three annotation levels (surface → context → interpretation) with category tagging (Language, Form, Intratextuality, Intertextuality, Context, Interpretation, Textual Variants, Questions).
- **Multiple text types** — Poetry (with stanza/line handling), prose (chapters/paragraphs), drama (acts/scenes/stage directions), and Collections (multi-part books/plays).
- **Sophisticated Reading UI** — Clean, distraction-free reading view with a sticky side panel for annotations. Supports overlapping annotations with a seamless click-to-cycle UX.
- **Rich Annotation Editor** — Select text to create annotations with a Markdown body, works cited, and cross-references to other annotations using `[[id]]` syntax. Automatic linkification of DOIs.
- **Author Profiles & Index** — Automatically groups texts by author, generating dedicated author pages with book counts, portraits, and biographies.
- **Admin Dashboard & CMS** — Manage texts, authors, standalone static pages (like About and Meeting Times), and users with role-based access control.
- **TEI XML Export** — Auto-generates TEI-compatible XML from annotations.
- **File-based Content** — Texts, Markdown Pages, and annotations are stored as flat files inside the repository, making it easy to version-control the corpus and deploy anywhere.
- **Dark Mode** — Built-in, user-toggled dark mode for comfortable reading at night.
- **Authentication** — Simple username/password auth with session cookies and SQLite-backed user storage.

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9

### Installation

```bash
git clone <your-repo-
cd teasys-viewer
npm install
```

### Development

```bash
npm run dev
```

The app starts at [http://localhost:5173](http://localhost:5173).

A default admin account is created on first run: **username `admin`, password `admin`**. Change this immediately in the admin dashboard.

### Production Build

```bash
npm run build
node build/index.js
```

The app uses `@sveltejs/adapter-node` for standalone, high-performance Node.js deployment. It automatically minifies assets during the build step.

## Content Structure

Texts and annotations live in `content/texts/`. The flat-file architecture makes your entire literature catalog git-trackable.

```
content/texts/
├── the-red-wheelbarrow/
│   ├── metadata.json       # Title, author, year, type, category
│   ├── text.txt             # Full plain text of the work
│   └── annotations/
│       ├── ann1.json        # Individual annotation files
│       └── ann2.json
```

### Static Pages & Navigation

You can create standard, non-literary pages (e.g., *About Us*, *FAQs*) directly from the Admin dashboard (`/admin/pages`).
They support rich Markdown formatting, and you can easily insert images directly into the body.

They are stored as Markdown under `content/pages/` and are automatically accessible at their URL slug (e.g., `yourapp.com/about-us`).

**To add your pages to the top navigation bar:**
Edit the `MAIN_NAV` array inside `src/lib/config/navigation.ts`. You can add direct links, or group multiple pages under a dropdown menu.

### Adding Texts

You can add texts directly via the visual Editor in the Admin dashboard at `/admin/texts`. (Strongly preferred, you want to avoid editing raw files unless you know exactly what you're doing.)

Alternatively, add texts manually: (Only if you know what you're doing and you can't reach someone with more coding experience—or you're the new person with coding experience. In that case, hey, welcome, sorry, and think about emailling me: [nicolai@mujistan](mailto:nicolai@mujistan)).

1. Create a directory under `content/texts/` with a URL-friendly slug name.
2. Add `metadata.json`. For standard reading texts:

   ```json
   {
     "id": "my-text",
     "title": "My Text",
     "author": "Author Name",
     "year": 1923,
     "category": "Imagism",
     "type": "poetry"
   }
   ```

   **Handling Long Texts (Collections)**:
   If you have a 5-act play or a multi-chapter novel, you should avoid pasting the entire 50,000 word raw text into one document (as hundreds of annotations will heavily degrade the browser DOM performance). Instead, create a Parent Collection:

   ```json
   {
     "id": "hamlet-collection",
     "title": "Hamlet (Complete)",
     "author": "William Shakespeare",
     "type": "collection"
   }
   ```

   Then, create individual texts for each Scene/Act, and assign them to the collection using `parentId` and `order`:

   ```json
   {
     "id": "hamlet-act-1",
     "title": "Act 1",
     "author": "William Shakespeare",
     "type": "drama",
     "parentId": "hamlet-collection",
     "order": 1
   }
   ```

3. Add `text.txt` containing the full text content (not needed if the `type` is `collection`).
4. Refresh the app, and annotations can immediately be created through the web UI.

## Tech Stack

- **[SvelteKit](https://kit.svelte.dev/)** (Svelte 5) — Full-stack framework offering snappy client-side navigation.
- **[Tailwind CSS v4](https://tailwindcss.com/)** — Utility-first semantic styling.
- **[better-sqlite3](https://github.com/WiseLibs/better-sqlite3)** — Lightweight SQLite storage for user/session data.
- **[Gentium Plus](https://software.sil.org/gentium/)** — Elegant, highly legible serif typeface (bundled locally).
- **[marked](https://github.com/markedjs/marked)** — Robust Markdown rendering for annotations.

## License

MIT
