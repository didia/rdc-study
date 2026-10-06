import {Suspense} from 'react';
import {generatePageMetadata} from '@/lib/metadata';
import AssistancePage from '@/components/pages/AssistancePage';

export const metadata = generatePageMetadata({
  title: 'JE VEUX UNE ASSISTANCE',
  description: "Nous accompagnons les étudiants d'Afrique francophone dans leurs projets d'études.",
  path: '/accompagnement',
});

export default function AccompagnementPage() {
  return (
    <Suspense>
      <AssistancePage />
    </Suspense>
  );
}
