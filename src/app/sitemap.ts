import { MetadataRoute } from 'next'
// import { createStaticClient } from '@/shared/lib/supabase/server'
// import { categoriesApi } from '@/shared/lib/api'
import { config } from '@/shared/lib/config'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = config.site.url
  // const supabase = createStaticClient()

  const languages = ['en', 'sk', 'cs']

  // Static routes for each language
  const routes = languages
    .flatMap((lang) => [
      `/${lang}`,
      `/${lang}/about`,
      `/${lang}/contact`,
      `/${lang}/faq`,
      `/${lang}/categories`,
      `/${lang}/search`,
      `/${lang}/login`,
      `/${lang}/register`,
    ])
    .map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    }))

  // Dynamic routes: Categories (Disabled during Docker build)
  let categoryRoutes: MetadataRoute.Sitemap = []
  /*
  if (process.env.SKIP_ENV_VALIDATION !== '1') {
    try {
      const { data: categories } = await categoriesApi.getAll(supabase)
      categoryRoutes = (categories || []).flatMap((category) =>
        languages.map((lang) => ({
          url: `${baseUrl}/${lang}/categories/${category.slug}`,
          lastModified: new Date(),
          changeFrequency: 'daily' as const,
          priority: 0.8,
        }))
      )
    } catch (error) {
      console.error('Failed to fetch categories for sitemap:', error)
    }
  }
  */

  return [...routes, ...categoryRoutes]
}
