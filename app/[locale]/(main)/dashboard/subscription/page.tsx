import { createClient } from '@/lib/supabase/server'
import { subscriptionsApi } from '@/lib/api'
import { SubscriptionView } from '@/components/features/dashboard/user/subscription-view'

export default async function SubscriptionPage() {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return null // Layout handles redirect
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
