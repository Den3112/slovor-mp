'use client'

import { useState } from 'react'
import { AlertTriangle, X } from 'lucide-react'
import { reportsApi, type ReportReason } from '@/lib/api'
import { useTranslation } from '@/lib/i18n'
import { useAuth } from '@/components/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ReportDialogProps {
    isOpen: boolean
    onClose: () => void
    listingId?: string
    userId?: string
}

const REPORT_REASONS: ReportReason[] = [
    'spam',
    'inappropriate',
    'fraud',
    'counterfeit',
    'prohibited',
    'duplicate',
    'other',
]

export function ReportDialog({ isOpen, onClose, listingId, userId }: ReportDialogProps) {
    const { t } = useTranslation()
    const { user } = useAuth()
    const [reason, setReason] = useState<ReportReason | ''>('')
    const [description, setDescription] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitState, setSubmitState] = useState<'idle' | 'success' | 'error'>('idle')
    const [errorMessage, setErrorMessage] = useState('')

    if (!isOpen) return null

    const handleSubmit = async () => {
        if (!user || !reason) return

        setIsSubmitting(true)
        setSubmitState('idle')

        const { error } = await reportsApi.create({
            reporter_id: user.id,
            reported_listing_id: listingId,
            reported_user_id: userId,
            reason,
            description: description.trim() || undefined,
        })

        if (error) {
            setSubmitState('error')
            setErrorMessage(error)
        } else {
            setSubmitState('success')
            setTimeout(() => {
                onClose()
                // Reset form
                setReason('')
                setDescription('')
                setSubmitState('idle')
            }, 2000)
        }

        setIsSubmitting(false)
    }

    const handleClose = () => {
        if (!isSubmitting) {
            onClose()
            setReason('')
            setDescription('')
            setSubmitState('idle')
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={handleClose}
            />

            {/* Dialog */}
            <div className="relative z-10 w-full max-w-md rounded-3xl bg-card p-6 shadow-2xl">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100">
                            <AlertTriangle className="h-5 w-5 text-rose-500" />
                        </div>
                        <h2 className="text-lg font-bold">
                            {listingId ? t.reports.reportListing : t.reports.reportUser}
                        </h2>
                    </div>
                    <button
                        onClick={handleClose}
                        className="rounded-xl p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Success State */}
                {submitState === 'success' ? (
                    <div className="rounded-2xl bg-emerald-50 p-6 text-center">
                        <div className="mb-2 text-4xl">✓</div>
                        <p className="font-medium text-emerald-600">{t.reports.thankYou}</p>
                    </div>
                ) : (
                    <>
                        {/* Error Message */}
                        {submitState === 'error' && (
                            <div className="mb-4 rounded-xl bg-red-50 px-4 py-2 text-sm text-red-600">
                                {errorMessage}
                            </div>
                        )}

                        {/* Reason Select */}
                        <div className="mb-4">
                            <label className="mb-2 block text-sm font-medium">
                                {t.reports.reason} *
                            </label>
                            <select
                                value={reason}
                                onChange={(e) => setReason(e.target.value as ReportReason)}
                                className="w-full rounded-xl border border-input bg-muted/30 px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary"
                            >
                                <option value="">—</option>
                                {REPORT_REASONS.map((r) => (
                                    <option key={r} value={r}>
                                        {t.reports.reasons[r]}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Description */}
                        <div className="mb-6">
                            <label className="mb-2 block text-sm font-medium">
                                {t.reports.description}
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="..."
                                className="w-full resize-none rounded-xl border border-input bg-muted/30 px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary"
                                rows={3}
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <Button
                                onClick={handleSubmit}
                                disabled={!reason || isSubmitting || !user}
                                className={cn(
                                    "flex-1 rounded-xl",
                                    !user && "opacity-50"
                                )}
                            >
                                {isSubmitting ? '...' : t.reports.submit}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={handleClose}
                                disabled={isSubmitting}
                                className="rounded-xl"
                            >
                                {t.common.back}
                            </Button>
                        </div>

                        {/* Login hint */}
                        {!user && (
                            <p className="mt-4 text-center text-xs text-muted-foreground">
                                {t.auth.signIn} required
                            </p>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
