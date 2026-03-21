'use client'

import { useAuth } from '@/components/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { Pencil } from 'lucide-react'
import { useRouter, useParams } from 'next/navigation'

interface ListingOwnerActionsProps {
  listingId: string
  ownerId: string
  className?: string
}

export function ListingOwnerActions({
  listingId,
  ownerId,
  className,
}: ListingOwnerActionsProps) {
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const lang = (params?.lang as string) || 'en'

  if (!user || user.id !== ownerId) {
    return null
  }

  return (
    <Button
      variant="outline"
      size="lg"
      className={className}
      onClick={() => router.push(`/${lang}/post?edit=${listingId}`)}
    >
      <Pencil className="mr-2 h-5 w-5" />
      Edit Listing
    </Button>
  )
}
