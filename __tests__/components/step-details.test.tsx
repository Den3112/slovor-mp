import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { StepDetails } from '@/components/listing/form-steps/step-details'

// Mock useTranslation
vi.mock('@/lib/i18n', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en' },
  }),
}))

// Mock LocationCombobox
vi.mock('@/components/ui/location-combobox', () => ({
  LocationCombobox: ({ value, onChange, placeholder }: any) => (
    <input
      data-testid="location-input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  ),
}))

describe('StepDetails', () => {
  const defaultProps = {
    formData: {
      title: '',
      price: '',
      description: '',
      location: '',
      category_id: '1',
      condition: 'new',
      attributes: {},
    } as any,
    fieldErrors: {},
    updateField: vi.fn(),
    categories: [],
  }

  it('renders all form fields', () => {
    render(<StepDetails {...defaultProps} />)
    expect(screen.getByPlaceholderText(/iPhone 13/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText('0.00')).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText(/Describe your item/i)
    ).toBeInTheDocument()
    expect(screen.getByTestId('location-input')).toBeInTheDocument()
  })

  it('calls updateField when title changes', () => {
    const updateField = vi.fn()
    render(<StepDetails {...defaultProps} updateField={updateField} />)

    const input = screen.getByPlaceholderText(/iPhone 13/i)
    fireEvent.change(input, { target: { value: 'Test Title' } })
    expect(updateField).toHaveBeenCalledWith('title', 'Test Title')
  })

  it('calls updateField when price changes', () => {
    const updateField = vi.fn()
    render(<StepDetails {...defaultProps} updateField={updateField} />)

    const input = screen.getByPlaceholderText('0.00')
    fireEvent.change(input, { target: { value: '49.99' } })
    expect(updateField).toHaveBeenCalledWith('price', '49.99')
  })

  it('shows error messages', () => {
    render(
      <StepDetails
        {...defaultProps}
        fieldErrors={{ title: 'Title is required', price: 'Invalid price' }}
      />
    )
    expect(screen.getByText('Title is required')).toBeInTheDocument()
    expect(screen.getByText('Invalid price')).toBeInTheDocument()
  })
})
