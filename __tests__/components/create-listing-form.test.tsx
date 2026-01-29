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

const { mockUpdateField } = vi.hoisted(() => ({
  mockUpdateField: vi.fn(),
}))

vi.mock('@/lib/hooks/use-create-listing', () => ({
  useCreateListing: () => ({
    state: {
      step: 1,
      error: null,
      fieldErrors: {},
      categories: [
        { id: '1', name: 'Electronics', slug: 'electronics', icon: '📱' },
        { id: '2', name: 'Fashion', slug: 'fashion', icon: '👗' },
      ],
      isUploading: false,
      uploadProgress: null,
      formData: {
        title: '',
        price: '',
        description: '',
        location: '',
        category_id: '',
        condition: 'new',
        images: [],
      },
      isSubmitting: false,
      isLoadingData: false,
      authLoading: false,
    },
    actions: {
      updateField: mockUpdateField,
      goToNextStep: vi.fn(),
      prevStep: vi.fn(),
      handleSubmit: vi.fn(),
      handleFilesSelected: vi.fn(),
      setStep: vi.fn(),
    },
    flags: {
      showLoader: false,
    },
    t: (key: string, params?: any) => {
      const translations: any = {
        'createListing.title': 'Create New Listing',
        'createListing.step': 'Step {step} of 3',
        'createListing.preview': 'Preview',
        'createListing.previewDescription': 'Preview description',
        'createListing.edit': 'Edit',
        'createListing.back': 'Back',
        'createListing.nextStep': 'Next',
        'createListing.publish': 'Publish',
        'createListing.backToEdit': 'Back to Edit',
        'createListing.itemTitle': 'Title',
        'createListing.price': 'Price',
        'createListing.currency': 'Currency',
        'createListing.description': 'Description',
        'createListing.location': 'Location',
        'filters.new': 'new',
        'filters.used': 'used',
        'categories.electronics': 'Electronics',
        'categories.fashion': 'Fashion',
      }
      let text = translations[key] || key
      if (params) {
        Object.entries(params).forEach(([k, v]) => {
          text = text.replace(`{${k}}`, String(v))
        })
      }
      return text
    },
    router: {
      push: vi.fn(),
    },
  }),
}))

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

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
    },
  }),
}))

vi.mock('@/components/listing/form-steps/step-category', () => ({
  StepCategory: ({ categories, updateField }: any) => (
    <div>
      {categories?.map((cat: any) => (
        <button key={cat.id} onClick={() => updateField('category_id', cat.id)}>
          {cat.name}
        </button>
      ))}
      <button onClick={() => updateField('condition', 'new')}>new</button>
      <button onClick={() => updateField('condition', 'used')}>used</button>
    </div>
  ),
}))
vi.mock('@/components/listing/form-steps/step-details', () => ({
  StepDetails: () => <div data-testid="step-details">Step Details Form</div>,
}))
vi.mock('@/components/listing/form-steps/step-images', () => ({
  StepImages: () => <div data-testid="step-images">Step Images Form</div>,
}))

vi.mock('@/components/listing/listing-preview', () => ({
  ListingPreview: () => <div data-testid="listing-preview">Listing Preview</div>,
}))

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
      const electronicsButton = screen.getByText('Electronics')
      fireEvent.click(electronicsButton)
      expect(mockUpdateField).toHaveBeenCalledWith('category_id', '1')
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
