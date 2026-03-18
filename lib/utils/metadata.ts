import { Metadata } from 'next'
import { listingsApi } from '@/lib/api'

type Props = {
  params: Promise<{ id: string; locale?: string }>
}

export async function generateListingMetadata({
  params,
}: Props): Promise<Metadata> {
  const { id, locale = 'en' } = await params

  // Validate UUID
  const isValidUUID =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
  if (!isValidUUID) {
    return {
      title: 'Listing Not Found | Slovor',
    }
  }


  const { data: listing } = await listingsApi.getById(id)

  if (!listing) {
    return {
      title: 'Listing Not Found | Slovor',
    }
  }

  const title = `${listing.title} | ${listing.category?.name || 'Listing'}`
  // Create description from listing description (truncated) or fallback
  const description = listing.description
    ? listing.description.slice(0, 160) +
      (listing.description.length > 160 ? '...' : '')
    : `Buy ${listing.title} on Slovor Marketplace. Great deals in ${listing.location}.`

  const images =
    listing.images && listing.images.length > 0
      ? listing.images
      : ['/og-default.jpg'] // Fallback image

  const mainImage = images[0] || '/og-default.jpg'

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://slovor.sk/${locale}/listings/${listing.id}`,
      images: [
        {
          url: mainImage,
          width: 1200,
          height: 630,
          alt: listing.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [mainImage],
    },
  }
}
