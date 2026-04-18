import { j as json } from './index-B2LGyy1l.js';
import { deleteAnnotation, getAnnotation, saveAnnotation } from './content-DzBBz6_I.js';
import 'fs/promises';
import 'path';

const GET = async ({ params }) => {
  try {
    const annotation = await getAnnotation(params.textId, params.annotationId);
    return json(annotation);
  } catch (error) {
    return json({ error: "Annotation not found" }, { status: 404 });
  }
};
const PUT = async ({ request, locals, params }) => {
  if (!locals.user) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }
  const data = await request.json();
  try {
    const existing = await getAnnotation(params.textId, params.annotationId);
    const updatedAnnotation = {
      ...existing,
      ...data,
      id: params.annotationId,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    await saveAnnotation(params.textId, updatedAnnotation);
    return json(updatedAnnotation);
  } catch (error) {
    if (error.errors) {
      return json({ error: "Validation failed", details: error.errors }, { status: 400 });
    }
    console.error("Failed to update annotation:", error);
    return json({ error: "Failed to update annotation" }, { status: 500 });
  }
};
const DELETE = async ({ locals, params }) => {
  if (!locals.user) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await deleteAnnotation(params.textId, params.annotationId);
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Failed to delete annotation:", error);
    return json({ error: "Failed to delete annotation" }, { status: 500 });
  }
};

export { DELETE, GET, PUT };
//# sourceMappingURL=_server.ts-CgzFjo-a.js.map
