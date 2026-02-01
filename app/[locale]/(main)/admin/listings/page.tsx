import { createClient } from '@/lib/supabase/server'
import { AdminListingsView } from '@/components/features/dashboard/admin/listings-view'
import { config } from '@/lib/config'
import { redirect } from 'next/navigation'

export default async function AdminModerationPage() {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user || !config.app.adminEmails.includes(user.email || '')) {
        redirect('/')
    }

    // Pre-fetch listings (optional, component also fetches)
    const { data: listings } = await supabase
        .from('listings')
        .select('*, user:profiles(display_name)')
        .order('created_at', { ascending: false })

    return (
        <AdminListingsView initialListings={listings || []} />
    )
}
