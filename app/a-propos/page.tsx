import {getTeam} from '@/lib/content';
import {generatePageMetadata} from '@/lib/metadata';
import AboutUsPage from '@/components/pages/AboutUsPage';

export const metadata = generatePageMetadata({
  title: 'Pourquoi RDC-Etudes?',
  description: 'Nous voulons que tout le monde ait facilement accès à une éducation de qualité.',
  path: '/a-propos',
});

export default async function AProposPage() {
  const team = await getTeam();
  return <AboutUsPage team={team} />;
}
