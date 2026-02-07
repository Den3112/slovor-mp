'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Edit, Trash2, Power, AlertTriangle, Eye, Calendar } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import type { Listing } from '@/lib/types/database'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useParams } from 'next/navigation'
import { PriceDisplay } from '@/components/ui/price-display'

interface DashboardListingCardProps {
  listing: Listing & { category?: { name: string } | null }
  priority?: boolean
}

// Delete Confirmation Modal using Radix Dialog
function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  isLoading,
}: {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  isLoading: boolean
}) {
  const { t } = useTranslation(['dashboard', 'common'])
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="bg-destructive/10 mb-4 flex h-12 w-12 items-center justify-center rounded-full">
            <AlertTriangle className="text-destructive h-6 w-6" />
          </div>
          <DialogTitle className="text-xl font-bold">
            {t('dashboard:deleteListingTitle')}
          </DialogTitle>
          <DialogDescription asChild>
            <div className="space-y-3">
              <p>{t('dashboard:deleteListingConfirm', { title })}</p>
              <p className="bg-destructive/5 text-destructive flex items-center gap-2 rounded-lg p-3 text-sm">
                <AlertTriangle className="h-4 w-4" />
                {t('dashboard:deleteListingWarning')}
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onClose}
            disabled={isLoading}
          >
            {t('common:cancel')}
          </Button>
          <Button
            variant="destructive"
            className="flex-1"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? t('dashboard:deleting') : t('dashboard:deleteForever')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function DashboardListingCard({
  listing,
  priority = false,
}: DashboardListingCardProps) {
  const router = useRouter()
  const params = useParams()
  const locale = (params?.locale as string) || 'en'
  const { t } = useTranslation(['dashboard', 'common'])
  const [isDeleting, setIsDeleting] = useState(false)
  const [isToggling, setIsToggling] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Toggle active/inactive status
  const handleToggleActive = async () => {
    setIsToggling(true)
    const supabase = createClient()

    const { error } = await supabase
      .from('listings')
      .update({ status: listing.status === 'active' ? 'draft' : 'active' })
      .eq('id', listing.id)

    if (!error) {
      router.refresh()
    }
    setIsToggling(false)
  }

  // Permanent delete
  const handleDelete = async () => {
    setIsDeleting(true)
    const supabase = createClient()

    // Actually delete the listing from database
    const { error } = await supabase
      .from('listings')
      .delete()
      .eq('id', listing.id)

    if (!error) {
      setShowDeleteModal(false)
      router.refresh()
    }
    setIsDeleting(false)
  }

  return (
    <>
      <div className="group border-border bg-card shadow-card hover:border-primary/50 hover:bg-accent/5 relative flex flex-col items-start gap-4 rounded-2xl border p-3 transition-all duration-300 md:flex-row md:items-center md:gap-6 md:p-4">
        {/* Clickable Image Thumbnail */}
        <Link
          href={`/${locale}/listings/${listing.id}`}
          className="bg-muted group/image relative h-48 w-full shrink-0 overflow-hidden rounded-lg shadow-inner md:h-32 md:w-32"
        >
          {listing.images?.[0] ? (
            <>
              <Image
                src={listing.images[0]}
                alt={listing.title}
                fill
                className="object-cover transition-transform duration-700 group-hover/image:scale-110"
                unoptimized
                priority={priority}
              />
            </>
          ) : (
            <div className="text-muted-foreground bg-primary/5 flex h-full w-full items-center justify-center">
              <Eye className="h-10 w-10 opacity-20" />
            </div>
          )}
        </Link>

        {/* Clickable Info */}
        <Link
          href={`/${locale}/listings/${listing.id}`}
          className="w-full min-w-0 flex-1 space-y-2 px-1 py-1 md:px-0"
        >
          <div className="flex items-center gap-3">
            <span
              className={cn(
                'rounded-full border px-3 py-1 text-[10px] font-bold tracking-widest uppercase shadow-sm',
                listing.status === 'active'
                  ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-500'
                  : 'border-amber-500/20 bg-amber-500/10 text-amber-500'
              )}
            >
              {listing.status === 'active'
                ? t('dashboard:activeStatus')
                : t('dashboard:draftStatus')}
            </span>
            <span className="text-muted-foreground/60 flex items-center gap-1.5 text-xs font-medium tracking-wider uppercase">
              <Calendar className="h-3 w-3" />
              {isMounted
                ? new Date(listing.created_at).toLocaleDateString()
                : '...'}
            </span>
          </div>

          <div>
            <h3 className="font-heading text-foreground group-hover:text-primary mb-1 truncate text-xl leading-tight font-bold transition-colors duration-300 md:text-2xl">
              {listing.title || t('dashboard:unknownListing')}
            </h3>
            {listing.category?.name && (
              <p className="text-primary/60 text-[10px] font-bold tracking-widest uppercase">
                {listing.category.name}
              </p>
            )}
          </div>

          <div className="flex items-center gap-4 pt-1 md:gap-6">
            <PriceDisplay
              amount={listing.price}
              baseCurrency={listing.currency}
              className="text-foreground text-xl font-bold tracking-tighter md:text-2xl"
            />
            <div className="text-muted-foreground/70 flex items-center gap-1.5 rounded-lg border border-white/5 bg-white/5 px-2.5 py-1 text-[10px] font-bold">
              <Eye className="h-3 w-3" />
              <span>{listing.views_count || 0}</span>
            </div>
          </div>
        </Link>

        {/* Actions - Modern Pill Group */}
        <div className="border-border/40 bg-muted/30 mt-2 flex w-full items-center gap-2 rounded-lg border p-1 md:mt-0 md:w-auto md:border-none md:bg-transparent md:pl-4">
          <Link
            href={`/${locale}/post?edit=${listing.id}`}
            title="Edit"
            className="flex-1 md:flex-none"
          >
            <Button
              size="icon"
              variant="ghost"
              className="hover:bg-primary/20 hover:text-primary text-muted-foreground h-12 w-full rounded-lg transition-all md:w-12"
            >
              <Edit className="h-5 w-5" />
              <span className="sr-only">{t('dashboard:edit')}</span>
            </Button>
          </Link>

          {/* Toggle Active/Inactive */}
          <Button
            size="icon"
            variant="ghost"
            className={cn(
              'h-12 w-full flex-1 rounded-lg transition-all md:w-12 md:flex-none',
              listing.status === 'active'
                ? 'text-muted-foreground hover:bg-amber-500/20 hover:text-amber-500'
                : 'text-muted-foreground hover:bg-emerald-500/20 hover:text-emerald-500'
            )}
            onClick={handleToggleActive}
            disabled={isToggling}
            title={listing.status === 'active' ? 'Deactivate' : 'Activate'}
          >
            <Power className="h-5 w-5" />
            <span className="sr-only">
              {listing.status === 'active' ? 'Deactivate' : 'Activate'}
            </span>
          </Button>

          {/* Delete */}
          <Button
            size="icon"
            variant="ghost"
            className="text-muted-foreground hover:bg-destructive/20 hover:text-destructive h-12 w-full flex-1 rounded-lg transition-all md:w-12 md:flex-none"
            onClick={() => setShowDeleteModal(true)}
            disabled={isDeleting}
            title="Delete"
          >
            <Trash2 className="h-5 w-5" />
            <span className="sr-only">{t('dashboard:delete')}</span>
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title={listing.title || 'Untitled Listing'}
        isLoading={isDeleting}
      />
    </>
  )
}
