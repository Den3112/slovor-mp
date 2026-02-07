'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import { cn } from '@/lib/utils/cn'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface BulkActionsBarProps {
  selectedCount: number
  onCancel: () => void
  onDeactivate: () => void
  onDelete: () => void
  isSubmitting: boolean
}

export function BulkActionsBar({
  selectedCount,
  onCancel,
  onDeactivate,
  onDelete,
  isSubmitting,
}: BulkActionsBarProps) {
  const { t } = useTranslation(['dashboard', 'common'])
  if (selectedCount === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="dark:bg-card dark:border-border fixed bottom-24 left-1/2 z-50 flex max-w-[90vw] min-w-[320px] -translate-x-1/2 items-center gap-6 rounded-2xl border border-white/10 bg-slate-900 px-6 py-3 shadow-2xl"
    >
      <div className="flex flex-col">
        <span className="text-primary text-[10px] font-bold tracking-[0.2em] uppercase">
          {t('dashboard:bulkActions.title')}
        </span>
        <span className="dark:text-foreground text-xs font-bold text-white">
          {t('dashboard:bulkActions.selectedItems', { count: selectedCount })}
        </span>
      </div>
      <div className="dark:bg-border h-8 w-px bg-white/10" />
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="ghost"
          className="dark:text-foreground dark:hover:bg-accent h-9 rounded-lg px-4 text-[10px] font-bold tracking-widest text-white uppercase hover:bg-white/10"
          onClick={onCancel}
        >
          {t('dashboard:bulkActions.cancel')}
        </Button>
        <Button
          size="sm"
          className="h-9 rounded-lg border border-transparent bg-white px-4 text-[10px] font-bold tracking-widest text-slate-900 uppercase hover:bg-white/90"
          onClick={onDeactivate}
          disabled={isSubmitting}
        >
          {t('dashboard:bulkActions.deactivate')}
        </Button>
        <Button
          size="sm"
          variant="destructive"
          className="h-9 rounded-lg px-4 text-[10px] font-bold tracking-widest uppercase"
          onClick={onDelete}
          disabled={isSubmitting}
        >
          {t('dashboard:bulkActions.delete')}
        </Button>
      </div>
    </motion.div>
  )
}

interface BulkConfirmDialogProps {
  action: 'delete' | 'deactivate' | null
  onClose: () => void
  onConfirm: () => void
  selectedCount: number
  isSubmitting: boolean
}

export function BulkConfirmDialog({
  action,
  onClose,
  onConfirm,
  selectedCount,
  isSubmitting,
}: BulkConfirmDialogProps) {
  const { t } = useTranslation(['dashboard', 'common'])

  return (
    <AlertDialog open={!!action} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="border-border bg-card rounded-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-bold tracking-tight uppercase">
            {action === 'delete'
              ? t('dashboard:bulkActions.deleteTitle')
              : t('dashboard:bulkActions.deactivateTitle')}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground font-medium">
            {action === 'delete'
              ? t('dashboard:bulkActions.deleteConfirm', {
                  count: selectedCount,
                })
              : t('dashboard:bulkActions.deactivateConfirm', {
                  count: selectedCount,
                })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel
            className="rounded-lg text-[10px] font-bold tracking-widest uppercase"
            disabled={isSubmitting}
          >
            {t('common:cancel')}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              onConfirm()
            }}
            className={cn(
              'rounded-lg text-[10px] font-bold tracking-widest uppercase',
              action === 'delete'
                ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                : 'bg-primary text-primary-foreground hover:bg-primary/90'
            )}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : action === 'delete' ? (
              t('dashboard:bulkActions.delete')
            ) : (
              t('dashboard:bulkActions.deactivate')
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
