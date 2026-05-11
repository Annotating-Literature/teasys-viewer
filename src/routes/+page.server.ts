import { listTexts } from '$lib/server/content';
import type { PageServerLoad } from './$types';
import type { TextMetadata } from '$lib/types/text';

export const load: PageServerLoad = async ({ parent, locals }) => {
	const { user } = await parent();
	const db = locals.db;
	const texts = await listTexts(db);
	texts.sort((a, b) => a.title.localeCompare(b.title));

	// Single query for all annotation counts
	const countRows = (await db.prepare(
		'SELECT text_id, COUNT(*) as n FROM annotations GROUP BY text_id'
	).all<{ text_id: string; n: number }>()).results;
	const countMap = new Map(countRows.map(r => [r.text_id, r.n]));

	const textsWithCounts = texts.map(text => ({
		...text,
		annotationCount: countMap.get(text.id) ?? 0
	}));

	const groupedTexts: { [key: string]: (TextMetadata & { annotationCount: number })[] } = {
		poetry: [],
		prose: [],
		drama: [],
		collection: []
	};

	for (const text of textsWithCounts) {
		if (groupedTexts[text.type] && !text.parentId) {
			groupedTexts[text.type].push(text);
		}
	}

	return { groupedTexts, user };
};
