import {
  COUNTRY_CURRENCY_MAP,
  DEFAULT_CURRENCY,
  type CurrencyCode,
} from '@/lib/types/currency'

export interface GeoData {
  status: string
  country: string
  countryCode: string
  city: string
  currency: CurrencyCode
}

export const FALLBACK_GEO: GeoData = {
  status: 'success',
  country: 'Slovakia',
  countryCode: 'SK',
  city: 'Bratislava',
  currency: 'EUR' as CurrencyCode,
}

export async function getGeoByIp(ip: string | null): Promise<GeoData> {
  // Mock for Test/Dev environments where external API might fail or be slow
  if (process.env.NODE_ENV === 'test') {
    return FALLBACK_GEO
  }

  const isLocal =
    !ip ||
    ip === '127.0.0.1' ||
    ip === '::1' ||
    ip.startsWith('192.168.') ||
    ip.startsWith('10.')

  // API URL: If local, query own IP (no param). If remote, query that IP.
  const apiUrl = isLocal
    ? 'http://ip-api.com/json/?fields=status,country,countryCode,city,query'
    : `http://ip-api.com/json/${ip}?fields=status,country,countryCode,city`

  try {
    const response = await fetch(apiUrl, {
      next: { revalidate: 3600 }, // Cache less aggressively (1 hour)
    })

    if (!response.ok) {
      throw new Error('Geo API failed')
    }

    const data = await response.json()

    if (data.status !== 'success') {
      throw new Error('Geo lookup failed')
    }

    const currency: CurrencyCode =
      COUNTRY_CURRENCY_MAP[
      data.countryCode as keyof typeof COUNTRY_CURRENCY_MAP
      ] || DEFAULT_CURRENCY

    return {
      status: 'success',
      country: data.country,
      countryCode: data.countryCode,
      city: data.city,
      currency,
    }
  } catch (error) {
    console.warn(`Geo lookup failed for IP ${ip}:`, error)
    return FALLBACK_GEO
  }
}
