# TEASys Viewer — Complete Implementation Plan

## Stack
- SvelteKit + adapter-node
- TypeScript
- Tailwind CSS
- better-sqlite3 (auth only)
- bcrypt (password hashing)
- zod (schema validation)
- uuid (annotation IDs)
- marked (lightweight markdown parser for annotation bodies)

---

## Directory Structure (final)

```
teasys-viewer/
├── src/
│   ├── app.html
│   ├── app.css
│   ├── hooks.server.ts              ← session loading middleware
│   ├── lib/
│   │   ├── server/
│   │   │   ├── db.ts                ← SQLite singleton
│   │   │   ├── auth.ts              ← hash, verify, session CRUD
│   │   │   ├── content.ts           ← all filesystem read/write ops
│   │   │   ├── textParser.ts        ← poetry/prose/drama → structured segments
│   │   │   ├── teiGenerator.ts      ← produces TEI XML from text + annotations
│   │   │   └── validation.ts        ← Zod schemas
│   │   ├── types/
│   │   │   ├── annotation.ts
│   │   │   ├── text.ts
│   │   │   └── user.ts
│   │   ├── utils/
│   │   │   └── spanSplitter.ts      ← overlap → minimal segment algorithm
│   │   ├── constants.ts             ← categories, colors, level rules
│   │   └── components/
│   │       ├── reading/
│   │       │   ├── AnnotatedText.svelte
│   │       │   ├── TextSegment.svelte
│   │       │   ├── AnchorPicker.svelte
│   │       │   ├── AnnotationPanel.svelte
│   │       │   ├── AnnotationEntry.svelte
│   │       │   ├── FilterBar.svelte
│   │       │   └── CategoryBadge.svelte
│   │       ├── editor/
│   │       │   ├── TextSelector.svelte
│   │       │   ├── AnchorConfirmation.svelte
│   │       │   ├── AnnotationForm.svelte
│   │       │   ├── LevelEditor.svelte
│   │       │   ├── CategorySelect.svelte
│   │       │   ├── MarkdownEditor.svelte
│   │       │   ├── WorksCitedEditor.svelte
│   │       │   └── CrossRefPicker.svelte
│   │       ├── admin/
│   │       │   ├── UserForm.svelte
│   │       │   └── TextForm.svelte
│   │       └── layout/
│   │           ├── Header.svelte
│   │           └── PageShell.svelte
│   └── routes/
│       ├── +layout.svelte
│       ├── +layout.server.ts        ← load session for all pages
│       ├── +error.svelte
│       ├── +page.svelte             ← library index (public)
│       ├── +page.server.ts
│       ├── login/
│       │   ├── +page.svelte
│       │   └── +page.server.ts
│       ├── logout/
│       │   └── +server.ts
│       ├── admin/
│       │   ├── +layout.server.ts    ← require editor role
│       │   ├── +page.svelte         ← dashboard
│       │   ├── users/
│       │   │   ├── +page.svelte
│       │   │   └── +page.server.ts
│       │   └── texts/
│       │       ├── +page.svelte
│       │       └── +page.server.ts
│       ├── texts/
│       │   └── [textId]/
│       │       ├── +page.svelte     ← reading view (public)
│       │       ├── +page.server.ts
│       │       └── annotate/
│       │           ├── +page.svelte ← editing view (auth required)
│       │           └── +page.server.ts
│       └── api/
│           └── texts/
│               ├── +server.ts
│               └── [textId]/
│                   ├── +server.ts
│                   ├── export/
│                   │   └── +server.ts   ← download TEI XML
│                   └── annotations/
│                       ├── +server.ts
│                       └── [annotationId]/
│                           └── +server.ts
├── content/
│   └── texts/
│       └── [textId]/
│           ├── metadata.json
│           ├── text.txt
│           ├── annotations/
│           │   └── [annotationId].json
│           └── [textId].tei.xml     ← auto-generated, never hand-edited
├── data/
│   └── teasys.db                    ← SQLite (users + sessions only)
├── scripts/
│   └── seed-admin.ts                ← one-time: create first admin user
├── svelte.config.js
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── .env.example
```

---

## Data Models

### TextMetadata (metadata.json)
```typescript
interface TextMetadata {
  id: string;
  title: string;
  author: string;
  year?: number;
  type: 'poetry' | 'prose' | 'drama';
  createdAt: string;
  updatedAt: string;
}
```

