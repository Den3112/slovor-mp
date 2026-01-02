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
      <div className="py-20 text-center text-muted-foreground">
        {t.common.error}
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
            <p className="mt-2 text-xs font-bold uppercase tracking-widest text-muted-foreground opacity-60 transition-opacity group-hover:opacity-100">
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
        <div className="mx-auto mb-20 max-w-4xl text-center">
          <h1 className="mb-8 font-heading text-6xl font-black leading-[1.05] tracking-tight text-foreground md:text-8xl">
            {t.home.categories.title}
          </h1>
          <p className="mx-auto max-w-2xl text-xl font-medium leading-relaxed text-muted-foreground md:text-2xl">
            {t.home.categories.subtitle}
          </p>
        </div>

        <Suspense
          fallback={
            <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {[...Array(15)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-[2rem] border border-border/50 bg-card/40 p-8"
                >
                  <div className="mx-auto mb-6 h-16 w-16 rounded-full bg-muted" />
                  <div className="mx-auto mb-2 h-6 w-3/4 rounded-full bg-muted" />
                  <div className="mx-auto h-3 w-1/2 rounded-full bg-muted" />
                </div>
              ))}
            </div>
          }
        >
          <CategoriesGrid />
        </Suspense>
      </Container>
    </main>
  )
}
