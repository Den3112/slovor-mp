import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminDashboard } from './components/admin-dashboard'
import { config } from '@/lib/config'

export default async function AdminPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Check if user is authenticated and is an admin
  if (!user || !config.app.adminEmails.includes(user.email || '')) {
    redirect('/')
  }

  return <AdminDashboard userEmail={user.email || ''} />
}
