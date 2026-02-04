import { createClient } from '@/lib/supabase/server'
import { savedSearchesApi } from '@/lib/api'
import { SavedSearchesView } from '@/components/features/dashboard/user/saved-searches-view'

export default async function SavedSearchesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null // Layout handles redirect
  }

  // Pass the server-side supabase client to get all searches
  const { data: searches } = await savedSearchesApi.getAll(supabase)

  return <SavedSearchesView initialSearches={searches || []} />
}
