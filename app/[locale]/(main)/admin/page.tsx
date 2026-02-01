import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { config } from '@/lib/config'
import { AdminOverviewView } from '@/components/features/dashboard/admin/overview-view'

export default async function AdminPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Check if user is authenticated and is an admin
  if (!user || !config.app.adminEmails.includes(user.email || '')) {
    redirect('/')
  }

  return <AdminOverviewView userEmail={user.email || ''} />
}
