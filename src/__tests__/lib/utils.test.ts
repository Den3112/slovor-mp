import { describe, it, expect } from 'vitest'
import { cn, formatDate, formatPrice } from '@/lib/utils'

describe('cn utility', () => {
  it('merges class names correctly', () => {
    const result = cn('flex', 'items-center')
    expect(result).toBe('flex items-center')
  })

  it('handles conditional classes', () => {
    const isActive = true
    const result = cn('base-class', isActive && 'active-class')
    expect(result).toBe('base-class active-class')
  })

  it('handles tailwind merge correctly', () => {
    // Later class should override earlier conflicting class
    const result = cn('p-4', 'p-2')
    expect(result).toBe('p-2')
  })

  it('handles falsy values', () => {
    const result = cn('base', false && 'nope', undefined, null, 'valid')
    expect(result).toBe('base valid')
  })

  it('merges complex tailwind classes', () => {
    const result = cn('bg-red-500', 'bg-blue-500')
    expect(result).toBe('bg-blue-500')
  })
})

describe('formatDate', () => {
  it('formats date in Slovak lang', () => {
    const date = '2024-12-25T10:00:00Z'
    const result = formatDate(date)
    expect(result).toContain('25')
    expect(result).toContain('2024')
  })

  it('handles different date formats', () => {
    const date = '2025-01-15'
    const result = formatDate(date)
    expect(result).toContain('15')
    expect(result).toContain('2025')
  })

  it('returns formatted date string', () => {
    const date = '2024-06-01T12:00:00Z'
    const result = formatDate(date)
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })
})

describe('formatPrice', () => {
  it('formats price in EUR by default', () => {
    const result = formatPrice(100)
    expect(result).toContain('100')
    // Check for EUR symbol (€) - using regex to handle encoding
    expect(result).toMatch(/€/)
  })

  it('formats price with custom currency', () => {
    const result = formatPrice(50, 'USD')
    expect(result).toContain('50')
    // sk-SK lang formats USD as "50 USD" not "$50"
    expect(result).toMatch(/USD|\$/)
  })

  it('handles whole numbers', () => {
    const result = formatPrice(999)
    expect(result).toContain('999')
    expect(result).toMatch(/€/)
  })

  it('handles decimal values', () => {
    const result = formatPrice(49.99)
    // formatPrice rounds to integers
    expect(result).toContain('50')
  })

  it('handles zero price', () => {
    const result = formatPrice(0)
    expect(result).toContain('0')
    expect(result).toMatch(/€/)
  })

  it('handles large numbers', () => {
    const result = formatPrice(1000000)
    expect(result).toContain('1')
    expect(result).toContain('000')
  })
})
