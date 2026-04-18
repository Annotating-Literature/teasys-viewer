export function slugify(name: string, maxLength?: number): string {
    const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
    return maxLength ? slug.slice(0, maxLength) : slug;
}

export function findUniqueSlug(base: string, existing: Set<string>): string {
    if (!existing.has(base)) return base;
    let i = 2;
    while (existing.has(`${base}-${i}`)) i++;
    return `${base}-${i}`;
}

export function findAuthorBySlug(
    texts: { author: string }[],
    slug: string
): string | undefined {
    return texts.find((t) => slugify(t.author) === slug)?.author;
}
