import Link from 'next/link';
import Image from 'next/image';
import { Package, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils/cn';
import { useTranslation } from '@/lib/i18n';
import { RecentActivityTableProps } from './types';

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export function RecentActivityTable({ listings }: RecentActivityTableProps) {
    const { t, locale } = useTranslation(['common', 'dashboard', 'createListing']);

    return (
        <motion.div variants={item}>
            <Card className="border-border/60 shadow-sm overflow-hidden rounded-xl">
                <CardHeader className="border-b border-border/40 bg-muted/20 px-6 py-4 flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                        {t('dashboard:recentActivity')}
                    </CardTitle>
                    <Button variant="ghost" size="sm" asChild className="hover:bg-primary/5 hover:text-primary transition-colors">
                        <Link href={`/${locale}/dashboard/listings`} className="gap-2 text-[10px] font-bold uppercase tracking-widest">
                            {t('common:viewAll')} <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                    </Button>
                </CardHeader>
                <CardContent className="p-0">
                    {listings && listings.length > 0 ? (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent bg-muted/20 border-b border-border/40">
                                        <TableHead className="px-6 h-10 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">{t('createListing:title')}</TableHead>
                                        <TableHead className="px-6 h-10 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">{t('createListing:price')}</TableHead>
                                        <TableHead className="px-6 h-10 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">{t('dashboard:status')}</TableHead>
                                        <TableHead className="px-6 h-10 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50 text-right">{t('common:actions')}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {listings.slice(0, 5).map((listing) => (
                                        <TableRow key={listing.id} className="hover:bg-accent/40 transition-colors group border-b border-border/10">
                                            <TableCell className="px-6 py-4">
                                                <div className="flex items-center gap-4">
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
                                                        <Link href={`/${locale}/listings/${listing.id}`} className="font-bold text-sm hover:text-primary transition-colors truncate max-w-[240px]">
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
                                                <div className="flex items-center gap-2">
                                                    <div className={cn(
                                                        "h-1.5 w-1.5 rounded-full animate-pulse",
                                                        listing.is_active ? "bg-emerald-500" : "bg-zinc-500"
                                                    )} />
                                                    <span className="text-[10px] font-bold uppercase tracking-widest">
                                                        {listing.is_active ? t('dashboard:active') : t('dashboard:inactive')}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button variant="outline" size="sm" asChild className="h-8 rounded-xl text-[9px] font-bold uppercase tracking-widest border-border/60 hover:bg-primary/5 hover:text-primary hover:border-primary/20">
                                                        <Link href={`/${locale}/post?edit=${listing.id}`}>Edit</Link>
                                                    </Button>
                                                    <Button variant="ghost" size="icon" asChild className="h-8 w-8 rounded-xl hover:bg-primary/10 hover:text-primary">
                                                        <Link href={`/${locale}/listings/${listing.id}`}>
                                                            <ArrowRight className="h-4 w-4" />
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
                        <div className="flex h-48 flex-col items-center justify-center text-center p-6">
                            <div className="bg-muted h-12 w-12 rounded-full flex items-center justify-center mb-4">
                                <Package className="h-6 w-6 text-muted-foreground/40" />
                            </div>
                            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">{t('dashboard:noListingsYet')}</p>
                            <Button variant="outline" size="sm" asChild className="rounded-xl border-border/60 text-[10px] font-bold uppercase tracking-widest">
                                <Link href={`/${locale}/post`}>{t('createListing:publish')}</Link>
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}
