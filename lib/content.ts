import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import {unified} from 'unified';
import remarkParse from 'remark-parse';
import remarkSmartypants from 'remark-smartypants';
import remarkRehype from 'remark-rehype';
import rehypePrismPlus from 'rehype-prism-plus';
import rehypeStringify from 'rehype-stringify';
import readingTime from 'reading-time';

import type {
  Article,
  Guide,
  Scholarship,
  Service,
  AssistancePackage,
  AssistancePackageDictionary,
  FAQ,
  TeamMember,
} from './types';

const DATA_DIR = path.join(process.cwd(), 'data');

async function markdownToHtml(markdown: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkSmartypants)
    .use(remarkRehype, {allowDangerousHtml: true})
    .use(rehypePrismPlus)
    .use(rehypeStringify, {allowDangerousHtml: true})
    .process(markdown);

  return result.toString();
}

function getAllFiles(dir: string, ext = '.md'): string[] {
  if (!fs.existsSync(dir)) return [];

  const files: string[] = [];
  const entries = fs.readdirSync(dir, {withFileTypes: true});

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getAllFiles(fullPath, ext));
    } else if (entry.name.endsWith(ext)) {
      files.push(fullPath);
    }
  }

  return files;
}

function resolveImagePath(imagePath: string | undefined, sourceDir?: string): string {
  if (!imagePath) return '';
  if (imagePath.startsWith('/')) return imagePath;
  if (imagePath.startsWith('http')) return imagePath;

  // If we know the source file's directory, resolve the relative path
  // so the URL maps to /data/<relative-dir>/<imagePath>.
  // The prebuild script (scripts/copy-data-assets.mjs) mirrors data/ into
  // public/data/, so these URLs resolve to real files.
  if (sourceDir) {
    const relativeDir = path.relative(DATA_DIR, sourceDir);
    return `/data/${relativeDir}/${imagePath}`;
  }

  return `/${imagePath}`;
}

// ---- Articles ----

