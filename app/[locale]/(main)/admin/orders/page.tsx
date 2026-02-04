import { AdminOrdersView } from '@/components/features/dashboard/admin/orders-view'
import { createClient } from '@/lib/supabase/server'
import { ordersApi } from '@/lib/api'

export default async function AdminOrdersPage() {
    const supabase = await createClient()
    const { data: orders } = await ordersApi.getAll(supabase)

    return <AdminOrdersView initialOrders={orders || []} />
}
