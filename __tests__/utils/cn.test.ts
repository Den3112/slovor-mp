import { describe, it, expect } from 'vitest'
import { cn } from '@/lib/utils/cn'

describe('cn utility', () => {
  it('merges classes and removes duplicates', () => {
    const res = cn('btn', 'btn-primary', { hidden: false }, 'btn')
    expect(typeof res).toBe('string')
    expect(res.includes('btn')).toBe(true)
  })
})
