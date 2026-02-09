import { createClient } from '@/lib/supabase/server'
import dynamic from 'next/dynamic'
import { ordersApi } from '@/lib/api'
import { Loader2 } from 'lucide-react'
import { redirect } from 'next/navigation'
import { config } from '@/lib/config'

const AdminOrdersView = dynamic(
  () =>
    import('@/components/features/dashboard/admin/orders').then(
      (mod) => mod.AdminOrdersView
    ),
  {
    loading: () => (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    ),
  }
)

export default async function AdminOrdersPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Check if user is authenticated and is an admin
  if (!user || !config.app.adminEmails.includes(user.email || '')) {
    redirect('/')
  }

  const { data: orders } = await ordersApi.getAll(supabase)

  return <AdminOrdersView initialOrders={orders || []} />
}
