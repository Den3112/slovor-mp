// Currency types for Slovor Marketplace

export type CurrencyCode = 'EUR' | 'USD' | 'CZK' | 'PLN' | 'UAH' | 'GBP'

export interface Currency {
  code: CurrencyCode
  name: string
  symbol: string
  locale: string
}

export const CURRENCIES: Record<CurrencyCode, Currency> = {
  EUR: { code: 'EUR', name: 'Euro', symbol: '€', locale: 'de-DE' },
  USD: { code: 'USD', name: 'US Dollar', symbol: '$', locale: 'en-US' },
  CZK: { code: 'CZK', name: 'Czech Koruna', symbol: 'Kč', locale: 'cs-CZ' },
  PLN: { code: 'PLN', name: 'Polish Złoty', symbol: 'zł', locale: 'pl-PL' },
  UAH: { code: 'UAH', name: 'Ukrainian Hryvnia', symbol: '₴', locale: 'uk-UA' },
  GBP: { code: 'GBP', name: 'British Pound', symbol: '£', locale: 'en-GB' },
}

export const DEFAULT_CURRENCY: CurrencyCode = 'EUR'

// Country to currency mapping
export const COUNTRY_CURRENCY_MAP: Record<string, CurrencyCode> = {
  SK: 'EUR', // Slovakia
  AT: 'EUR', // Austria
  DE: 'EUR', // Germany
  FR: 'EUR', // France
  IT: 'EUR', // Italy
  ES: 'EUR', // Spain
  NL: 'EUR', // Netherlands
  BE: 'EUR', // Belgium
  PT: 'EUR', // Portugal
  IE: 'EUR', // Ireland
  FI: 'EUR', // Finland
  GR: 'EUR', // Greece
  CZ: 'CZK', // Czech Republic
  PL: 'PLN', // Poland
  GB: 'GBP', // United Kingdom
  US: 'USD', // United States
}

export interface ExchangeRates {
  base: CurrencyCode
  rates: Partial<Record<CurrencyCode, number>>
  updatedAt: string
}

export interface GeoLocation {
  country: string
  countryCode: string
  city: string
  currency: CurrencyCode
}

// Fallback exchange rates (EUR base)
export const FALLBACK_RATES: Record<CurrencyCode, number> = {
  EUR: 1,
  USD: 1.08,
  CZK: 25.2,
  PLN: 4.32,
  UAH: 40.5,
  GBP: 0.86,
}
