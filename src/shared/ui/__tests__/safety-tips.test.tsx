import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SafetyTips } from '@/entities/listing/ui/details/safety-tips'

// Mock useTranslation
vi.mock('@/shared/lib/i18n', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

describe('SafetyTips', () => {
  it('renders safety tips heading', () => {
    render(<SafetyTips />)
    expect(screen.getByText('listing:safetyTips')).toBeInTheDocument()
  })

  it('renders all safety tips', () => {
    render(<SafetyTips />)
    expect(screen.getByText('Osobné stretnutie')).toBeInTheDocument()
    expect(screen.getByText('Platba pri prevzatí')).toBeInTheDocument()
    expect(screen.getByText('Buďte obozretní')).toBeInTheDocument()
  })

  it('renders footer warning message', () => {
    render(<SafetyTips />)
    expect(
      screen.getByText(/Slovor marketplace nikdy nežiada vaše údaje/)
    ).toBeInTheDocument()
  })
})
