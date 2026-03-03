import db from '$lib/server/db';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { hashPassword } from '$lib/server/auth';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user?.role !== 'admin') {
		throw redirect(303, '/');
	}
	const users = db.prepare('SELECT id, username, role FROM users').all();
	return { users };
};

export const actions: Actions = {
	createUser: async ({ request, locals }) => {
		if (locals.user?.role !== 'admin') return fail(403, { message: 'Forbidden' });

		const data = await request.formData();
		const username = data.get('username') as string;
		const password = data.get('password') as string;
		const role = data.get('role') as string;

		if (!username || !password || !role) {
			return fail(400, { message: 'Missing fields' });
		}

		const passwordHash = await hashPassword(password);
		try {
			db.prepare('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)').run(username, passwordHash, role);
		} catch (e) {
			return fail(500, { message: 'Failed to create user' });
		}
		return { success: true };
	},
	deleteUser: async ({ request, locals }) => {
		if (locals.user?.role !== 'admin') return fail(403, { message: 'Forbidden' });
		const data = await request.formData();
		const id = data.get('id') as string;
		try {
			db.prepare('DELETE FROM users WHERE id = ?').run(id);
		} catch (e) {
			return fail(500, { message: 'Failed to delete user' });
		}
		return { success: true };
	}
};
