import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { FavoriteButton } from '@/features/favorite-listing/ui/favorite-button'
import { createClient } from '@/shared/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { trackEvent } from '@/shared/lib/utils/analytics'

// Mock dependencies
vi.mock('@/shared/lib/supabase/client', () => ({
  createClient: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}))

vi.mock('@/shared/lib/i18n', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    locale: 'en',
  }),
}))

vi.mock('@/shared/lib/utils/analytics', () => ({
  trackEvent: vi.fn(),
}))

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    button: ({ children, ...props }: any) => (
      <button {...props}>{children}</button>
    ),
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

describe('FavoriteButton', () => {
  const mockPush = vi.fn()
  const mockSupabase = {
    auth: {
      getSession: vi.fn(),
      getUser: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn(),
      insert: vi.fn(),
      delete: vi.fn().mockReturnThis(),
    })),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    ;(createClient as any).mockReturnValue(mockSupabase)
    ;(useRouter as any).mockReturnValue({
      push: mockPush,
      refresh: vi.fn(),
    })
    mockSupabase.auth.getSession.mockResolvedValue({ data: { session: null } })
  })

  it('renders initial state correctly', () => {
    render(<FavoriteButton listingId="listing-1" />)
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
  })

  it('checks favorite status on mount', async () => {
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: { user: { id: 'user-1' } } },
    })
    const mockSelect = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: { id: 'fav-1' } }),
    }
    mockSupabase.from.mockReturnValue(mockSelect as any)

    render(<FavoriteButton listingId="listing-1" />)

    await waitFor(() => {
      const heartIcon = screen.getByTestId('heart-icon')
      expect(heartIcon).toHaveClass('fill-current')
    })
  })

  it('redirects to login if non-authenticated user tries to favorite', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null } })

    render(<FavoriteButton listingId="listing-1" />)
    const button = screen.getByRole('button')
    fireEvent.click(button)

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/en/login')
    })
  })

  it('toggles favorite status and tracks event for authenticated user', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: 'user-1' } },
    })
    const mockInsert = {
      insert: vi.fn().mockResolvedValue({ error: null }),
    }
    mockSupabase.from.mockReturnValue(mockInsert as any)

    render(<FavoriteButton listingId="listing-1" initialIsFavorited={false} />)
    const button = screen.getByRole('button')
    fireEvent.click(button)

    await waitFor(() => {
      expect(mockInsert.insert).toHaveBeenCalledWith({
        listing_id: 'listing-1',
        user_id: 'user-1',
      })
      expect(trackEvent).toHaveBeenCalledWith(
        'favorite_toggle',
        expect.any(Object)
      )
    })
  })
})
