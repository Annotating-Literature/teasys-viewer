import { listTexts, getAnnotationCount } from './content-DzBBz6_I.js';
import 'fs/promises';
import 'path';

const load = async ({ parent }) => {
  const { user } = await parent();
  const texts = await listTexts();
  texts.sort((a, b) => a.title.localeCompare(b.title));
  const textsWithCounts = await Promise.all(
    texts.map(async (text) => {
      const annotationCount = await getAnnotationCount(text.id);
      return { ...text, annotationCount };
    })
  );
  const groupedTexts = {
    poetry: [],
    prose: [],
    drama: [],
    collection: []
  };
  for (const text of textsWithCounts) {
    if (groupedTexts[text.type] && !text.parentId) {
      groupedTexts[text.type].push(text);
    }
  }
  return { groupedTexts, user };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 4;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-CtGPgk0q.js')).default;
const server_id = "src/routes/+page.server.ts";
const imports = ["_app/immutable/nodes/4.BvsK991k.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/Cy30Bi6B.js","_app/immutable/chunks/Dlad0eN8.js","_app/immutable/chunks/DsjihQKJ.js","_app/immutable/chunks/DP48GSDs.js","_app/immutable/chunks/CR2qLiVv.js","_app/immutable/chunks/DBQdzsR4.js","_app/immutable/chunks/CXNM2av5.js","_app/immutable/chunks/RIzggJLg.js","_app/immutable/chunks/BBcsKPiw.js","_app/immutable/chunks/BcUw28Pf.js","_app/immutable/chunks/DlD15Zhy.js","_app/immutable/chunks/BNJKe7Ty.js","_app/immutable/chunks/USo26ZfE.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=4-Dd_Dtdtu.js.map
