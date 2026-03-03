import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getUserByUsername, verifyPassword, createSession } from '$lib/server/auth';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		throw redirect(302, '/');
	}
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const username = data.get('username');
		const password = data.get('password');

		if (typeof username !== 'string' || typeof password !== 'string') {
			return fail(400, { error: 'Invalid username or password' });
		}

		const user = getUserByUsername(username);

		if (!user) {
			return fail(400, { error: 'Invalid username or password' });
		}

		const validPassword = await verifyPassword(password, user.password_hash);

		if (!validPassword) {
			return fail(400, { error: 'Invalid username or password' });
		}

		const sessionId = createSession(user.id);
		cookies.set('session_id', sessionId, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			maxAge: 60 * 60 * 24 * 30, // 30 days
			secure: process.env.NODE_ENV === 'production'
		});

		throw redirect(302, '/');
	}
};
