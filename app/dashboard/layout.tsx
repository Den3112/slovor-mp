'use client'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { DashboardMobileNav } from '@/components/dashboard/mobile-nav'
import { useAuth } from '@/components/providers/auth-provider'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) return null
  return (
    <div className="min-h-screen bg-background pt-20 lg:pt-0">
      <DashboardMobileNav />
      <div className="flex">
        <DashboardSidebar />
        <main className="flex-1 p-6 pb-32 lg:p-10 lg:pb-10 lg:pt-28">
          <div className="fade-in-up mx-auto max-w-5xl space-y-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
