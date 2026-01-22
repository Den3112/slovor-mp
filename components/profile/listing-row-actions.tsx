'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Edit, Power, Trash2, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

interface ListingRowActionsProps {
    listing: {
        id: string
        title: string
        is_active: boolean
    }
}

export function ListingRowActions({ listing }: ListingRowActionsProps) {
    const router = useRouter()
    const [isDeleting, setIsDeleting] = useState(false)
    const [isToggling, setIsToggling] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)

    const handleToggleActive = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
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

    const handleDelete = async () => {
        setIsDeleting(true)
        const supabase = createClient()

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
        <div className="flex items-center gap-2 pl-4 border-l-2 border-primary/10" onClick={(e) => e.stopPropagation()}>
            <Link href={`/post?edit=${listing.id}`} title="Edit" onClick={(e) => e.stopPropagation()}>
                <Button size="icon" variant="outline" className="h-10 w-10 rounded-none border-2 border-white/10 bg-transparent transition-all hover:bg-primary/20 hover:border-primary hover:text-primary text-zinc-500">
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                </Button>
            </Link>



            <Button
                size="icon"
                variant="outline"
                className={cn(
                    "h-10 w-10 rounded-none border-2 transition-all",
                    listing.is_active
                        ? "border-amber-500/20 bg-transparent hover:bg-amber-500/20 hover:border-amber-500 hover:text-amber-500 text-zinc-500 font-bold"
                        : "border-emerald-500/20 bg-transparent hover:bg-emerald-500/20 hover:border-emerald-500 hover:text-emerald-500 text-zinc-500 font-bold"
                )}
                onClick={handleToggleActive}
                disabled={isToggling}
                title={listing.is_active ? "Deactivate" : "Activate"}
            >
                <Power className="h-4 w-4" />
                <span className="sr-only">{listing.is_active ? 'Deactivate' : 'Activate'}</span>
            </Button>

            <Button
                size="icon"
                variant="outline"
                className="h-10 w-10 rounded-none border-2 border-white/10 bg-transparent transition-all hover:bg-destructive/20 hover:border-destructive hover:text-destructive text-zinc-500"
                onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setShowDeleteModal(true)
                }}
                disabled={isDeleting}
                title="Delete"
            >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
            </Button>

            <Dialog open={showDeleteModal} onOpenChange={(open) => {
                if (!open) setShowDeleteModal(false)
            }}>
                <DialogContent className="sm:max-w-md bg-zinc-950 border-2 border-primary/20 rounded-none p-10 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                    <DialogHeader>
                        <div className="mb-6 flex h-16 w-16 items-center justify-center border-2 border-destructive bg-destructive/10">
                            <AlertTriangle className="h-8 w-8 text-destructive" />
                        </div>
                        <DialogTitle className="font-heading text-3xl font-bold italic tracking-tight text-white">Delete Listing?</DialogTitle>
                        <DialogDescription className="font-sans text-sm font-medium leading-relaxed text-zinc-500 mt-4">
                            Are you sure you want to delete <strong className="text-white">&quot;{listing.title}&quot;</strong>? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex gap-4 mt-8 pt-8 border-t-2 border-primary/10">
                        <Button
                            variant="outline"
                            className="flex-1 h-14 rounded-none border-2 border-primary/10 font-sans text-xs font-bold uppercase tracking-widest transition-all"
                            onClick={() => setShowDeleteModal(false)}
                            disabled={isDeleting}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            className="flex-1 h-14 rounded-none font-sans text-xs font-bold uppercase tracking-widest transition-all"
                            onClick={handleDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
