import { notFound } from 'next/navigation'
import { listingsApi } from '@/lib/api'
import { ErrorState } from '@/components/ui/error-state'
import { ListingDetailView } from '@/components/features/listing/ui/listing-detail-view'
import { createClient } from '@/lib/supabase/server'

interface Props {
  params: Promise<{
    id: string
  }>
}

import { generateListingMetadata } from '@/lib/utils/metadata'

export const generateMetadata = generateListingMetadata

export default async function ListingDetailPage({ params }: Props) {
  const { id } = await params

  if (process.env.SKIP_ENV_VALIDATION === '1') {
    return <div className="py-20 text-center">Building...</div>
  }

  const supabase = await createClient()

  // Validate UUID to prevent 500 errors
  const isValidUUID =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
  if (!isValidUUID) {
    notFound()
  }

  // Try public fetch first (active only)
  let result = await listingsApi.getById(id)

  // If not found, check if it's the owner's inactive listing
  if (!result.data) {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      const ownerResult = await listingsApi.getForOwner(id, user.id)
      if (ownerResult.data) {
        result = ownerResult
      }
    }
  }

  if (result.error) {
    return <ErrorState message={result.error} />
  }

  if (!result.data) {
    notFound()
  }

  return <ListingDetailView listing={result.data} />
}
