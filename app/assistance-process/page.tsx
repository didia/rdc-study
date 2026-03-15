import {Suspense} from 'react';
import {getAssistancePackageDictionary, getServices} from '@/lib/content';
import {generatePageMetadata} from '@/lib/metadata';
import AssistanceProcess from '@/components/pages/AssistanceProcess';

export const metadata = generatePageMetadata({
  title: 'JE SOUHAITE ETRE ASSISTE PAR UN MENTOR RDC ETUDES.',
  description: "L'accompagnement RDC ETUDES consiste à vous orienter dans votre projet d'études du choix de l'université jusqu'à l'obtention de votre visa.",
  path: '/assistance-process',
});

export default async function AssistanceProcessPage() {
  const [assistancePackages, services] = await Promise.all([
    getAssistancePackageDictionary(),
    getServices(),
  ]);

  return (
    <Suspense>
      <AssistanceProcess assistancePackages={assistancePackages} services={services} />
    </Suspense>
  );
}
