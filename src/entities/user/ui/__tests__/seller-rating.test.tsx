import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { SellerRating } from '@/features/seller-profile/ui/seller-rating'
import { reviewsApi } from '@/shared/lib/api'
import { useAuth } from '@/app/providers/auth-provider'

// Mock dependencies
vi.mock('@/shared/lib/api', () => ({
  reviewsApi: {
    getForSeller: vi.fn(),
    hasReviewed: vi.fn(),
    create: vi.fn(),
  },
}))

vi.mock('@/app/providers/auth-provider', () => ({
  useAuth: vi.fn(),
}))

vi.mock('@/shared/lib/i18n', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

vi.mock('next/image', () => ({
  // eslint-disable-next-line @next/next/no-img-element
  default: (props: any) => <img alt={props.alt || ''} {...props} />,
}))

describe('SellerRating', () => {
  const mockSellerId = 'seller-123'
  const mockUser = { id: 'user-456' }

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useAuth as any).mockReturnValue({ user: null })
    ;(reviewsApi.getForSeller as any).mockResolvedValue({
      data: { averageRating: 0, totalReviews: 0, reviews: [] },
    })
    ;(reviewsApi.hasReviewed as any).mockResolvedValue({ data: false })
  })

  it('renders loading state initially', async () => {
    ;(reviewsApi.getForSeller as any).mockReturnValue(new Promise(() => {})) // never resolves
    render(<SellerRating sellerId={mockSellerId} />)
    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument()
  })

  it('renders "no reviews" state', async () => {
    render(<SellerRating sellerId={mockSellerId} />)
    await waitFor(() => {
      expect(screen.getByText('reviews:noReviews')).toBeInTheDocument()
    })
  })

  it('renders average rating and reviews list', async () => {
    const mockData = {
      averageRating: 4.5,
      totalReviews: 2,
      reviews: [
        {
          id: 'r1',
          rating: 5,
          comment: 'Great!',
          created_at: new Date().toISOString(),
          author: { display_name: 'Alice' },
        },
        {
          id: 'r2',
          rating: 4,
          comment: 'Good',
          created_at: new Date().toISOString(),
          author: { display_name: 'Bob' },
        },
      ],
    }
    ;(reviewsApi.getForSeller as any).mockResolvedValue({ data: mockData })

    render(<SellerRating sellerId={mockSellerId} />)

    await waitFor(() => {
      expect(screen.getByText('4.5')).toBeInTheDocument()
      expect(
        screen.getByText('reviews:basedOn 2 reviews:reviewsCount')
      ).toBeInTheDocument()
      expect(screen.getByText('Alice')).toBeInTheDocument()
      expect(screen.getByText('Great!')).toBeInTheDocument()
    })
  })

  it('shows review form when "write review" is clicked', async () => {
    ;(useAuth as any).mockReturnValue({ user: mockUser })
    render(<SellerRating sellerId={mockSellerId} />)

    await waitFor(() => {
      const writeBtn = screen.getByText('reviews:writeReview')
      fireEvent.click(writeBtn)
    })

    expect(screen.getByText('reviews:yourRating')).toBeInTheDocument()
    expect(screen.getByText('reviews:submitReview')).toBeInTheDocument()
  })

  it('submits a new review', async () => {
    ;(useAuth as any).mockReturnValue({ user: mockUser })
    ;(reviewsApi.create as any).mockResolvedValue({ error: null })

    render(<SellerRating sellerId={mockSellerId} />)

    await waitFor(() => {
      fireEvent.click(screen.getByText('reviews:writeReview'))
    })

    const stars = screen
      .getAllByRole('button')
      .filter((b) => b.querySelector('svg') !== null)
    fireEvent.click(stars[4]!) // 5 stars

    const textarea = screen.getByPlaceholderText('...')
    fireEvent.change(textarea, { target: { value: 'Excellent!' } })

    fireEvent.click(screen.getByText('reviews:submitReview'))

    await waitFor(() => {
      expect(reviewsApi.create).toHaveBeenCalledWith({
        recipient_id: mockSellerId,
        author_id: mockUser.id,
        rating: 5,
        comment: 'Excellent!',
      })
      expect(screen.getByText('reviews:thankYou')).toBeInTheDocument()
    })
  })
})
