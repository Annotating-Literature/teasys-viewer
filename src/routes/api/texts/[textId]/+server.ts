import { json } from '@sveltejs/kit';
import { getText, saveTextMetadata } from '$lib/server/content';
import fs from 'fs/promises';
import path from 'path';
import type { RequestHandler } from './$types';

const CONTENT_DIR = path.resolve('content', 'texts');

// GET /api/texts/[textId]
export const GET: RequestHandler = async ({ params }) => {
	try {
		const data = await getText(params.textId);
		return json(data);
	} catch (error) {
		return json({ error: 'Text not found' }, { status: 404 });
	}
};

// PUT /api/texts/[textId]
export const PUT: RequestHandler = async ({ request, params, locals }) => {
	if (!locals.user || locals.user.role !== 'admin') {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const { metadata } = await request.json();
	if (!metadata) {
		return json({ error: 'Missing metadata' }, { status: 400 });
	}

	try {
		const existing = await getText(params.textId);
		const updatedMetadata = { ...existing.metadata, ...metadata, id: params.textId, updatedAt: new Date().toISOString() };
		await saveTextMetadata(updatedMetadata);
		return json(updatedMetadata);
	} catch (error) {
		console.error('Failed to update text:', error);
		return json({ error: 'Failed to update text' }, { status: 500 });
	}
};

// DELETE /api/texts/[textId]
export const DELETE: RequestHandler = async ({ params, locals }) => {
	if (!locals.user || locals.user.role !== 'admin') {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const textDir = path.join(CONTENT_DIR, params.textId);
		await fs.rm(textDir, { recursive: true, force: true });
		return new Response(null, { status: 204 });
	} catch (error) {
		console.error('Failed to delete text:', error);
		return json({ error: 'Failed to delete text' }, { status: 500 });
	}
};
