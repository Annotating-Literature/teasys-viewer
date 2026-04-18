import { r as redirect, e as error } from './index-B2LGyy1l.js';
import { getText, listAnnotations } from './content-DzBBz6_I.js';
import { p as parseText } from './textParser-yEPjp0AV.js';
import 'fs/promises';
import 'path';

const load = async ({ locals, params }) => {
  if (!locals.user) {
    throw redirect(302, "/login");
  }
  try {
    const text = await getText(params.textId);
    if (text.metadata.type === "collection") {
      throw redirect(303, `/texts/${params.textId}`);
    }
    const annotations = await listAnnotations(params.textId);
    const parsedText = parseText(text.rawText, text.metadata.type);
    return {
      user: locals.user,
      text,
      annotations,
      parsedText
    };
  } catch (e) {
    throw error(404, "Text not found");
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 16;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-BUDLpilF.js')).default;
const server_id = "src/routes/texts/[textId]/annotate/+page.server.ts";
const imports = ["_app/immutable/nodes/16.Dhf-l4im.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/Cy30Bi6B.js","_app/immutable/chunks/Dlad0eN8.js","_app/immutable/chunks/DsjihQKJ.js","_app/immutable/chunks/DP48GSDs.js","_app/immutable/chunks/CR2qLiVv.js","_app/immutable/chunks/DBQdzsR4.js","_app/immutable/chunks/CXNM2av5.js","_app/immutable/chunks/BBcsKPiw.js","_app/immutable/chunks/aX7IRqrA.js","_app/immutable/chunks/BDNO5S8S.js","_app/immutable/chunks/BcUw28Pf.js","_app/immutable/chunks/DlD15Zhy.js","_app/immutable/chunks/BNJKe7Ty.js","_app/immutable/chunks/Cf9kNodC.js","_app/immutable/chunks/DS6GD7R7.js","_app/immutable/chunks/DVHVI5O2.js","_app/immutable/chunks/BLbPi5EO.js","_app/immutable/chunks/i_gIkIP3.js","_app/immutable/chunks/NDjzLCLq.js"];
const stylesheets = ["_app/immutable/assets/16.Dmn56atr.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=16-CkBYu9y3.js.map
