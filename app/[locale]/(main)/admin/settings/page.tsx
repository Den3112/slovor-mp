import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Settings, Construction } from 'lucide-react'
import { getTranslationServer } from '@/lib/i18n/server'

export default async function AdminSettingsPage(props: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await props.params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/${locale}/login`)
  }

  // Check if user is admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle()

  if (profile?.role !== 'admin') {
    redirect(`/${locale}/dashboard`)
  }

  const { t } = await getTranslationServer(['admin', 'common'])

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-8 duration-700">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-foreground flex items-center gap-3 text-3xl font-bold tracking-tight uppercase">
            <Settings className="text-primary h-8 w-8" />
            {t('admin:settings')}
          </h1>
          <p className="text-muted-foreground mt-1 text-[10px] font-bold tracking-[0.2em] uppercase">
            {t('admin:overview')}
          </p>
        </div>
      </div>

      <div className="border-border/60 bg-card flex min-h-[400px] flex-col items-center justify-center gap-6 rounded-2xl border p-12">
        <div className="bg-primary/10 text-primary border-primary/20 flex h-20 w-20 items-center justify-center rounded-2xl border">
          <Construction className="h-10 w-10" />
        </div>
        <div className="max-w-md space-y-2 text-center">
          <h2 className="text-foreground text-2xl font-bold tracking-tight">
            {t('admin:comingSoon')}
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {t('admin:comingSoonDesc')}
          </p>
        </div>
      </div>
    </div>
  )
}
