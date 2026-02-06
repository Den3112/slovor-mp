'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import {
    Tag, Clock, ChevronRight, UserCircle,
    CheckCircle2, XCircle, Edit3, Ban
} from 'lucide-react'
import { Listing } from '@/lib/api'
import { cn } from '@/lib/utils'
import { formatPrice } from '@/lib/utils/formatting'
import { SuspicionIssue } from './types'

interface ModerationCardProps {
    listing: Listing
    issues: SuspicionIssue[]
    onAction: (id: string, status: 'active' | 'rejected') => void
    locale: string
}

export function ModerationCard({ listing, issues, onAction, locale }: ModerationCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group relative flex flex-col bg-card rounded-xl border border-border/60 overflow-hidden shadow-sm hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 transition-all duration-500"
        >
            {/* Status Badge Overlays */}
            {issues.map((issue, idx) => (
                <div key={idx} className={cn("absolute top-6 left-6 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full text-white text-[9px] font-bold uppercase tracking-widest shadow-xl", issue.color)}>
                    <issue.icon className="h-3 w-3" />
                    {issue.label}
                </div>
            ))}

            {/* Image & Main Info */}
            <div className="flex gap-6 p-6">
                <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-2xl bg-muted border border-border/40">
                    {listing.images?.[0] ? (
                        <Image src={listing.images[0]} alt={listing.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" unoptimized />
                    ) : (
                        <Tag className="absolute inset-0 m-auto h-8 w-8 text-muted-foreground/20" />
                    )}
                </div>
                <div className="flex flex-col justify-between py-1">
                    <div className="space-y-1">
                        <h3 className="text-lg font-bold tracking-tight leading-tight line-clamp-2">{listing.title}</h3>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-primary uppercase">{formatPrice(listing.price)} {listing.currency}</span>
                            <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">({listing.category_id})</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        <Clock className="h-3.5 w-3.5" />
                        {new Date(listing.created_at).toLocaleDateString()}
                    </div>
                </div>
            </div>

            {/* Description & Metadata */}
            <div className="px-6 pb-6 space-y-4">
                <div className="bg-muted/30 rounded-2xl p-4 border border-border/40">
                    <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed ">
                        &quot;{listing.description || 'No description provided.'}&quot;
                    </p>
                </div>

                <div className="flex items-center justify-between py-2 border-y border-border/40">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                            <UserCircle className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[11px] font-bold tracking-tight">{listing.user?.display_name || 'Seller'}</span>
                            <span className="text-[9px] font-bold text-muted-foreground/60 uppercase">Joined {new Date(listing.user?.created_at || '').getFullYear()}</span>
                        </div>
                    </div>
                    <Link href={`/${locale}/listings/${listing.id}`} target="_blank" className="flex items-center gap-1.5 text-[10px] font-bold text-primary uppercase tracking-widest hover:opacity-70">
                        Full Details <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                </div>
            </div>

            {/* Action Bar */}
            <div className="mt-auto grid grid-cols-2 gap-px bg-border/40 border-t border-border/40">
                <button
                    onClick={() => onAction(listing.id, 'active')}
                    className="flex items-center justify-center gap-2 py-5 bg-background hover:bg-emerald-500 hover:text-white transition-all text-xs font-bold uppercase tracking-widest group/btn"
                >
                    <CheckCircle2 className="h-4 w-4 transition-transform group-hover/btn:scale-110" />
                    Approve
                </button>
                <button
                    onClick={() => onAction(listing.id, 'rejected')}
                    className="flex items-center justify-center gap-2 py-5 bg-background hover:bg-destructive hover:text-white transition-all text-xs font-bold uppercase tracking-widest group/btn"
                >
                    <XCircle className="h-4 w-4 transition-transform group-hover/btn:scale-110" />
                    Reject
                </button>
            </div>

            {/* Sub-actions Overlay (More) */}
            <div className="flex items-center justify-around border-t border-border/40 bg-muted/20 p-2">
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-background text-[9px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all">
                    <Edit3 className="h-3.5 w-3.5" /> Request Fix
                </button>
                <div className="h-4 w-px bg-border/60" />
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-background text-[9px] font-bold uppercase tracking-widest text-muted-foreground hover:text-destructive transition-all">
                    <Ban className="h-3.5 w-3.5" /> Ban Seller
                </button>
            </div>
        </motion.div>
    )
}
