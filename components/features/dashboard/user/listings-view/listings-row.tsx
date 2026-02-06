'use client'

import { Package, Eye, Heart, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TableCell, TableRow } from '@/components/ui/table'
import { useTranslation } from '@/lib/i18n'
import { Listing } from './types'

const statusConfig = {
    active: { className: 'bg-success/10 text-success border-success/20' },
    sold: { className: 'bg-muted/50 text-muted-foreground border-border/60' },
    draft: { className: 'bg-amber-500/10 text-amber-600 border-amber-500/20' },
    pending: { className: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
    rejected: { className: 'bg-destructive/10 text-destructive border-destructive/20' },
    expired: { className: 'bg-muted text-muted-foreground' }
}

interface ListingsRowProps {
    listing: Listing;
    selected: boolean;
    onToggle: () => void;
    locale: string;
}

export function ListingsRow({ listing, selected, onToggle, locale }: ListingsRowProps) {
    const { t } = useTranslation(['common', 'dashboard', 'createListing', 'listings'])

    return (
        <TableRow className={cn("hover:bg-accent/40 border-b border-border/40 transition-colors group", selected && "bg-primary/5")}>
            <TableCell className="w-12 px-4 py-3 text-center">
                <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-border/60 bg-background accent-primary cursor-pointer"
                    checked={selected}
                    onChange={onToggle}
                />
            </TableCell>
            <TableCell className="px-4 py-3">
                <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-[16px] bg-muted border border-border/10">
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
                            <Package className="m-auto h-6 w-6 text-muted-foreground/40" />
                        )}
                    </div>
                    <div className="flex flex-col min-w-0">
                        <Link href={`/${locale}/listings/${listing.id}`} className="font-bold text-sm tracking-tight hover:text-primary transition-colors truncate max-w-[240px]">
                            {listing.title}
                        </Link>
                        <span className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest">{new Date(listing.created_at).toLocaleDateString()}</span>
                    </div>
                </div>
            </TableCell>
            <TableCell className="px-6 py-4">
                <div className="flex flex-col">
                    <span className="font-heading text-base font-bold tracking-tight">{listing.price} {listing.currency}</span>
                    <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">{t('createListing:price')}</span>
                </div>
            </TableCell>
            <TableCell className="px-6 py-4">
                <Badge className={cn("rounded-sm px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest border shadow-sm", statusConfig[listing.status as keyof typeof statusConfig]?.className)}>
                    {t(`listings:status.${listing.status}`)}
                </Badge>
            </TableCell>
            <TableCell className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2 text-muted-foreground">
                    <div className="flex items-center gap-1 min-w-[50px] justify-end">
                        <Eye className="h-4 w-4 text-muted-foreground/40" />
                        <span className="text-xs font-bold leading-none">{listing.views_count || 0}</span>
                    </div>
                    <div className="flex items-center gap-1 min-w-[50px] justify-end">
                        <Heart className="h-4 w-4 text-muted-foreground/40" />
                        <span className="text-xs font-bold leading-none">{listing.favorites_count || 0}</span>
                    </div>
                </div>
            </TableCell>
            <TableCell className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                    <Button variant="outline" size="sm" asChild className="h-8 rounded-xl text-[9px] font-bold uppercase tracking-widest border-border/60 hover:bg-primary/5 hover:text-primary hover:border-primary/20">
                        <Link href={`/${locale}/post?edit=${listing.id}`}>{t('common:edit')}</Link>
                    </Button>
                    <Button variant="ghost" size="icon" asChild className="h-8 w-8 rounded-xl hover:bg-primary/10 hover:text-primary transition-all">
                        <Link href={`/${locale}/listings/${listing.id}`}>
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </TableCell>
        </TableRow>
    )
}
