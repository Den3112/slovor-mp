import { describe, it, expect } from 'vitest'
import {
  getLocalizedCategoryName,
  getUniqueCategories,
} from '@/shared/lib/utils/category-i18n'

describe('category-i18n utility', () => {
  // Mock t function: returns a translation if found in internal map, or empty string (to test fallbacks)
  const mockT = (key: string, options?: any) => {
    // Simulate t('cat.electronics') -> 'Electronic Devices'
    const db: Record<string, string> = {
      'categories:electronics': 'Electronic Devices',
    }
    return db[key] || options?.defaultValue || ''
  }

  const mockCategory = {
    name: 'Electronics',
    slug: 'electronics',
    name_sk: 'Elektronika',
    name_cs: 'Elektronika CS',
    name_en: 'Electronics EN',
  } as any

  describe('getLocalizedCategoryName', () => {
    it('returns SK name if locale is sk', () => {
      expect(getLocalizedCategoryName(mockCategory, 'sk', mockT as any)).toBe(
        'Elektronika'
      )
    })

    it('returns CS name if locale is cs', () => {
      expect(getLocalizedCategoryName(mockCategory, 'cs', mockT as any)).toBe(
        'Elektronika CS'
      )
    })

    it('returns EN name if locale is en', () => {
      expect(getLocalizedCategoryName(mockCategory, 'en', mockT as any)).toBe(
        'Electronics EN'
      )
    })

    it('falls back to translation key if locale name is missing', () => {
      const cat = { slug: 'electronics' } as any
      expect(getLocalizedCategoryName(cat, 'en', mockT as any)).toBe(
        'Electronic Devices'
      )
    })

    it('falls back to default name if all else fails', () => {
      const cat = { name: 'Fallback Name', slug: 'unknown' } as any
      expect(getLocalizedCategoryName(cat, 'en', mockT as any)).toBe(
        'Fallback Name'
      )
    })

    it('capitalizes slug as final fallback', () => {
      const cat = { slug: 'unknown' } as any
      expect(getLocalizedCategoryName(cat, 'en', mockT as any)).toBe('Unknown')
    })
  })

  describe('getUniqueCategories', () => {
    it('removes duplicates based on localized name', () => {
      const categories = [
        { id: '1', slug: 'a', name_en: 'Same Name' },
        { id: '2', slug: 'b', name_en: 'Same Name' },
        { id: '3', slug: 'c', name_en: 'Different Name' },
      ] as any
      const result = getUniqueCategories(categories, 'en', mockT as any)
      expect(result).toHaveLength(2)
      expect(result[0]?.id).toBe('1')
      expect(result[1]?.id).toBe('3')
    })
  })
})
