import { json } from '@sveltejs/kit';
import { listAnnotations, saveAnnotation } from '$lib/server/content';
import { v4 as uuidv4 } from 'uuid';
import type { RequestHandler } from './$types';

// GET /api/texts/[textId]/annotations
export const GET: RequestHandler = async ({ params }) => {
	try {
		const annotations = await listAnnotations(params.textId);
		return json(annotations);
	} catch (error) {
		return json({ error: 'Could not list annotations' }, { status: 500 });
	}
};

// POST /api/texts/[textId]/annotations
export const POST: RequestHandler = async ({ request, locals, params }) => {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const data = await request.json();

	try {
		const newAnnotation = {
			...data,
			id: data.id || uuidv4(),
			authors: data.authors?.length ? data.authors : [locals.user.username],
			version: data.version ?? 1,
			createdAt: data.createdAt || new Date().toISOString(),
			updatedAt: new Date().toISOString()
		};

		await saveAnnotation(params.textId, newAnnotation);
		return json(newAnnotation, { status: 201 });
	} catch (error: any) {
		if (error.errors) {
			return json({ error: 'Validation failed', details: error.errors }, { status: 400 });
		}
		console.error('Failed to create annotation:', error);
		return json({ error: 'Failed to create annotation' }, { status: 500 });
	}
};
