import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
    if (!locals.user) {
        return json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!locals.bucket) {
        return json({ error: 'Image storage not configured' }, { status: 503 });
    }

    try {
        const formData = await request.formData();
        const file = formData.get('image') as File | null;

        if (!file) {
            return json({ error: 'No image provided' }, { status: 400 });
        }

        if (!file.type.startsWith('image/')) {
            return json({ error: 'File must be an image' }, { status: 400 });
        }

        const timestamp = Date.now();
        const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const key = `page-images/${timestamp}-${safeName}`;

        await locals.bucket.put(key, await file.arrayBuffer(), {
            httpMetadata: { contentType: file.type }
        });

        return json({ url: `/api/page-images/${key}` });
    } catch (err) {
        console.error('Image upload failed:', err);
        return json({ error: 'Failed to upload image' }, { status: 500 });
    }
};
