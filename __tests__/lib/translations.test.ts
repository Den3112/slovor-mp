import { describe, it, expect } from 'vitest'
import { translations } from '@/lib/i18n/translations'

describe('Translations', () => {
  it('has Slovak translations', () => {
    expect(translations.sk).toBeDefined()
  })

  it('has English translations', () => {
    expect(translations.en).toBeDefined()
  })

  it('has common translations in all locales', () => {
    expect(translations.sk.common).toBeDefined()
    expect(translations.en.common).toBeDefined()
  })

  it('has home key in common', () => {
    expect(translations.sk.common.home).toBe('Domov')
    expect(translations.en.common.home).toBe('Home')
  })

  it('has categories section', () => {
    expect(translations.sk.categories).toBeDefined()
    expect(translations.en.categories).toBeDefined()
  })

  it('has footer translations', () => {
    expect(translations.sk.footer).toBeDefined()
    expect(translations.en.footer).toBeDefined()
  })

  it('has listing translations', () => {
    expect(translations.sk.listing).toBeDefined()
    expect(translations.en.listing).toBeDefined()
  })

  it('has trust badges translations', () => {
    expect(translations.sk.trust.secure).toBe('Bezpečné')
    expect(translations.en.trust.secure).toBe('Secure')
  })
})
