import { getCollection } from 'astro:content';

// Static search index for the ⌘K palette. Built at compile time and fetched
// lazily the first time someone types, so it costs nothing on page load.

// Strips the markdown/MDX that would otherwise pollute snippets and matches:
// frontmatter, code fences, images, link syntax, headings, emphasis marks.
function toPlainText(md: string): string {
  return md
    .replace(/^---[\s\S]*?---/, '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/^\s{0,3}#{1,6}\s+/gm, '')
    .replace(/^\s*>\s?/gm, '')
    .replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

export async function GET() {
  const posts = (await getCollection('blog', ({ data }) => !data.draft))
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  const index = posts.map((p) => ({
    id: p.id,
    title: p.data.title,
    description: p.data.description,
    tags: p.data.tags,
    date: p.data.date.toISOString().slice(0, 10),
    text: toPlainText(p.body ?? ''),
  }));

  return new Response(JSON.stringify(index), {
    headers: { 'Content-Type': 'application/json' },
  });
}
