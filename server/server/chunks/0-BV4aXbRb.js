import { listTexts } from './content-DzBBz6_I.js';
import { l as listPages } from './pages-BKVKuvbN.js';
import 'fs/promises';
import 'path';

const load = async ({ locals }) => {
  const texts = await listTexts();
  const availableTypes = [...new Set(texts.map((t) => t.type))];
  const pages = await listPages();
  return {
    user: locals.user,
    availableTypes,
    pages
  };
};

var _layout_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 0;
let component_cache;
const component = async () => component_cache ??= (await import('./_layout.svelte-YCg3WKad.js')).default;
const server_id = "src/routes/+layout.server.ts";
const imports = ["_app/immutable/nodes/0.BvlazBpd.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/Cy30Bi6B.js","_app/immutable/chunks/NDjzLCLq.js","_app/immutable/chunks/DP48GSDs.js","_app/immutable/chunks/CTMADYky.js","_app/immutable/chunks/Dlad0eN8.js","_app/immutable/chunks/DsjihQKJ.js","_app/immutable/chunks/CR2qLiVv.js","_app/immutable/chunks/CC-GJfqR.js","_app/immutable/chunks/CXNM2av5.js","_app/immutable/chunks/BBcsKPiw.js","_app/immutable/chunks/BcUw28Pf.js","_app/immutable/chunks/DlD15Zhy.js","_app/immutable/chunks/BNJKe7Ty.js","_app/immutable/chunks/DLVpGK2M.js","_app/immutable/chunks/B0wOLG0j.js","_app/immutable/chunks/Cms0Dx7A.js"];
const stylesheets = ["_app/immutable/assets/0.CBmYrmH-.css"];
const fonts = ["_app/immutable/assets/gentium-plus-cyrillic-ext-400-normal.CJ4YKexy.woff2","_app/immutable/assets/gentium-plus-cyrillic-ext-400-normal.B9Nl3F-2.woff","_app/immutable/assets/gentium-plus-cyrillic-400-normal.BKY-Jqah.woff2","_app/immutable/assets/gentium-plus-cyrillic-400-normal.2gl_A-Tn.woff","_app/immutable/assets/gentium-plus-greek-ext-400-normal.DOc93t8p.woff2","_app/immutable/assets/gentium-plus-greek-ext-400-normal.Vs3SB95H.woff","_app/immutable/assets/gentium-plus-greek-400-normal.FlMNHri1.woff2","_app/immutable/assets/gentium-plus-greek-400-normal.CYsP5XPD.woff","_app/immutable/assets/gentium-plus-vietnamese-400-normal.lfG8qd7w.woff2","_app/immutable/assets/gentium-plus-vietnamese-400-normal.C_3yQKPY.woff","_app/immutable/assets/gentium-plus-latin-ext-400-normal.BID1L8QP.woff2","_app/immutable/assets/gentium-plus-latin-ext-400-normal.B46t2ITS.woff","_app/immutable/assets/gentium-plus-latin-400-normal.Bx4sytbw.woff2","_app/immutable/assets/gentium-plus-latin-400-normal.CBUjaU8k.woff","_app/immutable/assets/gentium-plus-cyrillic-ext-400-italic.C1z13Y30.woff2","_app/immutable/assets/gentium-plus-cyrillic-ext-400-italic.DSWs7lFu.woff","_app/immutable/assets/gentium-plus-cyrillic-400-italic.DQXVPpCp.woff2","_app/immutable/assets/gentium-plus-cyrillic-400-italic.BjmfxNiF.woff","_app/immutable/assets/gentium-plus-greek-ext-400-italic.FDP_zPGX.woff2","_app/immutable/assets/gentium-plus-greek-ext-400-italic.BFbDRHPp.woff","_app/immutable/assets/gentium-plus-greek-400-italic.DX6gAVRV.woff2","_app/immutable/assets/gentium-plus-greek-400-italic.KkeI8_iU.woff","_app/immutable/assets/gentium-plus-vietnamese-400-italic.BS87EaK5.woff2","_app/immutable/assets/gentium-plus-vietnamese-400-italic.H8_5wHOb.woff","_app/immutable/assets/gentium-plus-latin-ext-400-italic.BHhmV4nS.woff2","_app/immutable/assets/gentium-plus-latin-ext-400-italic.Huj9dzRX.woff","_app/immutable/assets/gentium-plus-latin-400-italic.D6OoM5cr.woff2","_app/immutable/assets/gentium-plus-latin-400-italic.T5fZmFZn.woff","_app/immutable/assets/gentium-plus-cyrillic-ext-700-normal.C1kZgXRF.woff2","_app/immutable/assets/gentium-plus-cyrillic-ext-700-normal.gYojOTBQ.woff","_app/immutable/assets/gentium-plus-cyrillic-700-normal.B1zLRpU8.woff2","_app/immutable/assets/gentium-plus-cyrillic-700-normal.e9QLjvGk.woff","_app/immutable/assets/gentium-plus-greek-ext-700-normal.DNiA9UMu.woff2","_app/immutable/assets/gentium-plus-greek-ext-700-normal.NrbSlVQg.woff","_app/immutable/assets/gentium-plus-greek-700-normal.DaGysG3y.woff2","_app/immutable/assets/gentium-plus-greek-700-normal.MT5fSVwO.woff","_app/immutable/assets/gentium-plus-vietnamese-700-normal.gkMvyLtE.woff2","_app/immutable/assets/gentium-plus-vietnamese-700-normal.BgmbUFXW.woff","_app/immutable/assets/gentium-plus-latin-ext-700-normal.3Uomgn00.woff2","_app/immutable/assets/gentium-plus-latin-ext-700-normal.Cs_Pxez5.woff","_app/immutable/assets/gentium-plus-latin-700-normal.R26OWV_q.woff2","_app/immutable/assets/gentium-plus-latin-700-normal.CXsr-dHq.woff","_app/immutable/assets/gentium-plus-cyrillic-ext-700-italic.DK3_OvY4.woff2","_app/immutable/assets/gentium-plus-cyrillic-ext-700-italic.D3c1NxSi.woff","_app/immutable/assets/gentium-plus-cyrillic-700-italic.CAXKFndc.woff2","_app/immutable/assets/gentium-plus-cyrillic-700-italic.BDxxkD7_.woff","_app/immutable/assets/gentium-plus-greek-ext-700-italic.CSwm0l05.woff2","_app/immutable/assets/gentium-plus-greek-ext-700-italic.T1ym239g.woff","_app/immutable/assets/gentium-plus-greek-700-italic.atEuIV-p.woff2","_app/immutable/assets/gentium-plus-greek-700-italic.C_uF00ym.woff","_app/immutable/assets/gentium-plus-vietnamese-700-italic.CQGikawn.woff2","_app/immutable/assets/gentium-plus-vietnamese-700-italic.DzHiKmyC.woff","_app/immutable/assets/gentium-plus-latin-ext-700-italic.D1ebtgDR.woff2","_app/immutable/assets/gentium-plus-latin-ext-700-italic.D2MLNksN.woff","_app/immutable/assets/gentium-plus-latin-700-italic.w0CCXBz5.woff2","_app/immutable/assets/gentium-plus-latin-700-italic.hWgqrT0F.woff"];

export { component, fonts, imports, index, _layout_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=0-BV4aXbRb.js.map
