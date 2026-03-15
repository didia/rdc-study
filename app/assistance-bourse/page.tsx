import {generatePageMetadata} from '@/lib/metadata';
import AssistanceScholarship from '@/components/pages/AssistanceScholarship';

export const metadata = generatePageMetadata({
  title: "JE VEUX UNE BOURSE D'ETUDES",
  description: "Nous accompagnons les étudiants d'Afrique francophone dans leurs projets d'études.",
  path: '/assistance-bourse',
});

export default function AssistanceBoursePage() {
  return <AssistanceScholarship />;
}
