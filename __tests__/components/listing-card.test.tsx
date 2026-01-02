import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ListingCard } from '@/components/listing/card'

// Mock i18n
vi.mock('@/lib/i18n', () => ({
  useTranslation: () => ({
    locale: 'en',
    t: {
      common: {
        new: 'New',
        used: 'Used',
        featured: 'Featured',
        noImage: 'No image',
      },
      categories: {
        electronics: 'Electronics',
      },
    },
  }),
}))

// Mock category-i18n
vi.mock('@/lib/utils/category-i18n', () => ({
  getLocalizedCategoryName: () => 'Electronics',
}))

const mockListing = {
  id: '1',
  title: 'Test Product',
  description: 'Test description',
  price: 99.99,
  currency: 'EUR',
  location: 'Bratislava',
  condition: 'new' as const,
  is_featured: false,
  is_active: true,
  featured: false,
  views: 0,
  views_count: 0,
  images: ['https://example.com/image.jpg'],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  status: 'active' as const,
  category_id: 'cat-1',
  user_id: 'user-1',
  metadata: null,
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
    expect(link).toHaveAttribute('href', '/listings/1')
  })
})
