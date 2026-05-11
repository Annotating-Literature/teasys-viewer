import { getSessionUser } from '$lib/server/auth';
import type { Handle } from '@sveltejs/kit';

declare const __ADAPTER__: string;

export const handle: Handle = async ({ event, resolve }) => {
	if (event.platform?.env?.DB) {
		// Cloudflare Workers — use platform bindings
		event.locals.db = event.platform.env.DB;
		event.locals.bucket = event.platform.env.BUCKET ?? null;
		event.locals.context = event.platform.context;
	} else if (__ADAPTER__ === 'node') {
		// Node.js / PM2 — use local SQLite and filesystem storage
		// These dynamic imports are eliminated from the Cloudflare bundle via dead-code elimination
		const { getLocalDB } = await import('$lib/server/db');
		const { getLocalBucket } = await import('$lib/server/storage');
		event.locals.db = getLocalDB();
		event.locals.bucket = getLocalBucket();
		event.locals.context = { waitUntil: (p: Promise<unknown>) => void p.catch(console.error) };
	} else {
		throw new Error(
			'No database available. Check that Cloudflare D1/R2 bindings are configured in wrangler.toml.'
		);
	}

	const db = event.locals.db;
	const sessionId = event.cookies.get('session_id');

	if (sessionId && db) {
		const user = await getSessionUser(db, sessionId);
		if (user) {
			event.locals.user = { id: user.id, username: user.username, role: user.role };
		} else {
			event.locals.user = null;
			event.cookies.delete('session_id', { path: '/' });
		}
	} else {
		event.locals.user = null;
	}

	return resolve(event);
};
