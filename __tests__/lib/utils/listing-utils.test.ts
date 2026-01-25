import { describe, it, expect } from 'vitest'
import {
  getLocalizedTitle,
  getLocalizedDescription,
} from '@/lib/utils/listing-utils'

describe('listing-utils utility', () => {
  const mockListing = {
    title: 'Default Title',
    title_sk: 'SK Title',
    title_cs: 'CS Title',
    title_en: 'EN Title',
    description: 'Default Desc',
    description_sk: 'SK Desc',
    description_cs: 'CS Desc',
    description_en: 'EN Desc',
  } as any

  describe('getLocalizedTitle', () => {
    it('returns SK title', () =>
      expect(getLocalizedTitle(mockListing, 'sk')).toBe('SK Title'))
    it('returns CS title', () =>
      expect(getLocalizedTitle(mockListing, 'cs')).toBe('CS Title'))
    it('returns EN title', () =>
      expect(getLocalizedTitle(mockListing, 'en')).toBe('EN Title'))
    it('falls back to default title', () => {
      const l = { title: 'Default' } as any
      expect(getLocalizedTitle(l, 'sk')).toBe('Default')
    })
  })

  describe('getLocalizedDescription', () => {
    it('returns SK desc', () =>
      expect(getLocalizedDescription(mockListing, 'sk')).toBe('SK Desc'))
    it('returns CS desc', () =>
      expect(getLocalizedDescription(mockListing, 'cs')).toBe('CS Desc'))
    it('returns EN desc', () =>
      expect(getLocalizedDescription(mockListing, 'en')).toBe('EN Desc'))
    it('falls back to default desc', () => {
      const l = { description: 'Default' } as any
      expect(getLocalizedDescription(l, 'en')).toBe('Default')
    })
  })
})