### Annotation ([annotationId].json)
```typescript
type Category =
  | 'language' | 'form' | 'intratextuality' | 'intertextuality'
  | 'context' | 'interpretation' | 'textual-variants' | 'questions';

interface AnnotationLevel {
  level: 1 | 2 | 3;
  category: Category;
  body: string;          // Markdown text
  worksCited: string[];
}

interface CrossRef {
  annotationId: string;
  annotationTitle: string;
  level: 1 | 2 | 3;
  category: Category;
}

interface Annotation {
  id: string;            // UUID
  title: string;         // short label, e.g. "chum"
  anchorText: string;    // exact quoted text from primary source
  anchorStart: number;   // char offset in text.txt
  anchorEnd: number;
  author: string;
  createdAt: string;     // ISO
  updatedAt: string;
  levels: AnnotationLevel[];
  crossRefs: CrossRef[];
}
```

### Users (SQLite)
```sql
CREATE TABLE users (
  id       INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role     TEXT NOT NULL DEFAULT 'editor',  -- 'admin' | 'editor'
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE sessions (
  id         TEXT PRIMARY KEY,   -- UUID
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  expires_at TEXT NOT NULL       -- datetime('now', '+30 days')
);
```

### Text file format

**Poetry (text.txt)**
```
## Trench Poets

I knew a man, he was my chum,
but he grew blacker every day,
and would not brush the flies away,

## Sonnet 18

Shall I compare thee to a summer's day?
```
Parsed into: poem title → stanzas (blank-line separated) → lines (numbered globally)

**Prose (text.txt)**
```
## Chapter 1

It was the best of times, it was the worst of times.

The second paragraph begins here.

## Chapter 2

Another chapter opens.
```
Parsed into: chapter → paragraphs

**Drama (text.txt)**
```
## Act 1, Scene 1

[A room in the castle.]

HAMLET:
To be or not to be, that is the question.

OPHELIA:
My lord—
```
Parsed into: act/scene → blocks (stage direction or speech with speaker label)

---

## Phase 1 — Project Setup

**Goal**: Runnable skeleton, all deps installed, directory structure in place.

Tasks:
1. `npm create svelte@latest teasys-viewer` (TypeScript, no demo pages)
2. Install all dependencies:
   - `@sveltejs/adapter-node`
   - `tailwindcss @tailwindcss/typography postcss autoprefixer`
   - `better-sqlite3 @types/better-sqlite3`
   - `bcrypt @types/bcrypt`
   - `zod`
   - `uuid @types/uuid`
   - `marked @types/marked`
3. Configure `svelte.config.js` with adapter-node
4. Configure Tailwind with typography plugin
5. Create `content/texts/` and `data/` directories
6. Write `.env.example` with `SESSION_SECRET`, `PORT`
7. Create `src/app.html` with base HTML shell
8. Create `src/app.css` with Tailwind directives + base typography variables

**Output**: `npm run dev` starts successfully.

---

## Phase 2 — Authentication

**Goal**: Login/logout working, session persisted in cookie, hooks protecting routes.

Files to create:
- `src/lib/server/db.ts` — open SQLite at `data/teasys.db`, run init SQL on first open
- `src/lib/server/auth.ts`:
  - `hashPassword(plain)` → bcrypt
  - `verifyPassword(plain, hash)` → bcrypt compare
  - `createSession(userId)` → insert row, return UUID
  - `getSessionUser(sessionId)` → join users, return user or null if expired
  - `deleteSession(sessionId)` → delete row
- `src/hooks.server.ts`:
  - Read `session_id` cookie
  - Call `getSessionUser`
  - Set `event.locals.user` (or null)
- `src/routes/login/+page.svelte` — simple email/password form
- `src/routes/login/+page.server.ts`:
  - `load`: redirect to `/` if already logged in
  - `actions.default`: verify credentials → set cookie → redirect
- `src/routes/logout/+server.ts`:
  - `POST`: delete session, clear cookie, redirect to `/login`
- `src/routes/admin/+layout.server.ts`:
  - Redirect to `/login` if no `locals.user`
- `src/routes/texts/[textId]/annotate/+page.server.ts`:
  - Redirect to `/login` if no `locals.user`
- `scripts/seed-admin.ts`:
  - Accept `--username` and `--password` args
  - Hash password and insert into users table

