import { redirect } from 'next/navigation'
import dynamic from 'next/dynamic'
import { createClient } from '@/lib/supabase/server'
import { config } from '@/lib/config'
import { Loader2 } from 'lucide-react'

const AdminOverviewView = dynamic(() => import('@/components/features/dashboard/admin/overview-view').then(mod => mod.AdminOverviewView), {
  loading: () => (
    <div className="flex h-[calc(100vh-200px)] items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  )
})

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
