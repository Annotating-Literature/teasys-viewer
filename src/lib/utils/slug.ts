export function slugify(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}

export function findAuthorBySlug(
    texts: { author: string }[],
    slug: string
): string | undefined {
    return texts.find((t) => slugify(t.author) === slug)?.author;
}
