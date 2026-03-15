import type {Metadata} from 'next';
import config from '@/config';

type MetaInput = {
  title?: string;
  description?: string;
  path?: string;
  image?: {
    src: string;
    width?: number;
    height?: number;
  };
  keywords?: string[];
};

export function getCanonicalUrl(pagePath?: string): string {
  if (!pagePath) return config.siteURL;
  return `${config.siteURL}${pagePath}`;
}

export function generatePageMetadata(meta?: MetaInput): Metadata {
  const title = meta?.title || config.siteTitle;
  const description = meta?.description || config.siteDescription;
  const url = meta?.path ? getCanonicalUrl(meta.path) : config.siteURL;
  const imageUrl = meta?.image?.src
    ? `${config.siteURL}${meta.image.src}`
    : `${config.siteURL}${config.siteImage}`;
  const keywords = meta?.keywords?.join(',') || config.siteKeywords;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      siteName: config.siteTitle,
      url,
      type: meta ? 'article' : 'website',
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: meta?.image?.width || 1200,
          height: meta?.image?.height || 630,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
    other: {
      'fb:app_id': config.siteFBAppID,
    },
  };
}

export function generateJsonLd(meta?: MetaInput) {
  const title = meta?.title || config.siteTitle;
  const description = meta?.description || config.siteDescription;
  const url = meta?.path ? getCanonicalUrl(meta.path) : config.siteURL;
  const imageUrl = meta?.image?.src
    ? `${config.siteURL}${meta.image.src}`
    : `${config.siteURL}${config.siteImage}`;

  const jsonLd: object[] = [
    {
      '@context': 'http://schema.org',
      '@type': 'WebSite',
      url: config.siteURL,
      name: title,
    },
  ];

  if (meta) {
    jsonLd.push(
      {
        '@context': 'http://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            item: {
              '@id': url,
              name: title,
              image: imageUrl,
            },
          },
        ],
      },
      {
        '@context': 'http://schema.org',
        '@type': 'BlogPosting',
        url: config.siteURL,
        name: title,
        headline: title,
        image: {
          '@type': 'ImageObject',
          url: imageUrl,
        },
        description,
      }
    );
  }

  return jsonLd;
}
