import { notFound } from 'next/navigation'
import { listingsApi } from '@/lib/api'
import { ErrorState } from '@/components/ui/error-state'
import { ListingDetailView } from '@/components/listing/listing-detail-view'

interface Props {
  params: Promise<{
    id: string
  }>
}

export default async function ListingDetailPage({ params }: Props) {
  const { id } = await params
  const result = await listingsApi.getById(id)

  if (result.error) {
    return <ErrorState message={result.error} />
  }

  if (!result.data) {
    notFound()
  }

  return <ListingDetailView listing={result.data} />
}
