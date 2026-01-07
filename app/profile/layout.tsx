import { Container } from '@/components/ui/container'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { MobileBottomNav } from '@/components/dashboard/mobile-nav'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen bg-background pb-32 pt-24 md:pb-20 md:pt-28">
      <Container>
        <div className="flex flex-col gap-4 md:gap-8 md:flex-row">
          <DashboardSidebar />
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </Container>
      <MobileBottomNav />
    </div>
  )
}
