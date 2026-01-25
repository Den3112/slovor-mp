import { sk } from './locales/sk'
import { cs } from './locales/cs'
import { en } from './locales/en'

export const translations = {
  sk,
  cs,
  en,
}

export type Locale = keyof typeof translations
export type TranslationKeys = typeof en
