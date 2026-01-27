'use client'

import { useEffect, useState } from 'react'
import { listingsApi, adminApi, type Listing } from '@/lib/api'
import {
    CheckCircle2,
    XCircle,
    Eye,
    ShieldAlert,
    Search,
    Loader2,
    Calendar,
    User,
    Tag,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import Image from 'next/image'
import Link from 'next/link'

export default function AdminModerationPage() {
    const [listings, setListings] = useState<Listing[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        loadListings()
    }, [])

    const loadListings = async () => {
        setIsLoading(true)
        const { data } = await listingsApi.getAdminAll()
        if (data) setListings(data)
        setIsLoading(false)
    }

    const handleAction = async (id: string, status: 'active' | 'rejected' | 'draft') => {
        const { error } = await listingsApi.update(id, { status })
        if (error) {
            toast.error(error)
        } else {
            toast.success(status === 'active' ? 'Listing approved' : 'Listing rejected/hidden')
            setListings(prev => prev.map(l => l.id === id ? { ...l, status } : l))
            // Log action
            adminApi.logAction({
                target_id: id,
                target_type: 'listing',
                action_type: status === 'active' ? 'approve' : 'reject',
                reason: status === 'active' ? 'Admin approved listing' : `Admin set status to ${status}`
            })
        }
    }

    const filteredListings = listings.filter(l =>
        l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.user?.display_name?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    if (isLoading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="text-primary h-8 w-8 animate-spin" />
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1">
                    <h1 className="font-heading text-4xl font-black tracking-tight italic">Moderation</h1>
                    <p className="text-muted-foreground font-medium">Review and manage all marketplace listings.</p>
                </div>
                <div className="relative w-full max-w-sm md:w-80">
                    <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search listings or users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="border-border/50 bg-card w-full rounded-2xl border py-3 pl-10 pr-4 text-sm font-medium outline-none transition-all focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
                    />
                </div>
            </div>

            {/* Listing Table */}
            <div className="border-border/50 bg-card overflow-hidden rounded-4xl border shadow-2xl shadow-black/5">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-border/50 bg-muted/30">
                                <th className="px-6 py-4 text-[10px] font-black tracking-widest text-muted-foreground uppercase">Listing</th>
                                <th className="px-6 py-4 text-[10px] font-black tracking-widest text-muted-foreground uppercase">Seller</th>
                                <th className="px-6 py-4 text-[10px] font-black tracking-widest text-muted-foreground uppercase">Date</th>
                                <th className="px-6 py-4 text-[10px] font-black tracking-widest text-muted-foreground uppercase">Status</th>
                                <th className="px-6 py-4 text-right text-[10px] font-black tracking-widest text-muted-foreground uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/30">
                            {filteredListings.map((listing) => (
                                <tr key={listing.id} className="group hover:bg-muted/30 transition-colors">
                                    <td className="px-6 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-muted">
                                                {listing.images?.[0] ? (
                                                    <Image src={listing.images[0]} alt={listing.title} fill className="object-cover" />
                                                ) : (
                                                    <Tag className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 text-muted-foreground/40" />
                                                )}
                                            </div>
                                            <div className="min-w-0 flex-1 space-y-0.5">
                                                <Link href={`/listings/${listing.id}`} target="_blank" className="font-bold text-foreground hover:text-primary transition-colors flex items-center gap-1">
                                                    {listing.title}
                                                    <Eye className="h-3 w-3 inline opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </Link>
                                                <p className="text-xs font-bold text-primary">{listing.price} {listing.currency}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 font-bold text-sm">
                                        <div className="flex items-center gap-2">
                                            <User className="h-3.5 w-3.5 text-muted-foreground" />
                                            {listing.user?.display_name || 'Unknown'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 text-sm font-medium text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-3.5 w-3.5" />
                                            {new Date(listing.created_at).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <span className={cn(
                                            "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-widest",
                                            listing.status === 'active' ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                                        )}>
                                            {listing.status === 'active' ? 'Active' : listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {listing.status === 'active' ? (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleAction(listing.id, 'draft')}
                                                    className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-xl"
                                                >
                                                    <ShieldAlert className="h-4 w-4" />
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleAction(listing.id, 'active')}
                                                    className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl"
                                                >
                                                    <CheckCircle2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleAction(listing.id, 'rejected')}
                                                className="text-destructive hover:bg-destructive/10 rounded-xl"
                                            >
                                                <XCircle className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
