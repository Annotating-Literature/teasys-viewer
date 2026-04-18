import { g as getSessionUser } from './auth-BM2QBTFt.js';
import 'bcryptjs';
import 'module';
import 'path';
import 'node:crypto';

const handle = async ({ event, resolve }) => {
  const sessionId = event.cookies.get("session_id");
  if (sessionId) {
    const user = getSessionUser(sessionId);
    if (user) {
      event.locals.user = {
        id: user.id,
        username: user.username,
        role: user.role
      };
    } else {
      event.locals.user = null;
      event.cookies.delete("session_id", { path: "/" });
    }
  } else {
    event.locals.user = null;
  }
  return resolve(event);
};

export { handle };
//# sourceMappingURL=hooks.server-D82wHYRu.js.map
