import { createClient } from '@/lib/supabase/server'
import { UserListingsView } from '@/components/features/dashboard/user/listings-view'
// import { getTranslationServer } from '@/lib/i18n/server'

export default async function DashboardListingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  // Fetch listings for the user
  const { data: listings } = await supabase
    .from('listings')
    .select('*, category:categories(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const initialListings = listings || []

  // Pre-fetch translations logic handled inside client component via useTranslation mostly,
  // but we can pass current locale if needed. View uses i18n hook.

  return (
    <UserListingsView initialListings={initialListings} />
  )
}
