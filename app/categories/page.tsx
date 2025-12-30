import { Suspense } from 'react'
import Link from 'next/link'
import { categoriesApi } from '@/lib/supabase/queries'
import type { Category } from '@/lib/types/database'
import { Container } from '@/components/ui/container'
import { getTranslationServer } from '@/lib/i18n/server'
import { getCategoryName } from '@/lib/utils/category-helpers'

export const revalidate = 300 // 5 minutes

async function CategoriesGrid() {
    const { data: categories, error } = await categoriesApi.getAll()
    const { t, locale } = await getTranslationServer()

    if (error || !categories) {
        return (
            <div className="text-center py-20 text-muted-foreground">
                {t.common.error}
            </div>
        )
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {categories.map((category: Category) => (
                <Link
                    key={category.id}
                    href={`/categories/${category.slug}`}
                    className="group relative p-8 bg-card/40 backdrop-blur-sm border border-border/50 rounded-[2rem] hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 text-center overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative z-10">
                        <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-500">
                            {category.icon || '📦'}
                        </div>
                        <h3 className="font-black text-xl text-foreground group-hover:text-primary transition-colors tracking-tight">
                            {getCategoryName(category, locale, t)}
                        </h3>
                        <p className="text-xs font-bold text-muted-foreground mt-2 uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">
                            View listings
                        </p>
                    </div>
                </Link>
            ))}
        </div>
    )
}

export default async function CategoriesPage() {
    const { t } = await getTranslationServer()

    return (
        <main className="min-h-screen pb-24">
            <Container className="pt-32 md:pt-40">
                <div className="max-w-4xl mx-auto text-center mb-20">
                    <h1 className="text-6xl md:text-8xl font-black tracking-tight text-foreground leading-[1.05] mb-8 font-heading">
                        {t.home.categories.title}
                    </h1>
                    <p className="text-xl md:text-2xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
                        {t.home.categories.subtitle}
                    </p>
                </div>

                <Suspense fallback={
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {[...Array(15)].map((_, i) => (
                            <div key={i} className="p-8 bg-card/40 border border-border/50 rounded-[2rem] animate-pulse">
                                <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-6" />
                                <div className="h-6 bg-muted rounded-full w-3/4 mx-auto mb-2" />
                                <div className="h-3 bg-muted rounded-full w-1/2 mx-auto" />
                            </div>
                        ))}
                    </div>
                }>
                    <CategoriesGrid />
                </Suspense>
            </Container>
        </main>
    )
}
