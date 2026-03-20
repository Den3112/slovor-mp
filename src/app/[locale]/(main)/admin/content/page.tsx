import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import dynamic from 'next/dynamic'
import { config } from '@/lib/config'
import { Loader2 } from 'lucide-react'

const AdminContentView = dynamic(
  () =>
    import('@/components/features/dashboard/admin/content-view').then(
      (mod) => mod.AdminContentView
    ),
  {
    loading: () => (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    ),
  }
)

export default async function ContentManagementPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Check if user is authenticated and is an admin
  if (!user || !config.app.adminEmails.includes(user.email || '')) {
    redirect('/')
  }

  return <AdminContentView />
}
