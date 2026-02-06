'use client'

import { useState } from 'react'
import { reportsApi, type ReportReason } from '@/lib/api'
import { useTranslation } from '@/lib/i18n'
import { useAuth } from '@/components/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ResponsiveDialog } from '@/components/ui/responsive-dialog'

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

export function ReportDialog({
  isOpen,
  onClose,
  listingId,
  userId,
}: ReportDialogProps) {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [reason, setReason] = useState<ReportReason | ''>('')
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitState, setSubmitState] = useState<'idle' | 'success' | 'error'>(
    'idle'
  )
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async () => {
    if (!user || !reason) return

    setIsSubmitting(true)
    setSubmitState('idle')

    const { error } = await reportsApi.create({
      reporter_id: user.id,
      listing_id: listingId,
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
    <ResponsiveDialog
      open={isOpen}
      onOpenChange={(val) => !val && handleClose()}
      title={listingId ? t('reports:reportListing') : t('reports:reportUser')}
      description={t('reports:description')}
    >
      <div className="space-y-6">
        {/* Success State */}
        {submitState === 'success' ? (
          <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-6 text-center">
            <div className="mb-2 text-4xl">✓</div>
            <p className="font-bold uppercase tracking-wide text-emerald-600 dark:text-emerald-500">{t('reports:thankYou')}</p>
          </div>
        ) : (
          <>
            {/* Error Message */}
            {submitState === 'error' && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive mb-4 rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wide">
                {errorMessage}
              </div>
            )}

            {/* Reason Select */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                {t('reports:reason')} *
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value as ReportReason)}
                className="border-input bg-background focus:ring-ring w-full rounded-xl border px-4 py-3 text-sm transition-all outline-none focus:ring-2"
              >
                <option value="">—</option>
                {REPORT_REASONS.map((r) => (
                  <option key={r} value={r}>
                    {t(`reports.reasons.${r}`)}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                {t('reports:description')}
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="..."
                className="border-input bg-background focus:ring-ring w-full resize-none rounded-xl border px-4 py-3 text-sm transition-all outline-none focus:ring-2"
                rows={3}
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                onClick={handleSubmit}
                disabled={!reason || isSubmitting || !user}
                className={cn('flex-1 rounded-xl font-bold uppercase tracking-widest', !user && 'opacity-50')}
              >
                {isSubmitting ? '...' : t('reports:submit')}
              </Button>
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
                className="rounded-xl font-bold uppercase tracking-widest"
              >
                {t('common:back')}
              </Button>
            </div>

            {/* Login hint */}
            {!user && (
              <p className="text-muted-foreground mt-4 text-center text-[10px] font-bold uppercase tracking-widest">
                {t('auth:signIn')} required
              </p>
            )}
          </>
        )}
      </div>
    </ResponsiveDialog>
  )
}
