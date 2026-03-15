import { listTexts, listAnnotations, listAuthorDirectories } from '$lib/server/content';
import { slugify } from '$lib/utils/slug';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    const texts = await listTexts();

    // Load annotations for each text
    const textsWithAnnotations = await Promise.all(
        texts.map(async (text) => {
            const annotations = await listAnnotations(text.id);
            return { ...text, annotations };
        })
    );

    // Get standalone author directories (not derived from texts)
    const standaloneAuthors = await listAuthorDirectories();
    const textAuthorSlugs = new Set(texts.map(t => slugify(t.author)));
    const extraAuthors = standaloneAuthors.filter(a => !textAuthorSlugs.has(a.slug));

    // Compute detailed stats
    const allAnnotations = textsWithAnnotations.flatMap(t => t.annotations);

    // Unique contributors (annotation authors)
    const contributors = new Set<string>();
    for (const ann of allAnnotations) {
        for (const a of ann.authors) contributors.add(a);
    }

    // Level distribution
    const levelCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0 };
    const categoryCounts: Record<string, number> = {};
    for (const ann of allAnnotations) {
        for (const lvl of ann.levels) {
            levelCounts[lvl.level] = (levelCounts[lvl.level] || 0) + 1;
            categoryCounts[lvl.category] = (categoryCounts[lvl.category] || 0) + 1;
        }
    }

    // Most annotated text
    const mostAnnotated = textsWithAnnotations.length > 0
        ? textsWithAnnotations.reduce((best, t) =>
            t.annotations.length > best.annotations.length ? t : best
        )
        : null;

    // Most recent annotation
    const mostRecent = allAnnotations.length > 0
        ? allAnnotations.reduce((latest, ann) =>
            ann.updatedAt > latest.updatedAt ? ann : latest
        )
        : null;

    // Average annotations per text
    const avgAnnotations = texts.length > 0
        ? Math.round((allAnnotations.length / texts.length) * 10) / 10
        : 0;

    // Cross-references count
    const totalCrossRefs = allAnnotations.reduce((sum, ann) => sum + ann.crossRefs.length, 0);

    // Works cited count
    const totalWorksCited = allAnnotations.reduce((sum, ann) =>
        sum + ann.levels.reduce((s, l) => s + l.worksCited.length, 0), 0);

    const stats = {
        contributors: contributors.size,
        contributorNames: Array.from(contributors).sort(),
        levelCounts,
        categoryCounts: Object.entries(categoryCounts)
            .sort((a, b) => b[1] - a[1]),
        mostAnnotated: mostAnnotated ? {
            title: mostAnnotated.title,
            id: mostAnnotated.id,
            count: mostAnnotated.annotations.length
        } : null,
        mostRecent: mostRecent ? {
            anchorText: mostRecent.anchorText,
            updatedAt: mostRecent.updatedAt,
            authors: mostRecent.authors
        } : null,
        avgAnnotations,
        totalCrossRefs,
        totalWorksCited
    };

    return { textsWithAnnotations, extraAuthors, stats };
};
