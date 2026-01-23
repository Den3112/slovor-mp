import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  translateText,
  isTranslationEnabled,
  generateListingTranslations,
} from '@/lib/services/translation'

describe('translation service', () => {
  const originalEnv = process.env

  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
    vi.stubGlobal('console', {
      ...console,
      warn: vi.fn(),
      error: vi.fn(),
    })
    process.env = { ...originalEnv }
  })

  afterEach(() => {
    vi.restoreAllMocks()
    process.env = originalEnv
  })

  describe('isTranslationEnabled', () => {
    it('returns true if API key is set', () => {
      process.env.DEEPL_API_KEY = 'test-key'
      expect(isTranslationEnabled()).toBe(true)
    })

    it('returns false if API key is missing', () => {
      delete process.env.DEEPL_API_KEY
      delete process.env.NEXT_PUBLIC_DEEPL_API_KEY
      expect(isTranslationEnabled()).toBe(false)
    })
  })

  describe('translateText', () => {
    it('returns original text if API key is missing', async () => {
      delete process.env.DEEPL_API_KEY
      const result = await translateText('hello', 'sk')
      expect(result).toBe('hello')
      expect(console.warn).toHaveBeenCalled()
    })

    it('returns original text if text is empty', async () => {
      const result = await translateText('', 'sk')
      expect(result).toBe('')
    })

    it('returns original text if source and target are the same', async () => {
      const result = await translateText('hello', 'en', 'en')
      expect(result).toBe('hello')
    })

    it('calls DeepL API and returns translated text on success', async () => {
      process.env.DEEPL_API_KEY = 'test-key'
      const mockResponse = {
        ok: true,
        json: async () => ({
          translations: [{ text: 'ahoj' }],
        }),
      }
        ; (fetch as any).mockResolvedValue(mockResponse)

      const result = await translateText('hello', 'sk', 'en')
      expect(result).toBe('ahoj')
      expect(fetch).toHaveBeenCalledWith(
        'https://api-free.deepl.com/v2/translate',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            Authorization: 'DeepL-Auth-Key test-key',
          }),
        })
      )
    })

    it('handles DeepL API errors and returns original text', async () => {
      process.env.DEEPL_API_KEY = 'test-key'
      const mockResponse = {
        ok: false,
        text: async () => 'Quota exceeded',
      }
        ; (fetch as any).mockResolvedValue(mockResponse)

      const result = await translateText('hello', 'sk')
      expect(result).toBe('hello')
      expect(console.error).toHaveBeenCalled()
    })
  })

  describe('generateListingTranslations', () => {
    it('uses original text only if translation is disabled', async () => {
      delete process.env.DEEPL_API_KEY
      const result = await generateListingTranslations('Title', 'Desc', 'en')
      expect(result.title_en).toBe('Title')
      expect(result.title_sk).toBe('Title')
      expect(result.description_en).toBe('Desc')
      expect(result.description_sk).toBe('Desc')
    })

    it('translates to all locales when enabled', async () => {
      process.env.DEEPL_API_KEY = 'test-key'
        ; (fetch as any).mockImplementation(async (_url: string, options: any) => {
          const body = JSON.parse(options.body)
          const target = body.target_lang
          return {
            ok: true,
            json: async () => ({
              translations: [{ text: `trans-${target}` }],
            }),
          }
        })

      const result = await generateListingTranslations('Title', 'Desc', 'en')
      expect(result.title_en).toBe('Title') // source
      expect(result.title_sk).toBe('trans-SK')
      expect(result.title_cs).toBe('trans-CS')
      expect(result.description_en).toBe('Desc') // source
      expect(result.description_sk).toBe('trans-SK')
      expect(result.description_cs).toBe('trans-CS')
    })
  })
})
