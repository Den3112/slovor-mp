'use client'

import { MoreHorizontal, SquarePen, Trash2, Eye, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useTranslation } from '@/lib/i18n'
import { listingsApi } from '@/lib/api'

interface ListingRowActionsProps {
    listing: any
}

export function ListingRowActions({ listing }: ListingRowActionsProps) {
    const router = useRouter()
    const { t } = useTranslation(['common', 'dashboard'])

    const handleDelete = async () => {
        try {
            const { error } = await listingsApi.delete(listing.id)
            if (error) throw new Error(error)
            toast.success(t('dashboard:listingDeleted'))
            router.refresh()
        } catch (error) {
            toast.error('Failed to delete listing')
        }
    }

    return (
        <div className="flex items-center gap-2">
            {listing.status === 'active' && (
                <Button
                    variant="outline"
                    size="sm"
                    className="hidden sm:flex h-8 px-3 rounded-lg border-primary/20 bg-primary/5 text-primary hover:bg-primary hover:text-white transition-all text-[10px] font-black uppercase tracking-widest gap-2"
                >
                    <TrendingUp className="h-3.5 w-3.5" />
                    {t('dashboard:promote') || 'Promote'}
                </Button>
            )}

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground border border-transparent hover:border-border/60 rounded-lg transition-all"
                    >
                        <span className="sr-only">{t('common:openMenu')}</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[180px] p-1.5 rounded-xl border-border/60 shadow-xl">
                    <DropdownMenuItem asChild className="rounded-lg h-10 px-3 cursor-pointer">
                        <Link href={`/listings/${listing.id}`} target="_blank">
                            <Eye className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span className="text-[11px] font-bold uppercase tracking-wider">{t('common:view')}</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-lg h-10 px-3 cursor-pointer">
                        <Link href={`/post?edit=${listing.id}`}>
                            <SquarePen className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span className="text-[11px] font-bold uppercase tracking-wider">{t('common:edit')}</span>
                        </Link>
                    </DropdownMenuItem>

                    {listing.status === 'active' && (
                        <DropdownMenuItem className="rounded-lg h-10 px-3 cursor-pointer text-primary bg-primary/5 focus:bg-primary focus:text-white">
                            <TrendingUp className="mr-2 h-4 w-4" />
                            <span className="text-[11px] font-black uppercase tracking-widest">{t('dashboard:promote') || 'Promote'}</span>
                        </DropdownMenuItem>
                    )}

                    <DropdownMenuSeparator className="my-1.5 bg-border/40" />
                    <DropdownMenuItem onClick={handleDelete} className="rounded-lg h-10 px-3 cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span className="text-[11px] font-bold uppercase tracking-wider">{t('common:delete')}</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
