import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminDashboard } from './components/admin-dashboard'

// List of admin email addresses
const ADMIN_EMAILS = [
    'admin@slovor.sk',
    'moderator@slovor.sk',
    // Add more admin emails as needed
]

export default async function AdminPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    // Check if user is authenticated and is an admin
    if (!user || !ADMIN_EMAILS.includes(user.email || '')) {
        redirect('/')
    }

    return <AdminDashboard userEmail={user.email || ''} />
}
