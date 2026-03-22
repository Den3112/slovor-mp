import { Container } from '@/components/ui/container'
import { ListingGrid } from '@/components/features/listing/ui/grid'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getTranslationServer } from '@/lib/i18n/server'

export default async function SellerListingsPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/${lang}/auth/login`)
  }

  const { t } = await getTranslationServer(['common', 'dashboard'])

  // Fetch only user's listings
  const { data: listings } = await supabase
    .from('listings')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <Container className="py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{t('dashboard:myListings')}</h1>
        <p className="text-muted-foreground">
          {t('dashboard:manageListingsDesc')}
        </p>
      </div>

      {listings && listings.length > 0 ? (
        <ListingGrid listings={listings} />
      ) : (
        <div className="border-border/50 bg-muted/30 flex min-h-[400px] flex-col items-center justify-center rounded-xl border-2 border-dashed text-center">
          <p className="text-xl font-medium">{t('dashboard:noListingsYet')}</p>
          <p className="text-muted-foreground mt-2">
            {t('dashboard:noListingsDesc')}
          </p>
        </div>
      )}
    </Container>
  )
}
