import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import dynamic from 'next/dynamic'
import { config } from '@/lib/config'
import { Loader2 } from 'lucide-react'

const AdminAnalyticsView = dynamic(
  () =>
    import('@/components/features/dashboard/admin/analytics').then(
      (mod) => mod.AdminAnalyticsView
    ),
  {
    loading: () => (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    ),
  }
)

export default async function AdminAnalyticsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Check if user is authenticated and is an admin
  if (!user || !config.app.adminEmails.includes(user.email || '')) {
    redirect('/')
  }

  return <AdminAnalyticsView />
}
