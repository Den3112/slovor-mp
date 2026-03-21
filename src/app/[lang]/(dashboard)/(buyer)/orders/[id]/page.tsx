import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { ordersApi } from '@/lib/api'
import { OrderDetailsView } from '@/components/features/dashboard/shared/order-details-view'

interface OrderDetailsPageProps {
  params: {
    lang: string
    id: string
  }
}

export default async function OrderDetailsPage({
  params,
}: OrderDetailsPageProps) {
  const { id, lang } = params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect(`/${lang}/auth/login`)

  const { data: order, error } = await ordersApi.getById(supabase, id)

  if (error || !order) {
    console.error('Order not found:', error)
    notFound()
  }

  // Security: Check if user is part of the order
  if (order.buyer_id !== user.id && order.seller_id !== user.id) {
    redirect(`/${lang}/dashboard/orders`)
  }

  return (
    <div className="container py-8">
      <OrderDetailsView order={order} />
    </div>
  )
}
