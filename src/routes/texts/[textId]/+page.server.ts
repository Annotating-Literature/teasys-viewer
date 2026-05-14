import { error } from '@sveltejs/kit';
import { getText, listAnnotations, getChildTexts } from '$lib/server/content';
import { parseText } from '$lib/server/textParser';
import type { PageServerLoad } from './$types';
import type { TextMetadata, ParsedText } from '$lib/types/text';
import type { Annotation } from '$lib/types/annotation';

export const load: PageServerLoad = async ({ params, parent, locals }) => {
	try {
		const { user } = await parent();
		const db = locals.db;
		const text = await getText(db, params.textId);

		let parsedText: ParsedText | null = null;
		let annotations: Annotation[] = [];
		let children: TextMetadata[] = [];
		let parentText: TextMetadata | null = null;
		let prevText: { id: string; title: string } | null = null;
		let nextText: { id: string; title: string } | null = null;

		if (text.metadata.type === 'collection') {
			children = await getChildTexts(db, text.metadata.id);
		} else {
			annotations = await listAnnotations(db, params.textId);
			parsedText = parseText(text.rawText, text.metadata.type);

			if (text.metadata.parentId) {
				const [p, siblings] = await Promise.all([
					getText(db, text.metadata.parentId),
					getChildTexts(db, text.metadata.parentId),
				]);
				parentText = p.metadata;
				const idx = siblings.findIndex(s => s.id === text.metadata.id);
				prevText = idx > 0 ? { id: siblings[idx - 1].id, title: siblings[idx - 1].title } : null;
				nextText = idx < siblings.length - 1 ? { id: siblings[idx + 1].id, title: siblings[idx + 1].title } : null;
			}
		}

		return { text, annotations, parsedText, children, user, parentText, prevText, nextText };
	} catch (e) {
		console.error(e);
		throw error(404, 'Text not found');
	}
};
