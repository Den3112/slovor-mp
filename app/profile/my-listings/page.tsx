import { createClient } from '@/lib/supabase/server'
import { DashboardListingsContent } from '@/components/profile/listings-content'

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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Premium Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between rounded-[2rem] bg-gradient-to-br from-background/80 via-background/60 to-background/40 backdrop-blur-xl p-6 md:p-10 border border-white/10 shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative z-10">
          <h1 className="font-heading text-4xl md:text-5xl font-black tracking-tight text-foreground mb-2">My Listings</h1>
          <p className="text-muted-foreground font-medium text-base md:text-lg max-w-lg leading-relaxed">Manage your inventory and track performance across all your active and draft items.</p>
        </div>
        <div className="relative z-10">
          {/* Future Actions */}
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
