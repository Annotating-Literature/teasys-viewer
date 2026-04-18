import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const SESSION_MAX_AGE_DAYS = 30;

export interface User {
	id: number;
	username: string;
	role: 'admin' | 'editor';
}

export interface SessionUser extends User {
	sessionId: string;
}

export async function hashPassword(plain: string): Promise<string> {
	return await bcrypt.hash(plain, 8);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
	return await bcrypt.compare(plain, hash);
}

export async function createSession(db: D1Database, userId: number): Promise<string> {
	const sessionId = uuidv4();
	const expiresAt = new Date();
	expiresAt.setDate(expiresAt.getDate() + SESSION_MAX_AGE_DAYS);

	await db.prepare('INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)')
		.bind(sessionId, userId, expiresAt.toISOString())
		.run();

	return sessionId;
}

export async function getSessionUser(db: D1Database, sessionId: string): Promise<SessionUser | null> {
	const row = await db.prepare(`
		SELECT users.id, users.username, users.role, sessions.expires_at
		FROM sessions
		JOIN users ON sessions.user_id = users.id
		WHERE sessions.id = ?
	`).bind(sessionId).first<{ id: number; username: string; role: 'admin' | 'editor'; expires_at: string }>();

	if (!row) return null;

	if (new Date(row.expires_at) < new Date()) {
		await deleteSession(db, sessionId);
		return null;
	}

	return { id: row.id, username: row.username, role: row.role, sessionId };
}

export async function deleteSession(db: D1Database, sessionId: string): Promise<void> {
	await db.prepare('DELETE FROM sessions WHERE id = ?').bind(sessionId).run();
}

export async function getUserByUsername(db: D1Database, username: string): Promise<(User & { password_hash: string }) | null> {
	return await db.prepare('SELECT id, username, role, password_hash FROM users WHERE username = ?')
		.bind(username)
		.first<User & { password_hash: string }>();
}
