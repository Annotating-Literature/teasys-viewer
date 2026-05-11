import type { RequestHandler } from './$types';
import { listTexts, listAuthorDirectories } from '$lib/server/content';
import { listPages } from '$lib/server/pages';
import { SITE } from '$lib/config/site';

export const GET: RequestHandler = async ({ locals }) => {
	const base = SITE.siteUrl;

	if (!base) {
		return new Response('siteUrl is not configured in src/lib/config/site.ts', { status: 503 });
	}

	const [texts, authors, pages] = await Promise.all([
		listTexts(locals.db),
		listAuthorDirectories(locals.db),
		listPages(locals.db),
	]);

	type UrlEntry = {
		loc: string;
		lastmod?: string;
		changefreq: string;
		priority: string;
	};

	const urls: UrlEntry[] = [
		{ loc: base, changefreq: 'weekly', priority: '1.0' },
		{ loc: `${base}/authors`, changefreq: 'weekly', priority: '0.8' },
		{ loc: `${base}/attribution`, changefreq: 'yearly', priority: '0.3' },
	];

	for (const text of texts) {
		if (!text.parentId) {
			urls.push({
				loc: `${base}/texts/${text.id}`,
				lastmod: text.updatedAt.split('T')[0],
				changefreq: 'monthly',
				priority: '0.7',
			});
		}
	}

	for (const author of authors) {
		urls.push({
			loc: `${base}/authors/${author.slug}`,
			changefreq: 'monthly',
			priority: '0.6',
		});
	}

	for (const page of pages) {
		if (page.menu && !page.parent) {
			urls.push({
				loc: `${base}/${page.id}`,
				lastmod: page.updatedAt.split('T')[0],
				changefreq: 'monthly',
				priority: '0.5',
			});
		}
	}

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
	.map(
		(u) => `  <url>
    <loc>${u.loc}</loc>${u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ''}
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
	)
	.join('\n')}
</urlset>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'public, max-age=3600',
		},
	});
};
