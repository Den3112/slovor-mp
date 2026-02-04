import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { config } from '@/lib/config'
import { AdminCategoriesView } from '@/components/features/dashboard/admin/categories-view'

export default async function AdminCategoriesPage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    // Check if user is authenticated and is an admin
    if (!user || !config.app.adminEmails.includes(user.email || '')) {
        redirect('/')
    }

    return <AdminCategoriesView />
}
