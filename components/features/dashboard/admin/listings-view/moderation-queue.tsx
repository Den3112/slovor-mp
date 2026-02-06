'use client';

import { CheckCircle2 } from 'lucide-react';
import { Listing } from '@/lib/api';
import { ModerationCard } from './moderation-card';
import { SuspicionIssue } from './types';

interface ModerationQueueProps {
    listings: Listing[];
    isLoading: boolean;
    getSuspicion: (listing: Listing) => SuspicionIssue[];
    handleAction: (id: string, status: 'active' | 'rejected') => Promise<void>;
    locale: string;
}

export function ModerationQueue({
    listings,
    isLoading,
    getSuspicion,
    handleAction,
    locale,
}: ModerationQueueProps) {
    if (isLoading) {
        return (
            <div className="flex h-64 items-center justify-center rounded-xl border-2 border-dashed border-border/40">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        Loading queue...
                    </span>
                </div>
            </div>
        );
    }

    if (listings.length === 0) {
        return (
            <div className="flex h-64 flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-border/40 bg-muted/5">
                <CheckCircle2 className="h-12 w-12 text-muted-foreground/20" />
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    Queue is clear! Well done.
                </span>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
            {listings.map((listing) => (
                <ModerationCard
                    key={listing.id}
                    listing={listing}
                    issues={getSuspicion(listing)}
                    onAction={handleAction}
                    locale={locale}
                />
            ))}
        </div>
    );
}
