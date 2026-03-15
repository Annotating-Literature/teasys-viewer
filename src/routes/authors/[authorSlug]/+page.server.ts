import { listTexts, listAnnotations, getAuthorProfile, listAuthorDirectories } from '$lib/server/content';
import { slugify, findAuthorBySlug } from '$lib/utils/slug';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, parent }) => {
    const { user } = await parent();
    const allTexts = await listTexts();

    // Try to find author name from texts first
    let authorName = findAuthorBySlug(allTexts, params.authorSlug);

    // If not found in texts, check standalone author directories
    if (!authorName) {
        const standaloneAuthors = await listAuthorDirectories();
        const standalone = standaloneAuthors.find(a => a.slug === params.authorSlug);
        if (standalone) {
            authorName = standalone.name;
        }
    }

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
        birthYear: profile?.birthYear ?? null,
        deathYear: profile?.deathYear ?? null,
        photoCredit: profile?.photoCredit ?? null,
        photoCreditUrl: profile?.photoCreditUrl ?? null,
        user
    };
};
