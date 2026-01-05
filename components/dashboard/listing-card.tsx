'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Edit, Trash2, Eye, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Listing } from '@/lib/types/database'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface DashboardListingCardProps {
    listing: Listing & { category?: { name: string } | null }
}

export function DashboardListingCard({ listing }: DashboardListingCardProps) {
    const router = useRouter()
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this listing?')) return

        setIsDeleting(true)
        const supabase = createClient()
        // Soft delete or status update
        const { error } = await supabase
            .from('listings')
            .update({ status: 'archived' })
            .eq('id', listing.id)

        if (!error) {
            router.refresh()
        }
        setIsDeleting(false)
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-500/10 text-green-600'
            case 'draft': return 'bg-yellow-500/10 text-yellow-600'
            case 'sold': return 'bg-blue-500/10 text-blue-600'
            case 'archived': return 'bg-gray-500/10 text-gray-600'
            default: return 'bg-muted text-muted-foreground'
        }
    }

    return (
        <div className="group relative flex items-center gap-4 rounded-2xl border border-border/40 bg-card p-3 transition-all hover:bg-muted/30 hover:border-primary/20">
            {/* Image Thumbnail */}
            <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-muted">
                {listing.images?.[0] ? (
                    <Image
                        src={listing.images[0]}
                        alt={listing.title}
                        fill
                        className="object-cover"
                        unoptimized
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                        <Eye className="h-8 w-8 opacity-20" />
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <span className={cn(
                        "rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider",
                        getStatusColor(listing.is_active ? 'active' : 'draft') // This logic needs to be aligned with the `status` column if it exists, or derive from is_active
                    )}>
                        {listing.is_active ? 'Active' : 'Inactive'}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(listing.created_at).toLocaleDateString()}
                    </span>
                </div>

                <h3 className="truncate font-heading text-lg font-bold">
                    {listing.title || 'Untitled Listing'}
                </h3>

                <div className="flex items-center gap-4 mt-1">
                    <span className="font-bold text-primary">
                        {listing.price?.toLocaleString()} {listing.currency}
                    </span>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Eye className="h-3 w-3" /> {listing.views || 0} views
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
                <Link href={`/create-listing?edit=${listing.id}`}>
                    <Button size="icon" variant="ghost" className="h-9 w-9 text-muted-foreground hover:text-primary">
                        <Edit className="h-4 w-4" />
                    </Button>
                </Link>
                <Button
                    size="icon"
                    variant="ghost"
                    className="h-9 w-9 text-muted-foreground hover:text-destructive"
                    onClick={handleDelete}
                    disabled={isDeleting}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}
