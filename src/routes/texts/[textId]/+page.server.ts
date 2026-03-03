import { error } from '@sveltejs/kit';
import { getText, listAnnotations } from '$lib/server/content';
import { parseText } from '$lib/server/textParser';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, parent }) => {
	try {
		const { user } = await parent();
		const text = await getText(params.textId);
		const annotations = await listAnnotations(params.textId);
		const parsedText = parseText(text.rawText, text.metadata.type);

		return { text, annotations, parsedText, user };
	} catch (e) {
		console.error(e);
		throw error(404, 'Text not found');
	}
};
