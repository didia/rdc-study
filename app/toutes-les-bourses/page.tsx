import {getScholarships} from '@/lib/content';
import {generatePageMetadata} from '@/lib/metadata';
import ScholarshipsPage from '@/components/pages/ScholarshipsPage';

export const metadata = generatePageMetadata({
  title: "Bourses d'études",
  description: "Voici toutes les offres de bourses partagées avec ❤️ par l'équipe RDC Etudes.",
  path: '/toutes-les-bourses',
});

export default async function ToutesLesBourses() {
  const allScholarships = await getScholarships();

  const scholarships = allScholarships.map((s) => ({
    deadline: s.deadline,
    excerpt: s.excerpt,
    levels: s.levels,
    path: s.path,
    targetCountries: s.targetCountries,
    thumbnail: s.thumbnail,
    title: s.title,
  }));

  const page = {
    description: "Voici toutes les offres de bourses partagées avec ❤️ par l'équipe RDC Etudes.",
    title: "Bourses d'études",
    path: '/toutes-les-bourses',
    socialShareEnabled: true,
  };

  return <ScholarshipsPage activeOnly={false} page={page} scholarships={scholarships} />;
}
