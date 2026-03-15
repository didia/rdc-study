import {getServices} from '@/lib/content';
import {generatePageMetadata} from '@/lib/metadata';
import ServicesPage from '@/components/pages/ServicesPage';

export const metadata = generatePageMetadata({
  title: 'Nous sommes là pour vous à chaque étape de votre projet d\'études!',
  description: 'Que vous soyez au tout début ne sachant pas comment vous y prendre, que vous ayez déjà obtenu votre admission ou que vous soyez déjà dans votre pays de destination, nous offrons un éventail de services qui vous permettent de réussir votre projet d\'études',
  path: '/nos-services',
});

export default async function NosServicesPage() {
  const allServices = await getServices();

  const page = {
    title: 'Nous sommes là pour vous à chaque étape de votre projet d\'études!',
    description: 'Que vous soyez au tout début ne sachant pas comment vous y prendre, que vous ayez déjà obtenu votre admission ou que vous soyez déjà dans votre pays de destination, nous offrons un éventail de services qui vous permettent de réussir votre projet d\'études',
    path: '/nos-services',
    socialShareEnabled: true,
  };

  const services = allServices.map((s) => ({
    slug: s.slug,
    title: s.title,
    price: s.price,
    excerpt: s.excerpt,
    assistanceRequestLink: s.assistanceRequestLink,
  }));

  return <ServicesPage page={page} services={services} />;
}
