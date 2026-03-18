/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://slovor.sk',
  generateRobotsTxt: true,
  sitemapSize: 7000,
  exclude: [
    '/server-sitemap.xml',
    '/sk/profile/*',
    '/en/profile/*',
    '/sk/chat/*',
    '/en/chat/*',
  ],
  alternateRefs: [
    {
      href: 'https://slovor.sk/sk',
      hreflang: 'sk',
    },
    {
      href: 'https://slovor.sk/en',
      hreflang: 'en',
    },
  ],
  robotsTxtOptions: {
    additionalSitemaps: ['https://slovor.sk/server-sitemap.xml'],
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
