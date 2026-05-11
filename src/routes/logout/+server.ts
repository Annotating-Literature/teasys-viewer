import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { deleteSession } from '$lib/server/auth';

export const POST: RequestHandler = async ({ cookies, locals }) => {
	const sessionId = cookies.get('session_id');

	if (sessionId) {
		await deleteSession(locals.db, sessionId);
		cookies.delete('session_id', { path: '/' });
	}

	throw redirect(302, '/');
};
