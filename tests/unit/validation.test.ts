import { describe, it, expect } from 'vitest';
import { AnnotationSchema, AnnotationLevelSchema, TextMetadataSchema } from '../../src/lib/server/validation';

const now = new Date().toISOString();

function makeAnnotation(levels: object[]) {
	return {
		id: 'ann-1',
		anchorText: 'some text',
		anchorStart: 0,
		anchorEnd: 9,
		authors: ['Alice'],
		version: 1,
		createdAt: now,
		updatedAt: now,
		levels,
		crossRefs: [],
	};
}

// ─── AnnotationLevelSchema ───────────────────────────────────────────────────

describe('AnnotationLevelSchema', () => {
	it('accepts a valid L1 language annotation', () => {
		const result = AnnotationLevelSchema.safeParse({ level: 1, category: 'language', body: 'text', worksCited: [] });
		expect(result.success).toBe(true);
	});

	it('rejects L1 with interpretation category', () => {
		const result = AnnotationLevelSchema.safeParse({ level: 1, category: 'interpretation', body: 'text', worksCited: [] });
		expect(result.success).toBe(false);
	});

	it('accepts L2 with interpretation category', () => {
		const result = AnnotationLevelSchema.safeParse({ level: 2, category: 'interpretation', body: 'text', worksCited: [] });
		expect(result.success).toBe(true);
	});

	it('accepts L3 with any category', () => {
		for (const cat of ['language', 'form', 'context', 'interpretation', 'questions'] as const) {
			const result = AnnotationLevelSchema.safeParse({ level: 3, category: cat, body: '', worksCited: [] });
			expect(result.success, `L3 ${cat} should be valid`).toBe(true);
		}
	});

	it('rejects unknown category', () => {
		const result = AnnotationLevelSchema.safeParse({ level: 1, category: 'philosophy', body: '', worksCited: [] });
		expect(result.success).toBe(false);
	});

	it('rejects level 0', () => {
		const result = AnnotationLevelSchema.safeParse({ level: 0, category: 'language', body: '', worksCited: [] });
		expect(result.success).toBe(false);
	});
});

// ─── AnnotationSchema — level cascade rules ───────────────────────────────────

describe('AnnotationSchema level cascading', () => {
	it('accepts annotation with only L1', () => {
		const result = AnnotationSchema.safeParse(makeAnnotation([
			{ level: 1, category: 'language', body: 'A', worksCited: [] }
		]));
		expect(result.success).toBe(true);
	});

	it('accepts annotation with L1 + L2', () => {
		const result = AnnotationSchema.safeParse(makeAnnotation([
			{ level: 1, category: 'form', body: 'A', worksCited: [] },
			{ level: 2, category: 'context', body: 'B', worksCited: [] },
		]));
		expect(result.success).toBe(true);
	});

	it('accepts annotation with L1 + L2 + L3', () => {
		const result = AnnotationSchema.safeParse(makeAnnotation([
			{ level: 1, category: 'language', body: 'A', worksCited: [] },
			{ level: 2, category: 'form', body: 'B', worksCited: [] },
			{ level: 3, category: 'interpretation', body: 'C', worksCited: [] },
		]));
		expect(result.success).toBe(true);
	});

	it('rejects L2 without L1', () => {
		const result = AnnotationSchema.safeParse(makeAnnotation([
			{ level: 2, category: 'context', body: 'B', worksCited: [] },
		]));
		expect(result.success).toBe(false);
		expect(JSON.stringify(result.error)).toContain('Level 2 requires Level 1');
	});

	it('rejects L3 without L2', () => {
		const result = AnnotationSchema.safeParse(makeAnnotation([
			{ level: 1, category: 'language', body: 'A', worksCited: [] },
			{ level: 3, category: 'form', body: 'C', worksCited: [] },
		]));
		expect(result.success).toBe(false);
		expect(JSON.stringify(result.error)).toContain('Level 3 requires Level 2');
	});

	it('rejects L3 without L1 or L2', () => {
		const result = AnnotationSchema.safeParse(makeAnnotation([
			{ level: 3, category: 'form', body: 'C', worksCited: [] },
		]));
		expect(result.success).toBe(false);
	});

	it('rejects empty levels array', () => {
		const result = AnnotationSchema.safeParse(makeAnnotation([]));
		expect(result.success).toBe(false);
	});

	it('migrates legacy author field to authors array', () => {
		const input = {
			...makeAnnotation([{ level: 1, category: 'language', body: 'A', worksCited: [] }]),
			authors: [],
			author: 'Legacy Author',
		};
		const result = AnnotationSchema.safeParse(input);
		expect(result.success).toBe(true);
		if (!result.success) return;
		expect(result.data.authors).toEqual(['Legacy Author']);
	});

	it('strips deprecated title and author fields from output', () => {
		const input = {
			...makeAnnotation([{ level: 1, category: 'language', body: 'A', worksCited: [] }]),
			title: 'old title',
			author: 'old author',
		};
		const result = AnnotationSchema.safeParse(input);
		expect(result.success).toBe(true);
		if (!result.success) return;
		expect('title' in result.data).toBe(false);
		expect('author' in result.data).toBe(false);
	});
});

// ─── TextMetadataSchema ───────────────────────────────────────────────────────

describe('TextMetadataSchema', () => {
	const base = {
		id: 'faust',
		title: 'Faust',
		author: 'Goethe',
		category: 'drama',
		type: 'drama' as const,
		createdAt: now,
		updatedAt: now,
	};

	it('accepts valid minimal metadata', () => {
		expect(TextMetadataSchema.safeParse(base).success).toBe(true);
	});

	it('accepts optional year field', () => {
		expect(TextMetadataSchema.safeParse({ ...base, year: 1808 }).success).toBe(true);
	});

	it('rejects unknown type', () => {
		expect(TextMetadataSchema.safeParse({ ...base, type: 'essay' }).success).toBe(false);
	});

	it('accepts all valid types', () => {
		for (const type of ['poetry', 'prose', 'drama', 'collection'] as const) {
			expect(TextMetadataSchema.safeParse({ ...base, type }).success, `type ${type}`).toBe(true);
		}
	});

	it('rejects missing required fields', () => {
		const { title, ...rest } = base;
		expect(TextMetadataSchema.safeParse(rest).success).toBe(false);
	});
});
