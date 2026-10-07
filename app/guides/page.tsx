import {getGuides} from '@/lib/content';
import {generatePageMetadata} from '@/lib/metadata';
import GuidesPage from '@/components/pages/GuidesPage';

export const metadata = generatePageMetadata({
  title: 'Guides par pays',
  description:
    "Des guides gratuits, étape par étape : admission, bourses, visa d'études, logement et vie sur le campus.",
  path: '/guides',
});

export default async function GuidesIndexPage() {
  const allGuides = await getGuides();

  const guides = allGuides
    .filter((g) => g.topic === 'country')
    .sort((a, b) => (a.name || '').localeCompare(b.name || '', 'fr'))
    .map((g) => ({
      path: g.path,
      slug: g.slug,
      title: g.title,
      name: g.name,
      excerpt: g.excerpt,
      thumbnail: g.thumbnail,
    }));

  return <GuidesPage guides={guides} />;
}
