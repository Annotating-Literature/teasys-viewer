import { r as redirect } from './index-B2LGyy1l.js';
import { b as deleteSession } from './auth-BM2QBTFt.js';
import 'bcryptjs';
import 'module';
import 'path';
import 'node:crypto';

const POST = async ({ cookies }) => {
  const sessionId = cookies.get("session_id");
  if (sessionId) {
    deleteSession(sessionId);
    cookies.delete("session_id", { path: "/" });
  }
  throw redirect(302, "/");
};

export { POST };
//# sourceMappingURL=_server.ts-Dthc0-Qp.js.map
