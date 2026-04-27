import { createClient } from '@/shared/lib/supabase/server'
import { redirect } from 'next/navigation'
import { listingsApi } from '@/entities/listing/api'
import { DashboardProfileHub } from '@/features/dashboard/user/dashboard-profile-hub'

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
    redirect(`/${lang}/login`)
  }

  // Fetch full profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) {
    redirect(`/${lang}/login`)
  }

  // Get active listings for the user
  const listingsResponse = await listingsApi.getByUser(supabase, user.id)

  return (
    <DashboardProfileHub
      seller={profile}
      listings={listingsResponse.data || []}
    />
  )
}
