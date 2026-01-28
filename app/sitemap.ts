import { MetadataRoute } from 'next'
import { createStaticClient } from '@/lib/supabase/server'
import { categoriesApi } from '@/lib/api'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://slovor.sk'
    const supabase = createStaticClient()

    const languages = ['en', 'sk', 'cs']

    // Static routes for each language
    const routes = languages.flatMap(lang => [
        `/${lang}`,
        `/${lang}/about`,
        `/${lang}/contact`,
        `/${lang}/faq`,
        `/${lang}/categories`,
        `/${lang}/search`,
        `/${lang}/auth/login`,
        `/${lang}/auth/register`,
    ]).map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.8,
    }))

    // Dynamic routes: Categories
    const { data: categories } = await categoriesApi.getAll(supabase)

    const categoryRoutes = (categories || []).flatMap(category =>
        languages.map(lang => ({
            url: `${baseUrl}/${lang}/categories/${category.slug}`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 0.8,
        }))
    )

    return [...routes, ...categoryRoutes]
}
