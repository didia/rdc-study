import {getArticles, getScholarships} from '@/lib/content';
import config from '@/config';

export async function GET() {
  const [articles, scholarships] = await Promise.all([getArticles(), getScholarships()]);

  const items = [
    ...articles.map((a) => ({
      title: a.title,
      description: a.excerpt,
      link: `${config.siteURL}${a.path}`,
      pubDate: new Date(a.date).toUTCString(),
    })),
    ...scholarships
      .filter((s) => !s.draft)
      .map((s) => ({
        title: s.title,
        description: s.excerpt,
        link: `${config.siteURL}${s.path}`,
        pubDate: s.deadline ? new Date(s.deadline).toUTCString() : new Date().toUTCString(),
      })),
  ].sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${config.siteTitle}</title>
    <link>${config.siteURL}</link>
    <description>${config.siteDescription}</description>
    <language>fr</language>
    <atom:link href="${config.siteURL}/feed.xml" rel="self" type="application/rss+xml"/>
    ${items
      .slice(0, 50)
      .map(
        (item) => `
    <item>
      <title><![CDATA[${item.title}]]></title>
      <description><![CDATA[${item.description}]]></description>
      <link>${item.link}</link>
      <guid>${item.link}</guid>
      <pubDate>${item.pubDate}</pubDate>
    </item>`
      )
      .join('')}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
