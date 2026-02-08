import { MetadataRoute } from 'next'
import { createStaticClient } from '@/lib/supabase/server'
import { categoriesApi } from '@/lib/api'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const supabase = createStaticClient()

  const languages = ['en', 'sk', 'cs', 'ru']

  // Static routes for each language
  const routes = languages
    .flatMap((lang) => [
      `/${lang}`,
      `/${lang}/about`,
      `/${lang}/contact`,
      `/${lang}/faq`,
      `/${lang}/categories`,
      `/${lang}/search`,
      `/${lang}/auth/login`,
      `/${lang}/auth/register`,
    ])
    .map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    }))

  // Dynamic routes: Categories
  let categoryRoutes: any[] = []
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

  return [...routes, ...categoryRoutes]
}
