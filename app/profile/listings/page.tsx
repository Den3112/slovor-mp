import { createClient } from '@/lib/supabase/server'
import { getTranslationServer } from '@/lib/i18n/server'
import { DashboardListingsContent } from '@/components/profile/listings-content'

export default async function DashboardListingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

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

  const { t } = await getTranslationServer()
  const allListings = listings || []

  // Status filtering logic
  const activeListings = allListings.filter((l) => l.status === 'active')
  const draftListings = allListings.filter((l) => l.status === 'draft' || l.status === 'pending')
  const soldListings = allListings.filter((l) => l.status === 'sold')
  const archivedListings = allListings.filter((l) => l.status === 'expired' || l.status === 'rejected')

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-8 duration-700">
      {/* Premium Header */}
      <div className="from-background/80 via-background/60 to-background/40 group relative flex flex-col gap-6 overflow-hidden rounded-4xl border border-white/10 bg-linear-to-br p-6 shadow-2xl backdrop-blur-xl md:flex-row md:items-start md:justify-between md:p-10">
        <div className="from-primary/10 pointer-events-none absolute inset-0 bg-linear-to-r via-transparent to-transparent opacity-50 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="relative z-10 max-w-2xl">
          <h1 className="font-heading text-foreground mb-3 text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">
            {t('dashboard.myListings')}
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed font-medium sm:text-base md:text-lg">
            {t('dashboard.inventoryDescription')}
          </p>
        </div>
        <div className="relative z-10 shrink-0">
          {/* Future Actions - ensuring it wraps properly if added later */}
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
