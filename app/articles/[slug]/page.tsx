import {notFound} from 'next/navigation';
import {getArticles, getArticleBySlug} from '@/lib/content';
import {generatePageMetadata} from '@/lib/metadata';
import ArticlePage from '@/components/pages/ArticlePage';
import type {Metadata} from 'next';

export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.map((a) => ({slug: a.slug}));
}

export async function generateMetadata({params}: {params: Promise<{slug: string}>}): Promise<Metadata> {
  const {slug} = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};

  return generatePageMetadata({
    title: article.title,
    description: article.excerpt,
    path: article.path,
    image: article.metaImage,
    keywords: article.tags,
  });
}

export default async function ArticleRoute({params}: {params: Promise<{slug: string}>}) {
  const {slug} = await params;
  const article = await getArticleBySlug(slug);

  if (!article) notFound();

  const allArticles = await getArticles();
  const otherArticles = allArticles
    .filter((a) => a.slug !== slug)
    .slice(0, 10)
    .map((a) => ({
      date: a.date,
      excerpt: a.excerpt,
      path: a.path,
      thumbnail: a.thumbnail,
      title: a.title,
      timeToRead: a.timeToRead,
    }));

  return (
    <ArticlePage
      article={{
        content: article.content,
        metaImage: article.metaImage || {src: article.thumbnail, width: 1200, height: 630},
        date: article.date,
        excerpt: article.excerpt,
        path: article.path,
        tags: article.tags,
        thumbnail: article.thumbnail,
        thumbnailCredits: article.thumbnailCredits,
        timeToRead: article.timeToRead,
        title: article.title,
      }}
      otherArticles={otherArticles}
      hasMoreArticles={allArticles.length > 11}
    />
  );
}
