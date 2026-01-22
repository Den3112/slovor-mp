'use client'

import Link from 'next/link'
import { useTranslation } from '@/lib/i18n'
import type { Category } from '@/lib/types/database'
import { getLocalizedCategoryName } from '@/lib/utils/category-i18n'
import { getCategoryIcon } from '@/lib/constants/category-icons'

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

                    <div className="relative z-10 flex flex-col items-center gap-3 md:gap-6">
                        <div className="flex h-12 items-center justify-center transform text-3xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 md:h-16 md:text-5xl">
                            {(() => {
                                const Icon = getCategoryIcon(category.slug)
                                return <Icon className="h-full w-full text-primary/60 transition-colors group-hover:text-primary" />
                            })()}
                        </div>
                        <h3 className="line-clamp-2 text-sm font-black tracking-tight text-foreground transition-colors group-hover:text-primary md:text-xl">
                            {getLocalizedCategoryName(category, locale, t)}
                        </h3>
                    </div>
                </Link>
            ))}
        </div>
    )
}
