import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}
	
	// Optional: require admin role for /admin
	if (locals.user.role !== 'admin') {
		// Depending on your requirements, you could block non-admins
		// For now we allow editors to see admin to manage texts if needed, 
		// or you can tighten this: throw redirect(303, '/');
	}
	
	return {
		user: locals.user
	};
};
