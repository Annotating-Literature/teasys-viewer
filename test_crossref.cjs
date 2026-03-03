const marked = require('marked').marked;

function applySmartQuotes(html) {
	const unescaped = html.replace(/&quot;/g, '"');
	let insideTag = false;
	let open = true;
	let result = "";
	for (const ch of unescaped) {
		if (ch === "<") {
			insideTag = true;
			result += ch;
		} else if (ch === ">") {
			insideTag = false;
			result += ch;
		} else if (ch === '"' && !insideTag) {
			result += open ? "\u201c" : "\u201d";
			open = !open;
		} else {
			result += ch;
		}
	}
	return result;
}

const resolved = 'Test [[abc]]';
const replaced = resolved.replace(/\[\[([^\]]+)\]\]/g, (match, annId) => {
	return `<a class="crossref-link" data-ann-id="${annId}" title="Cross-reference">“AnchorText”</a>`;
});
console.log("Replaced:", replaced);
console.log("Marked:", marked(replaced));
console.log("SmartQuotes:", applySmartQuotes(marked(replaced)));
