import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { ordersApi } from '@/lib/api'
import { OrderDetailsView } from '@/components/features/dashboard/shared/order-details-view'

interface AdminOrderDetailsPageProps {
  params: {
    locale: string
    id: string
  }
}

export default async function AdminOrderDetailsPage({
  params,
}: AdminOrderDetailsPageProps) {
  const { id } = params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  // Check if admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/dashboard')
  }

  const { data: order, error } = await ordersApi.getById(supabase, id)

  if (error || !order) {
    notFound()
  }

  return (
    <div className="p-8">
      <OrderDetailsView order={order} isAdmin />
    </div>
  )
}
