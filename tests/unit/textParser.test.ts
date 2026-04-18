import { describe, it, expect } from 'vitest';
import { parseText } from '../../src/lib/server/textParser';

// ─── Poetry ──────────────────────────────────────────────────────────────────

describe('parseText (poetry)', () => {
	it('parses a single poem with one stanza', () => {
		const raw = '## Ode to Joy\nJoy, bright spark of divinity\nDaughter of Elysium\n';
		const result = parseText(raw, 'poetry');
		expect(result.type).toBe('poetry');
		if (result.type !== 'poetry') return;

		expect(result.poems).toHaveLength(1);
		expect(result.poems[0].title).toBe('Ode to Joy');
		expect(result.poems[0].stanzas).toHaveLength(1);
		expect(result.poems[0].stanzas[0]).toHaveLength(2);
	});

	it('assigns sequential globalIndex across stanzas', () => {
		const raw = '## Poem\nLine one\nLine two\n\nLine three\n';
		const result = parseText(raw, 'poetry');
		if (result.type !== 'poetry') return;

		const lines = result.poems[0].stanzas.flat();
		expect(lines.map(l => l.globalIndex)).toEqual([0, 1, 2]);
	});

	it('splits stanzas on blank lines', () => {
		const raw = '## Poem\nA\nB\n\nC\nD\n';
		const result = parseText(raw, 'poetry');
		if (result.type !== 'poetry') return;

		expect(result.poems[0].stanzas).toHaveLength(2);
		expect(result.poems[0].stanzas[0]).toHaveLength(2);
		expect(result.poems[0].stanzas[1]).toHaveLength(2);
	});

	it('tracks char offsets correctly', () => {
		const raw = '## Poem\nHello\nWorld\n';
		const result = parseText(raw, 'poetry');
		if (result.type !== 'poetry') return;

		const lines = result.poems[0].stanzas[0];
		// "## Poem\n" = 8 chars
		expect(lines[0].start).toBe(8);
		expect(lines[0].end).toBe(13); // "Hello" = 5
		// "Hello\n" = 6, so next starts at 14
		expect(lines[1].start).toBe(14);
		expect(lines[1].end).toBe(19); // "World" = 5
	});

	it('handles CRLF line endings', () => {
		const raw = '## Poem\r\nLine one\r\nLine two\r\n';
		const result = parseText(raw, 'poetry');
		if (result.type !== 'poetry') return;

		expect(result.poems[0].stanzas[0]).toHaveLength(2);
		expect(result.poems[0].stanzas[0][0].text).toBe('Line one');
	});

	it('parses multiple poems', () => {
		const raw = '## First\nA\n\n## Second\nB\n';
		const result = parseText(raw, 'poetry');
		if (result.type !== 'poetry') return;

		expect(result.poems).toHaveLength(2);
		expect(result.poems[0].title).toBe('First');
		expect(result.poems[1].title).toBe('Second');
	});

	it('falls back to "Untitled" poem if no ## heading', () => {
		const raw = 'A lone line\n';
		const result = parseText(raw, 'poetry');
		if (result.type !== 'poetry') return;

		expect(result.poems[0].title).toBe('Untitled');
	});

	it('preserves leading indentation in line text', () => {
		const raw = '## Poem\n    indented line\n';
		const result = parseText(raw, 'poetry');
		if (result.type !== 'poetry') return;

		const line = result.poems[0].stanzas[0][0];
		expect(line.text).toBe('    indented line');
		expect(line.indentCount).toBe(4);
	});
});

// ─── Prose ────────────────────────────────────────────────────────────────────

