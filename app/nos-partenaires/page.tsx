import {generatePageMetadata} from '@/lib/metadata';
import PartenairesPage from '@/components/pages/PartenairesPage';

export const metadata = generatePageMetadata({
  title: 'Nos Partenaires',
  description: 'Découvrez les partenaires de RDC Etudes.',
  path: '/nos-partenaires',
});

export default function NosPartenairesPage() {
  return <PartenairesPage />;
}
