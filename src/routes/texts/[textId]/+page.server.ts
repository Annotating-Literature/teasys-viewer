import { error } from '@sveltejs/kit';
import { getText, listAnnotations, listTexts } from '$lib/server/content';
import { parseText } from '$lib/server/textParser';
import type { PageServerLoad } from './$types';
import type { TextMetadata, ParsedText } from '$lib/types/text';
import type { Annotation } from '$lib/types/annotation';

export const load: PageServerLoad = async ({ params, parent, platform }) => {
	try {
		const { user } = await parent();
		const db = platform!.env.DB;
		const text = await getText(db, params.textId);

		let parsedText: ParsedText | null = null;
		let annotations: Annotation[] = [];
		let children: TextMetadata[] = [];

		if (text.metadata.type === 'collection') {
			const allTexts = await listTexts(db);
			children = allTexts
				.filter(t => t.parentId === text.metadata.id)
				.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
		} else {
			annotations = await listAnnotations(db, params.textId);
			parsedText = parseText(text.rawText, text.metadata.type);
		}

		return { text, annotations, parsedText, children, user };
	} catch (e) {
		console.error(e);
		throw error(404, 'Text not found');
	}
};
