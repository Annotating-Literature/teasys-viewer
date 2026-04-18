import { listPages, deletePage } from '$lib/server/pages';
import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ platform }) => {
    const db = platform!.env.DB;
    const pages = await listPages(db);
    return { pages };
};

export const actions: Actions = {
    delete: async ({ request, platform }) => {
        const data = await request.formData();
        const slug = data.get('slug')?.toString();
        if (slug) {
            try {
                await deletePage(platform!.env.DB, slug);
                return { success: true };
            } catch {
                return fail(500, { error: 'Failed to delete page' });
            }
        }
        return fail(400, { error: 'Missing slug' });
    }
};
