import {Suspense} from 'react';
import {getAssistancePackageDictionary, getGuides, getServices} from '@/lib/content';
import {generatePageMetadata} from '@/lib/metadata';
import {getServicePrices} from '@/lib/prices';
import AssistanceProcess from '@/components/pages/AssistanceProcess';

export const metadata = generatePageMetadata({
  title: 'JE SOUHAITE ETRE ASSISTE PAR UN MENTOR RDC ETUDES.',
  description: "L'accompagnement RDC ETUDES consiste à vous orienter dans votre projet d'études du choix de l'université jusqu'à l'obtention de votre visa.",
  path: '/assistance-process',
});

export default async function AssistanceProcessPage() {
  const [assistancePackages, services, guides, prices] = await Promise.all([
    getAssistancePackageDictionary(),
    getServices(),
    getGuides(),
    getServicePrices(),
  ]);
  const guideSlugs = guides.map((guide) => guide.slug);

  return (
    <Suspense>
      <AssistanceProcess assistancePackages={assistancePackages} services={services} guideSlugs={guideSlugs} prices={prices} />
    </Suspense>
  );
}
