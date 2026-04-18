import { listTexts, listAuthorDirectories, listAnnotations, getAuthorProfile } from './content-DzBBz6_I.js';
import { f as findAuthorBySlug, s as slugify } from './slug-CnYtB6EQ.js';
import { e as error } from './index-B2LGyy1l.js';
import 'fs/promises';
import 'path';

const load = async ({ params, parent }) => {
  const { user } = await parent();
  const allTexts = await listTexts();
  let authorName = findAuthorBySlug(allTexts, params.authorSlug);
  if (!authorName) {
    const standaloneAuthors = await listAuthorDirectories();
    const standalone = standaloneAuthors.find((a) => a.slug === params.authorSlug);
    if (standalone) {
      authorName = standalone.name;
    }
  }
  if (!authorName) {
    throw error(404, "Author not found");
  }
  const authorTexts = allTexts.filter((t) => slugify(t.author) === params.authorSlug);
  authorTexts.sort((a, b) => a.title.localeCompare(b.title));
  const textsWithCounts = await Promise.all(
    authorTexts.map(async (text) => {
      const annotations = await listAnnotations(text.id);
      return { ...text, annotationCount: annotations.length };
    })
  );
  const profile = await getAuthorProfile(params.authorSlug);
  return {
    author: authorName,
    slug: params.authorSlug,
    texts: textsWithCounts,
    bio: profile?.bio ?? "",
    portraitPath: profile?.portraitPath ?? null,
    birthYear: profile?.birthYear ?? null,
    deathYear: profile?.deathYear ?? null,
    photoCredit: profile?.photoCredit ?? null,
    photoCreditUrl: profile?.photoCreditUrl ?? null,
    user
  };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 13;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-Cq7sDsV9.js')).default;
const server_id = "src/routes/authors/[authorSlug]/+page.server.ts";
const imports = ["_app/immutable/nodes/13.BkJTOWph.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/Cy30Bi6B.js","_app/immutable/chunks/Dlad0eN8.js","_app/immutable/chunks/DsjihQKJ.js","_app/immutable/chunks/DP48GSDs.js","_app/immutable/chunks/CR2qLiVv.js","_app/immutable/chunks/Cf9kNodC.js","_app/immutable/chunks/DBQdzsR4.js","_app/immutable/chunks/CXNM2av5.js","_app/immutable/chunks/i_gIkIP3.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=13-1lPsuMu3.js.map
