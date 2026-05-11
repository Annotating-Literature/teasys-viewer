import { listTexts, getAuthorProfile, saveAuthorProfile, saveAuthorPortrait, saveAuthorMetadata } from '$lib/server/content';
import { findAuthorBySlug } from '$lib/utils/slug';
import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
    const db = locals.db;
    const allTexts = await listTexts(db);
    const authorName = findAuthorBySlug(allTexts, params.authorSlug);

    if (!authorName) {
        throw error(404, 'Author not found');
    }

    const profile = await getAuthorProfile(db, params.authorSlug);

    return {
        author: authorName,
        slug: params.authorSlug,
        bio: profile?.bio ?? '',
        portraitPath: profile?.portraitPath ?? null,
        birthYear: profile?.birthYear ?? null,
        deathYear: profile?.deathYear ?? null,
        photoCredit: profile?.photoCredit ?? null,
        photoCreditUrl: profile?.photoCreditUrl ?? null,
    };
};

export const actions: Actions = {
    default: async ({ request, params, locals }) => {
        const db = locals.db;
        const formData = await request.formData();
        const bio = formData.get('bio') as string;
        const portrait = formData.get('portrait') as File | null;
        const birthYearRaw = formData.get('birthYear') as string;
        const deathYearRaw = formData.get('deathYear') as string;
        const photoCredit = formData.get('photoCredit') as string;
        const photoCreditUrl = formData.get('photoCreditUrl') as string;

        if (bio !== null) {
            await saveAuthorProfile(db, params.authorSlug, bio);
        }

        await saveAuthorMetadata(db, params.authorSlug, {
            birthYear: birthYearRaw ? parseInt(birthYearRaw, 10) : null,
            deathYear: deathYearRaw ? parseInt(deathYearRaw, 10) : null,
            photoCredit: photoCredit || null,
            photoCreditUrl: photoCreditUrl || null,
        });

        if (portrait && portrait.size > 0) {
            const ext = portrait.name.split('.').pop()?.toLowerCase() ?? 'jpg';
            if (!['jpg', 'jpeg', 'png', 'webp'].includes(ext)) {
                return fail(400, { error: 'Invalid image format. Use JPG, PNG, or WebP.' });
            }
            if (!locals.bucket) {
                return fail(500, { error: 'Portrait storage is not configured.' });
            }
            const data = await portrait.arrayBuffer();
            await saveAuthorPortrait(locals.bucket, db, params.authorSlug, data as unknown as Buffer, ext);
        }

        throw redirect(303, `/admin/authors/${params.authorSlug}`);
    }
};
