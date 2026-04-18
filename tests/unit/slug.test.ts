import { describe, it, expect } from 'vitest';
import { slugify, findAuthorBySlug } from '../../src/lib/utils/slug';

describe('slugify', () => {
	it('lowercases and hyphenates words', () => {
		expect(slugify('Hello World')).toBe('hello-world');
	});

	it('handles German names with spaces', () => {
		expect(slugify('Friedrich Schiller')).toBe('friedrich-schiller');
	});

	it('collapses multiple non-alphanumeric chars into one hyphen', () => {
		expect(slugify('foo  --  bar')).toBe('foo-bar');
	});

	it('strips leading and trailing hyphens', () => {
		expect(slugify('--foo--')).toBe('foo');
	});

	it('preserves numbers', () => {
		expect(slugify('Part 2')).toBe('part-2');
	});

	it('handles already-slugified input unchanged', () => {
		expect(slugify('my-slug')).toBe('my-slug');
	});

	it('handles single word', () => {
		expect(slugify('Goethe')).toBe('goethe');
	});

	it('replaces special characters', () => {
		expect(slugify("L'Étranger")).toBe('l-tranger');
	});
});

describe('findAuthorBySlug', () => {
	const texts = [
		{ author: 'Johann Wolfgang von Goethe' },
		{ author: 'Friedrich Schiller' },
		{ author: 'Heinrich Heine' },
	];

	it('finds an author whose slug matches', () => {
		expect(findAuthorBySlug(texts, 'friedrich-schiller')).toBe('Friedrich Schiller');
	});

	it('finds multi-word author slug', () => {
		expect(findAuthorBySlug(texts, 'johann-wolfgang-von-goethe')).toBe('Johann Wolfgang von Goethe');
	});

	it('returns undefined for unknown slug', () => {
		expect(findAuthorBySlug(texts, 'bertolt-brecht')).toBeUndefined();
	});

	it('returns undefined for empty list', () => {
		expect(findAuthorBySlug([], 'anyone')).toBeUndefined();
	});
});
