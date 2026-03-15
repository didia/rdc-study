import {getScholarships} from '@/lib/content';
import {generatePageMetadata} from '@/lib/metadata';
import ScholarshipsPage from '@/components/pages/ScholarshipsPage';

export const metadata = generatePageMetadata({
  title: "Trouver une bourse d'études",
  description: "Voici les offres de bourses en cours trouvées pour vous avec ❤️ par l'équipe RDC Etudes.",
  path: '/bourses',
});

export default async function BoursesPage() {
  const allScholarships = await getScholarships();
  const now = Date.now();

  const scholarships = allScholarships
    .filter((s) => s.timestamp > now)
    .map((s) => ({
      deadline: s.deadline,
      excerpt: s.excerpt,
      levels: s.levels,
      path: s.path,
      targetCountries: s.targetCountries,
      thumbnail: s.thumbnail,
      title: s.title,
    }));

  const page = {
    description: "Voici les offres de bourses en cours trouvées pour vous avec ❤️ par l'équipe RDC Etudes.",
    title: "Trouver une bourse d'études",
    path: '/bourses',
    socialShareEnabled: true,
  };

  return <ScholarshipsPage activeOnly={true} page={page} scholarships={scholarships} />;
}
