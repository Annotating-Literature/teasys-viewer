import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, locals }) => {
    if (!locals.bucket) {
        throw error(503, 'Image storage not available');
    }
    const obj = await locals.bucket.get(params.key);
    if (!obj) {
        throw error(404, 'Image not found');
    }

    const headers = new Headers();
    obj.writeHttpMetadata(headers);
    headers.set('Cache-Control', 'public, max-age=86400');

    return new Response(obj.body, { headers });
};
