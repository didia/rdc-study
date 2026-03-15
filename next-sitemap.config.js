/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.rdcetudes.com',
  generateRobotsTxt: true,
  changefreq: 'daily',
  priority: 0.7,
  exclude: ['/admin', '/admin/*'],
};
