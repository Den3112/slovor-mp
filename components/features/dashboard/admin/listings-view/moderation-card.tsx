'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import {
  Tag,
  Clock,
  ChevronRight,
  UserCircle,
  CheckCircle2,
  XCircle,
  Edit3,
  Ban,
} from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
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

export function ModerationCard({
  listing,
  issues,
  onAction,
  locale,
}: ModerationCardProps) {
  const { t } = useTranslation(['admin'])
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="group bg-card border-border/60 hover:shadow-primary/5 hover:border-primary/20 relative flex flex-col overflow-hidden rounded-xl border shadow-sm transition-all duration-500 hover:shadow-lg"
    >
      {/* Status Badge Overlays */}
      {issues.map((issue, idx) => (
        <div
          key={idx}
          className={cn(
            'absolute top-6 left-6 z-10 flex items-center gap-2 rounded-full px-3 py-1.5 text-[9px] font-bold tracking-widest text-white uppercase shadow-xl',
            issue.color
          )}
        >
          <issue.icon className="h-3 w-3" />
          {issue.label}
        </div>
      ))}

      {/* Image & Main Info */}
      <div className="flex gap-6 p-6">
        <div className="bg-muted border-border/40 relative h-32 w-32 shrink-0 overflow-hidden rounded-2xl border">
          {listing.images?.[0] ? (
            <Image
              src={listing.images[0]}
              alt={listing.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              unoptimized
            />
          ) : (
            <Tag className="text-muted-foreground/20 absolute inset-0 m-auto h-8 w-8" />
          )}
        </div>
        <div className="flex flex-col justify-between py-1">
          <div className="space-y-1">
            <h3 className="line-clamp-2 text-lg leading-tight font-bold tracking-tight">
              {listing.title}
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-primary text-sm font-bold uppercase">
                {formatPrice(listing.price)} {listing.currency}
              </span>
              <span className="text-muted-foreground/40 text-[10px] font-bold tracking-widest uppercase">
                ({listing.category_id})
              </span>
            </div>
          </div>
          <div className="text-muted-foreground flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase">
            <Clock className="h-3.5 w-3.5" />
            {new Date(listing.created_at).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Description & Metadata */}
      <div className="space-y-4 px-6 pb-6">
        <div className="bg-muted/30 border-border/40 rounded-2xl border p-4">
          <p className="text-muted-foreground line-clamp-3 text-xs leading-relaxed">
            &quot;{listing.description || t('admin:noDescription')}&quot;
          </p>
        </div>

        <div className="border-border/40 flex items-center justify-between border-y py-2">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary border-primary/20 flex h-8 w-8 items-center justify-center rounded-lg border">
              <UserCircle className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold tracking-tight">
                {listing.user?.display_name || t('admin:seller')}
              </span>
              <span className="text-muted-foreground/60 text-[9px] font-bold uppercase">
                {t('admin:joined', {
                  year: new Date(listing.user?.created_at || '').getFullYear(),
                })}
              </span>
            </div>
          </div>
          <Link
            href={`/${locale}/listings/${listing.id}`}
            target="_blank"
            className="text-primary flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase hover:opacity-70"
          >
            {t('admin:fullDetails')} <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-border/40 border-border/40 mt-auto grid grid-cols-2 gap-px border-t">
        <button
          onClick={() => onAction(listing.id, 'active')}
          className="bg-background group/btn flex items-center justify-center gap-2 py-5 text-xs font-bold tracking-widest uppercase transition-all hover:bg-emerald-500 hover:text-white"
        >
          <CheckCircle2 className="h-4 w-4 transition-transform group-hover/btn:scale-110" />
          {t('admin:approve')}
        </button>
        <button
          onClick={() => onAction(listing.id, 'rejected')}
          className="bg-background hover:bg-destructive group/btn flex items-center justify-center gap-2 py-5 text-xs font-bold tracking-widest uppercase transition-all hover:text-white"
        >
          <XCircle className="h-4 w-4 transition-transform group-hover/btn:scale-110" />
          {t('admin:reject')}
        </button>
      </div>

      {/* Sub-actions Overlay (More) */}
      <div className="border-border/40 bg-muted/20 flex items-center justify-around border-t p-2">
        <button className="hover:bg-background text-muted-foreground hover:text-foreground flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[9px] font-bold tracking-widest uppercase transition-all">
          <Edit3 className="h-3.5 w-3.5" /> {t('admin:requestFix')}
        </button>
        <div className="bg-border/60 h-4 w-px" />
        <button className="hover:bg-background text-muted-foreground hover:text-destructive flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[9px] font-bold tracking-widest uppercase transition-all">
          <Ban className="h-3.5 w-3.5" /> {t('admin:banSeller')}
        </button>
      </div>
    </motion.div>
  )
}
