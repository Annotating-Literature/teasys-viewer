import { s as savePage, l as listPages, g as getPage } from './pages-BKVKuvbN.js';
import { f as fail, r as redirect } from './index-B2LGyy1l.js';
import { s as slugify } from './slug-CnYtB6EQ.js';
import 'fs/promises';
import 'path';

const load = async ({ params }) => {
  const allPages = await listPages();
  if (params.slug === "new") {
    return {
      page: null,
      content: "",
      allPages
    };
  }
  try {
    const page = await getPage(params.slug);
    return {
      page: page.metadata,
      content: page.content,
      allPages
    };
  } catch (e) {
    throw redirect(303, "/admin/pages");
  }
};
const actions = {
  default: async ({ request, params }) => {
    const data = await request.formData();
    const title = data.get("title")?.toString();
    const content = data.get("content")?.toString() || "";
    const menu = data.get("menu") === "on";
    const parent = data.get("parent")?.toString() || "";
    if (!title) {
      return fail(400, { error: "Title is required", title, content });
    }
    let slug = params.slug;
    if (slug === "new") {
      slug = slugify(title);
    }
    try {
      await savePage(slug, title, content, menu, parent);
    } catch (e) {
      return fail(500, { error: "Failed to save page", title, content });
    }
    if (params.slug === "new") {
      throw redirect(303, `/admin/pages/${slug}`);
    }
    return { success: true };
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  actions: actions,
  load: load
});

const index = 9;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-VFMyfIrW.js')).default;
const server_id = "src/routes/admin/pages/[slug]/+page.server.ts";
const imports = ["_app/immutable/nodes/9.Bp-V4866.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/Cy30Bi6B.js","_app/immutable/chunks/Dlad0eN8.js","_app/immutable/chunks/DsjihQKJ.js","_app/immutable/chunks/DP48GSDs.js","_app/immutable/chunks/CR2qLiVv.js","_app/immutable/chunks/DBQdzsR4.js","_app/immutable/chunks/CC-GJfqR.js","_app/immutable/chunks/CXNM2av5.js","_app/immutable/chunks/DS6GD7R7.js","_app/immutable/chunks/DVHVI5O2.js","_app/immutable/chunks/BLbPi5EO.js","_app/immutable/chunks/DlD15Zhy.js","_app/immutable/chunks/BNJKe7Ty.js","_app/immutable/chunks/ShcMrO15.js","_app/immutable/chunks/DKTMO72l.js","_app/immutable/chunks/ClOgXLPN.js","_app/immutable/chunks/DLVpGK2M.js","_app/immutable/chunks/CT34IjU1.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=9-BuOkdUU8.js.map
