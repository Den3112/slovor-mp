import { describe, it, expect } from 'vitest'
import { generateListingMetadata } from '../metadata'
import { mockListingsApi } from '@/vitest.setup'

describe('generateListingMetadata', () => {
  const validId = '12345678-1234-1234-1234-123456789012'

  it('returns "Not Found" for invalid UUID', async () => {
    const params = Promise.resolve({ id: 'invalid-id' })
    const metadata = await generateListingMetadata({ params })
    expect(metadata.title).toBe('Listing Not Found | Slovor')
  })

  it('returns "Not Found" if listing does not exist', async () => {
    mockListingsApi.getById.mockResolvedValueOnce({ data: null, error: null })
    const params = Promise.resolve({ id: validId })
    const metadata = await generateListingMetadata({ params })
    expect(metadata.title).toBe('Listing Not Found | Slovor')
  })

  it('generates correct metadata for a valid listing', async () => {
    const mockListing = {
      id: validId,
      title: 'Test iPhone',
      description:
        'Long description that should be truncated because it is more than one hundred and sixty characters long to test the truncation logic in the metadata generator function correctly works as expected for SEO purposes.',
      category: { name: 'Electronics' },
      images: ['https://example.com/image1.jpg'],
      location: 'Bratislava',
    }
    mockListingsApi.getById.mockResolvedValueOnce({
      data: mockListing,
      error: null,
    })

    const params = Promise.resolve({ id: validId, locale: 'sk' })
    const metadata = await generateListingMetadata({ params })

    expect(metadata.title).toBe('Test iPhone | Electronics')
    expect(metadata.description).toHaveLength(163) // 160 chars + '...'
    expect(metadata.description).toMatch(/\.\.\.$/)
    expect(metadata.openGraph?.title).toBe('Test iPhone | Electronics')
    expect(metadata.openGraph?.url).toContain('/sk/listings/' + validId)
    expect(metadata.openGraph?.images).toBeDefined()
    const images = metadata.openGraph?.images
    const firstImage = Array.isArray(images) ? images[0] : images
    expect(firstImage).toMatchObject({
      url: 'https://example.com/image1.jpg',
      alt: 'Test iPhone',
    })
  })

  it('uses fallback image and default title for category-less listing', async () => {
    const mockListing = {
      id: validId,
      title: 'Minimal Listing',
      images: [],
    }
    mockListingsApi.getById.mockResolvedValueOnce({
      data: mockListing,
      error: null,
    })

    const params = Promise.resolve({ id: validId })
    const metadata = await generateListingMetadata({ params })

    expect(metadata.title).toBe('Minimal Listing | Listing')
    const images = metadata.openGraph?.images
    const firstImage = Array.isArray(images) ? images[0] : images
    expect(firstImage).toMatchObject({
      url: '/og-default.jpg',
    })
  })
})