export async function getArticles(showDraft = false): Promise<Article[]> {
  const dir = path.join(DATA_DIR, 'articles');
  const files = getAllFiles(dir);

  const articles = await Promise.all(
    files.map(async (filePath) => {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const {data, content} = matter(fileContent);

      if (!showDraft && data.draft) return null;

      const fileName = path.basename(filePath, '.md');
      const html = await markdownToHtml(content);
      const stats = readingTime(content);

      return {
        content: html,
        title: data.title,
        date: data.date,
        excerpt: data.excerpt || '',
        thumbnail: resolveImagePath(data.thumbnail),
        thumbnailCredits: data.thumbnailCredits || undefined,
        tags: data.tags || [],
        slug: fileName,
        path: `/articles/${fileName}`,
        timeToRead: Math.ceil(stats.minutes),
        metaImage: data.thumbnail
          ? {src: resolveImagePath(data.thumbnail), width: 1200, height: 630}
          : undefined,
      } as Article;
    })
  );

  return articles
    .filter((a): a is Article => a !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const articles = await getArticles();
  return articles.find((a) => a.slug === slug) || null;
}

// ---- Guides ----

export async function getGuides(showDraft = false): Promise<Guide[]> {
  const dir = path.join(DATA_DIR, 'guides');
  const files = getAllFiles(dir);

  const guides = await Promise.all(
    files.map(async (filePath) => {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const {data, content} = matter(fileContent);

      if (!showDraft && data.draft) return null;
      if (!data.slug) return null;

      const html = await markdownToHtml(content);
      const sourceDir = path.dirname(filePath);

      return {
        content: html,
        title: data.title,
        excerpt: data.excerpt || '',
        slug: data.slug,
        topic: data.topic || 'country',
        related: data.related || [],
        name: data.name || '',
        flag: data.flag ? resolveImagePath(data.flag, sourceDir) : undefined,
        thumbnail: resolveImagePath(data.thumbnail, sourceDir),
        date: data.date,
        path: `/guides/${data.slug}`,
        draft: Boolean(data.draft),
        metaImage: data.thumbnail
          ? {src: resolveImagePath(data.thumbnail, sourceDir), width: 1200, height: 630}
          : undefined,
      } as Guide;
    })
  );

  return guides.filter((g): g is Guide => g !== null);
}

export async function getGuideBySlug(slug: string): Promise<Guide | null> {
  const guides = await getGuides();
  return guides.find((g) => g.slug === slug) || null;
}

export function splitRelatedAndOthers(
  guide: Guide,
  allGuides: Guide[]
): {relatedGuides: Guide[]; otherGuides: Guide[]} {
  const sameTopicGuides = allGuides.filter(
    (g) => g.topic === guide.topic && g.slug !== guide.slug
  );

  if (!guide.related || guide.related.length === 0) {
    return {relatedGuides: [], otherGuides: sameTopicGuides};
  }

  const relatedGuides = guide.related
    .map((relatedSlug) => sameTopicGuides.find((g) => g.slug === relatedSlug))
    .filter((g): g is Guide => g !== undefined);

  const relatedSlugs = new Set(guide.related);
  const otherGuides = sameTopicGuides.filter((g) => !relatedSlugs.has(g.slug));

  return {relatedGuides, otherGuides};
}

// ---- Scholarships ----

export async function getScholarships(showDraft = false): Promise<Scholarship[]> {
  const dir = path.join(DATA_DIR, 'scholarships');
  const files = getAllFiles(dir);

  const scholarships = await Promise.all(
    files.map(async (filePath) => {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const {data, content} = matter(fileContent);

      if (!showDraft && data.draft) return null;

      const fileName = path.basename(filePath, '.md');
      const html = await markdownToHtml(content);
      const deadlineTimestamp = data.deadline
        ? new Date(data.deadline).getTime()
        : Number.MAX_SAFE_INTEGER;

      return {
        content: html,
        title: data.title,
        deadline: data.deadline || '',
        excerpt: data.excerpt || '',
        thumbnail: resolveImagePath(data.thumbnail),
        thumbnailCredits: data.thumbnailCredits || undefined,
        startDate: data.startDate || undefined,
        levels: data.levels || [],
        targetCountries: data.targetCountries || [],
        tags: data.tags || [],
        slug: fileName,
        path: `/bourses/${fileName}`,
        timestamp: deadlineTimestamp,
        draft: Boolean(data.draft),
        metaImage: data.thumbnail
          ? {src: resolveImagePath(data.thumbnail), width: 1200, height: 630}
          : undefined,
      } as Scholarship;
    })
  );

  return scholarships
    .filter((s): s is Scholarship => s !== null)
    .sort((a, b) => a.timestamp - b.timestamp);
}

export async function getScholarshipBySlug(slug: string): Promise<Scholarship | null> {
  const scholarships = await getScholarships();
  return scholarships.find((s) => s.slug === slug) || null;
}

export async function getUpcomingScholarships(
  excludeSlug?: string,
  limit = 12
): Promise<Scholarship[]> {
  const now = Date.now();
  const scholarships = await getScholarships();

  return scholarships
    .filter((s) => s.timestamp > now && s.slug !== excludeSlug)
    .slice(0, limit);
}

// ---- Services ----

export async function getServices(): Promise<Service[]> {
  const dir = path.join(DATA_DIR, 'services');
  const files = getAllFiles(dir);

  const services = await Promise.all(
    files.map(async (filePath) => {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const {data, content} = matter(fileContent);
      const html = await markdownToHtml(content);

      return {
        content: html,
        slug: data.slug,
        title: data.title,
        price: data.price,
        excerpt: data.excerpt || '',
        rank: data.rank || 0,
        assistanceFormServiceChoiceLabel: data.assistanceFormServiceChoiceLabel || '',
        assistanceFormConfirmationTitle: data.assistanceFormConfirmationTitle || '',
        assistanceFormConfirmationFirstParagraph: data.assistanceFormConfirmationFirstParagraph || '',
        assistanceFormConfirmationSecondParagraph: data.assistanceFormConfirmationSecondParagraph || undefined,
        assistanceRequestLink: data.assistanceRequestLink || undefined,
      } as Service;
    })
  );

  return services.sort((a, b) => (a.rank || 0) - (b.rank || 0));
}

// ---- Assistance Packages ----

export async function getAssistancePackages(): Promise<AssistancePackage[]> {
  const dir = path.join(DATA_DIR, 'assistance-packages');
  const files = getAllFiles(dir);

  return Promise.all(
    files.map(async (filePath) => {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const {data, content} = matter(fileContent);
      const html = await markdownToHtml(content);

      return {
        content: html,
        title: data.title,
        slug: data.slug,
      } as AssistancePackage;
    })
  );
}

export async function getAssistancePackageDictionary(): Promise<AssistancePackageDictionary> {
  const packages = await getAssistancePackages();
  const dict: AssistancePackageDictionary = {};

  for (const pkg of packages) {
    dict[pkg.slug] = pkg;
  }

  return dict;
}

// ---- FAQs ----

export async function getFaqs(): Promise<FAQ[]> {
  const filePath = path.join(DATA_DIR, 'pages', 'faqs.json');

  if (!fs.existsSync(filePath)) return [];

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(fileContent);

  return data.entries || [];
}

// ---- Team ----

export async function getTeam(): Promise<TeamMember[]> {
  const filePath = path.join(DATA_DIR, 'team', 'team.json');

  if (!fs.existsSync(filePath)) return [];

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const members: TeamMember[] = JSON.parse(fileContent);
  const teamDir = path.dirname(filePath);

  return members.map((member) => ({
    ...member,
    image: resolveImagePath(member.image, teamDir),
  }));
}
