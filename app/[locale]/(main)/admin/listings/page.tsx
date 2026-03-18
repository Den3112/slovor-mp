import { createClient } from '@/lib/supabase/server'
import dynamic from 'next/dynamic'
import { config } from '@/lib/config'
import { redirect } from 'next/navigation'
import { Loader2 } from 'lucide-react'

const AdminListingsView = dynamic(
  () =>
    import('@/components/features/dashboard/admin/listings-view').then(
      (mod) => mod.AdminListingsView
    ),
  {
    loading: () => (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    ),
  }
)

export default async function AdminListingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (
    !user ||
    !(config.app.adminEmails as readonly string[]).includes(user.email || '')
  ) {
    redirect('/')
  }

  // Pre-fetch listings (optional, component also fetches)
  const { data: listings } = await supabase
    .from('listings')
    .select('*, user:profiles(*), category:categories(*)')
    .order('created_at', { ascending: false })

  return <AdminListingsView initialListings={(listings as any) || []} />
}
