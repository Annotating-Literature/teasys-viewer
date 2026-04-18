import { e as error } from './index-B2LGyy1l.js';
import fs from 'fs/promises';
import path from 'path';

const CONTENT_DIR = path.resolve("content", "texts");
const GET = async ({ params }) => {
  const teiPath = path.join(CONTENT_DIR, params.textId, `${params.textId}.tei.xml`);
  try {
    const fileContents = await fs.readFile(teiPath, "utf-8");
    return new Response(fileContents, {
      headers: {
        "Content-Type": "application/xml",
        "Content-Disposition": `attachment; filename="${params.textId}.tei.xml"`
      }
    });
  } catch (e) {
    throw error(404, "TEI XML file not found. It will be generated when an annotation is saved.");
  }
};

export { GET };
//# sourceMappingURL=_server.ts-B_7uT6_E.js.map
