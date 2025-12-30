import { cookies } from 'next/headers'
import { translations, type Locale, type TranslationKeys } from './translations'

const LOCALE_COOKIE_KEY = 'slovor-locale'

export async function getTranslationServer() {
  const cookieStore = await cookies()
  const locale = (cookieStore.get(LOCALE_COOKIE_KEY)?.value as Locale) || 'en'

  return {
    locale,
    t: translations[locale] as TranslationKeys
  }
}
