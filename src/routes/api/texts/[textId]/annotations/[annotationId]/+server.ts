import { json } from '@sveltejs/kit';
import { getAnnotation, saveAnnotation, deleteAnnotation } from '$lib/server/content';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, locals }) => {
	try {
		const annotation = await getAnnotation(locals.db, params.textId, params.annotationId);
		return json(annotation);
	} catch {
		return json({ error: 'Annotation not found' }, { status: 404 });
	}
};

export const PUT: RequestHandler = async ({ request, locals, params }) => {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const data = await request.json() as Record<string, unknown>;
	const db = locals.db;
	const context = locals.context;

	try {
		const existing = await getAnnotation(db, params.textId, params.annotationId);
		const updatedAnnotation = {
			...existing,
			...data,
			id: params.annotationId,
			updatedAt: new Date().toISOString()
		};

		await saveAnnotation(db, context, params.textId, updatedAnnotation);
		return json(updatedAnnotation);
	} catch (err: any) {
		if (err.errors) {
			return json({ error: 'Validation failed', details: err.errors }, { status: 400 });
		}
		console.error('Failed to update annotation:', err);
		return json({ error: 'Failed to update annotation' }, { status: 500 });
	}
};

export const DELETE: RequestHandler = async ({ locals, params }) => {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		await deleteAnnotation(locals.db, locals.context, params.textId, params.annotationId);
		return new Response(null, { status: 204 });
	} catch (err) {
		console.error('Failed to delete annotation:', err);
		return json({ error: 'Failed to delete annotation' }, { status: 500 });
	}
};
