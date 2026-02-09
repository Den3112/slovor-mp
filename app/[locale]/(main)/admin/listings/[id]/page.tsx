import { createClient } from '@/lib/supabase/server'
import dynamic from 'next/dynamic'
import { config } from '@/lib/config'
import { redirect, notFound } from 'next/navigation'
import { Loader2 } from 'lucide-react'

const AdminListingDetailView = dynamic(
  () =>
    import('@/components/features/dashboard/admin/listing-detail-view').then(
      (mod) => mod.AdminListingDetailView
    ),
  {
    loading: () => (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    ),
  }
)

interface AdminListingPageProps {
  params: {
    id: string
    locale: string
  }
}

export default async function AdminListingPage({
  params,
}: AdminListingPageProps) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || !config.app.adminEmails.includes(user.email || '')) {
    redirect('/')
  }

  const { data: listing } = await supabase
    .from('listings')
    .select('*, user:profiles(*), category:categories(*)')
    .eq('id', params.id)
    .single()

  if (!listing) {
    notFound()
  }

  return <AdminListingDetailView listing={listing} />
}
