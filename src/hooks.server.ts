import { getSessionUser } from '$lib/server/auth';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const db = event.platform?.env.DB;
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
