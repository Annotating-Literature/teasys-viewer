import { listTexts, listAnnotations } from '$lib/server/content';
import type { PageServerLoad } from './$types';
import type { TextMetadata } from '$lib/types/text';

export const load: PageServerLoad = async ({ parent }) => {
	const { user } = await parent();
	const texts = await listTexts();
	texts.sort((a, b) => a.title.localeCompare(b.title));

	// Fetch annotation counts for each text
	const textsWithCounts = await Promise.all(
		texts.map(async (text) => {
			const annotations = await listAnnotations(text.id);
			return { ...text, annotationCount: annotations.length };
		})
	);

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
