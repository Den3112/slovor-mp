'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Edit, Trash2, Clock, Power, AlertTriangle, Eye } from 'lucide-react'
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
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
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
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="bg-destructive/10 mb-4 flex h-12 w-12 items-center justify-center rounded-full">
            <AlertTriangle className="text-destructive h-6 w-6" />
          </div>
          <DialogTitle className="text-xl font-bold">
            Delete Listing?
          </DialogTitle>
          <DialogDescription asChild>
            <div className="space-y-3">
              <p>
                Are you sure you want to delete{' '}
                <strong className="text-foreground">&quot;{title}&quot;</strong>
                ?
              </p>
              <p className="bg-destructive/5 text-destructive rounded-xl p-3 text-sm">
                ⚠️ This action cannot be undone. The listing will be permanently
                removed.
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
            Cancel
          </Button>
          <Button
            variant="destructive"
            className="flex-1"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Deleting...' : 'Delete Forever'}
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
  const [isDeleting, setIsDeleting] = useState(false)
  const [isToggling, setIsToggling] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  // Toggle active/inactive status
  const handleToggleActive = async () => {
    setIsToggling(true)
    const supabase = createClient()

    const { error } = await supabase
      .from('listings')
      .update({ is_active: !listing.is_active })
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
      <div className="group hover:shadow-primary/5 hover:border-primary/20 relative flex flex-col items-start gap-4 rounded-4xl border border-white/10 bg-white/5 p-3 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/10 hover:shadow-2xl md:flex-row md:items-center md:gap-6 md:p-4">
        {/* Clickable Image Thumbnail */}
        <Link
          href={`/listings/${listing.id}`}
          className="bg-muted group/image relative h-48 w-full flex-shrink-0 overflow-hidden rounded-3xl shadow-inner md:h-32 md:w-32 md:rounded-2xl"
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
              <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent opacity-60 transition-opacity md:opacity-0" />
            </>
          ) : (
            <div className="text-muted-foreground bg-primary/5 flex h-full w-full items-center justify-center">
              <Eye className="h-10 w-10 opacity-20" />
            </div>
          )}
        </Link>

        {/* Clickable Info */}
        <Link
          href={`/listings/${listing.id}`}
          className="w-full min-w-0 flex-1 space-y-2 px-1 py-1 md:px-0"
        >
          <div className="flex items-center gap-3">
            <span
              className={cn(
                'rounded-full border px-3 py-1 text-[10px] font-black tracking-widest uppercase shadow-sm',
                listing.is_active
                  ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-500'
                  : 'border-amber-500/20 bg-amber-500/10 text-amber-500'
              )}
            >
              {listing.is_active ? 'Active' : 'Inactive'}
            </span>
            <span className="text-muted-foreground flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase opacity-60">
              <Clock className="h-3 w-3" />
              {new Date(listing.created_at).toLocaleDateString()}
            </span>
          </div>

          <div>
            <h3 className="font-heading text-foreground group-hover:text-primary mb-1 truncate text-xl leading-tight font-black transition-colors duration-300 md:text-2xl">
              {listing.title || 'Untitled Listing'}
            </h3>
            {listing.category?.name && (
              <p className="text-primary/60 text-[10px] font-black tracking-widest uppercase">
                {listing.category.name}
              </p>
            )}
          </div>

          <div className="flex items-center gap-4 pt-1 md:gap-6">
            <PriceDisplay
              amount={listing.price}
              baseCurrency={listing.currency}
              className="text-foreground text-xl font-black tracking-tighter md:text-2xl"
            />
            <div className="text-muted-foreground/70 flex items-center gap-1.5 rounded-lg border border-white/5 bg-white/5 px-2.5 py-1 text-[10px] font-bold">
              <Eye className="h-3 w-3" />
              <span>{listing.views || 0}</span>
            </div>
          </div>
        </Link>

        {/* Actions - Modern Pill Group */}
        <div className="mt-2 flex w-full items-center gap-2 rounded-2xl border-white/5 bg-black/5 p-1 md:mt-0 md:w-auto md:border-l md:bg-transparent md:pl-4">
          <Link
            href={`/post?edit=${listing.id}`}
            title="Edit"
            className="flex-1 md:flex-none"
          >
            <Button
              size="icon"
              variant="ghost"
              className="hover:bg-primary/20 hover:text-primary text-muted-foreground h-12 w-full rounded-xl transition-all md:w-12"
            >
              <Edit className="h-5 w-5" />
              <span className="sr-only">Edit</span>
            </Button>
          </Link>

          {/* Toggle Active/Inactive */}
          <Button
            size="icon"
            variant="ghost"
            className={cn(
              'h-12 w-full flex-1 rounded-xl transition-all md:w-12 md:flex-none',
              listing.is_active
                ? 'text-muted-foreground hover:bg-amber-500/20 hover:text-amber-500'
                : 'text-muted-foreground hover:bg-emerald-500/20 hover:text-emerald-500'
            )}
            onClick={handleToggleActive}
            disabled={isToggling}
            title={listing.is_active ? 'Deactivate' : 'Activate'}
          >
            <Power className="h-5 w-5" />
            <span className="sr-only">
              {listing.is_active ? 'Deactivate' : 'Activate'}
            </span>
          </Button>

          {/* Delete */}
          <Button
            size="icon"
            variant="ghost"
            className="text-muted-foreground hover:bg-destructive/20 hover:text-destructive h-12 w-full flex-1 rounded-xl transition-all md:w-12 md:flex-none"
            onClick={() => setShowDeleteModal(true)}
            disabled={isDeleting}
            title="Delete"
          >
            <Trash2 className="h-5 w-5" />
            <span className="sr-only">Delete</span>
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
