import {generatePageMetadata} from '@/lib/metadata';
import PrivacyPolicyPage from '@/components/pages/PrivacyPolicyPage';

export const metadata = generatePageMetadata({
  title: 'Politique de confidentialité',
  description: 'La politique de confidentialité de RDC Etudes.',
  path: '/politique-de-confidentialite',
});

export default function PolitiqueConfidentialitePage() {
  return <PrivacyPolicyPage />;
}
