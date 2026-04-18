import { getAuthorPortraitFile } from './content-DzBBz6_I.js';
import { e as error } from './index-B2LGyy1l.js';
import 'fs/promises';
import 'path';

const MIME = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp"
};
const GET = async ({ params }) => {
  const result = await getAuthorPortraitFile(params.authorSlug);
  if (!result) {
    throw error(404, "Portrait not found");
  }
  return new Response(new Uint8Array(result.data), {
    headers: {
      "Content-Type": MIME[result.ext] || "application/octet-stream",
      "Cache-Control": "public, max-age=3600"
    }
  });
};

export { GET };
//# sourceMappingURL=_server.ts-CEPIy1Xk.js.map
