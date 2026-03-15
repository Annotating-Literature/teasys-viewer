import { listTexts } from '$lib/server/content';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const texts = await listTexts();
	const availableTypes = [...new Set(texts.map(t => t.type))];

	return {
		user: locals.user,
		availableTypes
	};
};
