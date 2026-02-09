import { createClient } from '@/lib/supabase/server'
import dynamic from 'next/dynamic'
import { config } from '@/lib/config'
import { redirect } from 'next/navigation'
import { Loader2 } from 'lucide-react'

const AdminVerificationView = dynamic(
  () =>
    import('@/components/features/dashboard/admin/verification').then(
      (mod) => mod.AdminVerificationView
    ),
  {
    loading: () => (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    ),
  }
)

export default async function AdminVerificationPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || !config.app.adminEmails.includes(user.email || '')) {
    redirect('/')
  }

  // Pre-fetch not strictly necessary as the component fetches,
  // but we could do it here for SSR.
  // For now, let's rely on the component's internal fetch for consistency with other admin views
  // unless performance demands SSR.

  return (
    <div className="container py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Identity Verification
        </h1>
        <p className="text-muted-foreground">
          Review and verify user identity documents.
        </p>
      </div>
      <AdminVerificationView />
    </div>
  )
}
