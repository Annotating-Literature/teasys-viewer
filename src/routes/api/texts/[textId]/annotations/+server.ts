import { json } from '@sveltejs/kit';
import { listAnnotations, saveAnnotation } from '$lib/server/content';
import { slugify, findUniqueSlug } from '$lib/utils/slug';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, locals }) => {
	try {
		const annotations = await listAnnotations(locals.db, params.textId);
		return json(annotations);
	} catch {
		return json({ error: 'Could not list annotations' }, { status: 500 });
	}
};

export const POST: RequestHandler = async ({ request, locals, params }) => {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const data = await request.json() as {
		id?: string;
		anchorText?: string;
		authors?: string[];
		version?: number;
		createdAt?: string;
		[key: string]: unknown;
	};
	const db = locals.db;
	const context = locals.context;

	try {
		let finalId = data.id;
		if (!finalId) {
			const baseSlug = slugify(data.anchorText || 'annotation', 50) || 'annotation';
			const existing = await listAnnotations(db, params.textId);
			finalId = findUniqueSlug(baseSlug, new Set(existing.map((a) => a.id)));
		}

		if (!finalId) {
			return json({ error: 'Missing ID and anchor text' }, { status: 400 });
		}

		const newAnnotation = {
			...data,
			id: finalId,
			authors: data.authors?.length ? data.authors : [locals.user.username],
			version: data.version ?? 1,
			createdAt: data.createdAt || new Date().toISOString(),
			updatedAt: new Date().toISOString()
		} as any;

		await saveAnnotation(db, context, params.textId, newAnnotation);
		return json(newAnnotation, { status: 201 });
	} catch (err: any) {
		if (err.errors) {
			return json({ error: 'Validation failed', details: err.errors }, { status: 400 });
		}
		console.error('Failed to create annotation:', err);
		return json({ error: 'Failed to create annotation' }, { status: 500 });
	}
};
