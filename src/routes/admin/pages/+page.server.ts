import { listPages, deletePage } from '$lib/server/pages';
import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
    const pages = await listPages();
    return { pages };
};

export const actions: Actions = {
    delete: async ({ request }) => {
        const data = await request.formData();
        const slug = data.get('slug')?.toString();
        if (slug) {
            try {
                await deletePage(slug);
                return { success: true };
            } catch (e) {
                return fail(500, { error: 'Failed to delete page' });
            }
        }
        return fail(400, { error: 'Missing slug' });
    }
};
