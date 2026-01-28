import { MetadataRoute } from 'next'
import { createStaticClient } from '@/lib/supabase/server'
import { categoriesApi } from '@/lib/api'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://slovor.sk'
    const supabase = createStaticClient()

    // Static routes
    const routes = [
        '',
        '/about',
        '/contact',
        '/faq',
        '/categories',
        '/search',
        '/auth/login',
        '/auth/register',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.8,
    }))

    // Dynamic routes: Categories
    const { data: categories } = await categoriesApi.getAll(supabase)

    const categoryRoutes = (categories || []).map((category) => ({
        url: `${baseUrl}/categories/${category.slug}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.8,
    }))

    return [...routes, ...categoryRoutes]
}
