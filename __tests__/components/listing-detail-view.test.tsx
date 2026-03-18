import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ListingDetailView } from '@/components/listing/listing-detail-view'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { CurrencyProvider } from '@/components/providers/currency-provider'

// Mock components
vi.mock('@/components/listing/image-gallery', () => ({
  ImageGallery: () => <div data-testid="image-gallery">Image Gallery</div>,
}))

vi.mock('@/components/listing/mobile-image-gallery', () => ({
  MobileImageGallery: () => (
    <div data-testid="mobile-image-gallery">Mobile Image Gallery</div>
  ),
}))

vi.mock('@/components/listing/details/listing-sidebar', () => ({
  ListingSidebar: () => (
    <div data-testid="listing-sidebar">Listing Sidebar</div>
  ),
}))

vi.mock('@/components/listing/related-listings', () => ({
  RelatedListings: () => (
    <div data-testid="related-listings">Related Listings</div>
  ),
}))

vi.mock('@/components/listing/recently-viewed', () => ({
  RecentlyViewed: () => (
    <div data-testid="recently-viewed">Recently Viewed</div>
  ),
}))

vi.mock('@/components/listing/details/listing-description', () => ({
  ListingDescription: () => (
    <div data-testid="listing-description">Listing Description</div>
  ),
}))

vi.mock('@/components/listing/details/listing-attributes', () => ({
  ListingDetailsGrid: () => (
    <div data-testid="listing-attributes">Listing Attributes</div>
  ),
}))

vi.mock('@/components/layout/structured-data', () => ({
  StructuredData: () => (
    <div data-testid="structured-data">Structured Data</div>
  ),
}))

// Mock translations
vi.mock('@/lib/i18n', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en' },
  }),
}))

// Mock hooks
vi.mock('@/lib/hooks/use-recently-viewed', () => ({
  useRecentlyViewed: () => ({
    addItem: vi.fn(),
  }),
}))

const mockListing = {
  id: '123',
  title: 'Test Listing',
  description: 'Test Description',
  price: 100,
  images: ['test.jpg'],
  category_id: 'cat1',
  location: 'Bratislava',
  condition: 'new',
  created_at: new Date().toISOString(),
  user_id: 'user1',
  category: { name: 'Electronics', slug: 'electronics' },
  profiles: { full_name: 'John Doe' },
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

describe('ListingDetailView', () => {
  it('renders listing details and sub-components', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <CurrencyProvider>
          <ListingDetailView listing={mockListing as any} />
        </CurrencyProvider>
      </QueryClientProvider>
    )

    expect(screen.getByTestId('image-gallery')).toBeInTheDocument()
    expect(screen.getByTestId('listing-sidebar')).toBeInTheDocument()
    expect(screen.getByTestId('listing-description')).toBeInTheDocument()
    expect(screen.getByTestId('listing-attributes')).toBeInTheDocument()
    // RelatedListings uses next/dynamic — not testable via vi.mock
    // RecentlyViewed may depend on localStorage context
  })
})
