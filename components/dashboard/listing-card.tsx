'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Edit, Trash2, Eye, Clock, Power, AlertTriangle } from 'lucide-react'
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
    isLoading
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
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                        <AlertTriangle className="h-6 w-6 text-destructive" />
                    </div>
                    <DialogTitle className="text-xl font-bold">Delete Listing?</DialogTitle>
                    <DialogDescription asChild>
                        <div className="space-y-3">
                            <p>
                                Are you sure you want to delete <strong className="text-foreground">&quot;{title}&quot;</strong>?
                            </p>
                            <p className="rounded-xl bg-destructive/5 p-3 text-sm text-destructive">
                                ⚠️ This action cannot be undone. The listing will be permanently removed.
                            </p>
                        </div>
                    </DialogDescription>
                </DialogHeader>

                <div className="flex gap-3 mt-4">
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

export function DashboardListingCard({ listing, priority = false }: DashboardListingCardProps) {
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

    const getStatusColor = (isActive: boolean) => {
        return isActive
            ? 'bg-green-500/10 text-green-600'
            : 'bg-yellow-500/10 text-yellow-600'
    }

    return (
        <>
            <div className="group relative flex items-center gap-4 rounded-2xl border border-border/40 bg-card p-3 transition-all hover:bg-muted/30 hover:border-primary/20 max-w-full overflow-hidden">
                {/* Clickable Image Thumbnail */}
                <Link href={`/listings/${listing.id}`} className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-muted">
                    {listing.images?.[0] ? (
                        <Image
                            src={listing.images[0]}
                            alt={listing.title}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                            unoptimized
                            priority={priority}
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                            <Eye className="h-8 w-8 opacity-20" />
                        </div>
                    )}
                </Link>

                {/* Clickable Info */}
                <Link href={`/listings/${listing.id}`} className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span className={cn(
                            "rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider",
                            getStatusColor(listing.is_active)
                        )}>
                            {listing.is_active ? 'Active' : 'Inactive'}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1" suppressHydrationWarning>
                            <Clock className="h-3 w-3" />
                            {new Date(listing.created_at).toLocaleDateString()}
                        </span>
                    </div>

                    <h3 className="truncate font-heading text-lg font-bold group-hover:text-primary transition-colors">
                        {listing.title || 'Untitled Listing'}
                    </h3>

                    <div className="flex items-center gap-4 mt-1">
                        <PriceDisplay
                            amount={listing.price}
                            baseCurrency={listing.currency}
                            className="font-bold text-primary"
                        />
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <Eye className="h-3 w-3" /> {listing.views || 0} views
                        </div>
                    </div>
                </Link>

                {/* Actions */}
                <div className="flex items-center gap-1">
                    <Link href={`/post?edit=${listing.id}`}>
                        <Button size="icon" variant="ghost" className="h-9 w-9 text-muted-foreground hover:text-primary" title="Edit">
                            <Edit className="h-4 w-4" />
                        </Button>
                    </Link>

                    {/* Toggle Active/Inactive */}
                    <Button
                        size="icon"
                        variant="ghost"
                        className={cn(
                            "h-9 w-9",
                            listing.is_active
                                ? "text-green-500 hover:text-yellow-500"
                                : "text-yellow-500 hover:text-green-500"
                        )}
                        onClick={handleToggleActive}
                        disabled={isToggling}
                        title={listing.is_active ? "Deactivate" : "Activate"}
                    >
                        <Power className="h-4 w-4" />
                    </Button>

                    {/* Delete */}
                    <Button
                        size="icon"
                        variant="ghost"
                        className="h-9 w-9 text-muted-foreground hover:text-destructive"
                        onClick={() => setShowDeleteModal(true)}
                        disabled={isDeleting}
                        title="Delete"
                    >
                        <Trash2 className="h-4 w-4" />
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