**Cookie config**: `httpOnly: true`, `sameSite: 'lax'`, `secure: true` in prod, `maxAge: 30 days`.

**Output**: Login flow works, protected routes redirect, session persists across requests.

---

## Phase 3 — Content Layer

**Goal**: All filesystem operations abstracted, text parsed into structured form, Zod validation enforced on read.

### `src/lib/server/validation.ts`
Zod schemas for:
- `TextMetadataSchema`
- `AnnotationLevelSchema` (validates Interpretation cannot be level 1)
- `AnnotationSchema`
- `CrossRefSchema`

### `src/lib/server/content.ts`
Functions:
- `listTexts()` → reads all `content/texts/*/metadata.json`, returns `TextMetadata[]`
- `getText(textId)` → returns `{ metadata, rawText }`
- `listAnnotations(textId)` → reads all JSON in `content/texts/[textId]/annotations/`
- `getAnnotation(textId, annotationId)` → single annotation
- `saveAnnotation(textId, annotation)` → write JSON, then trigger TEI regeneration
- `deleteAnnotation(textId, annotationId)` → delete file, regenerate TEI
- `saveTextMetadata(metadata)` → write metadata.json
- `saveTextContent(textId, text)` → write text.txt

All functions validate with Zod on read, throw typed errors on invalid data.

### `src/lib/server/textParser.ts`
- `parseText(rawText, type)` → returns `ParsedText`
- `ParsedText` is a union:
  - Poetry: `{ type: 'poetry', poems: Poem[] }` where `Poem = { title, stanzas: Line[][] }`
  - Prose: `{ type: 'prose', chapters: Chapter[] }` where `Chapter = { title, paragraphs: string[] }`
  - Drama: `{ type: 'drama', acts: Act[] }` where `Act = { title, scenes: Scene[] }`, `Scene = { title, blocks: Block[] }`, `Block = { type: 'stage'|'speech', speaker?: string, text: string }`
- Each line/paragraph/block has a `globalIndex` (sequential integer across whole text) used to anchor annotations and for line numbers in TEI.

### `src/lib/types/`
Full TypeScript interfaces for all data models (as defined in Data Models section above). Also export `AppLocals`:
```typescript
// in app.d.ts
declare namespace App {
  interface Locals {
    user: { id: number; username: string; role: 'admin' | 'editor' } | null;
  }
}
```

**Output**: Can call `listTexts()`, `getText()`, `listAnnotations()` and get typed, validated data.

---

## Phase 4 — Reading View

**Goal**: Public reading view with annotated text, clickable spans, annotation panel.

### `src/lib/constants.ts`
```typescript
export const CATEGORIES = ['language', 'form', 'intratextuality', 'intertextuality',
  'context', 'interpretation', 'textual-variants', 'questions'] as const;

export const CATEGORY_META: Record<Category, { label: string; color: string; bg: string }> = {
  language:        { label: 'Language',         color: '#2563eb', bg: '#dbeafe' },
  form:            { label: 'Form',              color: '#be185d', bg: '#fce7f3' },
  intratextuality: { label: 'Intratextuality',   color: '#047857', bg: '#d1fae5' },
  intertextuality: { label: 'Intertextuality',   color: '#b45309', bg: '#fef3c7' },
  context:         { label: 'Context',           color: '#6d28d9', bg: '#ede9fe' },
  interpretation:  { label: 'Interpretation',    color: '#b91c1c', bg: '#fee2e2' },
  'textual-variants': { label: 'Textual Variants', color: '#0369a1', bg: '#e0f2fe' },
  questions:       { label: 'Questions',         color: '#374151', bg: '#f3f4f6' },
};

// Which categories the first level of an annotation can have
export const LEVEL_1_ALLOWED_CATEGORIES = CATEGORIES.filter(c => c !== 'interpretation');
```

### `src/lib/utils/spanSplitter.ts`
Algorithm:
1. Collect all annotation `anchorStart` / `anchorEnd` as breakpoints (plus 0 and text.length)
2. Sort breakpoints
3. For each adjacent pair `[a, b]`, find all annotations where `start <= a && end >= b`
4. Return array of `TextSegment { text, start, end, annotationIds }`

This correctly handles: containment, partial overlap, identical spans, adjacent spans, unannotated regions (annotationIds = []).

### Components

