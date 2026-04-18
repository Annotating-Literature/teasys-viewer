function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
function findAuthorBySlug(texts, slug) {
  return texts.find((t) => slugify(t.author) === slug)?.author;
}

export { findAuthorBySlug as f, slugify as s };
//# sourceMappingURL=slug-CnYtB6EQ.js.map
