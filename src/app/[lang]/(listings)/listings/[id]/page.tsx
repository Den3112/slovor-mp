import { notFound } from 'next/navigation'
import { listingsApi } from '@/shared/lib/api'
import { ErrorState } from '@/shared/ui/error-state'
import { ListingDetailsWidget } from '@/widgets/listing-details/ui/listing-details-widget'
import { createClient } from '@/shared/lib/supabase/server'
import { generateListingMetadata } from '@/shared/lib/utils/metadata'

export const generateMetadata = generateListingMetadata

export default async function ListingPage({
  params,
}: {
  params: Promise<{ id: string; lang: string }>
}) {
  const { id, lang } = await params
  console.log(`[Page] Rendering ListingPage for id: ${id}, lang: ${lang}`)

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

  return <ListingDetailsWidget listing={result.data} />
}
