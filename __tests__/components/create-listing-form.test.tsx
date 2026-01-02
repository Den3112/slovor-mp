import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { CreateListingForm } from '@/components/listing/create-listing-form'

// Mock useAuth
vi.mock('@/components/providers/auth-provider', () => ({
  useAuth: () => ({
    user: { id: 'test-user-id', email: 'test@example.com' },
    isLoading: false,
  }),
}))

// Mock categoriesApi
vi.mock('@/lib/supabase/queries', () => ({
  categoriesApi: {
    getAll: vi.fn().mockResolvedValue({
      data: [
        { id: '1', name: 'Electronics', slug: 'electronics', icon: '📱' },
        { id: '2', name: 'Fashion', slug: 'fashion', icon: '👗' },
      ],
      error: null,
    }),
  },
  listingsApi: {
    create: vi.fn().mockResolvedValue({
      data: { id: 'new-listing-id' },
      error: null,
    }),
  },
}))

describe('CreateListingForm', () => {
  it('renders the form with step 1', async () => {
    render(<CreateListingForm />)

    await waitFor(() => {
      expect(screen.getByText('Create New Listing')).toBeInTheDocument()
      expect(screen.getByText('Step 1 of 3')).toBeInTheDocument()
    })
  })

  it('shows categories after loading', async () => {
    render(<CreateListingForm />)

    await waitFor(() => {
      expect(screen.getByText('Electronics')).toBeInTheDocument()
      expect(screen.getByText('Fashion')).toBeInTheDocument()
    })
  })

  it('allows selecting a category', async () => {
    render(<CreateListingForm />)

    await waitFor(() => {
      const electronicsButton = screen
        .getByText('Electronics')
        .closest('button')
      if (electronicsButton) {
        fireEvent.click(electronicsButton)
        expect(electronicsButton).toHaveClass('border-primary')
      }
    })
  })

  it('shows condition buttons', async () => {
    render(<CreateListingForm />)

    await waitFor(() => {
      expect(screen.getByText('new')).toBeInTheDocument()
      expect(screen.getByText('used')).toBeInTheDocument()
    })
  })
})
