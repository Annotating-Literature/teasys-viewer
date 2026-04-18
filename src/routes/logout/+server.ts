import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { deleteSession } from '$lib/server/auth';

export const POST: RequestHandler = async ({ cookies, platform }) => {
	const sessionId = cookies.get('session_id');

	if (sessionId) {
		await deleteSession(platform!.env.DB, sessionId);
		cookies.delete('session_id', { path: '/' });
	}

	throw redirect(302, '/');
};
