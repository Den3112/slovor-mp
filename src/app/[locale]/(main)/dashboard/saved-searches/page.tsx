import { createClient } from '@/lib/supabase/server'
import { savedSearchesApi } from '@/lib/api'
import dynamic from 'next/dynamic'
import { Loader2 } from 'lucide-react'
import { redirect } from 'next/navigation'

const SavedSearchesView = dynamic(
  () =>
    import('@/components/features/dashboard/user/saved-searches').then(
      (mod) => mod.SavedSearchesView
    ),
  {
    loading: () => (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    ),
  }
)

export default async function SavedSearchesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  // Pass the server-side supabase client to get all searches
  const { data: searches } = await savedSearchesApi.getAll(supabase)

  return <SavedSearchesView initialSearches={searches || []} />
}
