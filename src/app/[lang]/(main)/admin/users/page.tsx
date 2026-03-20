import { createClient } from '@/lib/supabase/server'
import dynamic from 'next/dynamic'
import { config } from '@/lib/config'
import { redirect } from 'next/navigation'
import { Loader2 } from 'lucide-react'

const AdminUsersView = dynamic(
  () =>
    import('@/components/features/dashboard/admin/users-view').then(
      (mod) => mod.AdminUsersView
    ),
  {
    loading: () => (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    ),
  }
)

export default async function AdminUsersPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (
    !user ||
    !(config.app.adminEmails as readonly string[]).includes(user.email || '')
  ) {
    redirect('/')
  }

  // Fetch users for initial data
  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  return <AdminUsersView initialUsers={profiles || []} />
}
