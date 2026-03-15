import {getArticles} from '@/lib/content';
import {generatePageMetadata} from '@/lib/metadata';
import ArticlesPage from '@/components/pages/ArticlesPage';

export const metadata = generatePageMetadata({
  title: 'Articles récents',
  description: 'Découvrez les derniers articles postés sur RDC-Etudes.',
  path: '/articles',
});

export default async function ArticlesRoute() {
  const allArticles = await getArticles();

  const articles = allArticles.map((a) => ({
    date: a.date,
    excerpt: a.excerpt,
    path: a.path,
    thumbnail: a.thumbnail,
    title: a.title,
    timeToRead: a.timeToRead,
  }));

  return <ArticlesPage articles={articles} />;
}
