'use client'

import {
  MoreHorizontal,
  SquarePen,
  Trash2,
  Eye,
  TrendingUp,
} from 'lucide-react'
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
  const { t, locale } = useTranslation(['common', 'dashboard'])

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
          asChild
          variant="outline"
          size="sm"
          className="border-primary/20 bg-primary/5 text-primary hover:bg-primary hidden h-8 gap-2 rounded-xl px-3 text-[10px] font-bold tracking-widest uppercase transition-all hover:text-white sm:flex"
        >
          <Link href={`/${locale}/listings/${listing.id}/promote`}>
            <TrendingUp className="h-3.5 w-3.5" />
            {t('dashboard:promote.title') || 'Promote'}
          </Link>
        </Button>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="text-muted-foreground hover:text-foreground hover:border-border/60 h-8 w-8 rounded-xl border border-transparent p-0 transition-all"
          >
            <span className="sr-only">{t('common:openMenu')}</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="border-border/60 w-[180px] rounded-xl p-1.5 shadow-xl"
        >
          <DropdownMenuItem
            asChild
            className="h-10 cursor-pointer rounded-xl px-3"
          >
            <Link href={`/${locale}/listings/${listing.id}`} target="_blank">
              <Eye className="text-muted-foreground mr-2 h-4 w-4" />
              <span className="text-[11px] font-bold tracking-wider uppercase">
                {t('common:view')}
              </span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            asChild
            className="h-10 cursor-pointer rounded-xl px-3"
          >
            <Link href={`/${locale}/post?edit=${listing.id}`}>
              <SquarePen className="text-muted-foreground mr-2 h-4 w-4" />
              <span className="text-[11px] font-bold tracking-wider uppercase">
                {t('common:edit')}
              </span>
            </Link>
          </DropdownMenuItem>

          {listing.status === 'active' && (
            <DropdownMenuItem
              asChild
              className="text-primary bg-primary/5 focus:bg-primary h-10 cursor-pointer rounded-xl px-3 focus:text-white"
            >
              <Link href={`/${locale}/listings/${listing.id}/promote`}>
                <TrendingUp className="mr-2 h-4 w-4" />
                <span className="text-[11px] font-bold tracking-widest uppercase">
                  {t('dashboard:promote.title') || 'Promote'}
                </span>
              </Link>
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator className="bg-border/40 my-1.5" />
          <DropdownMenuItem
            onClick={handleDelete}
            className="text-destructive focus:bg-destructive/10 focus:text-destructive h-10 cursor-pointer rounded-xl px-3"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span className="text-[11px] font-bold tracking-wider uppercase">
              {t('common:delete')}
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
