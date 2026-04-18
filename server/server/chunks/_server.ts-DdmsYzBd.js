import { j as json } from './index-B2LGyy1l.js';
import fs from 'fs/promises';
import path from 'path';

const POST = async ({ request, locals }) => {
  if (!locals.user) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const formData = await request.formData();
    const file = formData.get("image");
    if (!file) {
      return json({ error: "No image provided" }, { status: 400 });
    }
    if (!file.type.startsWith("image/")) {
      return json({ error: "File must be an image" }, { status: 400 });
    }
    const uploadDir = path.join(process.cwd(), "static", "uploads", "pages");
    await fs.mkdir(uploadDir, { recursive: true });
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileName = `${timestamp}-${safeName}`;
    const filePath = path.join(uploadDir, fileName);
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);
    return json({
      url: `/uploads/pages/${fileName}`
    });
  } catch (error) {
    console.error("Image upload failed:", error);
    return json({ error: "Failed to upload image" }, { status: 500 });
  }
};

export { POST };
//# sourceMappingURL=_server.ts-DdmsYzBd.js.map
