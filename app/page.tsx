// Main homepage - Server Component

import { HomeView } from '@/components/home/HomeView'
import { categoriesApi } from '@/lib/supabase/queries'

export const revalidate = 60

export default async function HomePage() {
  const categoriesRes = await categoriesApi.getAll()

  return (
    <HomeView
      categories={categoriesRes.data || []}
      categoriesError={categoriesRes.error}
    />
  )
}
