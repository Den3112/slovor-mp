import { createClient } from '@/lib/supabase/server'
import { AdminUsersView } from '@/components/features/dashboard/admin/users-view'
import { config } from '@/lib/config'
import { redirect } from 'next/navigation'

export default async function AdminUsersPage() {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user || !config.app.adminEmails.includes(user.email || '')) {
        redirect('/')
    }

    // Pre-fetch users
    const { data: users } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <AdminUsersView initialUsers={users || []} />
    )
}
