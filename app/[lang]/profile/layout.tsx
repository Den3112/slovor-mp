import { Container } from '@/components/ui/container'
import { DashboardSidebar } from '@/components/profile/sidebar'
import { MobileBottomNav } from '@/components/profile/mobile-nav'
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

  // Fetch global stats for navigation badges
  const { getDashboardStats } = await import('@/lib/api/dashboard-stats')
  const stats = await getDashboardStats(user.id)

  return (
    <div
      className="bg-background min-h-screen pt-24 pb-32 md:pt-28 md:pb-20"
      vaul-drawer-wrapper=""
    >
      <Container>
        <div className="flex flex-col gap-4 md:flex-row md:gap-8">
          <DashboardSidebar stats={stats} />
          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </Container>
      <MobileBottomNav stats={stats} />
    </div>
  )
}
