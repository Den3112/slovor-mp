import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { CreateListingForm } from '@/components/listing/form/create-listing-form'

// Mock useAuth
vi.mock('@/components/providers/auth-provider', () => ({
  useAuth: () => ({
    user: { id: 'test-user-id', email: 'test@example.com' },
    isLoading: false,
  }),
}))

// Mock useTranslation
vi.mock('@/lib/i18n', () => ({
  useTranslation: () => ({
    t: {
      createListing: {
        title: 'Create New Listing',
        step: 'Step {step} of 3',
        preview: 'Preview',
        previewDescription: 'Preview description',
        edit: 'Edit',
        back: 'Back',
        nextStep: 'Next',
        publish: 'Publish',
        backToEdit: 'Back to Edit'
      },
      common: {
        home: 'Home'
      },
      filters: {
        new: 'new',
        used: 'used'
      },
      categories: {
        electronics: 'Electronics',
        fashion: 'Fashion'
      }
    },
    locale: 'en',
    setLocale: vi.fn(),
  }),
}))

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn(),
  }),
  useParams: () => ({}),
}))

// Mock Supabase client
vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
    },
  }),
}))

// Mock categoriesApi and listingsApi
vi.mock('@/lib/api', () => ({
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
      const steps = screen.getAllByText('Step 1 of 3')
      expect(steps.length).toBeGreaterThan(0)
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
