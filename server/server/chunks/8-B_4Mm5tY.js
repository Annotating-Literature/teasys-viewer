import { d as deletePage, l as listPages } from './pages-BKVKuvbN.js';
import { f as fail } from './index-B2LGyy1l.js';
import 'fs/promises';
import 'path';

const load = async () => {
  const pages = await listPages();
  return { pages };
};
const actions = {
  delete: async ({ request }) => {
    const data = await request.formData();
    const slug = data.get("slug")?.toString();
    if (slug) {
      try {
        await deletePage(slug);
        return { success: true };
      } catch (e) {
        return fail(500, { error: "Failed to delete page" });
      }
    }
    return fail(400, { error: "Missing slug" });
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  actions: actions,
  load: load
});

const index = 8;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-B0oEB2Hg.js')).default;
const server_id = "src/routes/admin/pages/+page.server.ts";
const imports = ["_app/immutable/nodes/8.B0lN5foD.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/Cy30Bi6B.js","_app/immutable/chunks/Dlad0eN8.js","_app/immutable/chunks/DsjihQKJ.js","_app/immutable/chunks/DP48GSDs.js","_app/immutable/chunks/CR2qLiVv.js","_app/immutable/chunks/DBQdzsR4.js","_app/immutable/chunks/CC-GJfqR.js","_app/immutable/chunks/CXNM2av5.js","_app/immutable/chunks/BBcsKPiw.js","_app/immutable/chunks/ShcMrO15.js","_app/immutable/chunks/DKTMO72l.js","_app/immutable/chunks/ClOgXLPN.js","_app/immutable/chunks/DLVpGK2M.js","_app/immutable/chunks/BNJKe7Ty.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=8-B_4Mm5tY.js.map
