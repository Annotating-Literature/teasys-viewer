import fs from 'fs/promises';
import path from 'path';
import { getText, listAnnotations } from './content';

const XML_DIR = path.resolve('content', 'xml');

function escapeXml(text: string): string {
	return text
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

export async function generateTEI(textId: string): Promise<void> {
	const { metadata, rawText } = await getText(textId);
	const annotations = await listAnnotations(textId);

	const insertions: { pos: number; tag: string }[] = [];
	for (const ann of annotations) {
		insertions.push({ pos: ann.anchorStart, tag: `<anchor xml:id="s-${ann.id}"/>` });
		insertions.push({ pos: ann.anchorEnd, tag: `<anchor xml:id="e-${ann.id}"/>` });
	}
	insertions.sort((a, b) => a.pos - b.pos);

	let annotatedText = '';
	let lastPos = 0;
	for (const ins of insertions) {
		annotatedText += escapeXml(rawText.substring(lastPos, ins.pos)) + ins.tag;
		lastPos = ins.pos;
	}
	annotatedText += escapeXml(rawText.substring(lastPos));

	const teiHeader = `
    <teiHeader>
      <fileDesc>
        <titleStmt>
          <title>${escapeXml(metadata.title)}</title>
          <author>${escapeXml(metadata.author)}</author>
        </titleStmt>
        <publicationStmt><p>TEASys Viewer</p></publicationStmt>
        <sourceDesc><p>Annotating Literature, Tübingen University</p></sourceDesc>
      </fileDesc>
    </teiHeader>
  `.trim();

	const standOff = `
    <standOff>
      <listAnnotation>
        ${annotations
			.map(
				(ann) => `
          <annotation xml:id="ann-${ann.id}" from="#s-${ann.id}" to="#e-${ann.id}">
            <respStmt><resp>annotator</resp>${ann.authors.map((a) => `<name>${escapeXml(a)}</name>`).join('')}</respStmt>
            <date>${ann.createdAt.split('T')[0]}</date>
            ${ann.levels
						.map(
							(lvl) => `
              <div type="level" n="${lvl.level}">
                <div type="category" ana="#${lvl.category}">
                  <p>${escapeXml(lvl.body)}</p>
                  ${lvl.worksCited.length > 0
									? `<listBibl>${lvl.worksCited
										.map((w) => `<bibl>${escapeXml(w)}</bibl>`)
										.join('')}</listBibl>`
									: ''
								}
                </div>
              </div>
            `
						)
						.join('')}
          </annotation>
        `
			)
			.join('')}
      </listAnnotation>
    </standOff>
  `.trim();

	const textBody = `<text><body><div>${annotatedText}</div></body></text>`;

	const teiContent = `<?xml version="1.0" encoding="UTF-8"?>
<TEI xmlns="http://www.tei-c.org/ns/1.0">
  ${teiHeader}
  ${textBody}
  ${standOff}
</TEI>`;

	// Write to content/xml/<textId>.tei.xml
	await fs.mkdir(XML_DIR, { recursive: true });
	const teiPath = path.join(XML_DIR, `${textId}.tei.xml`);
	await fs.writeFile(teiPath, teiContent, 'utf-8');
}
