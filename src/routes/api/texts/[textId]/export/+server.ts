import { error } from '@sveltejs/kit';
import fs from 'fs/promises';
import path from 'path';
import type { RequestHandler } from './$types';

const CONTENT_DIR = path.resolve('content', 'texts');

// GET /api/texts/[textId]/export
export const GET: RequestHandler = async ({ params }) => {
	const teiPath = path.join(CONTENT_DIR, params.textId, `${params.textId}.tei.xml`);

	try {
		const fileContents = await fs.readFile(teiPath, 'utf-8');
		return new Response(fileContents, {
			headers: {
				'Content-Type': 'application/xml',
				'Content-Disposition': `attachment; filename="${params.textId}.tei.xml"`
			}
		});
	} catch (e) {
		// The TEI file might not be generated yet, which is not necessarily a server error.
		// A 404 is more appropriate.
		throw error(404, 'TEI XML file not found. It will be generated when an annotation is saved.');
	}
};
