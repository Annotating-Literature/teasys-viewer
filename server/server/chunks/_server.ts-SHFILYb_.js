import { j as json } from './index-B2LGyy1l.js';
import { listAnnotations, saveAnnotation } from './content-DzBBz6_I.js';
import 'fs/promises';
import 'path';

const GET = async ({ params }) => {
  try {
    const annotations = await listAnnotations(params.textId);
    return json(annotations);
  } catch (error) {
    return json({ error: "Could not list annotations" }, { status: 500 });
  }
};
const POST = async ({ request, locals, params }) => {
  if (!locals.user) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }
  const data = await request.json();
  try {
    let finalId = data.id;
    if (!finalId) {
      const baseSlug = (data.anchorText || "annotation").toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").slice(0, 50) || "annotation";
      const existing = await listAnnotations(params.textId);
      const existingIds = new Set(existing.map((a) => a.id));
      let suffix = 1;
      finalId = baseSlug;
      while (existingIds.has(finalId)) {
        suffix++;
        finalId = `${baseSlug}-${suffix}`;
      }
    }
    if (!finalId) {
      return json({ error: "Missing ID and anchor text" }, { status: 400 });
    }
    const newAnnotation = {
      ...data,
      id: finalId,
      authors: data.authors?.length ? data.authors : [locals.user.username],
      version: data.version ?? 1,
      createdAt: data.createdAt || (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    await saveAnnotation(params.textId, newAnnotation);
    return json(newAnnotation, { status: 201 });
  } catch (error) {
    if (error.errors) {
      return json({ error: "Validation failed", details: error.errors }, { status: 400 });
    }
    console.error("Failed to create annotation:", error);
    return json({ error: "Failed to create annotation" }, { status: 500 });
  }
};

export { GET, POST };
//# sourceMappingURL=_server.ts-SHFILYb_.js.map
