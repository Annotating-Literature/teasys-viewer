import { json } from '@sveltejs/kit';
import { getAnnotation, saveAnnotation, deleteAnnotation } from '$lib/server/content';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, platform }) => {
	try {
		const annotation = await getAnnotation(platform!.env.DB, params.textId, params.annotationId);
		return json(annotation);
	} catch {
		return json({ error: 'Annotation not found' }, { status: 404 });
	}
};

export const PUT: RequestHandler = async ({ request, locals, params, platform }) => {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const data = await request.json() as any;
	const db = platform!.env.DB;
	const context = platform!.context;

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

export const DELETE: RequestHandler = async ({ locals, params, platform }) => {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		await deleteAnnotation(platform!.env.DB, platform!.context, params.textId, params.annotationId);
		return new Response(null, { status: 204 });
	} catch (err) {
		console.error('Failed to delete annotation:', err);
		return json({ error: 'Failed to delete annotation' }, { status: 500 });
	}
};
