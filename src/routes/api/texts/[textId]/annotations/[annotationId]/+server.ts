import { json } from '@sveltejs/kit';
import { getAnnotation, saveAnnotation, deleteAnnotation } from '$lib/server/content';
import type { RequestHandler } from './$types';

// GET /api/texts/[textId]/annotations/[annotationId]
export const GET: RequestHandler = async ({ params }) => {
	try {
		const annotation = await getAnnotation(params.textId, params.annotationId);
		return json(annotation);
	} catch (error) {
		return json({ error: 'Annotation not found' }, { status: 404 });
	}
};

// PUT /api/texts/[textId]/annotations/[annotationId]
export const PUT: RequestHandler = async ({ request, locals, params }) => {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const data = await request.json();

	try {
		const existing = await getAnnotation(params.textId, params.annotationId);

		const updatedAnnotation = {
			...existing,
			...data,
			id: params.annotationId,
			updatedAt: new Date().toISOString()
		};

		await saveAnnotation(params.textId, updatedAnnotation);
		return json(updatedAnnotation);
	} catch (error: any) {
		if (error.errors) {
			return json({ error: 'Validation failed', details: error.errors }, { status: 400 });
		}
		console.error('Failed to update annotation:', error);
		return json({ error: 'Failed to update annotation' }, { status: 500 });
	}
};

// DELETE /api/texts/[textId]/annotations/[annotationId]
export const DELETE: RequestHandler = async ({ locals, params }) => {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		await deleteAnnotation(params.textId, params.annotationId);
		return new Response(null, { status: 204 });
	} catch (error) {
		console.error('Failed to delete annotation:', error);
		return json({ error: 'Failed to delete annotation' }, { status: 500 });
	}
};
