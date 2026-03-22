import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { listingsApi } from '@/lib/api/listings'
import { DashboardProfileHub } from '@/components/features/dashboard/user/dashboard-profile-hub'

interface DashboardProfilePageProps {
  params: Promise<{ lang: string }>
}

export default async function DashboardProfilePage({
  params,
}: DashboardProfilePageProps) {
  const { lang } = await params
  const supabase = await createClient()

  // Verify auth
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/${lang}/auth/login`)
  }

  // Fetch full profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) {
    redirect(`/${lang}/auth/login`)
  }

  // Get active listings for the user
  const listingsResponse = await listingsApi.getByUser(user.id)

  return (
    <DashboardProfileHub
      seller={profile}
      listings={listingsResponse.data || []}
    />
  )
}
