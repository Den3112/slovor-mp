import { UserDashboardLayout } from '@/components/features/dashboard/user/user-dashboard-layout'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { getDashboardStats } = await import('@/lib/api/dashboard-stats')
  const stats = await getDashboardStats(user.id)

  return <UserDashboardLayout stats={stats}>{children}</UserDashboardLayout>
}
