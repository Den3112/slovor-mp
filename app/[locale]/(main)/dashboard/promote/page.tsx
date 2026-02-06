import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Loader2 } from 'lucide-react'

const PromoteView = dynamic(() => import('@/components/features/dashboard/user/promote-view').then(mod => mod.PromoteView), {
    loading: () => (
        <div className="flex h-[calc(100vh-200px)] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    )
})

export default async function PromotionDashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/')
    }

    return <PromoteView userId={user.id} />
}
