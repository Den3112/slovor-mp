import { Container } from '@/components/ui/container'
import { ListingGrid } from '@/components/features/listing/ui/grid'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

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

  // Fetch only user's listings
  const { data: listings } = await supabase
    .from('listings')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <Container className="py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Мои объявления</h1>
        <p className="text-muted-foreground">
          Управляйте вашими активными и архивными объявлениями
        </p>
      </div>

      {listings && listings.length > 0 ? (
        <ListingGrid listings={listings} />
      ) : (
        <div className="border-border/50 bg-muted/30 flex min-h-[400px] flex-col items-center justify-center rounded-xl border-2 border-dashed text-center">
          <p className="text-xl font-medium">У вас пока нет объявлений</p>
          <p className="text-muted-foreground mt-2">
            Опубликуйте свое первое объявление прямо сейчас
          </p>
        </div>
      )}
    </Container>
  )
}
