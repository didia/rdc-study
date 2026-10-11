import 'server-only';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export type CataloguePackage = {slug: string; title: string; country: string; kind: string};

let cache: CataloguePackage[] | null = null;

// Assistance packages live in git (data/assistance-packages); requests reference them by slug only.
export function listPackages(): CataloguePackage[] {
  if (cache) return cache;
  const dir = path.join(process.cwd(), 'data', 'assistance-packages');
  const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith('.md')) : [];
  cache = files
    .map((file) => {
      const {data} = matter(fs.readFileSync(path.join(dir, file), 'utf-8'));
      const slug = String(data.slug ?? '');
      const [country = '', kind = ''] = slug.split('/');
      return {slug, title: String(data.title ?? slug), country, kind};
    })
    .filter((p) => p.slug)
    .sort((a, b) => a.slug.localeCompare(b.slug));
  return cache;
}

export const KIND_LABELS: Record<string, string> = {
  admission: 'Admission',
  caq: 'CAQ',
  equivalence: 'Équivalence',
  visa: 'Visa / permis d’études',
};

const COUNTRY_LABELS: Record<string, string> = {
  belgique: 'Belgique',
  canada: 'Canada',
  france: 'France',
  inde: 'Inde',
  usa: 'États-Unis',
  'chypre-du-nord': 'Chypre du Nord',
};

export function packageLabel(slug: string | null): string {
  if (!slug) return '';
  const [country, kind] = slug.split('/');
  const pretty = COUNTRY_LABELS[country] ?? country.replace(/-/g, ' ').replace(/^./, (c) => c.toUpperCase());
  return `${pretty} – ${KIND_LABELS[kind] ?? kind}`;
}
