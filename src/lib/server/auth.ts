import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import db from './db';

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
	return await bcrypt.hash(plain, 10);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
	return await bcrypt.compare(plain, hash);
}

export function createSession(userId: number): string {
	const sessionId = uuidv4();
	const expiresAt = new Date();
	expiresAt.setDate(expiresAt.getDate() + SESSION_MAX_AGE_DAYS);

	const stmt = db.prepare(`
		INSERT INTO sessions (id, user_id, expires_at)
		VALUES (?, ?, ?)
	`);

	stmt.run(sessionId, userId, expiresAt.toISOString());
	return sessionId;
}

export function getSessionUser(sessionId: string): SessionUser | null {
	const stmt = db.prepare(`
		SELECT users.id, users.username, users.role, sessions.expires_at
		FROM sessions
		JOIN users ON sessions.user_id = users.id
		WHERE sessions.id = ?
	`);

	const row = stmt.get(sessionId) as { id: number; username: string; role: 'admin' | 'editor'; expires_at: string } | undefined;

	if (!row) return null;

	const expiresAt = new Date(row.expires_at);
	if (expiresAt < new Date()) {
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

export function deleteSession(sessionId: string): void {
	const stmt = db.prepare('DELETE FROM sessions WHERE id = ?');
	stmt.run(sessionId);
}

export function getUserByUsername(username: string): (User & { password_hash: string }) | null {
	const stmt = db.prepare('SELECT id, username, role, password_hash FROM users WHERE username = ?');
	return stmt.get(username) as (User & { password_hash: string }) | null;
}
