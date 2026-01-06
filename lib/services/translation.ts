import type { Locale } from '@/lib/i18n'

/**
 * Translation Service - DeepL API Integration
 *
 * Provides automatic translation for user-generated content.
 * Supports: Slovak (SK), Czech (CS), English (EN)
 */

// DeepL language codes mapping
const DEEPL_LANG_MAP: Record<string, string> = {
    sk: 'SK',
    cs: 'CS',
    en: 'EN-GB',
}

/**
 * Check if translation service is configured
 */
export function isTranslationEnabled(): boolean {
    return Boolean(process.env.NEXT_PUBLIC_DEEPL_API_KEY) || Boolean(process.env.DEEPL_API_KEY)
}

/**
 * Translate text using DeepL API
 */
export async function translateText(
    text: string,
    targetLocale: Locale,
    sourceLocale?: Locale
): Promise<string> {
    if (!text) return ''

    // Don't translate to same language
    if (sourceLocale && sourceLocale === targetLocale) {
        return text
    }

    const apiKey = process.env.NEXT_PUBLIC_DEEPL_API_KEY || process.env.DEEPL_API_KEY

    if (!apiKey) {
        console.warn('[TranslationService] DEEPL_API_KEY not set, using original text')
        return text
    }

    try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 5000) // 5s timeout

        const response = await fetch('https://api-free.deepl.com/v2/translate', {
            method: 'POST',
            headers: {
                'Authorization': `DeepL-Auth-Key ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: [text],
                source_lang: sourceLocale ? DEEPL_LANG_MAP[sourceLocale] : undefined,
                target_lang: DEEPL_LANG_MAP[targetLocale] || targetLocale.toUpperCase(),
            }),
            signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
            const error = await response.text()
            console.error('[TranslationService] DeepL API error:', error)
            return text
        }

        const data = await response.json()
        return data.translations?.[0]?.text || text
    } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
            console.warn('[TranslationService] Translation timed out after 5s')
        } else {
            console.error('[TranslationService] Translation failed:', error)
        }
        return text
    }
}

/**
 * Generate translations for all supported locales
 * Used when creating/editing listings
 */
export async function generateListingTranslations(
    title: string,
    description: string,
    baseLocale: Locale
): Promise<{
    title_en: string
    title_sk: string
    title_cs: string
    description_en: string
    description_sk: string
    description_cs: string
}> {
    const locales: Locale[] = ['en', 'sk', 'cs']

    // If translation is not enabled, just set the source language field
    if (!isTranslationEnabled()) {
        console.warn('[TranslationService] Translation not enabled, using source text only')
        return {
            title_en: baseLocale === 'en' ? title : '',
            title_sk: baseLocale === 'sk' ? title : '',
            title_cs: baseLocale === 'cs' ? title : '',
            description_en: baseLocale === 'en' ? description : '',
            description_sk: baseLocale === 'sk' ? description : '',
            description_cs: baseLocale === 'cs' ? description : '',
        }
    }

    // Translate title and description to all target languages in parallel
    const [titleTranslations, descTranslations] = await Promise.all([
        Promise.all(
            locales.map(async (locale) => ({
                locale,
                text: locale === baseLocale
                    ? title
                    : await translateText(title, locale, baseLocale),
            }))
        ),
        Promise.all(
            locales.map(async (locale) => ({
                locale,
                text: locale === baseLocale
                    ? description
                    : await translateText(description, locale, baseLocale),
            }))
        ),
    ])

    return {
        title_en: titleTranslations.find(t => t.locale === 'en')?.text || '',
        title_sk: titleTranslations.find(t => t.locale === 'sk')?.text || '',
        title_cs: titleTranslations.find(t => t.locale === 'cs')?.text || '',
        description_en: descTranslations.find(t => t.locale === 'en')?.text || '',
        description_sk: descTranslations.find(t => t.locale === 'sk')?.text || '',
        description_cs: descTranslations.find(t => t.locale === 'cs')?.text || '',
    }
}
