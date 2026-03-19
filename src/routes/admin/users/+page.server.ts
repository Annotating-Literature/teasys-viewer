import db from '$lib/server/db';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { hashPassword } from '$lib/server/auth';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(303, '/');
	}
	// Give admins all users, give editors only themselves
	const users = locals.user.role === 'admin' 
		? db.prepare('SELECT id, username, role FROM users').all()
		: db.prepare('SELECT id, username, role FROM users WHERE id = ?').all(locals.user.id);
		
	return { users, currentUser: locals.user };
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
	},
	changePassword: async ({ request, locals }) => {
		if (!locals.user) return fail(401, { message: 'Unauthorized' });

		const data = await request.formData();
		const id = data.get('id') as string;
		const newPassword = data.get('new_password') as string;

		if (!id || !newPassword) {
			return fail(400, { message: 'Missing fields' });
		}

		// Authorization: Admins can change anyone's. Editors can only change their own.
		if (locals.user.role !== 'admin' && locals.user.id.toString() !== id) {
			return fail(403, { message: 'Forbidden: You can only change your own password' });
		}

		if (newPassword.length < 6) {
			return fail(400, { message: 'Password must be at least 6 characters.' });
		}

		try {
			const passwordHash = await hashPassword(newPassword);
			db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(passwordHash, id);
		} catch (e) {
			return fail(500, { message: 'Failed to change password' });
		}
		
		return { success: true };
	}
};
