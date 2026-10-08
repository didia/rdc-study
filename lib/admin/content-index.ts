import 'server-only';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Read-only inventory of the git-backed content (data/**), for the console's "Contenu" page.
export type ContentEntry = {collection: 'article' | 'guide' | 'scholarships'; slug: string; title: string; draft: boolean; modified: string; thumbnail: boolean};

const COLLECTIONS = [
  {dir: 'articles', collection: 'article' as const},
  {dir: 'guides', collection: 'guide' as const},
  {dir: 'scholarships', collection: 'scholarships' as const},
];

function walk(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, {withFileTypes: true}).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : entry.name.endsWith('.md') ? [full] : [];
  });
}

export function cmsEntryLink(collection: string, slug: string): string {
  return `/cms/#/collections/${collection}/entries/${slug}`;
}

export function readContentIndex(root = path.join(process.cwd(), 'data')): ContentEntry[] {
  return COLLECTIONS.flatMap(({dir, collection}) =>
    walk(path.join(root, dir)).map((file) => {
      const {data} = matter(fs.readFileSync(file, 'utf-8'));
      const slug = path.relative(path.join(root, dir), file).replace(/\.md$/, '').split(path.sep).join('/');
      return {
        collection,
        slug,
        title: String(data.title ?? slug),
        draft: data.draft === true,
        modified: fs.statSync(file).mtime.toISOString(),
        thumbnail: Boolean(data.thumbnail),
      };
    }),
  );
}

export function summarise(entries: ContentEntry[]) {
  const summary: Record<string, {total: number; drafts: number}> = {};
  for (const e of entries) {
    const s = (summary[e.collection] ??= {total: 0, drafts: 0});
    s.total += 1;
    if (e.draft) s.drafts += 1;
  }
  return summary;
}
