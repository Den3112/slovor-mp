'use client'

import Link from 'next/link'
import { useTranslation } from '@/lib/i18n'
import type { Category } from '@/lib/types/database'
import { getLocalizedCategoryName } from '@/lib/utils/category-i18n'
import { CategoryIcon } from '@/components/category/CategoryIcon'

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
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4 xl:grid-cols-5">
            {categories.map((category: Category) => (
                <Link
                    key={category.id}
                    href={`/categories/${category.slug}`}
                    className="group relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:border-primary/50 hover:bg-white/10 hover:shadow-2xl hover:shadow-primary/20 md:rounded-[2rem] md:p-8 dark:bg-black/20 dark:hover:bg-black/40"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                    {/* Decorative gloss effect */}
                    <div className="absolute -left-[100%] top-0 h-full w-full rotate-45 bg-gradient-to-r from-transparent via-white/10 to-transparent transition-all duration-1000 group-hover:left-[100%]" />

                    <div className="relative z-10 flex flex-col items-center gap-4 md:gap-8">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/30 shadow-sm transition-all duration-500 group-hover:rotate-[10deg] group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-xl group-hover:shadow-primary/30 md:h-24 md:w-24 md:rounded-[2.5rem]">
                            <CategoryIcon slug={category.slug} className="h-8 w-8 transition-transform duration-500 md:h-12 md:w-12" />
                        </div>
                        <h3 className="line-clamp-2 text-sm font-black tracking-tight text-foreground transition-colors group-hover:text-primary md:text-2xl">
                            {getLocalizedCategoryName(category, locale, t)}
                        </h3>
                    </div>
                </Link>
            ))}
        </div>
    )
}
