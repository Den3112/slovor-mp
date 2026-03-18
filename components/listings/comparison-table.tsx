'use client'

import { Check, X, Info } from 'lucide-react'
import Image from 'next/image'
import { CompareItem } from '@/hooks/use-compare'
import { PriceDisplay } from '@/components/ui/price-display'
import { cn } from '@/lib/utils'

interface ComparisonTableProps {
  items: CompareItem[]
}

export function ComparisonTable({ items }: ComparisonTableProps) {
  if (items.length === 0) return null

  // Extract all unique feature keys
  const featureKeys = Array.from(
    new Set(items.flatMap((item) => Object.keys(item.features)))
  )

  const isDifferent = (key: string) => {
    const values = items.map((item) => item.features[key])
    return new Set(values).size > 1
  }

  return (
    <div className="bg-card/30 overflow-x-auto rounded-4xl border shadow-2xl backdrop-blur-xl">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="bg-muted/20 min-w-[200px] border-r border-b p-6 text-left">
              <div className="flex flex-col">
                <span className="text-2xl font-bold">Porovnanie</span>
                <span className="text-muted-foreground mt-1 text-xs font-bold tracking-widest uppercase">
                  {items.length} produkty
                </span>
              </div>
            </th>
            {items.map((item) => (
              <th
                key={item.id}
                className="min-w-[250px] border-b p-6 align-top"
              >
                <div className="flex flex-col space-y-4">
                  <div className="relative aspect-video overflow-hidden rounded-2xl border shadow-sm">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="bg-muted flex h-full w-full items-center justify-center">
                        <Info className="text-muted-foreground/20 h-8 w-8" />
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <h3 className="line-clamp-2 text-sm font-bold">
                      {item.title}
                    </h3>
                    <PriceDisplay
                      amount={item.price}
                      className="text-primary text-lg font-bold"
                    />
                  </div>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Main Info */}
          <tr>
            <td className="text-muted-foreground bg-muted/10 border-r p-4 text-xs font-bold tracking-widest uppercase">
              Kategória
            </td>
            {items.map((item) => (
              <td key={item.id} className="border-b p-4 text-sm font-medium">
                {item.category}
              </td>
            ))}
          </tr>

          {/* Dynamic Features */}
          {featureKeys.map((key) => {
            const highlight = isDifferent(key)
            return (
              <tr key={key} className={cn(highlight && 'bg-primary/5')}>
                <td className="text-muted-foreground bg-muted/10 relative border-r border-b p-4 text-xs font-bold tracking-widest uppercase">
                  {key}
                  {highlight && (
                    <div className="bg-primary absolute top-1/2 -left-1 h-8 w-1 -translate-y-1/2 rounded-full" />
                  )}
                </td>
                {items.map((item) => {
                  const val = item.features[key]
                  return (
                    <td key={item.id} className="border-b p-4 text-sm">
                      {typeof val === 'boolean' ? (
                        val ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <X className="h-4 w-4 text-red-500" />
                        )
                      ) : (
                        <span
                          className={cn(highlight && 'text-primary font-bold')}
                        >
                          {val || '-'}
                        </span>
                      )}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>

      <div className="bg-primary/5 flex items-center space-x-3 p-6">
        <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full">
          <Info className="h-4 w-4" />
        </div>
        <p className="text-muted-foreground text-xs font-medium italic">
          Riadky zvýraznené{' '}
          <span className="text-primary font-bold">farbou</span> označujú
          rozdiely medzi vybranými produktmi.
        </p>
      </div>
    </div>
  )
}
