'use client'

import { useCurrency } from '@/components/providers/currency-provider'

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
    showOriginal = false
}: PriceDisplayProps) {
    const { formatPrice, currency } = useCurrency()

    const formattedPrice = formatPrice(amount, baseCurrency)
    const isConverted = currency !== baseCurrency

    return (
        <span className={className}>
            {formattedPrice}
            {showOriginal && isConverted && (
                <span className="ml-1 text-xs text-muted-foreground">
                    (~{amount.toLocaleString()} {baseCurrency})
                </span>
            )}
        </span>
    )
}
