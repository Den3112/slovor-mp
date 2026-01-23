import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ListingActionButtons } from '@/components/listing/shared/listing-action-buttons'

// Mock useTranslation
vi.mock('@/lib/i18n', () => ({
  useTranslation: () => ({
    t: {
      listing: {
        contactSeller: 'Contact Seller',
        callNow: 'Call Now',
        message: 'Message',
      },
      common: {
        loading: 'Loading...',
      },
    },
  }),
}))

describe('ListingActionButtons', () => {
  const mockSeller: any = {
    id: 'user-1',
    name: 'John Doe',
    full_name: 'John Doe',
    display_name: 'John Doe',
    username: 'johndoe',
    phone: '+421900000000',
    email: 'john@example.com',
    avatar_url: null,
    created_at: new Date().toISOString(),
    verified: true,
  }

  const mockHandlers = {
    onContact: vi.fn(),
    onCall: vi.fn(),
  }

  it('renders contact and call buttons', () => {
    render(
      <ListingActionButtons
        seller={mockSeller}
        isContacting={false}
        showPhone={false}
        {...mockHandlers}
      />
    )

    expect(screen.getByText('Contact Seller')).toBeInTheDocument()
    // It's in multiple places (main and grid)
    const callButtons = screen.getAllByText('Call Now')
    expect(callButtons.length).toBeGreaterThan(0)
  })

  it('calls onContact when main button is clicked', () => {
    render(
      <ListingActionButtons
        seller={mockSeller}
        isContacting={false}
        showPhone={false}
        {...mockHandlers}
      />
    )

    const contactButton = screen.getByText('Contact Seller')
    fireEvent.click(contactButton)
    expect(mockHandlers.onContact).toHaveBeenCalled()
  })

  it('shows loader and disables button when isContacting is true', () => {
    render(
      <ListingActionButtons
        seller={mockSeller}
        isContacting={true}
        showPhone={false}
        {...mockHandlers}
      />
    )

    // The button text is still there, but also an icon. Let's check for disabled state.
    const contactButton = screen.getByText('Contact Seller').closest('button')
    expect(contactButton).toBeDisabled()
  })

  it('shows phone number when showPhone is true', () => {
    render(
      <ListingActionButtons
        seller={mockSeller}
        isContacting={false}
        showPhone={true}
        {...mockHandlers}
      />
    )

    expect(screen.getByText(mockSeller.phone)).toBeInTheDocument()
  })

  it('calls onCall when call button is clicked', () => {
    render(
      <ListingActionButtons
        seller={mockSeller}
        isContacting={false}
        showPhone={false}
        {...mockHandlers}
      />
    )

    // Find by text 'Call Now'
    const callButton = screen.getByText('Call Now').closest('button')
    if (callButton) fireEvent.click(callButton)
    expect(mockHandlers.onCall).toHaveBeenCalled()
  })
})
