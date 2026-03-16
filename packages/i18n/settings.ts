export const fallbackLng = 'en'
export const languages = ['en', 'sk', 'cs']
export const defaultNS = ['common', 'home']
export const cookieName = 'i18next'

export function getOptions(
  lng = fallbackLng,
  ns: string | string[] = defaultNS
) {
  return {
    // debug: true,
    supportedLngs: languages,
    fallbackLng,
    lng,
    fallbackNS: defaultNS,
    defaultNS,
    ns,
  }
}
