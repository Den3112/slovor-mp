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
        <div className="flex items-center gap-1 pl-2 border-l border-white/10" onClick={(e) => e.stopPropagation()}>
            <Link href={`/post?edit=${listing.id}`} title="Edit" onClick={(e) => e.stopPropagation()}>
                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors text-muted-foreground">
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                </Button>
            </Link>



            <Button
                size="icon"
                variant="ghost"
                className={cn(
                    "h-8 w-8 rounded-lg transition-colors",
                    listing.is_active
                        ? "hover:bg-amber-500/10 hover:text-amber-500 text-muted-foreground"
                        : "hover:bg-emerald-500/10 hover:text-emerald-500 text-muted-foreground"
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
                variant="ghost"
                className="h-8 w-8 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors text-muted-foreground"
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
                <DialogContent className="sm:max-w-md" onClick={(e) => e.stopPropagation()}>
                    <DialogHeader>
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                            <AlertTriangle className="h-6 w-6 text-destructive" />
                        </div>
                        <DialogTitle>Delete Listing?</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete <strong>&quot;{listing.title}&quot;</strong>? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex gap-3 mt-4">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => setShowDeleteModal(false)}
                            disabled={isDeleting}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            className="flex-1"
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
