import { createClient } from '@/lib/supabase/server'
import { SellerProfileView } from '@/components/seller-profile/seller-profile-view'
import { redirect } from 'next/navigation'
import { Eye, ExternalLink } from 'lucide-react'
import { getTranslationServer } from '@/lib/i18n/server'

export default async function DashboardProfilePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Fetch own profile
  const { data: seller, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: listings } = await supabase
    .from('listings')
    .select('*, category:categories(*)')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (profileError || !seller) {
    // Fallback or handle error - for now redirect to settings to complete profile
    redirect('/dashboard/settings')
  }

  const { t } = await getTranslationServer()

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-6 duration-700">
      {/* Premium Header - Solid Bar */}
      <div className="bg-card relative z-10 mb-8 flex items-center justify-between rounded-xl border border-border p-5 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-xl border border-primary/20">
            <Eye className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-muted-foreground/80 text-[10px] font-bold tracking-[0.2em] uppercase">
              {t('profile_preview.title')}
            </h1>
            <p className="text-foreground text-sm font-bold">
              {t('profile_preview.description')}
            </p>
          </div>
        </div>

        <a
          href={`/seller/${user.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-black uppercase tracking-widest transition-all active:scale-95 shadow-sm"
        >
          {t('profile_preview.viewStore')}
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
      <SellerProfileView
        seller={seller}
        listings={listings || []}
        variant="dashboard"
      />
    </div>
  )
}
