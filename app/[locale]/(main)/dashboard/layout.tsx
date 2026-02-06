import { UserDashboardLayout } from '@/components/features/dashboard/user/user-dashboard-layout'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/${locale}/auth/login`)
  }

  const { getDashboardStats } = await import('@/lib/api/dashboard-stats')
  const stats = await getDashboardStats(user.id)

  return <UserDashboardLayout stats={stats}>{children}</UserDashboardLayout>
}
