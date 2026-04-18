import { listTexts, getAuthorProfile, listAuthorDirectories } from '$lib/server/content';
import { slugify, findAuthorBySlug } from '$lib/utils/slug';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, parent, platform }) => {
    const { user } = await parent();
    const db = platform!.env.DB;
    const allTexts = await listTexts(db);

    let authorName = findAuthorBySlug(allTexts, params.authorSlug);

    if (!authorName) {
        const standaloneAuthors = await listAuthorDirectories(db);
        const standalone = standaloneAuthors.find(a => a.slug === params.authorSlug);
        if (standalone) authorName = standalone.name;
    }

    if (!authorName) {
        throw error(404, 'Author not found');
    }

    const authorTexts = allTexts.filter((t) => slugify(t.author) === params.authorSlug);
    authorTexts.sort((a, b) => a.title.localeCompare(b.title));

    let countMap = new Map<string, number>();
    if (authorTexts.length > 0) {
        const placeholders = authorTexts.map(() => '?').join(',');
        const countRows = (await db.prepare(
            `SELECT text_id, COUNT(*) as n FROM annotations WHERE text_id IN (${placeholders}) GROUP BY text_id`
        ).bind(...authorTexts.map(t => t.id)).all<{ text_id: string; n: number }>()).results;
        countMap = new Map(countRows.map(r => [r.text_id, r.n]));
    }
    const textsWithCounts = authorTexts.map(text => ({ ...text, annotationCount: countMap.get(text.id) ?? 0 }));

    const profile = await getAuthorProfile(db, params.authorSlug);

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
