# TEASys Viewer: Project History & Features

This document provides a comprehensive log of the features available in TEASys Viewer and the major development changes made to the project.

## Core Features Implemented

### 1. Robust Annotation System

- **Multi-Level Annotations**: Annotations can have multiple hierarchical levels (e.g., Surface, Context, Interpretation).
- **Categorization**: Strict tagging with standard categories (Language, Form, Intratextuality, Intertextuality, Background/Context, History of Interpretation, Textual Variants, Open Questions).
- **Overlapping Annotations**: Users can annotate text that overlaps with existing annotations. These are resolved seamlessly and users can **click-to-cycle** through multiple active annotations on a single text segment.
- **Title Annotations**: Text titles can be natively annotated, utilizing abstract negative offsets to prevent conflict with body text offsets.
- **Markdown & Cross-Referencing**: Annotations support rich Markdown formatting. You can link between annotations using a `[[annotation-id]]` syntax.
- **Works Cited**: Explicit field to capture bibliographical details, with automatic regex-based linkification for DOIs (e.g., automatically transforms `doi.org/...` strings into clickable links).

### 2. Supported Text Types

- **Poetry**: Automatic generation of line numbers and stanza groupings.
- **Prose**: Paragraph indexing.
- **Drama**: Support for acts, scenes, and stage directions.

### 3. Organization & Navigation

- **Author Profiles & Index**: Texts are grouped by author. The system dynamically generates an `/authors` index page and `/authors/[slug]` individual author profiles showing book counts, a bio, and portrait.
- **Pagefind Search**: Integrated static and localized fuzzy search lazy-loaded to keep base bundles minimal.
- **Breadcrumbs navigation**: Standardized semantic breadcrumb navigation across the site's interior routes.

### 4. Admin Dashboard

- **Role-Based Authentication**: Secure SQLite-based session auth with `admin` and `editor` roles.
- **Content Management**: Add, edit, or delete texts and authors through the admin panel.
- **Metadata Management**: Direct control over author details (bio, portraits, metadata).

### 5. Design & UI Experience

- **Typography Swap**: Utilizes `Gentium Plus` locally bundled via `@fontsource` to provide an elegant, legible body and heading typeface.
- **System-Aware Dark Mode**: Fully supported dark theme that flips internal semantic classes (`surface`, `gray`) cleanly, preventing flashes of unstyled content utilizing a local storage check on application render.
- **Line Alignment**: Poem line numbers and paragraph indices are strictly `items-baseline` flex-aligned so numerals sit flush with the accompanying text font geometries.
- **No-Flash Static HTML**: Minimized JavaScript logic during CSS color switching.

## Major Development Tasks Completed

Below is a chronological list of recent refinements and fixes pushed to the application:

1. **Migration & Base Expansion**:
   - Built a Svelte 5 application leveraging Tailwind CSS v4 over former monolithic PHP structure.
   - Refined JSON corpus parsing engine (`textParser.ts`), adding edge-case validations and improved offset calculations.
2. **Author Pages generation**:
   - Created `/authors` and `/authors/[slug]` dynamic routes.
   - Implemented a robust URL slugification utility (`slug.ts`).
3. **Advanced Interactivity**:
   - Replaced clunky `AnchorPicker` UI dialog with an intuitive **click-to-cycle pointer event**, streamlining reading operations.
   - Allowed annotation of poetry titles by treating them as synthetic headers.
4. **Style Polish & Corrections**:
   - Adopted a clean aesthetic replacing old background radii and spotlights.
   - Vertically center-aligned textual marginalia (line numbers) for precise baseline matching.
   - Ensured Works Cited textual properties perfectly match Annotation rendering properties.
   - Added `impressum` and dynamic layout footers.
5. **Dark Mode Integration**:
   - Mapped semantic layout tokens (`bg-surface-card`, `bg-surface-elevated`) across all components.
   - Overrode default Tailwind CSS var scopes specifically targeting `html.dark`.
