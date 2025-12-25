import Link from 'next/link'
import { categoriesApi } from '@/lib/supabase/queries'
import { CategoryIcon } from '@/components/category/CategoryIcon'

export async function CategoryShowcase({ limit = 12 }: { limit?: number }) {
  const result = await categoriesApi.getAll()
  const categories: any[] = result.data || []

  const featured = categories.slice(0, limit)

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {featured.map((category) => (
        <Link
          key={category.slug}
          href={`/categories/${category.slug}`}
          className="bg-white rounded-lg p-6 hover:shadow-lg transition-all hover:scale-105 flex flex-col items-center text-center group border border-gray-100"
        >
          <div className="w-12 h-12 mb-3 text-blue-600 group-hover:text-blue-700 transition-colors">
            <CategoryIcon slug={category.slug} className="w-full h-full" />
          </div>
          <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
            {category.name}
          </h3>
        </Link>
      ))}
    </div>
  )
}
