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
            <DialogContent className="sm:max-w-md bg-zinc-950 border-2 border-primary/20 rounded-none p-10 shadow-2xl">
                <DialogHeader>
                    <div className="mb-6 flex h-16 w-16 items-center justify-center border-2 border-destructive bg-destructive/10">
                        <AlertTriangle className="h-8 w-8 text-destructive" />
                    </div>
                    <DialogTitle className="font-heading text-3xl font-bold italic tracking-tight text-white">Delete Listing?</DialogTitle>
                    <DialogDescription asChild>
                        <div className="space-y-6 mt-6">
                            <p className="font-sans text-sm font-medium leading-relaxed text-zinc-500">
                                Are you sure you want to delete <strong className="text-white">&quot;{title}&quot;</strong>?
                            </p>
                            <div className="border border-destructive/20 bg-destructive/5 p-4 font-sans text-xs font-bold uppercase tracking-widest text-destructive">
                                ⚠️ This action cannot be undone.
                            </div>
                        </div>
                    </DialogDescription>
                </DialogHeader>

                <div className="flex gap-4 mt-8 pt-8 border-t-2 border-primary/10">
                    <Button
                        variant="outline"
                        className="flex-1 h-14 rounded-none border-2 border-primary/10 font-sans text-xs font-bold uppercase tracking-widest transition-all"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        className="flex-1 h-14 rounded-none font-sans text-xs font-bold uppercase tracking-widest transition-all"
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
            <div className="group relative flex flex-col md:flex-row items-start md:items-center gap-6 border-2 border-primary/10 bg-zinc-950 p-4 transition-all duration-300 hover:border-primary/40 hover:bg-zinc-900 hover:-translate-y-1">
                {/* Clickable Image Thumbnail */}
                <Link href={`/listings/${listing.id}`} className="relative h-48 w-full md:w-40 md:h-40 flex-shrink-0 overflow-hidden border-2 border-primary/10 bg-muted group/image">
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
                            <div className="absolute inset-0 bg-black/10 group-hover/image:bg-black/0 transition-colors" />
                        </>
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-zinc-800 bg-primary/5">
                            <Eye className="h-10 w-10 opacity-20" />
                        </div>
                    )}
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0 py-1 space-y-4 w-full">
                    <div className="flex items-center gap-6">
                        <span className={cn(
                            "border-2 px-3 py-1 font-sans text-[10px] font-bold uppercase tracking-widest",
                            listing.is_active
                                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                        )}>
                            {listing.is_active ? 'Active' : 'Inactive'}
                        </span>
                        <span className="font-sans text-[10px] font-bold text-zinc-500 flex items-center gap-2 uppercase tracking-[0.2em] opacity-80">
                            <Clock className="h-3.5 w-3.5" />
                            {new Date(listing.created_at).toLocaleDateString()}
                        </span>
                    </div>

                    <div>
                        <Link href={`/listings/${listing.id}`}>
                            <h3 className="truncate font-heading text-2xl font-bold italic text-white group-hover:text-primary transition-colors duration-300 mb-2">
                                {listing.title || 'Untitled Listing'}
                            </h3>
                        </Link>
                        {listing.category?.name && (
                            <p className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-primary/80">
                                {listing.category.name}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-8 pt-2">
                        <PriceDisplay
                            amount={listing.price}
                            baseCurrency={listing.currency}
                            className="text-2xl font-black text-white tracking-tight"
                        />
                        <div className="flex items-center gap-2 border-2 border-primary/10 bg-zinc-950 px-3 py-1.5 font-sans text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                            <Eye className="h-3.5 w-3.5" />
                            <span>{listing.views || 0}</span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex w-full md:w-auto items-center gap-3 mt-4 md:mt-0 p-2 md:p-0 bg-zinc-900 md:bg-transparent md:pl-6 md:border-l-2 border-primary/10">
                    <Link href={`/post?edit=${listing.id}`} title="Edit" className="flex-1 md:flex-none">
                        <Button size="icon" variant="outline" className="w-full md:w-14 h-14 rounded-none border-2 border-primary/10 bg-transparent transition-all hover:bg-primary/20 hover:border-primary hover:text-primary text-zinc-500">
                            <Edit className="h-5 w-5" />
                            <span className="sr-only">Edit</span>
                        </Button>
                    </Link>



                    {/* Toggle Active/Inactive */}
                    <Button
                        size="icon"
                        variant="outline"
                        className={cn(
                            "flex-1 md:flex-none w-full md:w-14 h-14 rounded-none border-2 transition-all",
                            listing.is_active
                                ? "border-amber-500/20 bg-transparent hover:bg-amber-500/20 hover:border-amber-500 hover:text-amber-500 text-zinc-500 font-bold"
                                : "border-emerald-500/20 bg-transparent hover:bg-emerald-500/20 hover:border-emerald-500 hover:text-emerald-500 text-zinc-500 font-bold"
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
                        variant="outline"
                        className="flex-1 md:flex-none w-full md:w-14 h-14 rounded-none border-2 border-primary/10 bg-transparent transition-all hover:bg-destructive/20 hover:border-destructive hover:text-destructive text-zinc-500"
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
