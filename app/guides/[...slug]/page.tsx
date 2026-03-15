import {notFound} from 'next/navigation';
import {getGuides, getGuideBySlug, splitRelatedAndOthers} from '@/lib/content';
import {generatePageMetadata} from '@/lib/metadata';
import GuidePage from '@/components/pages/GuidePage';
import type {Metadata} from 'next';

export async function generateStaticParams() {
  const guides = await getGuides();
  return guides.map((g) => ({slug: g.slug.split('/')}));
}

export async function generateMetadata({params}: {params: Promise<{slug: string[]}>}): Promise<Metadata> {
  const {slug} = await params;
  const slugStr = slug.join('/');
  const guide = await getGuideBySlug(slugStr);
  if (!guide) return {};

  return generatePageMetadata({
    title: guide.title,
    description: guide.excerpt,
    path: guide.path,
    image: guide.metaImage,
  });
}

export default async function GuideRoute({params}: {params: Promise<{slug: string[]}>}) {
  const {slug} = await params;
  const slugStr = slug.join('/');
  const guide = await getGuideBySlug(slugStr);

  if (!guide) notFound();

  const allGuides = await getGuides();
  const {relatedGuides, otherGuides} = splitRelatedAndOthers(guide, allGuides);

  const mapGuide = (g: typeof guide) => ({
    path: g.path,
    excerpt: g.excerpt,
    slug: g.slug,
    title: g.title,
    name: g.name,
    thumbnail: g.thumbnail,
  });

  return (
    <GuidePage
      guide={{
        content: guide.content,
        metaImage: guide.metaImage || {src: guide.thumbnail, width: 1200, height: 630},
        excerpt: guide.excerpt,
        path: guide.path,
        slug: guide.slug,
        thumbnail: guide.thumbnail,
        title: guide.title,
        topic: guide.topic,
        related: guide.related,
      }}
      relatedGuides={relatedGuides.map(mapGuide)}
      otherGuides={otherGuides.map(mapGuide)}
    />
  );
}