**`TextSegment.svelte`**
- Props: `segment: TextSegment`, `annotations: Annotation[]`, `activeAnnotationId: string | null`
- If `annotationIds.length === 0`: render plain text
- If `annotationIds.length === 1`: render `<mark>` with category color from first level of L1 annotation
- If `annotationIds.length > 1`: render `<mark>` with neutral color + superscript count badge
- `on:click` → dispatch event with `annotationIds` to parent

**`AnchorPicker.svelte`**
- Shown when click returns `annotationIds.length > 1`
- Positioned near click point
- Lists each annotation: `[CategoryBadge] "[anchorText]" — [annotation title]`
- Click one → close picker, open AnnotationPanel for that ID

**`AnnotationPanel.svelte`**
- Slides in from right as a fixed sidebar (or bottom sheet on mobile)
- Header: annotation title + anchor quoted text
- Shows all levels in order (L1, L2, L3)
- Each level: level badge + category badge + body HTML + works cited list + any cross-refs
- Cross-refs render as clickable links that open the referenced annotation
- Close button (×) + Escape key to dismiss
- If user is editor: shows "Edit" button linking to annotate view

**`FilterBar.svelte`**
- Toggle buttons for L1/L2/L3 (multi-select)
- Toggle buttons for each of the 8 categories (multi-select)
- "Show all" / "Clear" controls
- Filtered state passed down to `AnnotatedText` which dims non-matching highlights

**`AnnotatedText.svelte`**
- Receives `parsedText`, `annotations`, `filters`
- Calls `splitIntoSegments` with the raw text and annotation spans
- For poetry: renders line numbers + `TextSegment` per line; line-level structure preserved
- For prose: renders paragraph blocks; each paragraph processed through span splitter independently
- For drama: renders speaker label / stage direction styling; span splitter per block

**`src/routes/+page.svelte`** (library)
- Grid of text cards: title, author, year, type badge, annotation count
- Link to reading view

**`src/routes/texts/[textId]/+page.svelte`**
- Layout: narrow text column (max ~65ch) + collapsible right sidebar
- Header: title, author, "Annotate" button (shown only to editors)
- FilterBar at top of text column
- AnnotatedText component
- AnnotationPanel (rendered outside text flow, fixed position)

**Output**: Public reading view fully functional, filters work, panel opens/closes cleanly.

---

## Phase 5 — Annotation Editor

**Goal**: Editors can select text, fill in the annotation form, save. Existing annotations can be edited/deleted.

### Text Selection Mechanism (`TextSelector.svelte`)

In annotate mode the text renders identically to the reading view, but:
1. `mouseup` event listener on the text container
2. `window.getSelection()` → extract selected text + compute char offsets relative to raw `text.txt` content (not DOM positions — needs a position mapping from segment layout)
3. Selection highlights in a neutral "pending" color
4. A floating "Add annotation" button appears near the selection end point
5. Clicking it opens `AnnotationForm` with the anchor pre-filled

**Offset mapping**: When `AnnotatedText` renders segments, each `TextSegment` knows its `start`/`end` in the raw text. The DOM `<span>` elements get `data-start` and `data-end` attributes. The selection handler walks `Selection.getRangeAt(0)`, finds the `data-start` of the start container and adds the intra-span offset.

### `AnnotationForm.svelte`

State:
```
title: string
anchorText: string (read-only, from selection)
anchorStart: number (from selection)
anchorEnd: number (from selection)
activeLevelIndex: number (0, 1, 2)
levels: LevelDraft[] (1–3 entries)
crossRefs: CrossRef[]
```

