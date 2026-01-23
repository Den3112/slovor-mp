import { NextResponse } from 'next/server'
import { FALLBACK_RATES, type CurrencyCode } from '@/lib/types/currency'

interface ExchangeRateApiResponse {
  result: string
  base_code: string
  conversion_rates: Record<string, number>
}

// Cache exchange rates in memory (server-side)
let cachedRates: {
  rates: Partial<Record<CurrencyCode, number>>
  timestamp: number
} | null = null

const CACHE_DURATION = 60 * 60 * 1000 // 1 hour

export async function GET() {
  try {
    // Check cache
    if (cachedRates && Date.now() - cachedRates.timestamp < CACHE_DURATION) {
      return NextResponse.json({
        base: 'EUR',
        rates: cachedRates.rates,
        updatedAt: new Date(cachedRates.timestamp).toISOString(),
        cached: true,
      })
    }

    // Fetch from exchangerate-api.com (free tier: 1500 req/month)
    // Using open.er-api.com which is free and doesn't require API key
    const response = await fetch('https://open.er-api.com/v6/latest/EUR', {
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) {
      throw new Error('Exchange rate API failed')
    }

    const data: ExchangeRateApiResponse = await response.json()

    if (data.result !== 'success' || !data.conversion_rates) {
      throw new Error('Exchange rate lookup failed')
    }

    // Extract only the currencies we support
    const rates: Partial<Record<CurrencyCode, number>> = {
      EUR: 1,
      USD: data.conversion_rates.USD ?? FALLBACK_RATES.USD,
      CZK: data.conversion_rates.CZK ?? FALLBACK_RATES.CZK,
      PLN: data.conversion_rates.PLN ?? FALLBACK_RATES.PLN,
      UAH: data.conversion_rates.UAH ?? FALLBACK_RATES.UAH,
      GBP: data.conversion_rates.GBP ?? FALLBACK_RATES.GBP,
    }

    // Update cache
    cachedRates = {
      rates,
      timestamp: Date.now(),
    }

    return NextResponse.json({
      base: 'EUR',
      rates,
      updatedAt: new Date().toISOString(),
      cached: false,
    })
  } catch (error) {
    console.warn('Exchange rate API failed, using fallback rates.')

    // Return fallback rates
    return NextResponse.json({
      base: 'EUR',
      rates: FALLBACK_RATES,
      updatedAt: new Date().toISOString(),
      fallback: true,
    })
  }
}
