import { Suspense } from 'react'
import { Container } from '@/shared/ui/container'
import { categoriesApi } from '@/entities/category/api'
import { CategoryCard } from '@/entities/category'
import { Skeleton } from '@/shared/ui/skeleton'

async function CategoriesList() {
  const { data: categories, error } = await categoriesApi.getAll()

  if (error || !categories) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-2xl font-bold">Failed to load categories</h2>
        <p className="text-muted-foreground mt-2">{error}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {categories.map((category, idx) => (
        <CategoryCard key={category.id} category={category} idx={idx} />
      ))}
    </div>
  )
}

export default function CategoriesPage() {
  return (
    <Container className="py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Categories</h1>
        <p className="text-muted-foreground mt-4 text-lg">
          Explore all our listing categories
        </p>
      </div>

      <Suspense
        fallback={
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-2xl" />
            ))}
          </div>
        }
      >
        <CategoriesList />
      </Suspense>
    </Container>
  )
}
