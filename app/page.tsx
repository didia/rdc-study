import {getGuides, getScholarships, getServices} from '@/lib/content';
import {generatePageMetadata} from '@/lib/metadata';
import IndexPage from '@/components/pages/IndexPage';

const NUMBER_OF_SCHOLARSHIPS_IN_HOME_PAGE = 3;
const NUMBER_OF_DESTINATIONS_IN_HOME_PAGE = 6;
const FEATURED_DESTINATIONS = ['usa', 'france', 'canada', 'belgique', 'chypre-du-nord', 'inde'];
const FEATURED_SERVICES = ['consultation', 'verification', 'assistance'];

export const metadata = generatePageMetadata();

export default async function Home() {
  const [allGuides, allScholarships, allServices] = await Promise.all([
    getGuides(),
    getScholarships(),
    getServices(),
  ]);

  const rank = (slug: string) => {
    const index = FEATURED_DESTINATIONS.indexOf(slug);
    return index === -1 ? FEATURED_DESTINATIONS.length : index;
  };

  const destinations = allGuides
    .filter((g) => g.topic === 'country')
    .sort((a, b) => rank(a.slug) - rank(b.slug) || (a.name || '').localeCompare(b.name || ''))
    .slice(0, NUMBER_OF_DESTINATIONS_IN_HOME_PAGE)
    .map((g) => ({
      path: g.path,
      slug: g.slug,
      name: g.name,
      thumbnail: g.thumbnail,
    }));

  const countryNames = allGuides
    .filter((g) => g.topic === 'country')
    .map((g) => g.name)
    .filter((name): name is string => Boolean(name));

  const now = Date.now();
  const scholarships = allScholarships
    .filter((s) => s.timestamp > now)
    .slice(0, NUMBER_OF_SCHOLARSHIPS_IN_HOME_PAGE)
    .map((s) => ({
      deadline: s.deadline,
      levels: s.levels,
      path: s.path,
      targetCountries: s.targetCountries,
      thumbnail: s.thumbnail,
      title: s.title,
    }));

  const services = FEATURED_SERVICES.map((slug) => allServices.find((s) => s.slug === slug))
    .filter((s): s is NonNullable<typeof s> => Boolean(s))
    .map((s) => ({
      slug: s.slug,
      title: s.title,
      price: s.price,
      priceFrom: s.priceFrom,
      excerpt: s.excerpt,
      assistanceRequestLink: s.assistanceRequestLink,
    }));

  return (
    <IndexPage
      countryCount={countryNames.length}
      destinations={destinations}
      scholarships={scholarships}
      services={services}
    />
  );
}
