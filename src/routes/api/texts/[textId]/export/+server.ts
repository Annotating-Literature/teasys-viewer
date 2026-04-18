import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, platform }) => {
	const row = await platform!.env.DB
		.prepare('SELECT tei_xml FROM texts WHERE id = ?')
		.bind(params.textId)
		.first<{ tei_xml: string | null }>();

	if (!row?.tei_xml) {
		throw error(404, 'TEI XML not yet generated. It will be generated when an annotation is saved.');
	}

	return new Response(row.tei_xml, {
		headers: {
			'Content-Type': 'application/xml',
			'Content-Disposition': `attachment; filename="${params.textId}.tei.xml"`
		}
	});
};
