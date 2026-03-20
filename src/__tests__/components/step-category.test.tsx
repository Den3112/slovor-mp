import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { StepCategory } from '@/components/listing/form-steps/step-category'

// Mock useTranslation
vi.mock('@/lib/i18n', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: any = {
        category: 'Category',
        condition: 'Condition',
        'filters:new': 'New',
        'filters:used': 'Used',
      }
      return translations[key] || key
    },
  }),
}))

describe('StepCategory', () => {
  const mockCategories = [
    { id: '1', name: 'Electronics', icon: '📱' },
    { id: '2', name: 'Fashion', icon: '👗' },
  ] as any

  const defaultProps = {
    categories: mockCategories,
    formData: { category_id: '', condition: 'used' } as any,
    fieldErrors: {},
    updateField: vi.fn(),
  }

  it('renders all categories', () => {
    render(<StepCategory {...defaultProps} />)
    expect(screen.getByText('Electronics')).toBeInTheDocument()
    expect(screen.getByText('Fashion')).toBeInTheDocument()
  })

  it('calls updateField when a category is clicked', () => {
    const updateField = vi.fn()
    render(<StepCategory {...defaultProps} updateField={updateField} />)

    fireEvent.click(screen.getByText('Electronics').closest('button')!)
    expect(updateField).toHaveBeenCalledWith('category_id', '1')
  })

  it('calls updateField when condition is clicked', () => {
    const updateField = vi.fn()
    render(<StepCategory {...defaultProps} updateField={updateField} />)

    fireEvent.click(screen.getByText('New').closest('button')!)
    expect(updateField).toHaveBeenCalledWith('condition', 'new')
  })

  it('shows error message if category_id has error', () => {
    render(
      <StepCategory
        {...defaultProps}
        fieldErrors={{ category_id: 'Required' }}
      />
    )
    expect(screen.getByText('Required')).toBeInTheDocument()
  })

  it('highlights selected category', () => {
    render(
      <StepCategory
        {...defaultProps}
        formData={{ category_id: '1', condition: 'new' } as any}
      />
    )
    const button = screen.getByText('Electronics').closest('button')
    expect(button).toHaveClass('bg-primary/5')
  })
})
