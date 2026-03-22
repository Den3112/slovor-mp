import { describe, it, expect } from 'vitest'
import {
  filterContent,
  validateListingContent,
  sanitizeContent,
} from '@/lib/moderation/content-filter'

describe('Content Filter', () => {
  describe('filterContent', () => {
    it('returns clean result for normal text', () => {
      const result = filterContent('Hello, this is a nice listing')
      expect(result.isClean).toBe(true)
      expect(result.hasProfanity).toBe(false)
      expect(result.hasSpam).toBe(false)
    })

    it('detects profanity (English)', () => {
      const result = filterContent('This is a fuck test')
      expect(result.isClean).toBe(false)
      expect(result.hasProfanity).toBe(true)
      expect(result.flaggedWords).toContain('fuck')
    })

    it('detects profanity (Slovak)', () => {
      const result = filterContent('Toto je kokot test')
      expect(result.isClean).toBe(false)
      expect(result.hasProfanity).toBe(true)
      expect(result.flaggedWords).toContain('kokot')
    })

    it('detects spam (repeated characters)', () => {
      const result = filterContent('Heeeeeeeeeeelp')
      expect(result.isClean).toBe(false)
      expect(result.hasSpam).toBe(true)
    })

    it('detects spam (all caps)', () => {
      // Pattern is \b[A-Z]{10,}\b
      // "BUY THIS NOW" doesn't have 10+ char words.
      // "EXTREMELY" is 9 chars.
      // "URGENT" is 6 chars.
      // I should use a longer word.
      const result = filterContent('THISISAVERYLONGWORDTHATISSPAM')
      expect(result.isClean).toBe(false)
      expect(result.hasSpam).toBe(true)
    })

    it('detects spam (excessive punctuation)', () => {
      const result = filterContent('Best price ever!!!!!')
      expect(result.isClean).toBe(false)
      expect(result.hasSpam).toBe(true)
    })

    it('detects spam (Telegram/WhatsApp numbers)', () => {
      const result = filterContent('Contact me on Telegram: +421944123456')
      expect(result.isClean).toBe(false)
      expect(result.hasSpam).toBe(true)
    })
  })

  describe('validateListingContent', () => {
    it('validates clean listing', () => {
      const result = validateListingContent(
        'Title',
        'Description',
        'Bratislava'
      )
      expect(result.isValid).toBe(true)
    })

    it('invalidates listing with profanity in title', () => {
      const result = validateListingContent(
        'Fuck title',
        'Description',
        'Bratislava'
      )
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('vulgárne slová')
    })

    it('invalidates listing with invalid location', () => {
      const result = validateListingContent(
        'Title',
        'Description',
        'Nonexistent City'
      )
      expect(result.isValid).toBe(false)
      // The error is "Neplatná lokalita." case sensitive check:
      expect(result.error).toMatch(/lokalita/i)
    })
  })

  describe('sanitizeContent', () => {
    it('replaces profanity with asterisks', () => {
      const sanitized = sanitizeContent('This is a fuck test')
      expect(sanitized).toBe('This is a **** test')
    })

    it('handles non-string input', () => {
      // @ts-ignore
      expect(sanitizeContent(null)).toBe(null)
      // @ts-ignore
      expect(sanitizeContent(undefined)).toBe(undefined)
      // @ts-ignore
      expect(sanitizeContent(123)).toBe(123)
    })
  })
})
