/**
 * Converts straight quotes in HTML text nodes to typographic smart quotes.
 * Skips content inside HTML tags.
 */
export function applySmartQuotes(html: string): string {
	let text = html.replace(/&quot;/g, '"').replace(/&#39;/g, "'");
	const parts = text.split(/(<[^>]*>)/);
	for (let i = 0; i < parts.length; i++) {
		if (!parts[i].startsWith("<")) {
			parts[i] = parts[i]
				.replace(/(^|[-\u2014\s(\["])'/g, "$1\u2018")        // opening singles
				.replace(/'/g, "\u2019")                             // closing singles & apostrophes
				.replace(/(^|[-\u2014/\[(\u2018\s])"/g, "$1\u201c") // opening doubles
				.replace(/"/g, "\u201d");                            // closing doubles
		}
	}
	return parts.join("");
}
