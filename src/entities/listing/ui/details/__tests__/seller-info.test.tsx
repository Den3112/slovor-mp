import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SellerInfoCard } from '@/entities/listing/ui/details/seller-info'

// Mock useTranslation
vi.mock('@/shared/lib/i18n', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    locale: 'en',
  }),
}))

describe('SellerInfoCard', () => {
  const mockSeller = {
    id: 'user-1',
    display_name: 'John Doe',
    avatar_url: 'https://example.com/avatar.jpg',
    created_at: '2022-06-01T12:00:00Z',
    verified: true,
  }

  it('renders seller name and avatar', () => {
    render(<SellerInfoCard seller={mockSeller as any} />)

    expect(screen.getByText('John Doe')).toBeInTheDocument()
    // Test that the link has the correct href
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/en/seller/user-1')
  })

  it('shows verified badge when seller is verified', () => {
    render(<SellerInfoCard seller={mockSeller as any} />)

    expect(screen.getByText('trust:verified')).toBeInTheDocument()
  })

  it('shows member since year', () => {
    render(<SellerInfoCard seller={mockSeller as any} />)

    expect(screen.getByText(/2022/)).toBeInTheDocument()
    expect(screen.getByText(/seller:memberSince/)).toBeInTheDocument()
  })

  it('shows anonymous status if name missing', () => {
    const anonSeller = { ...mockSeller, display_name: null }
    render(<SellerInfoCard seller={anonSeller as any} />)

    expect(screen.getByText('Anonymous Seller')).toBeInTheDocument()
  })
})
