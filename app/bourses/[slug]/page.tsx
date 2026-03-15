import {notFound} from 'next/navigation';
import {getScholarships, getScholarshipBySlug, getUpcomingScholarships} from '@/lib/content';
import {generatePageMetadata} from '@/lib/metadata';
import ScholarshipPage from '@/components/pages/ScholarshipPage';
import type {Metadata} from 'next';

export async function generateStaticParams() {
  const scholarships = await getScholarships();
  return scholarships.map((s) => ({slug: s.slug}));
}

export async function generateMetadata({params}: {params: Promise<{slug: string}>}): Promise<Metadata> {
  const {slug} = await params;
  const scholarship = await getScholarshipBySlug(slug);
  if (!scholarship) return {};

  return generatePageMetadata({
    title: scholarship.title,
    description: scholarship.excerpt,
    path: scholarship.path,
    image: scholarship.metaImage,
    keywords: scholarship.tags,
  });
}

export default async function ScholarshipRoute({params}: {params: Promise<{slug: string}>}) {
  const {slug} = await params;
  const scholarship = await getScholarshipBySlug(slug);

  if (!scholarship) notFound();

  const otherScholarships = await getUpcomingScholarships(slug, 12);
  const otherScholarshipsMapped = otherScholarships.map((s) => ({
    deadline: s.deadline,
    excerpt: s.excerpt,
    levels: s.levels,
    path: s.path,
    targetCountries: s.targetCountries,
    thumbnail: s.thumbnail,
    title: s.title,
  }));

  return (
    <ScholarshipPage
      scholarship={{
        content: scholarship.content,
        deadline: scholarship.deadline,
        excerpt: scholarship.excerpt,
        levels: scholarship.levels,
        metaImage: scholarship.metaImage || {src: scholarship.thumbnail, width: 1200, height: 630},
        path: scholarship.path,
        tags: scholarship.tags,
        targetCountries: scholarship.targetCountries,
        thumbnail: scholarship.thumbnail,
        thumbnailCredits: scholarship.thumbnailCredits,
        title: scholarship.title,
      }}
      otherScholarships={otherScholarshipsMapped}
    />
  );
}
