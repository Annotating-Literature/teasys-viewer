import { json } from '@sveltejs/kit';
import { listTexts, saveTextMetadata, saveTextContent } from '$lib/server/content';
import type { RequestHandler } from './$types';
import type { TextMetadata } from '$lib/types/text';

function slugify(text: string): string {
	return text
		.toLowerCase()
		.replace(/[^\w\s-]/g, '')
		.replace(/[\s_]+/g, '-')
		.replace(/-+/g, '-')
		.replace(/^-|-$/g, '')
		.slice(0, 80);
}

// GET /api/texts
export const GET: RequestHandler = async () => {
	const texts = await listTexts();
	return json(texts);
};

// POST /api/texts
export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user || locals.user.role !== 'admin') {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const data = await request.formData();
	const title = data.get('title') as string;
	const author = data.get('author') as string;
	const year = Number(data.get('year'));
	const category = data.get('category') as string;
	const type = data.get('type') as 'poetry' | 'prose' | 'drama' | 'collection';
	const textContent = (data.get('textContent') as string) || '';
	const parentId = data.get('parentId') as string | null;
	const order = Number(data.get('order'));

	if (!title || !author || !type || !category) {
		return json({ error: 'Missing required fields' }, { status: 400 });
	}
	if (type !== 'collection' && !textContent) {
		return json({ error: 'Text content is required for this type' }, { status: 400 });
	}

	// Generate slug from title, ensure uniqueness
	const existingTexts = await listTexts();
	const existingIds = new Set(existingTexts.map((t) => t.id));
	let slug = slugify(title);
	if (existingIds.has(slug)) {
		let i = 2;
		while (existingIds.has(`${slug}-${i}`)) i++;
		slug = `${slug}-${i}`;
	}

	const newText: TextMetadata = {
		id: slug,
		title,
		author,
		year: isNaN(year) ? undefined : year,
		category,
		type,
		...(parentId ? { parentId } : {}),
		...(order && !isNaN(order) ? { order } : {}),
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString()
	};

	try {
		await saveTextMetadata(newText);
		await saveTextContent(newText.id, textContent);
		return json(newText, { status: 201 });
	} catch (error) {
		console.error('Failed to create text:', error);
		return json({ error: 'Failed to create text' }, { status: 500 });
	}
};
