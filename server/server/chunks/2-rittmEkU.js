import { r as redirect } from './index-B2LGyy1l.js';

const load = async ({ locals }) => {
  if (!locals.user) {
    throw redirect(302, "/login");
  }
  if (locals.user.role !== "admin") ;
  return {
    user: locals.user
  };
};

var _layout_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 2;
let component_cache;
const component = async () => component_cache ??= (await import('./layout.svelte-UxsTmhKc.js')).default;
const server_id = "src/routes/admin/+layout.server.ts";
const imports = ["_app/immutable/nodes/2.BC3uGF9j.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/Cy30Bi6B.js","_app/immutable/chunks/NDjzLCLq.js","_app/immutable/chunks/DP48GSDs.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _layout_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=2-rittmEkU.js.map
