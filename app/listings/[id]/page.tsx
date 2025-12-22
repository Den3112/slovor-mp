import { notFound } from 'next/navigation'
import { ErrorState } from '@/components/ui/error-state'
import { listingsApi } from '@/lib/supabase/queries'
import { ListingDetailView } from '@/components/listing/ListingDetailView'

interface ListingDetailPageProps {
  params: {
    id: string
  }
}

export default async function ListingDetailPage({ params }: ListingDetailPageProps) {
  const { id } = await params
  const result = await listingsApi.getById(id)

  if (result.error) {
    if (result.error.includes('not found')) {
      notFound()
    }
    return <ErrorState message={result.error} />
  }

  const listing = result.data

  if (!listing) {
    notFound()
  }

  return <ListingDetailView listing={listing} />
}
