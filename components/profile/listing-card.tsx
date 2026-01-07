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



    return (
        <>
            <div className="group relative flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-md p-3 md:p-4 transition-all duration-300 hover:bg-white/10 hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/20 hover:-translate-y-0.5">
                {/* Clickable Image Thumbnail */}
                <Link href={`/listings/${listing.id}`} className="relative h-48 w-full md:w-32 md:h-32 flex-shrink-0 overflow-hidden rounded-3xl md:rounded-2xl bg-muted shadow-inner group/image">
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
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 md:opacity-0 transition-opacity" />
                        </>
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-muted-foreground bg-primary/5">
                            <Eye className="h-10 w-10 opacity-20" />
                        </div>
                    )}
                </Link>

                {/* Clickable Info */}
                <Link href={`/listings/${listing.id}`} className="flex-1 min-w-0 py-1 space-y-2 w-full px-1 md:px-0">
                    <div className="flex items-center gap-3">
                        <span className={cn(
                            "rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest border shadow-sm",
                            listing.is_active
                                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                        )}>
                            {listing.is_active ? 'Active' : 'Inactive'}
                        </span>
                        <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1.5 opacity-60 uppercase tracking-wider">
                            <Clock className="h-3 w-3" />
                            {new Date(listing.created_at).toLocaleDateString()}
                        </span>
                    </div>

                    <div>
                        <h3 className="truncate font-heading text-xl md:text-2xl font-black text-foreground group-hover:text-primary transition-colors duration-300 mb-1 leading-tight">
                            {listing.title || 'Untitled Listing'}
                        </h3>
                        {listing.category?.name && (
                            <p className="text-[10px] font-black uppercase tracking-widest text-primary/60">
                                {listing.category.name}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-4 md:gap-6 pt-1">
                        <PriceDisplay
                            amount={listing.price}
                            baseCurrency={listing.currency}
                            className="text-xl md:text-2xl font-black text-foreground tracking-tighter"
                        />
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground/70 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
                            <Eye className="h-3 w-3" />
                            <span>{listing.views || 0}</span>
                        </div>
                    </div>
                </Link>

                {/* Actions - Modern Pill Group */}
                <div className="flex w-full md:w-auto items-center gap-2 mt-2 md:mt-0 p-1 bg-black/20 md:bg-transparent rounded-2xl md:pl-4 md:border-l border-white/5">
                    <Link href={`/post?edit=${listing.id}`} title="Edit" className="flex-1 md:flex-none">
                        <Button size="icon" variant="ghost" className="w-full md:w-12 h-12 rounded-xl hover:bg-primary/20 hover:text-primary transition-all text-muted-foreground">
                            <Edit className="h-5 w-5" />
                            <span className="sr-only">Edit</span>
                        </Button>
                    </Link>

                    {/* Toggle Active/Inactive */}
                    <Button
                        size="icon"
                        variant="ghost"
                        className={cn(
                            "flex-1 md:flex-none w-full md:w-12 h-12 rounded-xl transition-all",
                            listing.is_active
                                ? "hover:bg-amber-500/20 hover:text-amber-500 text-muted-foreground"
                                : "hover:bg-emerald-500/20 hover:text-emerald-500 text-muted-foreground"
                        )}
                        onClick={handleToggleActive}
                        disabled={isToggling}
                        title={listing.is_active ? "Deactivate" : "Activate"}
                    >
                        <Power className="h-5 w-5" />
                        <span className="sr-only">{listing.is_active ? 'Deactivate' : 'Activate'}</span>
                    </Button>

                    {/* Delete */}
                    <Button
                        size="icon"
                        variant="ghost"
                        className="flex-1 md:flex-none w-full md:w-12 h-12 rounded-xl text-muted-foreground hover:bg-destructive/20 hover:text-destructive transition-all"
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
