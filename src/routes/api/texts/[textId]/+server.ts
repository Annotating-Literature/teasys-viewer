import { json } from '@sveltejs/kit';
import { getText, saveTextMetadata } from '$lib/server/content';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, platform }) => {
	try {
		const data = await getText(platform!.env.DB, params.textId);
		return json(data);
	} catch {
		return json({ error: 'Text not found' }, { status: 404 });
	}
};

export const PUT: RequestHandler = async ({ request, params, locals, platform }) => {
	if (!locals.user || locals.user.role !== 'admin') {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const { metadata } = await request.json() as { metadata: Record<string, unknown> };
	if (!metadata) {
		return json({ error: 'Missing metadata' }, { status: 400 });
	}

	try {
		const db = platform!.env.DB;
		const existing = await getText(db, params.textId);
		const updatedMetadata = { ...existing.metadata, ...metadata, id: params.textId, updatedAt: new Date().toISOString() };
		await saveTextMetadata(db, updatedMetadata);
		return json(updatedMetadata);
	} catch (err) {
		console.error('Failed to update text:', err);
		return json({ error: 'Failed to update text' }, { status: 500 });
	}
};

export const DELETE: RequestHandler = async ({ params, locals, platform }) => {
	if (!locals.user || locals.user.role !== 'admin') {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		// Annotations cascade-delete via FK ON DELETE CASCADE
		await platform!.env.DB.prepare('DELETE FROM texts WHERE id = ?').bind(params.textId).run();
		return new Response(null, { status: 204 });
	} catch (err) {
		console.error('Failed to delete text:', err);
		return json({ error: 'Failed to delete text' }, { status: 500 });
	}
};
