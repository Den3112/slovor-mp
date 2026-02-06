import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import dynamic from 'next/dynamic'
import { config } from '@/lib/config'
import { Loader2 } from 'lucide-react'

const AdminVerificationsView = dynamic(() => import('@/components/features/dashboard/admin/verifications-view').then(mod => mod.AdminVerificationsView), {
    loading: () => (
        <div className="flex h-[calc(100vh-200px)] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    )
})

export default async function AdminVerificationsPage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    // Check if user is authenticated and is an admin
    if (!user || !config.app.adminEmails.includes(user.email || '')) {
        redirect('/')
    }

    return <AdminVerificationsView />
}
