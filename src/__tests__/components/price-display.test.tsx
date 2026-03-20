import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PriceDisplay } from '@/components/ui/price-display'

const mockFormatPrice = vi.fn((amount: number) => `${amount} EUR`)
let mockCurrency = 'EUR'
let mockIsLoading = false

vi.mock('@/components/providers/currency-provider', () => ({
  useCurrency: () => ({
    currency: mockCurrency,
    formatPrice: mockFormatPrice,
    isLoading: mockIsLoading,
  }),
}))

describe('PriceDisplay', () => {
  beforeEach(() => {
    mockCurrency = 'EUR'
    mockIsLoading = false
    mockFormatPrice.mockClear()
    mockFormatPrice.mockImplementation((amount: number) => `${amount} EUR`)
  })

  it('renders amount with currency', () => {
    render(<PriceDisplay amount={100} />)
    expect(screen.getByText(/100/)).toBeInTheDocument()
  })

  it('shows simple format before mounting or when loading', () => {
    mockIsLoading = true
    render(<PriceDisplay amount={1234} />)
    expect(screen.getByText('1 234 EUR')).toBeInTheDocument()
  })

  it('shows original price when showOriginal is true and converted', () => {
    mockCurrency = 'USD'
    mockFormatPrice.mockImplementation((amount: number) => `$${amount}`)

    render(<PriceDisplay amount={100} baseCurrency="EUR" showOriginal={true} />)
    expect(screen.getByText('$100')).toBeInTheDocument()
    expect(screen.getByText('(~100 EUR)')).toBeInTheDocument()
  })
})
