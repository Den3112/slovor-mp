import { Suspense } from 'react'
import { Container } from '@/components/ui/container'
import { categoriesApi } from '@/lib/api/categories'
import { CategoryCard } from '@/components/features/listing/categories/category-card'
import { Skeleton } from '@/components/ui/skeleton'

async function CategoriesList() {
  const categories = await categoriesApi.getAll()

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {categories.map((category) => (
        <CategoryCard key={category.id} category={category} />
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
