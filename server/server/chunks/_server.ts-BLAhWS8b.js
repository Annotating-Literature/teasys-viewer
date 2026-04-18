import { j as json } from './index-B2LGyy1l.js';
import { listTexts, saveTextMetadata, saveTextContent } from './content-DzBBz6_I.js';
import 'fs/promises';
import 'path';

function slugify(text) {
  return text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
}
const GET = async () => {
  const texts = await listTexts();
  return json(texts);
};
const POST = async ({ request, locals }) => {
  if (!locals.user || locals.user.role !== "admin") {
    return json({ error: "Unauthorized" }, { status: 401 });
  }
  const data = await request.formData();
  const title = data.get("title");
  const author = data.get("author");
  const year = Number(data.get("year"));
  const category = data.get("category");
  const type = data.get("type");
  const textContent = data.get("textContent") || "";
  const parentId = data.get("parentId");
  const order = Number(data.get("order"));
  if (!title || !author || !type || !category) {
    return json({ error: "Missing required fields" }, { status: 400 });
  }
  if (type !== "collection" && !textContent) {
    return json({ error: "Text content is required for this type" }, { status: 400 });
  }
  const existingTexts = await listTexts();
  const existingIds = new Set(existingTexts.map((t) => t.id));
  let slug = slugify(title);
  if (existingIds.has(slug)) {
    let i = 2;
    while (existingIds.has(`${slug}-${i}`)) i++;
    slug = `${slug}-${i}`;
  }
  const newText = {
    id: slug,
    title,
    author,
    year: isNaN(year) ? void 0 : year,
    category,
    type,
    ...parentId ? { parentId } : {},
    ...order && !isNaN(order) ? { order } : {},
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  try {
    await saveTextMetadata(newText);
    await saveTextContent(newText.id, textContent);
    return json(newText, { status: 201 });
  } catch (error) {
    console.error("Failed to create text:", error);
    return json({ error: "Failed to create text" }, { status: 500 });
  }
};

export { GET, POST };
//# sourceMappingURL=_server.ts-BLAhWS8b.js.map
