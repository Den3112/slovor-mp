import { createClient } from '@/lib/supabase/server'
import { DashboardListingsContent } from '@/components/dashboard/listings-content'

export default async function DashboardListingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Fetch all user listings
  const { data: listings } = await supabase
    .from('listings')
    .select('*, category:categories(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const allListings = listings || []

  // Status filtering logic
  // Since we might not have a dedicated 'status' column fully migrated or populated, we rely on is_active for now
  // Ideally we should have a 'status' enum: active, draft, sold, archived

  const activeListings = allListings.filter(l => l.is_active === true)
  const draftListings = allListings.filter(l => l.is_active === false)
  const soldListings = [] as typeof allListings
  const archivedListings = [] as typeof allListings

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-black">My Listings</h1>
          <p className="text-muted-foreground">Manage your items and track sales</p>
        </div>

      </div>

      <div className="rounded-2xl border border-border/40 bg-card p-1 shadow-sm">
        <DashboardListingsContent
          active={activeListings}
          drafts={draftListings}
          sold={soldListings}
          archived={archivedListings}
        />
      </div>
    </div>
  )
}
