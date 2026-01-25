import { sk } from './locales/sk'
import { cs } from './locales/cs'
import { en } from './locales/en'

export const translations = {
  sk,
  cs,
  en,
} as const

export type Locale = keyof typeof translations
export type TranslationKeys = typeof translations.en
