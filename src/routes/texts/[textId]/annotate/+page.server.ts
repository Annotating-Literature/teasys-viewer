import { error, redirect } from '@sveltejs/kit';
import { getText, listAnnotations } from '$lib/server/content';
import { parseText } from '$lib/server/textParser';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}
	try {
		const text = await getText(params.textId);
		const annotations = await listAnnotations(params.textId);
		const parsedText = parseText(text.rawText, text.metadata.type);

		return {
			user: locals.user,
			text,
			annotations,
			parsedText
		};
	} catch (e) {
		throw error(404, 'Text not found');
	}
};
