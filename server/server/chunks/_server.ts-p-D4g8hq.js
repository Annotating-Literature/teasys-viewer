import { j as json } from './index-B2LGyy1l.js';
import { getText, saveTextMetadata } from './content-DzBBz6_I.js';
import fs from 'fs/promises';
import path from 'path';

const CONTENT_DIR = path.resolve("content", "texts");
const GET = async ({ params }) => {
  try {
    const data = await getText(params.textId);
    return json(data);
  } catch (error) {
    return json({ error: "Text not found" }, { status: 404 });
  }
};
const PUT = async ({ request, params, locals }) => {
  if (!locals.user || locals.user.role !== "admin") {
    return json({ error: "Unauthorized" }, { status: 401 });
  }
  const { metadata } = await request.json();
  if (!metadata) {
    return json({ error: "Missing metadata" }, { status: 400 });
  }
  try {
    const existing = await getText(params.textId);
    const updatedMetadata = { ...existing.metadata, ...metadata, id: params.textId, updatedAt: (/* @__PURE__ */ new Date()).toISOString() };
    await saveTextMetadata(updatedMetadata);
    return json(updatedMetadata);
  } catch (error) {
    console.error("Failed to update text:", error);
    return json({ error: "Failed to update text" }, { status: 500 });
  }
};
const DELETE = async ({ params, locals }) => {
  if (!locals.user || locals.user.role !== "admin") {
    return json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const textDir = path.join(CONTENT_DIR, params.textId);
    await fs.rm(textDir, { recursive: true, force: true });
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Failed to delete text:", error);
    return json({ error: "Failed to delete text" }, { status: 500 });
  }
};

export { DELETE, GET, PUT };
//# sourceMappingURL=_server.ts-p-D4g8hq.js.map
