import {generatePageMetadata} from '@/lib/metadata';
import AssistanceVisaPage from '@/components/pages/AssistanceVisaPage';

export const metadata = generatePageMetadata({
  title: 'Service d\'assistance visa',
  description: 'RDC Etudes offre un service d\'assistance dans le strict respect des lois des pays concernés.',
  path: '/assistance-visa',
});

export default function AssistanceVisaRoute() {
  return <AssistanceVisaPage />;
}
