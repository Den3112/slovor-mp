/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://slovor-mp.vercel.app',
  generateRobotsTxt: true,
  sitemapSize: 7000,
  exclude: [
    '/server-sitemap.xml',
    '/*/dashboard/profile/*',
    '/*/dashboard/chat/*',
  ],
  alternateRefs: [
    {
      href: 'https://slovor-mp.vercel.app/sk',
      hreflang: 'sk',
    },
    {
      href: 'https://slovor-mp.vercel.app/en',
      hreflang: 'en',
    },
  ],
  robotsTxtOptions: {
    additionalSitemaps: [
      'https://slovor-mp.vercel.app/server-sitemap.xml',
      'https://slovor-mp.vercel.app/sitemap.xml',
    ],
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
      {
        userAgent: '*',
        disallow: ['/profile', '/chat', '/admin'],
      },
    ],
  },
}
