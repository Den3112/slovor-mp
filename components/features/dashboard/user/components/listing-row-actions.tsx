'use client'

import { MoreHorizontal, SquarePen, Trash2, Eye } from 'lucide-react'
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
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                >
                    <span className="sr-only">{t('common:openMenu')}</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
                <DropdownMenuItem asChild>
                    <Link href={`/listings/${listing.id}`} target="_blank">
                        <Eye className="mr-2 h-3.5 w-3.5" />
                        {t('common:view')}
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href={`/edit/${listing.id}`}>
                        <SquarePen className="mr-2 h-3.5 w-3.5" />
                        {t('common:edit')}
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive">
                    <Trash2 className="mr-2 h-3.5 w-3.5" />
                    {t('common:delete')}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
