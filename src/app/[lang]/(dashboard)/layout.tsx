import { UserDashboardLayout } from '@/features/dashboard/user/user-dashboard-layout'
import { redirect } from 'next/navigation'
import { createClient } from '@/shared/lib/supabase/server'
import { MainLayout } from '@/widgets/main-layout'

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode
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

  const { getDashboardStats } = await import('@/entities/dashboard/api')
  const stats = await getDashboardStats(user.id)

  return (
    <MainLayout>
      <UserDashboardLayout stats={stats}>{children}</UserDashboardLayout>
    </MainLayout>
  )
}
