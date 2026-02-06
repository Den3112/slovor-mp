import { createClient } from '@/lib/supabase/server'
import { subscriptionsApi } from '@/lib/api'
import dynamic from 'next/dynamic'
import { Loader2 } from 'lucide-react'
import { redirect } from 'next/navigation'

const SubscriptionView = dynamic(() => import('@/components/features/dashboard/user/subscription-view').then(mod => mod.SubscriptionView), {
    loading: () => (
        <div className="flex h-[calc(100vh-200px)] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    )
})

export default async function SubscriptionPage() {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/')
    }

    const { data: subscription } = await subscriptionsApi.getCurrent()

    return (
        <SubscriptionView
            currentSubscription={subscription || {
                id: '',
                user_id: user.id,
                plan_type: 'free',
                status: 'active',
                current_period_end: null,
                cancel_at_period_end: false,
                created_at: new Date().toISOString()
            }}
        />
    )
}
