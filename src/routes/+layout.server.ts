import { listTexts } from '$lib/server/content';
import { listPages } from '$lib/server/pages';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const texts = await listTexts();
	const availableTypes = [...new Set(texts.map(t => t.type))];
	const pages = await listPages();

	return {
		user: locals.user,
		availableTypes,
		pages
	};
};
