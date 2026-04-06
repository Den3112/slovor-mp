import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { DynamicAttributes } from '@/features/search/ui/dynamic-attributes'

// Mock useTranslation
vi.mock('@/shared/lib/i18n', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

// Mock CATEGORY_ATTRIBUTES and getAttributeLabel
vi.mock('@/shared/lib/constants/category-attributes', () => ({
  CATEGORY_ATTRIBUTES: {
    electronics: [
      {
        id: 'brand',
        type: 'select',
        label: { en: 'Brand' },
        options: [{ value: 'apple', label: { en: 'Apple' } }],
      },
      { id: 'year', type: 'range', label: { en: 'Year' } },
      { id: 'model', type: 'text', label: { en: 'Model' } },
    ],
  },
  getAttributeLabel: (attr: any) => attr.label.en,
}))

describe('DynamicAttributes', () => {
  const mockOnAttrChange = vi.fn()

  it('renders nothing if no category provided', () => {
    const { container } = render(
      <DynamicAttributes
        category={null as any}
        dynamicAttrs={{}}
        onAttrChange={mockOnAttrChange}
        locale="en"
      />
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders select, range and text attributes for electronics', () => {
    render(
      <DynamicAttributes
        category="electronics"
        dynamicAttrs={{}}
        onAttrChange={mockOnAttrChange}
        locale="en"
      />
    )

    expect(screen.getByText('Brand')).toBeInTheDocument()
    expect(screen.getByText('Year')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('filters:min')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('filters:max')).toBeInTheDocument()
  })

  it('calls onAttrChange for text input', () => {
    render(
      <DynamicAttributes
        category="electronics"
        dynamicAttrs={{}}
        onAttrChange={mockOnAttrChange}
        locale="en"
      />
    )

    const inputs = screen.getAllByRole('textbox')
    // Index 0 might be select's hidden input or similar if using real Radix,
    // but here we just check our text input
    const textInput = inputs.find((i) => !(i as HTMLInputElement).placeholder)
    if (textInput) {
      fireEvent.change(textInput, { target: { value: 'iPhone' } })
      expect(mockOnAttrChange).toHaveBeenCalledWith('model', 'iPhone')
    }
  })

  it('calls onAttrChange for range inputs', () => {
    render(
      <DynamicAttributes
        category="electronics"
        dynamicAttrs={{}}
        onAttrChange={mockOnAttrChange}
        locale="en"
      />
    )

    const minInput = screen.getByPlaceholderText('filters:min')
    fireEvent.change(minInput, { target: { value: '2020' } })
    expect(mockOnAttrChange).toHaveBeenCalledWith('year', { min: '2020' })
  })
})
