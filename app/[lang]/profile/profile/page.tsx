import { createClient } from '@/lib/supabase/server'
import { SellerProfileView } from '@/components/profile/seller-profile-view'
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
    redirect('/profile/settings')
  }

  const { t } = await getTranslationServer()

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-6 duration-700">
      {/* Premium Header - Floating Glass Bar */}
      <div className="bg-background/60 relative z-10 mb-8 flex items-center justify-between rounded-3xl border border-white/20 p-4 shadow-lg backdrop-blur-xl dark:border-white/5 dark:bg-white/5">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full">
            <Eye className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-muted-foreground/80 text-sm font-black tracking-widest uppercase">
              {t('profile_preview.title')}
            </h1>
            <p className="text-foreground text-xs font-medium">
              {t('profile_preview.description')}
            </p>
          </div>
        </div>

        <a
          href={`/seller/${user.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group bg-primary text-primary-foreground shadow-primary/25 hover:shadow-primary/40 relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl px-4 py-2.5 text-sm font-bold shadow-lg transition-all hover:scale-105 active:scale-95"
        >
          <span className="relative z-10">{t('profile_preview.viewStore')}</span>
          <ExternalLink className="relative z-10 h-4 w-4" />
          <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
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
