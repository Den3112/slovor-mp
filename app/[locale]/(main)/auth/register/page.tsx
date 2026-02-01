'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function RegisterRedirect() {
  const router = useRouter()
  const params = useParams()
  const locale = params.locale as string

  useEffect(() => {
    router.replace(`/${locale}/login?mode=register`)
  }, [router, locale])

  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2" />
    </div>
  )
}
