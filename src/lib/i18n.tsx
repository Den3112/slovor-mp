'use client'

import { useTranslation as useNewTranslation } from '@/packages/i18n/client'

// Import ALL namespaces to build the complete schema
import about from '@/packages/i18n/locales/en/about.json'
import admin from '@/packages/i18n/locales/en/admin.json'
import auth from '@/packages/i18n/locales/en/auth.json'
import categories from '@/packages/i18n/locales/en/categories.json'
import common from '@/packages/i18n/locales/en/common.json'
import contact from '@/packages/i18n/locales/en/contact.json'
import createListing from '@/packages/i18n/locales/en/createListing.json'
import dashboard from '@/packages/i18n/locales/en/dashboard.json'
import faq from '@/packages/i18n/locales/en/faq.json'
import filters from '@/packages/i18n/locales/en/filters.json'
import footer from '@/packages/i18n/locales/en/footer.json'
import home from '@/packages/i18n/locales/en/home.json'
import listing from '@/packages/i18n/locales/en/listing.json'
import messages from '@/packages/i18n/locales/en/messages.json'
import orders from '@/packages/i18n/locales/en/orders.json'
import pagination from '@/packages/i18n/locales/en/pagination.json'
import profile from '@/packages/i18n/locales/en/profile.json'
import profile_preview from '@/packages/i18n/locales/en/profile_preview.json'
import purchases from '@/packages/i18n/locales/en/purchases.json'
import reports from '@/packages/i18n/locales/en/reports.json'
import reviews from '@/packages/i18n/locales/en/reviews.json'
import seller from '@/packages/i18n/locales/en/seller.json'
import trust from '@/packages/i18n/locales/en/trust.json'
import verification from '@/packages/i18n/locales/en/verification.json'
import wallet from '@/packages/i18n/locales/en/wallet.json'

const schema: any = {
  about,
  admin,
  auth,
  categories,
  common,
  contact,
  createListing,
  dashboard,
  faq,
  filters,
  footer,
  home,
  listing,
  messages,
  orders,
  pagination,
  profile,
  profile_preview,
  purchases,
  reports,
  reviews,
  seller,
  trust,
  verification,
  wallet,
}

export function useTranslation(ns?: string | string[]) {
  // If no namespace provided, we might want to load 'common' by default,
  // OR we rely on the component knowing what it wants.
  // However, the proxy hides the dependency, so we should arguably load ALL/Common if we can?
  // For now, we trust legacy code behavior or defaults.
  const { t: i18nextT, i18n } = useNewTranslation(ns)

  // Recursive Proxy to emulate the old object structure AND handle dot-notation strings
  const createProxy = (path: string[] = [], currentSchema: any = schema) => {
    // If we're at a function call t('key') or t('ns.key')
    const proxyFn: any = (keyOrOptions: string | object, options?: any) => {
      if (typeof keyOrOptions === 'string') {
        const fullKey =
          path.length > 0 ? [...path, keyOrOptions].join('.') : keyOrOptions

        // SUPPORT LEGACY: Detect if key starts with a namespace (e.g. "common.allListings")
        const parts = fullKey.split('.')
        // If the first part is a known namespace in our schema
        if (parts.length > 1 && parts[0] && schema[parts[0]]) {
          const namespace = parts[0]
          const realKey = parts.slice(1).join('.')
          // Pass explicit namespace to i18next
          return i18nextT(realKey, { ...options, ns: namespace })
        }

        return i18nextT(fullKey, options)
      } else {
        // t(options) usage
        return i18nextT(path.join('.'), keyOrOptions as any)
      }
    }

    return new Proxy(proxyFn, {
      get: (_target, prop: string) => {
        // Special props
        if (prop === 'then' || prop === 'toJSON') return undefined

        // Calculate new path and schema
        const newPath = [...path, prop]
        const nextSchema = currentSchema ? currentSchema[prop] : undefined

        // If next schema node is a string (leaf translation), or undefined (missing key),
        // we assume it is the end of the chain and execute the translation.
        // For existing keys (string), we can optimize:
        if (typeof nextSchema === 'string') {
          // It's a leaf.
          // Check if root was a namespace
          if (newPath.length > 1 && newPath[0] && schema[newPath[0]]) {
            const ns = newPath[0]
            const key = newPath.slice(1).join('.')
            return i18nextT(key, { ns })
          }

          return i18nextT(newPath.join('.'))
        }

        // If we are deep but nextSchema is undefined, it might be a dynamic key not in schema.
        // We continue building the proxy path, hoping i18next resolves it.
        // However, if we are at root and prop is 'common', nextSchema IS defined.

        // Return recursive proxy
        return createProxy(newPath, nextSchema)
      },
    })
  }

  return {
    locale: i18n.language || 'en',
    setLocale: (lng: string) => i18n.changeLanguage(lng),
    t: createProxy() as any,
    i18n,
  }
}

export { I18nProvider } from './i18n/index'
export type { Locale } from './i18n/index'
