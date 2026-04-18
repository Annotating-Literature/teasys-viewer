import { saveAuthorProfile, saveAuthorPortrait, listTexts, getAuthorProfile } from './content-DzBBz6_I.js';
import { f as findAuthorBySlug } from './slug-CnYtB6EQ.js';
import { f as fail, r as redirect, e as error } from './index-B2LGyy1l.js';
import 'fs/promises';
import 'path';

const load = async ({ params }) => {
  const allTexts = await listTexts();
  const authorName = findAuthorBySlug(allTexts, params.authorSlug);
  if (!authorName) {
    throw error(404, "Author not found");
  }
  const profile = await getAuthorProfile(params.authorSlug);
  return {
    author: authorName,
    slug: params.authorSlug,
    bio: profile?.bio ?? "",
    portraitPath: profile?.portraitPath ?? null,
    birthYear: profile?.birthYear ?? null,
    deathYear: profile?.deathYear ?? null,
    photoCredit: profile?.photoCredit ?? null,
    photoCreditUrl: profile?.photoCreditUrl ?? null
  };
};
const actions = {
  default: async ({ request, params }) => {
    const formData = await request.formData();
    const bio = formData.get("bio");
    const portrait = formData.get("portrait");
    const birthYearRaw = formData.get("birthYear");
    const deathYearRaw = formData.get("deathYear");
    const photoCredit = formData.get("photoCredit");
    const photoCreditUrl = formData.get("photoCreditUrl");
    if (bio !== null) {
      await saveAuthorProfile(params.authorSlug, bio);
    }
    const fs = await import('fs/promises');
    const path = await import('path');
    const { AUTHORS_DIR } = await import('./content-DzBBz6_I.js');
    const authorDir = path.join(AUTHORS_DIR, params.authorSlug);
    await fs.mkdir(authorDir, { recursive: true });
    let meta = {};
    try {
      const raw = await fs.readFile(path.join(authorDir, "metadata.json"), "utf-8");
      meta = JSON.parse(raw);
    } catch {
    }
    if (birthYearRaw) meta.birthYear = parseInt(birthYearRaw, 10);
    else delete meta.birthYear;
    if (deathYearRaw) meta.deathYear = parseInt(deathYearRaw, 10);
    else delete meta.deathYear;
    if (photoCredit) meta.photoCredit = photoCredit;
    else delete meta.photoCredit;
    if (photoCreditUrl) meta.photoCreditUrl = photoCreditUrl;
    else delete meta.photoCreditUrl;
    await fs.writeFile(path.join(authorDir, "metadata.json"), JSON.stringify(meta, null, 2), "utf-8");
    if (portrait && portrait.size > 0) {
      const ext = portrait.name.split(".").pop()?.toLowerCase() ?? "jpg";
      if (!["jpg", "jpeg", "png", "webp"].includes(ext)) {
        return fail(400, { error: "Invalid image format. Use JPG, PNG, or WebP." });
      }
      const buffer = Buffer.from(await portrait.arrayBuffer());
      await saveAuthorPortrait(params.authorSlug, buffer, ext);
    }
    throw redirect(303, `/admin/authors/${params.authorSlug}`);
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  actions: actions,
  load: load
});

const index = 7;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-Bt_1Dq0e.js')).default;
const server_id = "src/routes/admin/authors/[authorSlug]/+page.server.ts";
const imports = ["_app/immutable/nodes/7.DWs6LlaU.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/Cy30Bi6B.js","_app/immutable/chunks/Dlad0eN8.js","_app/immutable/chunks/DsjihQKJ.js","_app/immutable/chunks/DP48GSDs.js","_app/immutable/chunks/DBQdzsR4.js","_app/immutable/chunks/CXNM2av5.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=7-CFa-G5yp.js.map
