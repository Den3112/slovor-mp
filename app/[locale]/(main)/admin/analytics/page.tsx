import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { config } from '@/lib/config'
import { AdminAnalyticsView } from '@/components/features/dashboard/admin/analytics-view'

export default async function AdminAnalyticsPage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    // Check if user is authenticated and is an admin
    if (!user || !config.app.adminEmails.includes(user.email || '')) {
        redirect('/')
    }

    return <AdminAnalyticsView />
}
