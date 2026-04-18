import { g as getPage } from './pages-BKVKuvbN.js';
import { listTexts } from './content-DzBBz6_I.js';
import { e as error } from './index-B2LGyy1l.js';
import { g } from './marked.esm-9kFglIxa.js';
import DOMPurify from 'isomorphic-dompurify';
import 'fs/promises';
import 'path';

const load = async ({ params }) => {
  try {
    const page = await getPage(params.slug);
    const applySmartQuotes = (text) => {
      return text.replace(/(^|[-\u2014\s(\["])'/g, "$1‘").replace(/'/g, "’").replace(/(^|[-\u2014/\[(\u2018\s])"/g, "$1“").replace(/"/g, "”");
    };
    const processedContent = applySmartQuotes(page.content);
    const rawHtml = await g.parse(processedContent);
    const htmlContent = DOMPurify.sanitize(rawHtml);
    const categoryTypes = ["poetry", "prose", "drama"];
    let categoryTexts = null;
    if (categoryTypes.includes(params.slug)) {
      const allTexts = await listTexts();
      categoryTexts = allTexts.filter((t) => t.type === params.slug && !t.parentId).sort((a, b) => {
        const catCmp = (a.category || "").localeCompare(b.category || "");
        if (catCmp !== 0) return catCmp;
        const authCmp = a.author.localeCompare(b.author);
        if (authCmp !== 0) return authCmp;
        return a.title.localeCompare(b.title);
      });
    }
    return {
      page: page.metadata,
      htmlContent,
      categoryTexts
    };
  } catch (e) {
    throw error(404, "Page not found");
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 5;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-D6dEUx6x.js')).default;
const server_id = "src/routes/[slug]/+page.server.ts";
const imports = ["_app/immutable/nodes/5.OHc384JA.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/Cy30Bi6B.js","_app/immutable/chunks/Dlad0eN8.js","_app/immutable/chunks/DsjihQKJ.js","_app/immutable/chunks/DP48GSDs.js","_app/immutable/chunks/CR2qLiVv.js","_app/immutable/chunks/Cf9kNodC.js","_app/immutable/chunks/DBQdzsR4.js","_app/immutable/chunks/CXNM2av5.js","_app/immutable/chunks/ShcMrO15.js","_app/immutable/chunks/USo26ZfE.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=5-B5Al3ob1.js.map
