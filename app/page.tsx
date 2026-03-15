import {getGuides, getArticles, getScholarships} from '@/lib/content';
import {generatePageMetadata} from '@/lib/metadata';
import IndexPage from '@/components/pages/IndexPage';

const NUMBER_OF_SCHOLARSHIPS_IN_HOME_PAGE = 6;

export const metadata = generatePageMetadata();

export default async function Home() {
  const [allGuides, allArticles, allScholarships] = await Promise.all([
    getGuides(),
    getArticles(),
    getScholarships(),
  ]);

  const countries = allGuides
    .filter((g) => g.topic === 'country')
    .sort((a, b) => (a.name || '').localeCompare(b.name || ''))
    .slice(0, 10)
    .map((g) => ({
      path: g.path,
      excerpt: g.excerpt,
      slug: g.slug,
      title: g.title,
      name: g.name,
      thumbnail: g.flag || g.thumbnail,
    }));

  const articles = allArticles.slice(0, 2).map((a) => ({
    date: a.date,
    excerpt: a.excerpt,
    path: a.path,
    thumbnail: a.thumbnail,
    title: a.title,
    timeToRead: a.timeToRead,
  }));

  const now = Date.now();
  const scholarships = allScholarships
    .filter((s) => s.timestamp > now)
    .slice(0, NUMBER_OF_SCHOLARSHIPS_IN_HOME_PAGE)
    .map((s) => ({
      deadline: s.deadline,
      excerpt: s.excerpt,
      levels: s.levels,
      path: s.path,
      targetCountries: s.targetCountries,
      thumbnail: s.thumbnail,
      title: s.title,
    }));

  return (
    <IndexPage
      articles={articles}
      countries={countries}
      scholarships={scholarships}
      hasMoreArticles={allArticles.length > 2}
    />
  );
}
