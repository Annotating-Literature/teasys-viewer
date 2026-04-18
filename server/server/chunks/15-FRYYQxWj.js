import { e as error } from './index-B2LGyy1l.js';
import { getText, listTexts, listAnnotations } from './content-DzBBz6_I.js';
import { p as parseText } from './textParser-yEPjp0AV.js';
import 'fs/promises';
import 'path';

const load = async ({ params, parent }) => {
  try {
    const { user } = await parent();
    const text = await getText(params.textId);
    let parsedText = null;
    let annotations = [];
    let children = [];
    if (text.metadata.type === "collection") {
      const allTexts = await listTexts();
      children = allTexts.filter((t) => t.parentId === text.metadata.id).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    } else {
      annotations = await listAnnotations(params.textId);
      parsedText = parseText(text.rawText, text.metadata.type);
    }
    return { text, annotations, parsedText, children, user };
  } catch (e) {
    console.error(e);
    throw error(404, "Text not found");
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 15;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-U-OVARm9.js')).default;
const server_id = "src/routes/texts/[textId]/+page.server.ts";
const imports = ["_app/immutable/nodes/15.D3AzR1Y-.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/Cy30Bi6B.js","_app/immutable/chunks/Dlad0eN8.js","_app/immutable/chunks/DsjihQKJ.js","_app/immutable/chunks/DP48GSDs.js","_app/immutable/chunks/CR2qLiVv.js","_app/immutable/chunks/DBQdzsR4.js","_app/immutable/chunks/CXNM2av5.js","_app/immutable/chunks/BBcsKPiw.js","_app/immutable/chunks/aX7IRqrA.js","_app/immutable/chunks/DVHVI5O2.js","_app/immutable/chunks/BDNO5S8S.js","_app/immutable/chunks/BcUw28Pf.js","_app/immutable/chunks/DlD15Zhy.js","_app/immutable/chunks/BNJKe7Ty.js","_app/immutable/chunks/Cf9kNodC.js","_app/immutable/chunks/i_gIkIP3.js","_app/immutable/chunks/ShcMrO15.js","_app/immutable/chunks/USo26ZfE.js"];
const stylesheets = ["_app/immutable/assets/16.Dmn56atr.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=15-FRYYQxWj.js.map
