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
        'group border-primary/5 hover:bg-primary/5 transition-all duration-500',
        selected && 'bg-primary/5'
      )}
    >
      <TableCell className="w-12 px-6 py-5 text-center">
        <Checkbox
          checked={selected}
          onCheckedChange={() => onToggle()}
          className="border-primary/20 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground h-5 w-5 rounded-md transition-all duration-300"
        />
      </TableCell>
      <TableCell className="px-6 py-5">
        <div className="flex items-center gap-4">
          <div className="bg-primary/5 border-primary/10 relative h-14 w-14 shrink-0 overflow-hidden rounded-[1rem] border shadow-inner transition-transform duration-500 group-hover:scale-110">
            {listing.images?.[0] ? (
              <Image
                src={listing.images[0]}
                alt={listing.title}
                fill
                className="object-cover"
                sizes="56px"
              />
            ) : (
              <Package className="text-primary/20 m-auto h-7 w-7" />
            )}
          </div>
          <div className="flex min-w-0 flex-col gap-1">
            <Link
              href={`/${locale}/listings/${listing.id}`}
              className="text-foreground hover:text-primary max-w-[280px] truncate text-[13px] font-black tracking-tight transition-colors"
            >
              {listing.title}
            </Link>
            <span className="text-primary/30 text-[9px] font-black tracking-[0.2em] uppercase">
              {isMounted
                ? new Date(listing.created_at).toLocaleDateString(locale, {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })
                : '...'}
            </span>
          </div>
        </div>
      </TableCell>
      <TableCell className="px-6 py-5">
        <div className="flex flex-col gap-1">
          <span className="font-heading text-foreground text-lg font-black tracking-tighter">
            {listing.price} {listing.currency}
          </span>
          <span className="text-primary/30 text-[9px] font-black tracking-widest uppercase">
            {t('createListing:price')}
          </span>
        </div>
      </TableCell>
      <TableCell className="px-6 py-5">
        <Badge
          className={cn(
            'h-5 rounded-xl border px-2 py-0 text-[8px] font-black tracking-[0.15em] uppercase shadow-sm transition-all duration-500',
            statusConfig[listing.status as keyof typeof statusConfig]?.className
          )}
        >
          {t(`listing:status.${listing.status}`)}
        </Badge>
      </TableCell>
      <TableCell className="px-6 py-5 text-right">
        <div className="text-foreground/60 flex items-center justify-end gap-3">
          <div className="group/stat hover:text-primary flex min-w-[50px] items-center justify-end gap-1.5 transition-colors">
            <Eye className="h-4 w-4 transition-transform duration-500 group-hover/stat:scale-110" />
            <span className="text-xs font-black tracking-tighter">
              {listing.views_count || 0}
            </span>
          </div>
          <div className="group/stat flex min-w-[50px] items-center justify-end gap-1.5 transition-colors hover:text-rose-500">
            <Heart className="h-4 w-4 transition-transform duration-500 group-hover/stat:scale-110" />
            <span className="text-xs font-black tracking-tighter">
              {listing.favorites_count || 0}
            </span>
          </div>
        </div>
      </TableCell>
      <TableCell className="px-6 py-5 text-right">
        <div className="flex items-center justify-end gap-3">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="hover:bg-primary border-primary/10 h-9 rounded-2xl px-5 text-[9px] font-black tracking-[0.15em] uppercase transition-all duration-500 hover:text-white active:scale-95"
          >
            <Link href={`/${locale}/post?edit=${listing.id}`}>
              {t('common:edit')}
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="hover:bg-primary/10 hover:text-primary h-9 w-9 rounded-2xl transition-all duration-500 active:scale-90"
          >
            <Link href={`/${locale}/listings/${listing.id}`}>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}
