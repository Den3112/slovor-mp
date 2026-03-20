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
      className="glass-panel border-primary/20 fixed bottom-10 left-1/2 z-50 flex max-w-[95vw] min-w-[340px] -translate-x-1/2 items-center gap-8 rounded-[2rem] bg-slate-900/95 px-8 py-4 shadow-2xl backdrop-blur-2xl md:min-w-[480px]"
    >
      <div className="flex flex-col gap-0.5">
        <span className="text-primary/40 text-[9px] font-black tracking-[0.25em] uppercase">
          {t('dashboard:bulkActions.title')}
        </span>
        <span className="text-[13px] font-black tracking-tight text-white uppercase">
          {t('dashboard:bulkActions.selectedItems', { count: selectedCount })}
        </span>
      </div>
      <div className="h-10 w-px bg-white/10" />
      <div className="flex items-center gap-3">
        <Button
          size="sm"
          variant="ghost"
          className="h-10 rounded-2xl px-5 text-[9px] font-black tracking-[0.15em] text-white uppercase transition-all hover:bg-white/10 active:scale-95"
          onClick={onCancel}
        >
          {t('dashboard:bulkActions.cancel')}
        </Button>
        <Button
          size="sm"
          className="h-10 rounded-2xl bg-white px-6 text-[9px] font-black tracking-[0.15em] text-slate-900 uppercase shadow-lg shadow-white/10 transition-all hover:bg-white/90 active:scale-95"
          onClick={onDeactivate}
          disabled={isSubmitting}
        >
          {t('dashboard:bulkActions.deactivate')}
        </Button>
        <Button
          size="sm"
          variant="destructive"
          className="h-10 rounded-2xl px-6 text-[9px] font-black tracking-[0.15em] uppercase shadow-lg shadow-rose-500/20"
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
      <AlertDialogContent className="glass-panel border-primary/10 bg-background/80 max-w-md overflow-hidden rounded-[2.5rem] p-0 shadow-2xl backdrop-blur-3xl">
        <div className="border-primary/5 bg-primary/5 border-b p-8">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground mb-2 text-2xl font-black tracking-tighter uppercase">
              {action === 'delete'
                ? t('dashboard:bulkActions.deleteTitle')
                : t('dashboard:bulkActions.deactivateTitle')}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-foreground/60 text-sm leading-relaxed font-black tracking-tight">
              {action === 'delete'
                ? t('dashboard:bulkActions.deleteConfirm', {
                    count: selectedCount,
                  })
                : t('dashboard:bulkActions.deactivateConfirm', {
                    count: selectedCount,
                  })}
            </AlertDialogDescription>
          </AlertDialogHeader>
        </div>
        <div className="p-8">
          <AlertDialogFooter className="flex-row items-center gap-3 sm:justify-end">
            <AlertDialogCancel
              className="hover:bg-primary/5 border-primary/10 h-12 flex-1 rounded-2xl text-[10px] font-black tracking-[0.2em] uppercase transition-all active:scale-95 sm:flex-none sm:px-8"
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
                'h-12 flex-1 rounded-2xl text-[10px] font-black tracking-[0.2em] uppercase shadow-xl transition-all active:scale-95 sm:flex-none sm:px-8',
                action === 'delete'
                  ? 'bg-rose-500 text-white shadow-rose-500/20 hover:bg-rose-600'
                  : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/20'
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
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
