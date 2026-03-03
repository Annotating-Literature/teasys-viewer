import { listTexts, listAnnotations, getAuthorProfile } from '$lib/server/content';
import { slugify, findAuthorBySlug } from '$lib/utils/slug';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, parent }) => {
    const { user } = await parent();
    const allTexts = await listTexts();
    const authorName = findAuthorBySlug(allTexts, params.authorSlug);

    if (!authorName) {
        throw error(404, 'Author not found');
    }

    const authorTexts = allTexts.filter((t) => slugify(t.author) === params.authorSlug);
    authorTexts.sort((a, b) => a.title.localeCompare(b.title));

    const textsWithCounts = await Promise.all(
        authorTexts.map(async (text) => {
            const annotations = await listAnnotations(text.id);
            return { ...text, annotationCount: annotations.length };
        })
    );

    const profile = await getAuthorProfile(params.authorSlug);

    return {
        author: authorName,
        slug: params.authorSlug,
        texts: textsWithCounts,
        bio: profile?.bio ?? '',
        portraitPath: profile?.portraitPath ?? null,
        user
    };
};
