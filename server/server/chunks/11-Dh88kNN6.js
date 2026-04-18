import { h as hashPassword, d as db } from './auth-BM2QBTFt.js';
import { f as fail, r as redirect } from './index-B2LGyy1l.js';
import 'bcryptjs';
import 'module';
import 'path';
import 'node:crypto';

const load = async ({ locals }) => {
  if (!locals.user) {
    throw redirect(303, "/");
  }
  const users = locals.user.role === "admin" ? db.prepare("SELECT id, username, role FROM users").all() : db.prepare("SELECT id, username, role FROM users WHERE id = ?").all(locals.user.id);
  return { users, currentUser: locals.user };
};
const actions = {
  createUser: async ({ request, locals }) => {
    if (locals.user?.role !== "admin") return fail(403, { message: "Forbidden" });
    const data = await request.formData();
    const username = data.get("username");
    const password = data.get("password");
    const role = data.get("role");
    if (!username || !password || !role) {
      return fail(400, { message: "Missing fields" });
    }
    const passwordHash = await hashPassword(password);
    try {
      db.prepare("INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)").run(username, passwordHash, role);
    } catch (e) {
      return fail(500, { message: "Failed to create user" });
    }
    return { success: true };
  },
  deleteUser: async ({ request, locals }) => {
    if (locals.user?.role !== "admin") return fail(403, { message: "Forbidden" });
    const data = await request.formData();
    const id = data.get("id");
    try {
      db.prepare("DELETE FROM users WHERE id = ?").run(id);
    } catch (e) {
      return fail(500, { message: "Failed to delete user" });
    }
    return { success: true };
  },
  changePassword: async ({ request, locals }) => {
    if (!locals.user) return fail(401, { message: "Unauthorized" });
    const data = await request.formData();
    const id = data.get("id");
    const newPassword = data.get("new_password");
    if (!id || !newPassword) {
      return fail(400, { message: "Missing fields" });
    }
    if (locals.user.role !== "admin" && locals.user.id.toString() !== id) {
      return fail(403, { message: "Forbidden: You can only change your own password" });
    }
    if (newPassword.length < 6) {
      return fail(400, { message: "Password must be at least 6 characters." });
    }
    try {
      const passwordHash = await hashPassword(newPassword);
      db.prepare("UPDATE users SET password_hash = ? WHERE id = ?").run(passwordHash, id);
    } catch (e) {
      return fail(500, { message: "Failed to change password" });
    }
    return { success: true };
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  actions: actions,
  load: load
});

const index = 11;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-CBIOUSYK.js')).default;
const server_id = "src/routes/admin/users/+page.server.ts";
const imports = ["_app/immutable/nodes/11.B6sAJ3vx.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/Cy30Bi6B.js","_app/immutable/chunks/Dlad0eN8.js","_app/immutable/chunks/DsjihQKJ.js","_app/immutable/chunks/DP48GSDs.js","_app/immutable/chunks/CR2qLiVv.js","_app/immutable/chunks/DBQdzsR4.js","_app/immutable/chunks/CC-GJfqR.js","_app/immutable/chunks/CXNM2av5.js","_app/immutable/chunks/BBcsKPiw.js","_app/immutable/chunks/DKTMO72l.js","_app/immutable/chunks/ClOgXLPN.js","_app/immutable/chunks/DLVpGK2M.js","_app/immutable/chunks/BNJKe7Ty.js","_app/immutable/chunks/B0wOLG0j.js","_app/immutable/chunks/ShcMrO15.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=11-Dh88kNN6.js.map