describe('parseText (prose)', () => {
	it('parses a single chapter with paragraphs', () => {
		const raw = '## Chapter 1\nFirst paragraph.\nSecond paragraph.\n';
		const result = parseText(raw, 'prose');
		expect(result.type).toBe('prose');
		if (result.type !== 'prose') return;

		expect(result.chapters).toHaveLength(1);
		expect(result.chapters[0].title).toBe('Chapter 1');
		expect(result.chapters[0].paragraphs).toHaveLength(2);
	});

	it('assigns sequential globalIndex to paragraphs across chapters', () => {
		const raw = '## Ch1\nPara A\n\n## Ch2\nPara B\nPara C\n';
		const result = parseText(raw, 'prose');
		if (result.type !== 'prose') return;

		const all = result.chapters.flatMap(c => c.paragraphs);
		expect(all.map(p => p.globalIndex)).toEqual([0, 1, 2]);
	});

	it('skips blank lines between paragraphs', () => {
		const raw = '## Ch\nA\n\n\nB\n';
		const result = parseText(raw, 'prose');
		if (result.type !== 'prose') return;

		expect(result.chapters[0].paragraphs).toHaveLength(2);
	});

	it('tracks char offsets for paragraphs', () => {
		const raw = '## Ch\nHello\nWorld\n';
		const result = parseText(raw, 'prose');
		if (result.type !== 'prose') return;

		const paras = result.chapters[0].paragraphs;
		// "## Ch\n" = 6
		expect(paras[0].start).toBe(6);
		expect(paras[0].end).toBe(11);
		// "Hello\n" = 6, next starts at 12
		expect(paras[1].start).toBe(12);
		expect(paras[1].end).toBe(17);
	});

	it('falls back to "Untitled" chapter if no ## heading', () => {
		const raw = 'Some text\n';
		const result = parseText(raw, 'prose');
		if (result.type !== 'prose') return;

		expect(result.chapters[0].title).toBe('Untitled');
	});
});

// ─── Drama ────────────────────────────────────────────────────────────────────

describe('parseText (drama)', () => {
	it('parses an act with a scene and speech', () => {
		const raw = '## Act I\n## Scene 1\nHAMLET: To be or not to be.\n';
		const result = parseText(raw, 'drama');
		expect(result.type).toBe('drama');
		if (result.type !== 'drama') return;

		expect(result.acts).toHaveLength(1);
		expect(result.acts[0].scenes).toHaveLength(1);
		expect(result.acts[0].scenes[0].blocks).toHaveLength(1);

		const block = result.acts[0].scenes[0].blocks[0];
		expect(block.type).toBe('speech');
		expect(block.speaker).toBe('HAMLET');
		expect(block.text).toBe('To be or not to be.');
	});

	it('identifies stage directions by square brackets', () => {
		const raw = '## Act I\n## Scene 1\n[Enter Hamlet]\n';
		const result = parseText(raw, 'drama');
		if (result.type !== 'drama') return;

		const block = result.acts[0].scenes[0].blocks[0];
		expect(block.type).toBe('stage');
		expect(block.text).toBe('[Enter Hamlet]');
	});

	it('parses multiple acts and scenes', () => {
		const raw = '## Act I\n## Scene 1\nA: Hello.\n## Act II\n## Scene 1\nB: Goodbye.\n';
		const result = parseText(raw, 'drama');
		if (result.type !== 'drama') return;

		expect(result.acts).toHaveLength(2);
		expect(result.acts[0].scenes[0].blocks[0].speaker).toBe('A');
		expect(result.acts[1].scenes[0].blocks[0].speaker).toBe('B');
	});

	it('assigns sequential globalIndex to blocks', () => {
		const raw = '## Act I\n## Scene 1\nA: One.\nB: Two.\n[Stage dir]\n';
		const result = parseText(raw, 'drama');
		if (result.type !== 'drama') return;

		const blocks = result.acts[0].scenes[0].blocks;
		expect(blocks.map(b => b.globalIndex)).toEqual([0, 1, 2]);
	});

	it('tracks char offsets for speech text (after speaker prefix)', () => {
		const raw = '## Act I\n## Scene 1\nA: Hello.\n';
		const result = parseText(raw, 'drama');
		if (result.type !== 'drama') return;

		const block = result.acts[0].scenes[0].blocks[0];
		// "## Act I\n## Scene 1\n" = 20, "A: " = 3, so "Hello." starts at 23
		expect(block.start).toBe(23);
		expect(block.end).toBe(29);
	});
});

// ─── Error handling ───────────────────────────────────────────────────────────

describe('parseText (unsupported type)', () => {
	it('throws for unsupported type', () => {
		// @ts-expect-error intentional
		expect(() => parseText('text', 'essay')).toThrow('Unsupported text type: essay');
	});
});
