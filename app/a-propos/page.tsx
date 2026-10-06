import {getGuides, getTeam} from '@/lib/content';
import {generatePageMetadata} from '@/lib/metadata';
import AboutUsPage from '@/components/pages/AboutUsPage';

export const metadata = generatePageMetadata({
  title: 'Pourquoi RDC-Etudes?',
  description: 'Nous voulons que tout le monde ait facilement accès à une éducation de qualité.',
  path: '/a-propos',
});

export default async function AProposPage() {
  const [team, guides] = await Promise.all([getTeam(), getGuides()]);
  const countryNames = guides
    .filter((g) => g.topic === 'country')
    .map((g) => g.name)
    .filter((name): name is string => Boolean(name))
    .sort((a, b) => a.localeCompare(b, 'fr'));

  return <AboutUsPage team={team} countryNames={countryNames} />;
}
