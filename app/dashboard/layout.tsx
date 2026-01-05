import { Container } from '@/components/ui/container'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
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
    <div className="min-h-screen bg-background pb-20 pt-8">
      <Container>
        <div className="flex flex-col gap-8 md:flex-row">
          <DashboardSidebar />
          <main className="flex-1">
            {children}
          </main>
        </div>
      </Container>
    </div>
  )
}
