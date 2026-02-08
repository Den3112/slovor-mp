'use client'

import { Package, Eye, Heart, ArrowRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { TableCell, TableRow } from '@/components/ui/table'
import { useTranslation } from '@/lib/i18n'
import { Listing } from './types'

const statusConfig = {
  active: { className: 'bg-success/10 text-success border-success/20' },
  sold: { className: 'bg-muted/50 text-muted-foreground border-border/60' },
  draft: { className: 'bg-amber-500/10 text-amber-600 border-amber-500/20' },
  pending: { className: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
  rejected: {
    className: 'bg-destructive/10 text-destructive border-destructive/20',
  },
  expired: { className: 'bg-muted text-muted-foreground' },
}

interface ListingsRowProps {
  listing: Listing
  selected: boolean
  onToggle: () => void
  locale: string
}

export function ListingsRow({
  listing,
  selected,
  onToggle,
  locale,
}: ListingsRowProps) {
  const { t } = useTranslation([
    'common',
    'dashboard',
    'createListing',
    'listing',
  ])
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <TableRow
      className={cn(
        'hover:bg-accent/40 border-border/40 group border-b transition-colors',
        selected && 'bg-primary/5'
      )}
    >
      <TableCell className="w-12 px-4 py-3 text-center">
        <Checkbox
          checked={selected}
          onCheckedChange={() => onToggle()}
          className="border-border/60 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
        />
      </TableCell>
      <TableCell className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="bg-muted border-border/10 relative h-12 w-12 shrink-0 overflow-hidden rounded-2xl border">
            {listing.images?.[0] ? (
              <Image
                src={listing.images[0]}
                alt={listing.title}
                fill
                className="object-cover"
                sizes="48px"
                unoptimized
              />
            ) : (
              <Package className="text-muted-foreground/60 m-auto h-6 w-6" />
            )}
          </div>
          <div className="flex min-w-0 flex-col">
            <Link
              href={`/${locale}/listings/${listing.id}`}
              className="hover:text-primary max-w-[240px] truncate text-sm font-bold tracking-tight transition-colors"
            >
              {listing.title}
            </Link>
            <span className="text-muted-foreground/50 text-[10px] font-bold tracking-widest uppercase">
              {isMounted
                ? new Date(listing.created_at).toLocaleDateString()
                : '...'}
            </span>
          </div>
        </div>
      </TableCell>
      <TableCell className="px-6 py-4">
        <div className="flex flex-col">
          <span className="font-heading text-base font-bold tracking-tight">
            {listing.price} {listing.currency}
          </span>
          <span className="text-muted-foreground/60 text-[10px] font-bold tracking-widest uppercase">
            {t('createListing:price')}
          </span>
        </div>
      </TableCell>
      <TableCell className="px-6 py-4">
        <Badge
          className={cn(
            'rounded-sm border px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase shadow-sm',
            statusConfig[listing.status as keyof typeof statusConfig]?.className
          )}
        >
          {t(`listing:status.${listing.status}`)}
        </Badge>
      </TableCell>
      <TableCell className="px-6 py-4 text-right">
        <div className="text-muted-foreground flex items-center justify-end gap-2">
          <div className="flex min-w-[50px] items-center justify-end gap-1">
            <Eye className="text-muted-foreground/60 h-4 w-4" />
            <span className="text-xs leading-none font-bold">
              {listing.views_count || 0}
            </span>
          </div>
          <div className="flex min-w-[50px] items-center justify-end gap-1">
            <Heart className="text-muted-foreground/60 h-4 w-4" />
            <span className="text-xs leading-none font-bold">
              {listing.favorites_count || 0}
            </span>
          </div>
        </div>
      </TableCell>
      <TableCell className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="border-border/60 hover:bg-primary/5 hover:text-primary hover:border-primary/20 h-8 rounded-lg text-[9px] font-bold tracking-widest uppercase"
          >
            <Link href={`/${locale}/post?edit=${listing.id}`}>
              {t('common:edit')}
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="hover:bg-primary/10 hover:text-primary h-8 w-8 rounded-lg transition-all"
          >
            <Link href={`/${locale}/listings/${listing.id}`}>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}
