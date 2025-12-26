import { describe, it, expect } from 'vitest'
import { cn } from '@/lib/utils'

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

  it('removes false/undefined/null values', () => {
    const result = cn('base', false && 'nope', undefined, null, 'valid')
    expect(result).toBe('base valid')
  })

  it('handles tailwind merge correctly', () => {
    // Later class should override earlier conflicting class
    const result = cn('p-4', 'p-2')
    expect(result).toBe('p-2')
  })

  it('merges complex tailwind classes', () => {
    const result = cn('bg-red-500', 'bg-blue-500')
    expect(result).toBe('bg-blue-500')
  })
})
