import { json } from '@sveltejs/kit';
import { listAnnotations, saveAnnotation } from '$lib/server/content';
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
		let finalId = data.id;
		if (!finalId) {
			const baseSlug = (data.anchorText || 'annotation')
				.toLowerCase()
				.replace(/[^\w\s-]/g, '')
				.replace(/[\s_]+/g, '-')
				.replace(/-+/g, '-')
				.replace(/^-|-$/g, '')
				.slice(0, 50);

			const existing = await listAnnotations(params.textId);
			const existingIds = new Set(existing.map((a: any) => a.id));

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
