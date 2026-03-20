import { UserOrdersView } from '@/components/features/dashboard/user/orders'
import { createClient } from '@/lib/supabase/server'
import { ordersApi } from '@/lib/api'

export default async function OrdersPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: orders } = await ordersApi.getMyOrders(supabase)

  // Map to include flag if user is seller
  const ordersWithFlags =
    orders?.map((o) => ({
      ...o,
      is_seller: o.seller_id === user.id,
    })) || []

  return <UserOrdersView initialOrders={ordersWithFlags} />
}