Layout:
- **Top**: Quoted anchor text in a styled block (read-only confirmation of what is being annotated)
- **Title field**: Short label for the annotation
- **Level tabs**: "Level 1" (always), "Level 2" (add button), "Level 3" (add button, only if L2 exists)
  - Removing a level removes all subsequent levels (can't have L3 without L2)
- **Active level panel** (`LevelEditor.svelte`):
  - Category dropdown (Interpretation disabled if level 1)
  - Markdown editor (textarea) for body
  - Works Cited list (add/remove plain text fields)
- **Cross-references section**:
  - Search field that queries existing annotations by title
  - Select level + category for the reference
  - Displayed as removable chips
- **Actions**: Save / Cancel / Delete (if editing existing)

### `MarkdownEditor.svelte`
- Plain `<textarea>` for input, renders Markdown preview alongside or below
- Supports Bold, Italic, Link, Lists, Blockquote via Markdown syntax
- `bind:value` — gets/sets Markdown string
- Shows placeholder: "Write your annotation here (Markdown supported)…"

### `WorksCitedEditor.svelte`
- Array of plain text inputs
- "Add source" button adds empty input
- "×" button on each removes it
- Pre-fills with OED citation format hint as placeholder

### Validation (client-side, before POST)
- Title must not be empty
- At least one level with a category and non-empty body
- Interpretation cannot be on level 1 (enforced in CategorySelect — option is disabled)
- Level 2 can only exist if level 1 exists (tab UI enforces this structurally)
- Works Cited: at least one entry per level (warn but don't block)

### `src/routes/texts/[textId]/annotate/+page.svelte`
- Same layout as reading view but with `TextSelector` wrapper
- Sidebar: list of all existing annotations (sortable by position / date)
  - Click existing annotation → load into `AnnotationForm` for editing
  - Shows author + date + level/category badges
- On save: POST to API, optimistically update annotation list, regenerate sidebar

**Output**: Full annotation create/edit/delete cycle working.

---

## Phase 6 — API Routes

**Goal**: Clean REST API, all writes validated with Zod, all protected routes check `locals.user`.

All routes in `src/routes/api/`:

### `texts/+server.ts`
- `GET` → `listTexts()` — public
- `POST` → create new text (auth required, admin only): validate body with Zod, call `saveTextMetadata` + `saveTextContent`

### `texts/[textId]/+server.ts`
- `GET` → `getText(textId)` — public
- `PUT` → update metadata (admin only)
- `DELETE` → delete entire text + all annotations + TEI file (admin only)

### `texts/[textId]/annotations/+server.ts`
- `GET` → `listAnnotations(textId)` — public
- `POST` → create annotation (auth required):
  - Parse + validate body with `AnnotationSchema`
  - Enforce: Interpretation not on L1
  - Assign UUID, set `author` from `locals.user.username`, set timestamps
  - Call `saveAnnotation` → write JSON → regenerate TEI
  - Return saved annotation

### `texts/[textId]/annotations/[annotationId]/+server.ts`
- `GET` → `getAnnotation` — public
- `PUT` → update (auth required, must be original author OR admin)
- `DELETE` → delete (auth required, must be original author OR admin) → regenerate TEI

### `texts/[textId]/export/+server.ts`
- `GET` → read generated `[textId].tei.xml`, return with `Content-Type: application/xml` and `Content-Disposition: attachment`

**Error format**: All errors return `{ error: string, details?: unknown }` with appropriate HTTP status.

---

## Phase 7 — TEI XML Generator

**Goal**: Valid TEI P5 XML auto-generated from text + annotations on every write.

### Strategy: standOff with `<anchor>` milestones

The primary text is stored and rendered from plain `text.txt`. For TEI, the generator:
1. Reads `text.txt` and all annotation JSON files
2. Collects all annotation span boundaries as character offsets
3. Inserts `<anchor xml:id="s{annotationId}"/>` and `<anchor xml:id="e{annotationId}"/>` at those positions into the text
4. Wraps in appropriate TEI structural elements per text type
5. Appends `<standOff><listAnnotation>` with one `<annotation>` per entry
6. Writes to `[textId].tei.xml`

### TEI Structure

**Poetry:**
```xml
<TEI xmlns="http://www.tei-c.org/ns/1.0">
  <teiHeader>
    <fileDesc>
      <titleStmt><title>Trench Poets</title><author>Edgell Rickword</author></titleStmt>
      <publicationStmt><p>TEASys Viewer</p></publicationStmt>
      <sourceDesc><p>Annotating Literature, Tübingen University</p></sourceDesc>
    </fileDesc>
  </teiHeader>
  <text><body>
    <lg type="poem" xml:id="poem1">
      <head>Trench Poets</head>
      <lg type="stanza" n="1">
        <l n="1" xml:id="l1">I knew a man, he was my
          <anchor xml:id="s-UUID-001"/>chum<anchor xml:id="e-UUID-001"/>,
        </l>
        ...
      </lg>
    </lg>
  </body></text>
  <standOff>
    <listAnnotation>
      <annotation xml:id="ann-UUID-001" from="#s-UUID-001" to="#e-UUID-001">
        <respStmt><resp>annotator</resp><name>Max Mustermann</name></respStmt>
        <date>2024-01-15</date>
        <div type="level" n="1">
          <div type="category" ana="#language">
            <p>The word "chum" is British slang for...</p>
            <listBibl><bibl>OED Online...</bibl></listBibl>
          </div>
        </div>
        <div type="level" n="2">
          <div type="category" ana="#interpretation">
            <p>The informal register here signals...</p>
          </div>
        </div>
      </annotation>
    </listAnnotation>
  </standOff>
</TEI>
```

**Prose**: same but uses `<div type="chapter">` containing `<p>` elements.
**Drama**: uses `<div type="act">` → `<div type="scene">` → `<sp>` (speech) and `<stage>` elements.

### `teiGenerator.ts`
- `generateTEI(textId)` → async, reads files, builds XML string, writes file
- Called by `saveAnnotation` and `deleteAnnotation` in `content.ts`
- XML is built with string templating (no DOM) for speed and zero dependencies
- Escapes all text content (`<`, `>`, `&`, `"`)
- Character offset insertion: build sorted list of insertion points, reconstruct text left-to-right inserting `<anchor>` tags at the right positions

---

## Phase 8 — Admin Interface

**Goal**: Editors can manage texts and user accounts via a web UI.

**Routes under `/admin/`** (all protected by layout `+layout.server.ts` checking `locals.user`):

### `/admin` — Dashboard
- Count of texts, total annotations
- List of recent activity (last 10 saved annotations across all texts)
- Quick links to manage texts / users

### `/admin/texts`
- Table of all texts: title, author, type, annotation count, created date
- "New text" button → opens TextForm
- "Edit metadata" per row
- "Delete" per row (with confirmation prompt showing annotation count)

**`TextForm.svelte`**:
- Fields: title, author, year (optional), type (poetry/prose/drama)
- Large textarea for text content (with format hint per type)
- On submit: POST to `/api/texts`

### `/admin/users`
- Table: username, role, created date, last session date
- "New user" button → opens UserForm
- "Change role" toggle per row (admin/editor)
- "Delete user" per row

**`UserForm.svelte`**:
- Fields: username, password, role
- Calls `/admin/users` form action (SvelteKit form action, not API route)

---

## Phase 9 — Polish

**Typography & layout:**
- `@tailwindcss/typography` for annotation body rendering (prose styles)
- Serif font for primary text (e.g. `font-serif`, or load EB Garamond/Lora)
- Sans-serif for UI chrome
- Line height ~1.8 for comfortable reading
- Max text column width: 65ch
- Subtle off-white background (`#fafaf9`) for text area

**Keyboard shortcuts:**
- `Escape`: close AnnotationPanel or AnchorPicker
- `Arrow keys` in AnchorPicker: navigate choices
- `Enter` in AnchorPicker: select focused choice

**Responsive:**
- Mobile: annotation panel as bottom sheet (slide up)
- Tablet: annotation panel as half-screen overlay
- Desktop: annotation panel as fixed right sidebar

**Loading/error states:**
- Loading skeleton for text content
- Toast notifications for save success/failure in editor
- Inline form errors

**Empty states:**
- "No annotations yet" message in reading view with link to annotate (if editor)
- "No texts yet" on library index with link to admin (if editor)

**`+error.svelte`**: Simple error page with message and home link.

---

## Implementation Order

1. Phase 1 — Setup (~1 session)
2. Phase 2 — Auth (~1 session)
3. Phase 3 — Content Layer (~1 session)
4. Phase 6 — API Routes (build alongside reading view, so data flows end-to-end)
5. Phase 4 — Reading View (~2 sessions, span splitter is the tricky part)
6. Phase 5 — Annotation Editor (~2 sessions, selection offset mapping is tricky)
7. Phase 7 — TEI Generator (~1 session)
8. Phase 8 — Admin (~1 session)
9. Phase 9 — Polish (~1 session)

---

## Open Questions (resolved)
- Overlap visual: Option B (single highlight + count badge) ✓
- Click behavior: Option iii (anchor picker modal) ✓
- Auth: Two-tier (Editor / Reader) ✓
- Workflow: Save = immediately visible ✓
- Text types: Poetry, Prose, Drama all from day 1 ✓
- Auth storage: SQLite ✓
- Content storage: Filesystem JSON ✓
- Framework: SvelteKit + adapter-node ✓
