'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function RegisterRedirect() {
  const router = useRouter()
  const params = useParams()
  const lang = params.lang as string

  useEffect(() => {
    router.replace(`/${lang}/login?mode=register`)
  }, [router, lang])

  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2" />
    </div>
  )
}
