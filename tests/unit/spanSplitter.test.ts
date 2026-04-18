import { describe, it, expect } from 'vitest';
import { splitIntoSegments } from '../../src/lib/utils/spanSplitter';
import type { Annotation } from '../../src/lib/types/annotation';

function makeAnnotation(id: string, start: number, end: number): Annotation {
	return {
		id,
		anchorText: 'x',
		anchorStart: start,
		anchorEnd: end,
		authors: [],
		version: 1,
		createdAt: '',
		updatedAt: '',
		levels: [{ level: 1, category: 'language', body: '', worksCited: [] }],
		crossRefs: [],
	};
}

describe('splitIntoSegments', () => {
	const text = 'Hello, world!'; // length 13

	it('returns single segment when no annotations', () => {
		const segs = splitIntoSegments(text, []);
		expect(segs).toHaveLength(1);
		expect(segs[0]).toEqual({ text, start: 0, end: 13, annotationIds: [] });
	});

	it('returns single segment when annotations is null-like', () => {
		// @ts-expect-error testing runtime null
		const segs = splitIntoSegments(text, null);
		expect(segs).toHaveLength(1);
	});

	it('splits into three segments for a single annotation', () => {
		const ann = makeAnnotation('a1', 7, 12); // "world"
		const segs = splitIntoSegments(text, [ann]);
		expect(segs).toHaveLength(3);
		expect(segs[0]).toMatchObject({ text: 'Hello, ', annotationIds: [] });
		expect(segs[1]).toMatchObject({ text: 'world', annotationIds: ['a1'] });
		expect(segs[2]).toMatchObject({ text: '!', annotationIds: [] });
	});

	it('annotation spanning entire text produces one annotated segment', () => {
		const ann = makeAnnotation('a1', 0, 13);
		const segs = splitIntoSegments(text, [ann]);
		expect(segs).toHaveLength(1);
		expect(segs[0]).toMatchObject({ text, annotationIds: ['a1'] });
	});

	it('two non-overlapping annotations produce 4 segments', () => {
		const a1 = makeAnnotation('a1', 0, 5);  // "Hello"
		const a2 = makeAnnotation('a2', 7, 12); // "world"
		const segs = splitIntoSegments(text, [a1, a2]);
		expect(segs).toHaveLength(4);
		expect(segs[0]).toMatchObject({ text: 'Hello', annotationIds: ['a1'] });
		expect(segs[1]).toMatchObject({ text: ', ', annotationIds: [] });
		expect(segs[2]).toMatchObject({ text: 'world', annotationIds: ['a2'] });
		expect(segs[3]).toMatchObject({ text: '!', annotationIds: [] });
	});

	it('two overlapping annotations share annotationIds in overlapping segment', () => {
		const a1 = makeAnnotation('a1', 0, 8);  // "Hello, w"
		const a2 = makeAnnotation('a2', 5, 13); // ", world!"
		const segs = splitIntoSegments(text, [a1, a2]);
		// Breakpoints: 0, 5, 8, 13
		expect(segs).toHaveLength(3);
		expect(segs[0]).toMatchObject({ text: 'Hello', annotationIds: ['a1'] });
		expect(segs[1]).toMatchObject({ text: ', w', annotationIds: ['a1', 'a2'] });
		expect(segs[2]).toMatchObject({ text: 'orld!', annotationIds: ['a2'] });
	});

	it('skips title annotations with negative anchorStart', () => {
		const title = makeAnnotation('title', -1, 0);
		const segs = splitIntoSegments(text, [title]);
		expect(segs).toHaveLength(1);
		expect(segs[0].annotationIds).toEqual([]);
	});

	it('adjacent annotations produce no gap segment', () => {
		const a1 = makeAnnotation('a1', 0, 5);
		const a2 = makeAnnotation('a2', 5, 13);
		const segs = splitIntoSegments(text, [a1, a2]);
		expect(segs).toHaveLength(2);
		expect(segs[0]).toMatchObject({ annotationIds: ['a1'] });
		expect(segs[1]).toMatchObject({ annotationIds: ['a2'] });
	});
});
