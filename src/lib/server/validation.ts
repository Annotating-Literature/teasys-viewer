import { z } from 'zod';

export const TextMetadataSchema = z.object({
  id: z.string(),
  title: z.string(),
  author: z.string(),
  year: z.number().optional(),
  category: z.string(),
  type: z.enum(['poetry', 'prose', 'drama', 'collection']),
  parentId: z.string().optional(),
  order: z.number().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const CategorySchema = z.enum([
  'language', 'form', 'intratextuality', 'intertextuality',
  'context', 'interpretation', 'textual-variants', 'questions'
]);

export const AnnotationLevelSchema = z.object({
  level: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  category: CategorySchema,
  body: z.string(),
  worksCited: z.array(z.string()),
}).refine(data => {
  if (data.level === 1 && data.category === 'interpretation') {
    return false;
  }
  return true;
}, { message: "Interpretation cannot be used on level 1" });

export const CrossRefSchema = z.object({
  annotationId: z.string(),
  annotationTitle: z.string(),
  level: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  category: CategorySchema,
});

export const AnnotationSchema = z.object({
  id: z.string(),
  title: z.string().optional(),        // deprecated, kept for backward compat
  anchorText: z.string(),
  anchorStart: z.number(),
  anchorEnd: z.number(),
  author: z.string().optional(),       // deprecated — migrated to `authors`
  authors: z.array(z.string()).optional().default([]),
  version: z.number().int().min(1).optional().default(1),
  createdAt: z.string(),
  updatedAt: z.string(),
  levels: z.array(AnnotationLevelSchema).min(1).max(9).refine(
    levels => {
      const nums = new Set(levels.map(l => l.level));
      if (nums.has(2) && !nums.has(1)) return false;
      if (nums.has(3) && !nums.has(2)) return false;
      return true;
    },
    { message: 'Level 2 requires Level 1; Level 3 requires Level 2' }
  ),
  crossRefs: z.array(CrossRefSchema),
}).transform(data => {
  // Migrate legacy `author` field to `authors` array
  if (data.authors.length === 0 && data.author) {
    data.authors = [data.author];
  }
  // Remove deprecated fields from output
  const { title, author, ...rest } = data;
  return rest;
});
