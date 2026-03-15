import {Suspense} from 'react';
import {getAssistancePackageDictionary, getServices} from '@/lib/content';
import {generatePageMetadata} from '@/lib/metadata';
import AssistancePage from '@/components/pages/AssistancePage';

export const metadata = generatePageMetadata({
  title: 'JE VEUX UNE ASSISTANCE',
  description: "Nous accompagnons les étudiants d'Afrique francophone dans leurs projets d'études.",
  path: '/accompagnement',
});

export default async function AccompagnementPage() {
  const [assistancePackages, services] = await Promise.all([
    getAssistancePackageDictionary(),
    getServices(),
  ]);

  return (
    <Suspense>
      <AssistancePage assistancePackages={assistancePackages} services={services} />
    </Suspense>
  );
}
