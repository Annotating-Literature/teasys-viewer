import { listTexts } from '$lib/server/content';
import { listPages } from '$lib/server/pages';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, platform }) => {
	const db = platform!.env.DB;
	const texts = await listTexts(db);
	const availableTypes = [...new Set(texts.map(t => t.type))];
	const pages = await listPages(db);

	return {
		user: locals.user,
		availableTypes,
		pages
	};
};
