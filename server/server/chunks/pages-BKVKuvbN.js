import fs from 'fs/promises';
import path from 'path';

const PAGES_DIR = path.resolve("content", "pages");
async function listPages() {
  try {
    await fs.access(PAGES_DIR);
  } catch {
    await fs.mkdir(PAGES_DIR, { recursive: true });
  }
  const entries = await fs.readdir(PAGES_DIR, { withFileTypes: true });
  const dirs = entries.filter((e) => e.isDirectory());
  const pages = [];
  for (const dir of dirs) {
    const metaPath = path.join(PAGES_DIR, dir.name, "metadata.json");
    try {
      const raw = await fs.readFile(metaPath, "utf-8");
      const parsed = JSON.parse(raw);
      pages.push(parsed);
    } catch (err) {
      console.warn(`Skipping invalid or missing metadata for page ${dir.name}:`, err);
    }
  }
  return pages.sort((a, b) => a.title.localeCompare(b.title));
}
async function getPage(slug) {
  try {
    const pageDir = path.join(PAGES_DIR, slug);
    const metaPath = path.join(pageDir, "metadata.json");
    const contentPath = path.join(pageDir, "content.md");
    const metaRaw = await fs.readFile(metaPath, "utf-8");
    const metadata = JSON.parse(metaRaw);
    const content = await fs.readFile(contentPath, "utf-8");
    return { metadata, content };
  } catch (err) {
    throw new Error(`Page not found: ${slug}`);
  }
}
async function savePage(slug, title, content, menu = true, parent = "") {
  const pageDir = path.join(PAGES_DIR, slug);
  await fs.mkdir(pageDir, { recursive: true });
  const metaPath = path.join(pageDir, "metadata.json");
  const contentPath = path.join(pageDir, "content.md");
  let metadata;
  try {
    const metaRaw = await fs.readFile(metaPath, "utf-8");
    metadata = JSON.parse(metaRaw);
    metadata.title = title;
    metadata.menu = menu;
    metadata.parent = parent || void 0;
    metadata.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
  } catch {
    metadata = {
      id: slug,
      title,
      menu,
      parent: parent || void 0,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
  }
  await fs.writeFile(metaPath, JSON.stringify(metadata, null, 2), "utf-8");
  await fs.writeFile(contentPath, content, "utf-8");
  return metadata;
}
async function deletePage(slug) {
  const pageDir = path.join(PAGES_DIR, slug);
  await fs.rm(pageDir, { recursive: true, force: true });
}

export { deletePage as d, getPage as g, listPages as l, savePage as s };
//# sourceMappingURL=pages-BKVKuvbN.js.map
