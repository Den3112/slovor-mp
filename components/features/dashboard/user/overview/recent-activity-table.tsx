import Link from 'next/link'
import Image from 'next/image'
import { Package, ArrowRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { ru, enUS, sk, cs } from 'date-fns/locale'
import { useTranslation } from '@/lib/i18n'
import { RecentActivityTableProps } from './types'

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export function RecentActivityTable({ listings }: RecentActivityTableProps) {
  const { t, locale } = useTranslation(['common', 'dashboard', 'createListing'])
  const [isMounted, setIsMounted] = useState(false)

  const dateLocale =
    locale === 'ru' ? ru :
      locale === 'sk' ? sk :
        locale === 'cs' ? cs :
          enUS

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge
            variant="outline"
            className="border-emerald-500/20 bg-emerald-500/5 text-emerald-600 shadow-[0_0_8px] shadow-emerald-500/10 hover:bg-emerald-500/10"
          >
            {t('dashboard:active')}
          </Badge>
        )
      case 'pending':
        return (
          <Badge
            variant="outline"
            className="border-amber-500/20 bg-amber-500/5 text-amber-600 shadow-[0_0_8px] shadow-amber-500/10 hover:bg-amber-500/10"
          >
            {t('dashboard:pending')}
          </Badge>
        )
      case 'sold':
        return (
          <Badge
            variant="outline"
            className="border-blue-500/20 bg-blue-500/5 text-blue-600 shadow-[0_0_8px] shadow-blue-500/10 hover:bg-blue-500/10"
          >
            {t('dashboard:sold')}
          </Badge>
        )
      default:
        return (
          <Badge
            variant="outline"
            className="border-zinc-500/20 bg-zinc-500/5 text-zinc-500"
          >
            {status}
          </Badge>
        )
    }
  }

  return (
    <motion.div variants={item}>
      <Card className="border-border/40 bg-card overflow-hidden rounded-lg shadow-sm transition-all duration-300 hover:shadow-md">
        <CardHeader className="border-border/10 bg-muted/5 flex flex-row items-center justify-between space-y-0 border-b px-6 py-4">
          <CardTitle className="text-muted-foreground text-[10px] font-bold tracking-[0.2em] uppercase">
            {t('dashboard:recentActivity')}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="hover:bg-primary/5 hover:text-primary transition-colors"
          >
            <Link
              href={`/${locale}/dashboard/listings`}
              className="gap-2 text-[10px] font-bold tracking-widest uppercase"
            >
              {t('common:viewAll')} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {listings && listings.length > 0 ? (
            <div className="overflow-x-auto">
              {/* Mobile View (Cards) */}
              <div className="md:hidden space-y-4 p-4">
                {listings.slice(0, 5).map((listing) => (
                  <div key={listing.id} className="bg-card border-border/40 rounded-lg border p-4 space-y-3 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="bg-muted border-border/10 relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border">
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
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-sm truncate leading-tight mb-0.5">
                            <Link href={`/${locale}/listings/${listing.id}`} className="hover:text-primary transition-colors">
                              {listing.title}
                            </Link>
                          </h4>
                          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">
                            {isMounted ? format(new Date(listing.created_at), 'PP', { locale: dateLocale }) : '...'}
                          </p>
                        </div>
                      </div>
                      <div className="shrink-0">
                        {getStatusBadge(
                          listing.status ||
                          (listing.is_active ? 'active' : 'inactive')
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-border/40 pt-3 mt-3">
                      <span className="font-heading text-lg font-bold tracking-tight">
                        {listing.price} {listing.currency}
                      </span>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="border-border/60 hover:bg-primary/5 hover:text-primary hover:border-primary/20 h-8 rounded-lg px-3 text-[10px] font-bold tracking-widest uppercase"
                        >
                          <Link href={`/${locale}/post?edit=${listing.id}`}>
                            {t('common:edit')}
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          asChild
                          className="hover:bg-primary/10 hover:text-primary h-8 w-8 rounded-lg"
                        >
                          <Link href={`/${locale}/listings/${listing.id}`}>
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop View (Table) */}
              <Table className="hidden md:table">
                <TableHeader>
                  <TableRow className="bg-muted/5 border-border/10 border-b hover:bg-transparent">
                    <TableHead className="text-muted-foreground/50 h-10 px-6 text-[10px] font-bold tracking-widest uppercase">
                      {t('createListing:title')}
                    </TableHead>
                    <TableHead className="text-muted-foreground/50 h-10 px-6 text-[10px] font-bold tracking-widest uppercase">
                      {t('dashboard:dateListed')}
                    </TableHead>
                    <TableHead className="text-muted-foreground/50 h-10 px-6 text-[10px] font-bold tracking-widest uppercase">
                      {t('createListing:price')}
                    </TableHead>
                    <TableHead className="text-muted-foreground/50 h-10 px-6 text-[10px] font-bold tracking-widest uppercase">
                      {t('dashboard:status')}
                    </TableHead>
                    <TableHead className="text-muted-foreground/50 h-10 px-6 text-right text-[10px] font-bold tracking-widest uppercase">
                      {t('common:actions')}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {listings.slice(0, 5).map((listing) => (
                    <TableRow
                      key={listing.id}
                      className="hover:bg-muted/40 group border-border/10 hover:border-l-primary border-b border-l-2 border-l-transparent transition-all duration-200"
                    >
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="bg-muted border-border/10 relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border">
                            {listing.images?.[0] ? (
                              <Image
                                src={listing.images[0]}
                                alt={listing.title}
                                fill
                                className="object-cover"
                                sizes="40px"
                                unoptimized
                              />
                            ) : (
                              <Package className="text-muted-foreground/40 m-auto h-5 w-5" />
                            )}
                          </div>
                          <Link
                            href={`/${locale}/listings/${listing.id}`}
                            className="hover:text-primary max-w-[200px] truncate text-sm font-bold transition-colors"
                          >
                            {listing.title}
                          </Link>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <span className="text-muted-foreground/70 text-[11px] font-bold tracking-widest uppercase">
                          {isMounted ? format(new Date(listing.created_at), 'PP', { locale: dateLocale }) : '...'}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <span className="font-heading text-sm font-bold tracking-tight">
                          {listing.price} {listing.currency}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        {getStatusBadge(
                          listing.status ||
                          (listing.is_active ? 'active' : 'inactive')
                        )}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="border-border/60 hover:bg-primary/5 hover:text-primary hover:border-primary/20 h-7 rounded-lg px-3 text-[9px] font-bold tracking-widest uppercase"
                          >
                            <Link href={`/${locale}/post?edit=${listing.id}`}>
                              {t('common:edit')}
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            asChild
                            className="hover:bg-primary/10 hover:text-primary h-7 w-7 rounded-lg"
                          >
                            <Link href={`/${locale}/listings/${listing.id}`}>
                              <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex h-48 flex-col items-center justify-center p-6 text-center">
              <div className="bg-muted mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                <Package className="text-muted-foreground/40 h-6 w-6" />
              </div>
              <p className="text-muted-foreground mb-4 text-xs font-bold tracking-widest uppercase">
                {t('dashboard:noListingsYet')}
              </p>
              <Button
                variant="outline"
                size="sm"
                asChild
                className="border-border/60 rounded-lg text-[10px] font-bold tracking-widest uppercase"
              >
                <Link href={`/${locale}/post`}>
                  {t('createListing:publish')}
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
