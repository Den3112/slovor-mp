'use client'

import Link from 'next/link'
import { useTranslation } from '@/lib/i18n'
import type { Category } from '@/lib/types/database'
import { getCategoryName } from '@/lib/utils/category-helpers'

interface CategoriesGridProps {
    categories: Category[]
}

export function CategoriesGrid({ categories }: CategoriesGridProps) {
    const { t, locale } = useTranslation()

    if (!categories || categories.length === 0) {
        return (
            <div className="py-20 text-center text-muted-foreground">
                {t.common?.error || 'No categories found'}
            </div>
        )
    }

    return (
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {categories.map((category: Category) => (
                <Link
                    key={category.id}
                    href={`/categories/${category.slug}`}
                    className="group relative overflow-hidden rounded-[2rem] border border-border/50 bg-card/40 p-8 text-center backdrop-blur-sm transition-all duration-500 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10"
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <div className="relative z-10">
                        <div className="mb-6 transform text-5xl transition-transform duration-500 group-hover:scale-110">
                            {category.icon || '📦'}
                        </div>
                        <h3 className="text-xl font-black tracking-tight text-foreground transition-colors group-hover:text-primary">
                            {getCategoryName(category, locale, t)}
                        </h3>

                    </div>
                </Link>
            ))}
        </div>
    )
}
