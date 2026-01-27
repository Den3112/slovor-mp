import { cookies } from 'next/headers'
import { useTranslation } from '@/packages/i18n/server'
import { fallbackLng, languages } from '@/packages/i18n/settings'

const LOCALE_COOKIE_KEY = 'slovor-locale'

// Rename to satisfy hooks linter (even though it's server-side logic)
export async function getTranslationServer(ns: string | string[] = 'common') {
  const cookieStore = await cookies()
  const cookieLocale = cookieStore.get(LOCALE_COOKIE_KEY)?.value
  const locale = (languages.includes(cookieLocale as any) ? cookieLocale : fallbackLng) as string

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = await useTranslation(locale, ns)

  return {
    locale,
    t,
  }
}
