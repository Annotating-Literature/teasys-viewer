import { getText, getAnnotationCount } from '$lib/server/content';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	try {
		const db = locals.db;
		const [textData, annotationCount] = await Promise.all([
			getText(db, params.textId),
			getAnnotationCount(db, params.textId)
		]);
		
		return {
			text: textData,
			annotationCount
		};
	} catch (err) {
		error(404, 'Text not found');
	}
};
