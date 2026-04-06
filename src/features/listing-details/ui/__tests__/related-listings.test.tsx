import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { RelatedListings } from '@/entities/listing/ui/related-listings'

// 1. Define dummy mock storage
const mocks = vi.hoisted(() => ({
  getAll: vi.fn(),
}))

// 2. Mock the module using the hoisted mock storage
vi.mock('@/shared/lib/api', () => ({
  listingsApi: {
    getAll: mocks.getAll,
  },
}))

// 3. Other mocks
vi.mock('@/entities/listing/ui/listing-card', () => ({
  ListingCard: ({ listing }: any) => (
    <div data-testid={`listing-card-${listing.id}`}>{listing.title}</div>
  ),
}))

vi.mock('@/shared/lib/i18n', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

describe('RelatedListings', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders loading state initially', () => {
    mocks.getAll.mockReturnValue(new Promise(() => {}))
    const { container } = render(
      <RelatedListings categoryId="1" currentListingId="123" />
    )
    const skeletons = container.querySelectorAll('.animate-pulse')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('renders related listings excluding current when data is loaded', async () => {
    mocks.getAll.mockResolvedValue({
      data: [
        { id: '456', title: 'Related 1' },
        { id: '789', title: 'Related 2' },
        { id: '123', title: 'Current' },
      ],
      error: null,
    })

    render(<RelatedListings categoryId="1" currentListingId="123" />)

    await waitFor(() => {
      expect(screen.getByTestId('listing-card-456')).toBeInTheDocument()
      expect(screen.getByTestId('listing-card-789')).toBeInTheDocument()
      expect(screen.queryByTestId('listing-card-123')).not.toBeInTheDocument()
    })
  })

  it('renders nothing when empty', async () => {
    mocks.getAll.mockResolvedValue({ data: [], error: null })
    const { container } = render(
      <RelatedListings categoryId="1" currentListingId="123" />
    )
    await waitFor(() => {
      expect(container.firstChild).toBeNull()
    })
  })
})
