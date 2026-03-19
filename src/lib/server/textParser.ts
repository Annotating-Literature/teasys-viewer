import type {
	ParsedText,
	Poem,
	ProseChapter,
	DramaAct,
	DramaScene,
	PoetryLine,
	ProseParagraph,
	DramaBlock
} from '$lib/types/text';

export function parseText(rawText: string, type: 'poetry' | 'prose' | 'drama'): ParsedText {
	const lines = rawText.split(/\n/);
	let globalIndex = 0;
	let charOffset = 0;

	if (type === 'poetry') {
		const poems: Poem[] = [];
		let currentPoem: Poem | null = null;
		let currentStanza: PoetryLine[] = [];

		for (const lineWithCR of lines) {
			const hasCR = lineWithCR.endsWith('\r');
			const line = hasCR ? lineWithCR.slice(0, -1) : lineWithCR;
			const trimmed = line.trim();
			const lineLength = lineWithCR.length + 1; // +1 for the newline character

			if (trimmed.startsWith('## ')) {
				if (currentStanza.length > 0 && currentPoem) {
					currentPoem.stanzas.push(currentStanza);
					currentStanza = [];
				}
				if (currentPoem) {
					poems.push(currentPoem);
				}
				const prefixLength = line.indexOf(trimmed.substring(3));
				const titleStart = charOffset + prefixLength;
				currentPoem = {
					title: trimmed.substring(3).trim(),
					titleStart,
					titleEnd: titleStart + trimmed.substring(3).trim().length,
					stanzas: []
				};
			} else if (trimmed === '') {
				if (currentStanza.length > 0 && currentPoem) {
					currentPoem.stanzas.push(currentStanza);
					currentStanza = [];
				}
			} else {
				if (!currentPoem) {
					currentPoem = { title: 'Untitled', stanzas: [] };
				}

				// Calculate indentation (leading spaces) to detect drop lines
				const indentMatch = line.match(/^(\s+)/);
				const indentCount = indentMatch ? indentMatch[1].length : 0;

				// A line is considered a "drop line" only through manual metadata or extreme context.
				// For now, treat all visual indentations as standard poetic lines to preserve correct numbering.
				const isDropLine = false; 
				
				globalIndex++;

				currentStanza.push({
					globalIndex: globalIndex - 1,
					text: line, // Keep original line with spaces
					start: charOffset,
					end: charOffset + line.length,
					indentCount,
					isDropLine
				});
			}
			charOffset += lineLength;
		}

		if (currentStanza.length > 0 && currentPoem) {
			currentPoem.stanzas.push(currentStanza);
		}
		if (currentPoem) {
			poems.push(currentPoem);
		}

		return { type: 'poetry', poems };
	} else if (type === 'prose') {
		const chapters: ProseChapter[] = [];
		let currentChapter: ProseChapter | null = null;

		for (const lineWithCR of lines) {
			const hasCR = lineWithCR.endsWith('\r');
			const line = hasCR ? lineWithCR.slice(0, -1) : lineWithCR;
			const trimmed = line.trim();
			const lineLength = lineWithCR.length + 1;

			if (trimmed.startsWith('## ')) {
				if (currentChapter) chapters.push(currentChapter);
				const prefixLength = line.indexOf(trimmed.substring(3));
				const titleStart = charOffset + prefixLength;
				currentChapter = {
					title: trimmed.substring(3).trim(),
					titleStart,
					titleEnd: titleStart + trimmed.substring(3).trim().length,
					paragraphs: []
				};
			} else if (trimmed !== '') {
				if (!currentChapter) {
					currentChapter = { title: 'Untitled', paragraphs: [] };
				}
				const prefixLength = line.indexOf(trimmed);
				currentChapter.paragraphs.push({
					globalIndex: globalIndex++,
					text: trimmed,
					start: charOffset + prefixLength,
					end: charOffset + prefixLength + trimmed.length
				});
			}
			charOffset += lineLength;
		}

		if (currentChapter) chapters.push(currentChapter);

		return { type: 'prose', chapters };
	} else if (type === 'drama') {
		const acts: DramaAct[] = [];
		let currentAct: DramaAct | null = null;
		let currentScene: DramaScene | null = null;

		for (const lineWithCR of lines) {
			const hasCR = lineWithCR.endsWith('\r');
			const line = hasCR ? lineWithCR.slice(0, -1) : lineWithCR;
			const trimmed = line.trim();
			const lineLength = lineWithCR.length + 1;

			if (trimmed.startsWith('## Act')) {
				if (currentScene && currentAct) currentAct.scenes.push(currentScene);
				if (currentAct) acts.push(currentAct);
				const prefixLength = line.indexOf(trimmed.substring(3));
				const titleStart = charOffset + prefixLength;
				currentAct = {
					title: trimmed.substring(3).trim(),
					titleStart,
					titleEnd: titleStart + trimmed.substring(3).trim().length,
					scenes: []
				};
				currentScene = null;
			} else if (trimmed.startsWith('## Scene') || (trimmed.startsWith('## ') && !trimmed.startsWith('## Act'))) {
				if (currentScene && currentAct) currentAct.scenes.push(currentScene);
				if (!currentAct) currentAct = { title: 'Untitled Act', scenes: [] };
				const prefixLength = line.indexOf(trimmed.substring(3));
				const titleStart = charOffset + prefixLength;
				currentScene = {
					title: trimmed.substring(3).trim(),
					titleStart,
					titleEnd: titleStart + trimmed.substring(3).trim().length,
					blocks: []
				};
			} else if (trimmed !== '') {
				if (!currentAct) currentAct = { title: 'Untitled Act', scenes: [] };
				if (!currentScene) currentScene = { title: 'Untitled Scene', blocks: [] };

				let blockType: 'stage' | 'speech' = 'speech';
				let speaker: string | undefined;
				let text = trimmed;
				let startOffset = charOffset;

				if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
					blockType = 'stage';
				} else if (/^[A-Z\s]+:/.test(trimmed)) {
					const colonIndex = trimmed.indexOf(':');
					speaker = trimmed.substring(0, colonIndex).trim();
					text = trimmed.substring(colonIndex + 1).trim();
					const prefixLength = line.indexOf(text);
					startOffset += prefixLength;
				} else {
					startOffset += line.length - line.trimStart().length;
				}

				if (text) {
					currentScene.blocks.push({
						globalIndex: globalIndex++,
						type: blockType,
						speaker,
						text,
						start: startOffset,
						end: startOffset + text.length
					});
				}
			}
			charOffset += lineLength;
		}

		if (currentScene && currentAct) currentAct.scenes.push(currentScene);
		if (currentAct) acts.push(currentAct);

		return { type: 'drama', acts };
	}

	throw new Error(`Unsupported text type: ${type}`);
}
