import { describe, it, expect } from 'vitest'
import {
  getLocalizedTitle,
  getLocalizedDescription,
} from '@/lib/utils/listing-utils'

const base = {
  title: 'Default',
  description: 'Default desc',
  title_sk: 'SK title',
  description_sk: 'SK desc',
  title_en: 'EN title',
  description_en: 'EN desc',
}

describe('listing-utils', () => {
  it('returns localized title for sk', () => {
    expect(getLocalizedTitle(base as any, 'sk')).toBe('SK title')
  })

  it('falls back to default title when locale missing', () => {
    const item = { ...base }
    delete (item as any).title_cs
    expect(getLocalizedTitle(item as any, 'cs')).toBe('Default')
  })

  it('returns localized description for en', () => {
    expect(getLocalizedDescription(base as any, 'en')).toBe('EN desc')
  })
})
