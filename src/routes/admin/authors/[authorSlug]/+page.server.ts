import { listTexts, getAuthorProfile, saveAuthorProfile, saveAuthorPortrait } from '$lib/server/content';
import { slugify, findAuthorBySlug } from '$lib/utils/slug';
import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params }) => {
    const allTexts = await listTexts();
    const authorName = findAuthorBySlug(allTexts, params.authorSlug);

    if (!authorName) {
        throw error(404, 'Author not found');
    }

    const profile = await getAuthorProfile(params.authorSlug);

    return {
        author: authorName,
        slug: params.authorSlug,
        bio: profile?.bio ?? '',
        portraitPath: profile?.portraitPath ?? null
    };
};

export const actions: Actions = {
    default: async ({ request, params }) => {
        const formData = await request.formData();
        const bio = formData.get('bio') as string;
        const portrait = formData.get('portrait') as File | null;

        if (bio !== null) {
            await saveAuthorProfile(params.authorSlug, bio);
        }

        if (portrait && portrait.size > 0) {
            const ext = portrait.name.split('.').pop()?.toLowerCase() ?? 'jpg';
            if (!['jpg', 'jpeg', 'png', 'webp'].includes(ext)) {
                return fail(400, { error: 'Invalid image format. Use JPG, PNG, or WebP.' });
            }
            const buffer = Buffer.from(await portrait.arrayBuffer());
            await saveAuthorPortrait(params.authorSlug, buffer, ext);
        }

        throw redirect(303, `/admin/authors/${params.authorSlug}`);
    }
};
