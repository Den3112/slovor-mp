'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'
import {
  CURRENCIES,
  DEFAULT_CURRENCY,
  FALLBACK_RATES,
  type CurrencyCode,
  type Currency,
  type GeoLocation,
} from '@/lib/types/currency'
import { useAuth } from '@/components/providers/auth-provider'
import { createClient } from '@/lib/supabase/client'

interface CurrencyContextType {
  currency: CurrencyCode
  currencies: typeof CURRENCIES
  setCurrency: (code: CurrencyCode) => void
  formatPrice: (amount: number, baseCurrency?: string) => string
  convertPrice: (
    amount: number,
    from?: CurrencyCode,
    to?: CurrencyCode
  ) => number
  rates: Partial<Record<CurrencyCode, number>>
  geoLocation: GeoLocation | null
  isLoading: boolean
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined
)

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [currency, setCurrencyState] = useState<CurrencyCode>(DEFAULT_CURRENCY)
  const [rates, setRates] =
    useState<Partial<Record<CurrencyCode, number>>>(FALLBACK_RATES)
  const [geoLocation, setGeoLocation] = useState<GeoLocation | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load user's preferred currency from profile
  useEffect(() => {
    const loadPreference = async () => {
      if (!user?.id) return

      try {
        const supabase = createClient()
        // Use maybeSingle to avoid 406 Not Acceptable if multiple rows (shouldn't happen on ID PK)
        const { data, error } = await supabase
          .from('profiles')
          .select('preferred_currency')
          .eq('id', user.id)
          .maybeSingle()

        if (error) {
          // Check for 400 specifically or just ignore
          if (error.code === 'PGRST116') {
            // No data returned, ignore
          } else {
            // console.warn('Supabase profile fetch error (ignored):', error)
          }
          return
        }

        if (data?.preferred_currency) {
          setCurrencyState(data.preferred_currency as CurrencyCode)
        }
      } catch {
        // Silently ignore all network/parsing errors to prevent console noise
      }
    }

    loadPreference()
  }, [user])

  // Load exchange rates
  useEffect(() => {
    fetch('/api/exchange-rates')
      .then((res) => res.json())
      .then((data) => {
        if (data.rates) {
          setRates(data.rates)
        }
      })
      .catch(console.error)
  }, [])

  // Load geo location (only if no user preference)
  useEffect(() => {
    if (!user) {
      fetch('/api/geo')
        .then((res) => res.json())
        .then((data: GeoLocation) => {
          setGeoLocation(data)
          // Only set currency from geo if user hasn't set preference
          const stored = localStorage.getItem('preferred_currency')
          if (!stored) {
            setCurrencyState(data.currency)
          } else {
            setCurrencyState(stored as CurrencyCode)
          }
          setIsLoading(false)
        })
        .catch(() => {
          setIsLoading(false)
        })
    } else {
      setIsLoading(false)
    }
  }, [user])

  // Set currency and save to profile/localStorage
  const setCurrency = useCallback(
    async (code: CurrencyCode) => {
      setCurrencyState(code)
      localStorage.setItem('preferred_currency', code)

      if (user) {
        const supabase = createClient()
        await supabase
          .from('profiles')
          .update({ preferred_currency: code })
          .eq('id', user.id)
      }
    },
    [user]
  )

  // Convert price from one currency to another
  const convertPrice = useCallback(
    (
      amount: number,
      from: CurrencyCode = 'EUR',
      to: CurrencyCode = currency
    ): number => {
      if (from === to) return amount

      // Convert to EUR first, then to target
      const fromRate = rates[from] || 1
      const toRate = rates[to] || 1

      const inEur = amount / fromRate
      return inEur * toRate
    },
    [currency, rates]
  )

  // Format price with currency symbol
  const formatPrice = useCallback(
    (amount: number, baseCurrency: string = 'EUR'): string => {
      const converted = convertPrice(
        amount,
        baseCurrency as CurrencyCode,
        currency
      )
      const currencyInfo: Currency = CURRENCIES[currency]

      return new Intl.NumberFormat(currencyInfo.locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits:
          currency === 'EUR' || currency === 'USD' || currency === 'GBP'
            ? 2
            : 0,
      }).format(converted)
    },
    [currency, convertPrice]
  )

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        currencies: CURRENCIES,
        setCurrency,
        formatPrice,
        convertPrice,
        rates,
        geoLocation,
        isLoading,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider')
  }
  return context
}
