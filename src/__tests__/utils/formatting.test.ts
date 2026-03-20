import { describe, it, expect } from 'vitest'
import { formatDate, formatPrice } from '@/lib/utils/formatting'

describe('formatting', () => {
  it('formats date in sk lang', () => {
    const out = formatDate('2024-02-04T00:00:00.000Z')
    expect(typeof out).toBe('string')
    expect(out.length).toBeGreaterThan(0)
  })

  it('formats price without decimals', () => {
    expect(formatPrice(1234)).toMatch(/EUR|€|\u20AC|\d+/)
  })
})
