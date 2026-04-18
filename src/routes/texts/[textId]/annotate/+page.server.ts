import { error, redirect } from '@sveltejs/kit';
import { getText, listAnnotations } from '$lib/server/content';
import { parseText } from '$lib/server/textParser';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params, platform }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}
	try {
		const db = platform!.env.DB;
		const text = await getText(db, params.textId);

		if (text.metadata.type === 'collection') {
			throw redirect(303, `/texts/${params.textId}`);
		}

		const annotations = await listAnnotations(db, params.textId);
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
