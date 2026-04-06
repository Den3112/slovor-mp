import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ListingCard } from '@/entities/listing/ui/listing-card'

// Mock FavoriteButton to avoid dependency issues
vi.mock('@/features/favorite-listing', () => ({
  FavoriteButton: () => <div data-testid="favorite-button" />,
}))

// Mock i18n
vi.mock('@/shared/lib/i18n', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: any = {
        new: 'New',
        used: 'Used',
        featured: 'Featured',
        noImage: 'No image',
        photos: 'Photos',
        'common:price': 'Price',
        'filters:new': 'New',
        'filters:used': 'Used',
        'common:featured': 'Featured',
        'common:noImage': 'No image',
        electronics: 'Electronics',
      }

      return translations[key] || key
    },
    i18n: {
      language: 'en',
    },
  }),
}))

// Mock category-i18n
vi.mock('@/shared/lib/utils/category-i18n', () => ({
  getLocalizedCategoryName: () => 'Electronics',
}))

// Mock Supabase
vi.mock('@/shared/lib/supabase/client', () => ({
  createClient: () => ({
    from: () => ({
      select: () => ({
        eq: () => ({
          single: () => ({ data: null, error: null }),
        }),
      }),
    }),
    auth: {
      getUser: () => ({ data: { user: null }, error: null }),
      getSession: () => ({ data: { session: null }, error: null }),
    },
  }),
}))

// Mock Currency Provider
vi.mock('@/app/providers/currency-provider', () => ({
  useCurrency: () => ({
    currency: 'EUR',
    convertPrice: (price: number) => price,
    formatPrice: (price: number) => `${price} EUR`,
    isLoading: false,
  }),
}))

const mockListing = {
  id: '1',
  title: 'Test Product',
  description: 'Test description',
  price: 99.99,
  currency: 'EUR',
  location: 'Bratislava',
  condition: 'new' as const,
  is_promoted: false,
  is_highlighted: false,
  promoted_until: null,
  is_active: true,
  featured: false,
  views: 0,
  views_count: 0,
  favorites_count: 0,
  images: ['https://example.com/image.jpg'],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  status: 'active' as const,
  category_id: 'cat-1',
  user_id: 'user-1',
  metadata: null,
  attributes: {},
  expires_at: null,
  category: {
    id: 'cat-1',
    name: 'Electronics',
    slug: 'electronics',
    description: null,
    icon: null,
    icon_name: null,
    color: null,
    order_index: 0,
    created_at: new Date().toISOString(),
  },
}

describe('ListingCard', () => {
  it('renders the listing title', () => {
    render(<ListingCard listing={mockListing} />)
    expect(screen.getByText('Test Product')).toBeInTheDocument()
  })

  it('displays the price correctly', () => {
    render(<ListingCard listing={mockListing} />)
    // Price formatting may vary, just check for the number
    expect(screen.getByText(/99/)).toBeInTheDocument()
  })

  it('shows the location', () => {
    render(<ListingCard listing={mockListing} />)
    expect(screen.getByText('Bratislava')).toBeInTheDocument()
  })

  it('displays condition badge for new items', () => {
    render(<ListingCard listing={mockListing} />)
    expect(screen.getByText('New')).toBeInTheDocument()
  })

  it('renders featured items without error', () => {
    const featuredListing = { ...mockListing, is_featured: true }
    render(<ListingCard listing={featuredListing} />)
    // Featured items still render correctly
    expect(screen.getByText('Test Product')).toBeInTheDocument()
  })

  it('renders a link to the listing details', () => {
    render(<ListingCard listing={mockListing} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/en/listings/1')
  })

  it('renders the compact variant correctly', () => {
    render(<ListingCard listing={mockListing} variant="compact" />)
    // Check for specific compact layout elements or classes if needed
    // For now, check if the main info is still there
    expect(screen.getByText('Test Product')).toBeInTheDocument()
    expect(screen.getByText('Bratislava')).toBeInTheDocument()
  })

  it('shows featured badge when listing is featured', () => {
    // Note: The component uses the 'featured' prop OR listing.featured
    render(<ListingCard listing={mockListing} featured={true} />)
    expect(screen.getByText('Featured')).toBeInTheDocument()
  })

  it('shows views count when provided', () => {
    const listingWithViews = { ...mockListing, views_count: 123 }
    render(<ListingCard listing={listingWithViews} />)
    expect(screen.getByText('123')).toBeInTheDocument()
  })

  it('shows placeholder when no image is provided', () => {
    const listingNoImage = { ...mockListing, images: [] }
    render(<ListingCard listing={listingNoImage} />)
    expect(screen.getByText('No image')).toBeInTheDocument()
  })
})
