import { describe, it, expect } from 'vitest'
import { formatDate, formatPrice } from '../formatting'

describe('formatDate', () => {
  it('formats date string correctly in Slovak locale', () => {
    const date = '2024-03-29T12:00:00Z'
    const formatted = formatDate(date)
    // Expecting something like "29. marca 2024" or similar depending on the exact implementation
    expect(formatted).toMatch(/29/)
    expect(formatted).toMatch(/2024/)
  })

  it('handles invalid date strings gracefully', () => {
    const formatted = formatDate('invalid-date')
    expect(formatted).toBe('Invalid Date')
  })
})

describe('formatPrice', () => {
  it('formats EUR correctly', () => {
    expect(formatPrice(1234)).toMatch(/1\s?234/)
    expect(formatPrice(1234)).toMatch(/€/)
  })

  it('formats USD correctly', () => {
    expect(formatPrice(1234, 'USD')).toMatch(/1,234/)
    expect(formatPrice(1234, 'USD')).toMatch(/\$/)
  })

  it('handles zero', () => {
    expect(formatPrice(0)).toMatch(/0/)
  })
})
