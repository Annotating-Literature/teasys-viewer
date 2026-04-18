import { f as fail, r as redirect } from './index-B2LGyy1l.js';
import { a as getUserByUsername, v as verifyPassword, c as createSession } from './auth-BM2QBTFt.js';
import 'bcryptjs';
import 'module';
import 'path';
import 'node:crypto';

const load = async ({ locals }) => {
  if (locals.user) {
    throw redirect(302, "/");
  }
};
const actions = {
  default: async ({ request, cookies }) => {
    const data = await request.formData();
    const username = data.get("username");
    const password = data.get("password");
    if (typeof username !== "string" || typeof password !== "string") {
      return fail(400, { error: "Invalid username or password" });
    }
    const user = getUserByUsername(username);
    if (!user) {
      return fail(400, { error: "Invalid username or password" });
    }
    const validPassword = await verifyPassword(password, user.password_hash);
    if (!validPassword) {
      return fail(400, { error: "Invalid username or password" });
    }
    const sessionId = createSession(user.id);
    cookies.set("session_id", sessionId, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      // 30 days
      secure: process.env.NODE_ENV === "production"
    });
    throw redirect(302, "/");
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  actions: actions,
  load: load
});

const index = 14;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-E-h_dgll.js')).default;
const server_id = "src/routes/login/+page.server.ts";
const imports = ["_app/immutable/nodes/14.DgPupZp2.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/Cy30Bi6B.js","_app/immutable/chunks/Dlad0eN8.js","_app/immutable/chunks/DsjihQKJ.js","_app/immutable/chunks/DP48GSDs.js","_app/immutable/chunks/DBQdzsR4.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=14-CGJDqVW5.js.map
