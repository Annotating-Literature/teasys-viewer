import { listTexts } from '$lib/server/content';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const db = locals.db;
	const texts = await listTexts(db);
	return { texts };
};
