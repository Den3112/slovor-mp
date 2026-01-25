import { Suspense } from 'react'
import { Container } from '@/components/ui/container'
import { categoriesApi } from '@/lib/api'
import { getTranslationServer } from '@/lib/i18n/server'

export const revalidate = 300 // 5 minutes

import { CategoriesGrid } from '@/components/category/categories-grid'
import { createClient } from '@/lib/supabase/server'

async function CategoriesGridWrapper() {
  const supabase = await createClient()
  const { data: categories, error } = await categoriesApi.getAll(supabase)

  if (error || !categories) {
    return null
  }

  return <CategoriesGrid categories={categories} />
}

export default async function CategoriesPage() {
  const { t } = await getTranslationServer()

  return (
    <main className="from-background via-background/80 to-muted/20 min-h-screen bg-gradient-to-b pb-20 md:pb-32">
      <Container className="pt-24 md:pt-32">
        <div className="mx-auto mb-10 max-w-4xl text-center md:mb-20">
          <h1 className="font-heading text-foreground mb-4 text-4xl leading-[1.05] font-black tracking-tight md:mb-8 md:text-8xl">
            {t.home.categories.title}
          </h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-base leading-relaxed font-medium md:text-2xl">
            {t.home.categories.subtitle}
          </p>
        </div>

        <Suspense
          fallback={
            <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {[...Array(15)].map((_, i) => (
                <div
                  key={i}
                  className="border-border/50 bg-card/40 animate-pulse rounded-[2rem] border p-8"
                >
                  <div className="bg-muted mx-auto mb-6 h-16 w-16 rounded-full" />
                  <div className="bg-muted mx-auto mb-2 h-6 w-3/4 rounded-full" />
                  <div className="bg-muted mx-auto h-3 w-1/2 rounded-full" />
                </div>
              ))}
            </div>
          }
        >
          <CategoriesGridWrapper />
        </Suspense>
      </Container>
    </main>
  )
}
