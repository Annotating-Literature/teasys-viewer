import { listTexts, getAnnotationCount, listAuthorDirectories, getAuthorProfile } from './content-DzBBz6_I.js';
import { s as slugify } from './slug-CnYtB6EQ.js';
import 'fs/promises';
import 'path';

const load = async () => {
  const texts = await listTexts();
  const authorMap = /* @__PURE__ */ new Map();
  for (const text of texts) {
    const slug = slugify(text.author);
    if (!authorMap.has(slug)) {
      authorMap.set(slug, {
        name: text.author,
        slug,
        textCount: 0,
        annotationCount: 0,
        types: /* @__PURE__ */ new Set()
      });
    }
    const entry = authorMap.get(slug);
    entry.textCount++;
    entry.types.add(text.type);
    const count = await getAnnotationCount(text.id);
    entry.annotationCount += count;
  }
  const standaloneAuthors = await listAuthorDirectories();
  for (const sa of standaloneAuthors) {
    if (!authorMap.has(sa.slug)) {
      authorMap.set(sa.slug, {
        name: sa.name,
        slug: sa.slug,
        textCount: 0,
        annotationCount: 0,
        types: /* @__PURE__ */ new Set()
      });
    }
  }
  const authorList = Array.from(authorMap.values()).map((a) => ({
    name: a.name,
    slug: a.slug,
    textCount: a.textCount,
    annotationCount: a.annotationCount,
    types: Array.from(a.types)
  })).sort((a, b) => a.name.localeCompare(b.name));
  const authors = await Promise.all(
    authorList.map(async (a) => {
      const profile = await getAuthorProfile(a.slug);
      return {
        ...a,
        portraitPath: profile?.portraitPath ?? null,
        birthYear: profile?.birthYear ?? null,
        deathYear: profile?.deathYear ?? null
      };
    })
  );
  return { authors };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 12;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-B0XEZfQ5.js')).default;
const server_id = "src/routes/authors/+page.server.ts";
const imports = ["_app/immutable/nodes/12.4CdrfH1g.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/Cy30Bi6B.js","_app/immutable/chunks/Dlad0eN8.js","_app/immutable/chunks/DsjihQKJ.js","_app/immutable/chunks/DP48GSDs.js","_app/immutable/chunks/CR2qLiVv.js","_app/immutable/chunks/DBQdzsR4.js","_app/immutable/chunks/CXNM2av5.js","_app/immutable/chunks/ShcMrO15.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=12-CmQUkbmh.js.map
