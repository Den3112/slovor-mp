import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Loader2 } from 'lucide-react'

const VerificationView = dynamic(
  () =>
    import('@/components/features/dashboard/user/verification').then(
      (mod) => mod.VerificationView
    ),
  {
    loading: () => (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    ),
  }
)

export default async function VerificationPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  return <VerificationView />
}
