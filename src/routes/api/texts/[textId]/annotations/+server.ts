import { json } from '@sveltejs/kit';
import { listAnnotations, saveAnnotation } from '$lib/server/content';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, platform }) => {
	try {
		const annotations = await listAnnotations(platform!.env.DB, params.textId);
		return json(annotations);
	} catch {
		return json({ error: 'Could not list annotations' }, { status: 500 });
	}
};

export const POST: RequestHandler = async ({ request, locals, params, platform }) => {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const data = await request.json() as any;
	const db = platform!.env.DB;
	const context = platform!.context;

	try {
		let finalId = data.id;
		if (!finalId) {
			const baseSlug = ((data.anchorText || 'annotation')
				.toLowerCase()
				.replace(/[^\w\s-]/g, '')
				.replace(/[\s_]+/g, '-')
				.replace(/-+/g, '-')
				.replace(/^-|-$/g, '')
				.slice(0, 50)) || 'annotation';

			const existing = await listAnnotations(db, params.textId);
			const existingIds = new Set(existing.map((a) => a.id));

			let suffix = 1;
			finalId = baseSlug;
			while (existingIds.has(finalId)) {
				suffix++;
				finalId = `${baseSlug}-${suffix}`;
			}
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
		};

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
