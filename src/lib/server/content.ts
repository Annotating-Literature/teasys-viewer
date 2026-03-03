import fs from 'fs/promises';
import path from 'path';
import { TextMetadataSchema, AnnotationSchema } from './validation';
import type { TextMetadata } from '$lib/types/text';
import type { Annotation } from '$lib/types/annotation';

const CONTENT_DIR = path.resolve('content', 'texts');

export async function listTexts(): Promise<TextMetadata[]> {
  try {
    const entries = await fs.readdir(CONTENT_DIR, { withFileTypes: true });
    const dirs = entries.filter(e => e.isDirectory());

    const texts: TextMetadata[] = [];
    for (const dir of dirs) {
      const metaPath = path.join(CONTENT_DIR, dir.name, 'metadata.json');
      try {
        const raw = await fs.readFile(metaPath, 'utf-8');
        const parsed = TextMetadataSchema.parse(JSON.parse(raw));
        texts.push(parsed);
      } catch (err) {
        console.warn(`Skipping invalid or missing metadata for ${dir.name}:`, err);
      }
    }

    return texts;
  } catch (err) {
    console.error("Error reading content directory:", err);
    return [];
  }
}

export async function getText(textId: string): Promise<{ metadata: TextMetadata; rawText: string }> {
  const textDir = path.join(CONTENT_DIR, textId);

  const metaPath = path.join(textDir, 'metadata.json');
  const textPath = path.join(textDir, 'text.txt');

  const metaRaw = await fs.readFile(metaPath, 'utf-8');
  const metadata = TextMetadataSchema.parse(JSON.parse(metaRaw));

  const rawText = await fs.readFile(textPath, 'utf-8');

  return { metadata, rawText };
}

export async function listAnnotations(textId: string): Promise<Annotation[]> {
  const annotationsDir = path.join(CONTENT_DIR, textId, 'annotations');

  try {
    await fs.access(annotationsDir);
  } catch {
    return []; // No annotations directory yet
  }

  const entries = await fs.readdir(annotationsDir);
  const jsonFiles = entries.filter(e => e.endsWith('.json'));

  const annotations: Annotation[] = [];
  for (const file of jsonFiles) {
    try {
      const raw = await fs.readFile(path.join(annotationsDir, file), 'utf-8');
      const data = JSON.parse(raw);
      // Default version for existing files that don't have it
      if (data.version === undefined) data.version = 1;
      const parsed = AnnotationSchema.parse(data);
      annotations.push(parsed);
    } catch (err) {
      console.warn(`Skipping invalid annotation ${file} in ${textId}:`, err);
    }
  }

  return annotations;
}

export async function getAnnotation(textId: string, annotationId: string): Promise<Annotation> {
  const filePath = path.join(CONTENT_DIR, textId, 'annotations', `${annotationId}.json`);
  const raw = await fs.readFile(filePath, 'utf-8');
  return AnnotationSchema.parse(JSON.parse(raw));
}

import { generateTEI } from './teiGenerator';

export async function saveAnnotation(textId: string, annotation: Annotation): Promise<void> {
  const annotationsDir = path.join(CONTENT_DIR, textId, 'annotations');
  await fs.mkdir(annotationsDir, { recursive: true });

  const filePath = path.join(annotationsDir, `${annotation.id}.json`);
  await fs.writeFile(filePath, JSON.stringify(annotation, null, 2), 'utf-8');

  generateTEI(textId).catch(err => console.error('[TEI] Generation failed for', textId, err));
}

export async function deleteAnnotation(textId: string, annotationId: string): Promise<void> {
  const filePath = path.join(CONTENT_DIR, textId, 'annotations', `${annotationId}.json`);
  await fs.unlink(filePath);

  generateTEI(textId).catch(err => console.error('[TEI] Generation failed for', textId, err));
}

export async function saveTextMetadata(metadata: TextMetadata): Promise<void> {
  const validated = TextMetadataSchema.parse(metadata);
  const textDir = path.join(CONTENT_DIR, validated.id);
  await fs.mkdir(textDir, { recursive: true });

  const metaPath = path.join(textDir, 'metadata.json');
  await fs.writeFile(metaPath, JSON.stringify(validated, null, 2), 'utf-8');
}

export async function saveTextContent(textId: string, text: string): Promise<void> {
  const textDir = path.join(CONTENT_DIR, textId);
  await fs.mkdir(textDir, { recursive: true });

  const textPath = path.join(textDir, 'text.txt');
  await fs.writeFile(textPath, text, 'utf-8');
}

// --- Author Profiles ---

const AUTHORS_DIR = path.resolve('content', 'authors');

export interface AuthorProfile {
  bio: string;
  portraitPath: string | null;
}

export async function getAuthorProfile(slug: string): Promise<AuthorProfile | null> {
  const authorDir = path.join(AUTHORS_DIR, slug);
  try {
    await fs.access(authorDir);
  } catch {
    return null;
  }

  let bio = '';
  try {
    bio = await fs.readFile(path.join(authorDir, 'bio.md'), 'utf-8');
  } catch {
    // No bio file
  }

  let portraitPath: string | null = null;
  for (const ext of ['jpg', 'jpeg', 'png', 'webp']) {
    try {
      await fs.access(path.join(authorDir, `portrait.${ext}`));
      portraitPath = `/api/authors/${slug}/portrait`;
      break;
    } catch {
      // Try next extension
    }
  }

  return { bio, portraitPath };
}

export async function saveAuthorProfile(slug: string, bio: string): Promise<void> {
  const authorDir = path.join(AUTHORS_DIR, slug);
  await fs.mkdir(authorDir, { recursive: true });
  await fs.writeFile(path.join(authorDir, 'bio.md'), bio, 'utf-8');
}

export async function saveAuthorPortrait(slug: string, data: Buffer, ext: string): Promise<void> {
  const authorDir = path.join(AUTHORS_DIR, slug);
  await fs.mkdir(authorDir, { recursive: true });

  // Remove any existing portrait files
  for (const e of ['jpg', 'jpeg', 'png', 'webp']) {
    try {
      await fs.unlink(path.join(authorDir, `portrait.${e}`));
    } catch {
      // Doesn't exist
    }
  }

  await fs.writeFile(path.join(authorDir, `portrait.${ext}`), data);
}

export async function getAuthorPortraitFile(slug: string): Promise<{ data: Buffer; ext: string } | null> {
  const authorDir = path.join(AUTHORS_DIR, slug);
  for (const ext of ['jpg', 'jpeg', 'png', 'webp']) {
    const filePath = path.join(authorDir, `portrait.${ext}`);
    try {
      const data = await fs.readFile(filePath);
      return { data, ext };
    } catch {
      // Try next
    }
  }
  return null;
}
