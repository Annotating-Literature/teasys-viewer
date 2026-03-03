import type { Annotation } from '$lib/types/annotation';

export interface TextSegment {
	text: string;
	start: number;
	end: number;
	annotationIds: string[];
}

export function splitIntoSegments(
	rawText: string,
	annotations: Annotation[]
): TextSegment[] {
	if (!annotations || annotations.length === 0) {
		return [{ text: rawText, start: 0, end: rawText.length, annotationIds: [] }];
	}

	const breakpoints = new Set<number>([0, rawText.length]);
	for (const ann of annotations) {
		breakpoints.add(ann.anchorStart);
		breakpoints.add(ann.anchorEnd);
	}

	const sortedPoints = Array.from(breakpoints).sort((a, b) => a - b);

	const segments: TextSegment[] = [];
	for (let i = 0; i < sortedPoints.length - 1; i++) {
		const start = sortedPoints[i];
		const end = sortedPoints[i + 1];

		if (start === end) continue;

		const mid = (start + end) / 2;
		const text = rawText.substring(start, end);

		const annotationIds = annotations
			.filter((ann) => ann.anchorStart <= mid && ann.anchorEnd > mid)
			.map((ann) => ann.id);

		segments.push({ text, start, end, annotationIds });
	}

	return segments;
}
