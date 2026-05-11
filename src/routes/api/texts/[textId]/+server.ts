import { json } from '@sveltejs/kit';
import { getText, saveTextMetadata, saveTextContent, getAnnotationCount } from '$lib/server/content';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, locals }) => {
	try {
		const data = await getText(locals.db, params.textId);
		return json(data);
	} catch {
		return json({ error: 'Text not found' }, { status: 404 });
	}
};

export const PUT: RequestHandler = async ({ request, params, locals }) => {
	if (!locals.user || locals.user.role !== 'admin') {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const payload = await request.json() as { metadata?: Record<string, unknown>; rawText?: string };

	try {
		const db = locals.db;
		const existing = await getText(db, params.textId);
		let updatedMetadata = existing.metadata;

		if (payload.metadata) {
			updatedMetadata = { ...existing.metadata, ...payload.metadata, id: params.textId, updatedAt: new Date().toISOString() };
			await saveTextMetadata(db, updatedMetadata);
		}

		if (payload.rawText !== undefined) {
			const annotationCount = await getAnnotationCount(db, params.textId);
			if (annotationCount > 0) {
				return json({ error: 'Cannot edit text content because it has existing annotations' }, { status: 400 });
			}
			await saveTextContent(db, params.textId, payload.rawText);
		}

		return json(updatedMetadata);
	} catch (err) {
		console.error('Failed to update text:', err);
		return json({ error: 'Failed to update text' }, { status: 500 });
	}
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
	if (!locals.user) {
		return json({ error: 'Not logged in' }, { status: 401 });
	}
	if (locals.user.role !== 'admin') {
		return json({ error: 'Only admins can delete texts' }, { status: 403 });
	}

	try {
		const db = locals.db;
		await db.prepare('DELETE FROM annotations WHERE text_id = ?').bind(params.textId).run();
		await db.prepare('DELETE FROM texts WHERE id = ?').bind(params.textId).run();
		return new Response(null, { status: 204 });
	} catch (err) {
		console.error('Failed to delete text:', err);
		return json({ error: 'Failed to delete text' }, { status: 500 });
	}
};
