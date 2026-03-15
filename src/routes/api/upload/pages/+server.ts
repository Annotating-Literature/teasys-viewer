import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import fs from 'fs/promises';
import path from 'path';

export const POST: RequestHandler = async ({ request, locals }) => {
    // Require authentication to upload images
    if (!locals.user) {
        return json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const formData = await request.formData();
        const file = formData.get('image') as File | null;

        if (!file) {
            return json({ error: 'No image provided' }, { status: 400 });
        }

        // Basic validation for images
        if (!file.type.startsWith('image/')) {
            return json({ error: 'File must be an image' }, { status: 400 });
        }

        // Ensure the upload directory exists
        const uploadDir = path.join(process.cwd(), 'static', 'uploads', 'pages');
        await fs.mkdir(uploadDir, { recursive: true });

        // Create a safe, unique filename
        const timestamp = Date.now();
        const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const fileName = `${timestamp}-${safeName}`;
        const filePath = path.join(uploadDir, fileName);

        // Write the file buffer to disk
        const buffer = Buffer.from(await file.arrayBuffer());
        await fs.writeFile(filePath, buffer);

        // Return the public URL path
        return json({
            url: `/uploads/pages/${fileName}`
        });
    } catch (error) {
        console.error('Image upload failed:', error);
        return json({ error: 'Failed to upload image' }, { status: 500 });
    }
};
