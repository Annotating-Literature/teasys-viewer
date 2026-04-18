import { listTexts, listAnnotations, listAuthorDirectories } from './content-DzBBz6_I.js';
import { s as slugify } from './slug-CnYtB6EQ.js';
import 'fs/promises';
import 'path';

const load = async () => {
  const texts = await listTexts();
  const textsWithAnnotations = await Promise.all(
    texts.map(async (text) => {
      const annotations = await listAnnotations(text.id);
      return { ...text, annotations };
    })
  );
  const standaloneAuthors = await listAuthorDirectories();
  const textAuthorSlugs = new Set(texts.map((t) => slugify(t.author)));
  const extraAuthors = standaloneAuthors.filter((a) => !textAuthorSlugs.has(a.slug));
  const allAnnotations = textsWithAnnotations.flatMap((t) => t.annotations);
  const contributors = /* @__PURE__ */ new Set();
  for (const ann of allAnnotations) {
    for (const a of ann.authors) contributors.add(a);
  }
  const levelCounts = { 1: 0, 2: 0, 3: 0 };
  const categoryCounts = {};
  for (const ann of allAnnotations) {
    for (const lvl of ann.levels) {
      levelCounts[lvl.level] = (levelCounts[lvl.level] || 0) + 1;
      categoryCounts[lvl.category] = (categoryCounts[lvl.category] || 0) + 1;
    }
  }
  const mostAnnotated = textsWithAnnotations.length > 0 ? textsWithAnnotations.reduce(
    (best, t) => t.annotations.length > best.annotations.length ? t : best
  ) : null;
  const mostRecent = allAnnotations.length > 0 ? allAnnotations.reduce(
    (latest, ann) => ann.updatedAt > latest.updatedAt ? ann : latest
  ) : null;
  const avgAnnotations = texts.length > 0 ? Math.round(allAnnotations.length / texts.length * 10) / 10 : 0;
  const totalCrossRefs = allAnnotations.reduce((sum, ann) => {
    const fullBody = ann.levels.map((l) => l.body).join("\n");
    const matches = fullBody.match(/\[\[([^\]]+)\]\]/g);
    return sum + (matches ? matches.length : 0);
  }, 0);
  const totalWorksCited = allAnnotations.reduce((sum, ann) => sum + ann.levels.reduce((s, l) => s + l.worksCited.length, 0), 0);
  const stats = {
    contributors: contributors.size,
    contributorNames: Array.from(contributors).sort(),
    levelCounts,
    categoryCounts: Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]),
    mostAnnotated: mostAnnotated ? {
      title: mostAnnotated.title,
      id: mostAnnotated.id,
      count: mostAnnotated.annotations.length
    } : null,
    mostRecent: mostRecent ? {
      anchorText: mostRecent.anchorText,
      updatedAt: mostRecent.updatedAt,
      authors: mostRecent.authors
    } : null,
    avgAnnotations,
    totalCrossRefs,
    totalWorksCited
  };
  return { textsWithAnnotations, extraAuthors, stats };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 6;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-D6UHoPK-.js')).default;
const server_id = "src/routes/admin/+page.server.ts";
const imports = ["_app/immutable/nodes/6.B70NLuCZ.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/Cy30Bi6B.js","_app/immutable/chunks/Dlad0eN8.js","_app/immutable/chunks/DsjihQKJ.js","_app/immutable/chunks/DP48GSDs.js","_app/immutable/chunks/CR2qLiVv.js","_app/immutable/chunks/DBQdzsR4.js","_app/immutable/chunks/CXNM2av5.js","_app/immutable/chunks/BBcsKPiw.js","_app/immutable/chunks/aX7IRqrA.js","_app/immutable/chunks/RIzggJLg.js","_app/immutable/chunks/BcUw28Pf.js","_app/immutable/chunks/DlD15Zhy.js","_app/immutable/chunks/BNJKe7Ty.js","_app/immutable/chunks/ShcMrO15.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=6-BPt4Bp9b.js.map
