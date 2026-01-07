import { createClient } from '@/lib/supabase/server'
import { DashboardListingsContent } from '@/components/dashboard/listings-content'

export default async function DashboardListingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    // This should generally be handled by the middleware or layout, but as a safety net:
    return null
  }

  // Fetch all user listings with better error handling
  const { data: listings, error } = await supabase
    .from('listings')
    .select('*, category:categories(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching listings:', error)
    // We could return an error UI here, but for now let's show empty state to avoid crashing
  }

  const allListings = listings || []

  // Status filtering logic
  // TODO: Migrate to proper status enum when DB schema is ready
  const activeListings = allListings.filter(l => l.is_active === true)
  const draftListings = allListings.filter(l => l.is_active === false)
  // These are placeholders until we have sold/archived status logic
  const soldListings = [] as typeof allListings
  const archivedListings = [] as typeof allListings

  return (
    <div className="space-y-6 pb-24 md:pb-0">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-black">My Listings</h1>
          <p className="text-muted-foreground">Manage your items and track sales</p>
        </div>
      </div>

      <div>
        <DashboardListingsContent
          all={allListings}
          active={activeListings}
          drafts={draftListings}
          sold={soldListings}
          archived={archivedListings}
        />
      </div>
    </div>
  )
}
