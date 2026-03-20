import { createClient } from '@/lib/supabase/server'
import dynamic from 'next/dynamic'
import { config } from '@/lib/config'
import { redirect } from 'next/navigation'
import { Loader2 } from 'lucide-react'

const AdminReportsView = dynamic(
  () =>
    import('@/components/features/dashboard/admin/reports').then(
      (mod) => mod.AdminReportsView
    ),
  {
    loading: () => (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    ),
  }
)

export default async function AdminReportsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || !config.app.adminEmails.includes(user.email || '')) {
    redirect('/')
  }

  return (
    <div className="container py-6">
      <div className="mb-0">
        {/* Header is handled within the view component */}
      </div>
      <AdminReportsView />
    </div>
  )
}
