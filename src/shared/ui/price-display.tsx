'use client'

import { useMemo } from 'react'
import { useCurrency } from '@/app/providers/currency-provider'
import { useMounted } from '@/shared/lib/hooks/use-mounted'

interface PriceDisplayProps {
  amount: number
  baseCurrency?: string
  className?: string
  showOriginal?: boolean
}

export function PriceDisplay({
  amount,
  baseCurrency = 'EUR',
  className = '',
  showOriginal = false,
}: PriceDisplayProps) {
  const { formatPrice, currency, isLoading } = useCurrency()
  const mounted = useMounted()

  const isConverted = useMemo(
    () => currency !== baseCurrency,
    [currency, baseCurrency]
  )

  const formattedPrice = useMemo(() => {
    if (!mounted || isLoading) return null

    if (isConverted) {
      console.debug(
        `[PriceDisplay] Currency conversion triggered: ${baseCurrency} -> ${currency}`
      )
    }

    return formatPrice(amount, baseCurrency)
  }, [
    amount,
    baseCurrency,
    formatPrice,
    mounted,
    isLoading,
    isConverted,
    currency,
  ])

  // On server and initial render, show simple format to avoid hydration mismatch
  if (!mounted || isLoading) {
    const simplePrice = Math.round(amount)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, '\u00A0') // Using non-breaking space

    return (
      <span className={className} suppressHydrationWarning>
        {simplePrice}&nbsp;{baseCurrency}
      </span>
    )
  }

  return (
    <span className={className} suppressHydrationWarning>
      {formattedPrice}
      {showOriginal && isConverted && (
        <span
          className="text-muted-foreground ml-1 text-xs"
          suppressHydrationWarning
        >
          (~{amount.toLocaleString()} {baseCurrency})
        </span>
      )}
    </span>
  )
}
