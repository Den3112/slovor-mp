import { Suspense } from 'react'
import Link from 'next/link'
import { categoriesApi } from '@/lib/supabase/queries'
import type { Category } from '@/lib/types/database'

export const revalidate = 300 // 5 minutes

async function CategoriesGrid() {
    const { data: categories, error } = await categoriesApi.getAll()

    if (error || !categories) {
        return (
            <div className="text-center py-20 text-muted-foreground">
                Failed to load categories
            </div>
        )
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {categories.map((category: Category) => (
                <Link
                    key={category.id}
                    href={`/categories/${category.slug}`}
                    className="group p-6 bg-card border border-border/50 rounded-2xl hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 text-center"
                >
                    <div className="text-4xl mb-3">{category.icon || '📦'}</div>
                    <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">
                        {category.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                        View listings
                    </p>
                </Link>
            ))}
        </div>
    )
}

export default function CategoriesPage() {
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-black font-heading mb-4">
                    Browse Categories
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Explore our wide selection of categories to find exactly what you&apos;re looking for.
                </p>
            </div>

            <Suspense fallback={
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {[...Array(10)].map((_, i) => (
                        <div key={i} className="p-6 bg-card border border-border/50 rounded-2xl animate-pulse">
                            <div className="w-12 h-12 bg-muted rounded-full mx-auto mb-3" />
                            <div className="h-4 bg-muted rounded w-3/4 mx-auto" />
                        </div>
                    ))}
                </div>
            }>
                <CategoriesGrid />
            </Suspense>
        </div>
    )
}
