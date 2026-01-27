import { createInstance } from 'i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import { initReactI18next } from 'react-i18next/initReactI18next'
import { getOptions, languages, fallbackLng } from './settings'

const initI18next = async (lng: string, ns: string | string[]) => {
  const i18nInstance = createInstance()
  await i18nInstance
    .use(initReactI18next)
    .use(resourcesToBackend((language: string, namespace: string) => import(`./locales/${language}/${namespace}.json`)))
    .init(getOptions(lng, ns))
  return i18nInstance
}

export async function useTranslation(lng: string, ns: string | string[], options: any = {}) {
  // If lng is not provided or invalid, stick to fallback
  const locale = languages.includes(lng) ? lng : fallbackLng;
  const i18nextInstance = await initI18next(locale, ns)
  return {
    t: i18nextInstance.getFixedT(locale, Array.isArray(ns) ? ns[0] : ns, options.keyPrefix),
    i18n: i18nextInstance
  }
}
