import { listTexts, listAuthorDirectories } from '$lib/server/content';
import { slugify } from '$lib/utils/slug';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ platform }) => {
    const db = platform!.env.DB;
    const [texts, standaloneAuthors, countRows, authorRows] = await Promise.all([
        listTexts(db),
        listAuthorDirectories(db),
        db.prepare('SELECT text_id, COUNT(*) as n FROM annotations GROUP BY text_id')
            .all<{ text_id: string; n: number }>(),
        db.prepare('SELECT slug, portrait_key, birth_year, death_year FROM authors')
            .all<{ slug: string; portrait_key: string | null; birth_year: number | null; death_year: number | null }>(),
    ]);

    const countMap = new Map(countRows.results.map(r => [r.text_id, r.n]));
    const authorProfileMap = new Map(authorRows.results.map(r => [r.slug, r]));

    const authorMap = new Map<string, { name: string; slug: string; textCount: number; annotationCount: number; types: Set<string> }>();

    for (const text of texts) {
        const slug = slugify(text.author);
        if (!authorMap.has(slug)) {
            authorMap.set(slug, { name: text.author, slug, textCount: 0, annotationCount: 0, types: new Set() });
        }
        const entry = authorMap.get(slug)!;
        entry.textCount++;
        entry.types.add(text.type);
        entry.annotationCount += countMap.get(text.id) ?? 0;
    }

    for (const sa of standaloneAuthors) {
        if (!authorMap.has(sa.slug)) {
            authorMap.set(sa.slug, { name: sa.name, slug: sa.slug, textCount: 0, annotationCount: 0, types: new Set() });
        }
    }

    const authors = Array.from(authorMap.values())
        .map((a) => {
            const profile = authorProfileMap.get(a.slug);
            return {
                name: a.name,
                slug: a.slug,
                textCount: a.textCount,
                annotationCount: a.annotationCount,
                types: Array.from(a.types),
                portraitPath: profile?.portrait_key ? `/api/authors/${a.slug}/portrait` : null,
                birthYear: profile?.birth_year ?? null,
                deathYear: profile?.death_year ?? null,
            };
        })
        .sort((a, b) => a.name.localeCompare(b.name));

    return { authors };
};
