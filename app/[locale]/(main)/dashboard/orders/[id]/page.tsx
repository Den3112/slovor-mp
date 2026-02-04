import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { ordersApi } from '@/lib/api'
import { OrderDetailsView } from '@/components/features/dashboard/shared/order-details-view'

interface OrderDetailsPageProps {
    params: {
        locale: string
        id: string
    }
}

export default async function OrderDetailsPage({ params }: OrderDetailsPageProps) {
    const { id } = params
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/auth/login')

    const { data: order, error } = await ordersApi.getById(supabase, id)

    if (error || !order) {
        console.error('Order not found:', error)
        notFound()
    }

    // Security: Check if user is part of the order
    if (order.buyer_id !== user.id && order.seller_id !== user.id) {
        redirect('/dashboard/orders')
    }

    return (
        <div className="container py-8">
            <OrderDetailsView order={order} />
        </div>
    )
}
