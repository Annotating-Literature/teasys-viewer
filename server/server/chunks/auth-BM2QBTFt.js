import bcrypt from 'bcryptjs';
import { createRequire } from 'module';
import path from 'path';
import { randomFillSync, randomUUID } from 'node:crypto';

const byteToHex = [];
for (let i = 0; i < 256; ++i) {
    byteToHex.push((i + 0x100).toString(16).slice(1));
}
function unsafeStringify(arr, offset = 0) {
    return (byteToHex[arr[offset + 0]] +
        byteToHex[arr[offset + 1]] +
        byteToHex[arr[offset + 2]] +
        byteToHex[arr[offset + 3]] +
        '-' +
        byteToHex[arr[offset + 4]] +
        byteToHex[arr[offset + 5]] +
        '-' +
        byteToHex[arr[offset + 6]] +
        byteToHex[arr[offset + 7]] +
        '-' +
        byteToHex[arr[offset + 8]] +
        byteToHex[arr[offset + 9]] +
        '-' +
        byteToHex[arr[offset + 10]] +
        byteToHex[arr[offset + 11]] +
        byteToHex[arr[offset + 12]] +
        byteToHex[arr[offset + 13]] +
        byteToHex[arr[offset + 14]] +
        byteToHex[arr[offset + 15]]).toLowerCase();
}

const rnds8Pool = new Uint8Array(256);
let poolPtr = rnds8Pool.length;
function rng() {
    if (poolPtr > rnds8Pool.length - 16) {
        randomFillSync(rnds8Pool);
        poolPtr = 0;
    }
    return rnds8Pool.slice(poolPtr, (poolPtr += 16));
}

var native = { randomUUID };

function _v4(options, buf, offset) {
    options = options || {};
    const rnds = options.random ?? options.rng?.() ?? rng();
    if (rnds.length < 16) {
        throw new Error('Random bytes length must be >= 16');
    }
    rnds[6] = (rnds[6] & 0x0f) | 0x40;
    rnds[8] = (rnds[8] & 0x3f) | 0x80;
    return unsafeStringify(rnds);
}
function v4(options, buf, offset) {
    if (native.randomUUID && true && !options) {
        return native.randomUUID();
    }
    return _v4(options);
}

const require$1 = createRequire(import.meta.url);
const Database = require$1("better-sqlite3");
const dbPath = path.resolve("data", "teasys.db");
const db = new Database(dbPath);
db.pragma("journal_mode = WAL");
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role     TEXT NOT NULL DEFAULT 'editor',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id         TEXT PRIMARY KEY,
    user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    expires_at TEXT NOT NULL
  );
`);
const SESSION_MAX_AGE_DAYS = 30;
async function hashPassword(plain) {
  return await bcrypt.hash(plain, 10);
}
async function verifyPassword(plain, hash) {
  return await bcrypt.compare(plain, hash);
}
function createSession(userId) {
  const sessionId = v4();
  const expiresAt = /* @__PURE__ */ new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_MAX_AGE_DAYS);
  const stmt = db.prepare(`
		INSERT INTO sessions (id, user_id, expires_at)
		VALUES (?, ?, ?)
	`);
  stmt.run(sessionId, userId, expiresAt.toISOString());
  return sessionId;
}
function getSessionUser(sessionId) {
  const stmt = db.prepare(`
		SELECT users.id, users.username, users.role, sessions.expires_at
		FROM sessions
		JOIN users ON sessions.user_id = users.id
		WHERE sessions.id = ?
	`);
  const row = stmt.get(sessionId);
  if (!row) return null;
  const expiresAt = new Date(row.expires_at);
  if (expiresAt < /* @__PURE__ */ new Date()) {
    deleteSession(sessionId);
    return null;
  }
  return {
    id: row.id,
    username: row.username,
    role: row.role,
    sessionId
  };
}
function deleteSession(sessionId) {
  const stmt = db.prepare("DELETE FROM sessions WHERE id = ?");
  stmt.run(sessionId);
}
function getUserByUsername(username) {
  const stmt = db.prepare("SELECT id, username, role, password_hash FROM users WHERE username = ?");
  return stmt.get(username);
}

export { getUserByUsername as a, deleteSession as b, createSession as c, db as d, getSessionUser as g, hashPassword as h, verifyPassword as v };
//# sourceMappingURL=auth-BM2QBTFt.js.map
