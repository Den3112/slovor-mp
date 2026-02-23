'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/i18n'

interface BulkActionsBarProps {
  selectedCount: number
  onAction: (status: 'active' | 'rejected') => void
  onClear: () => void
}

export function BulkActionsBar({
  selectedCount,
  onAction,
  onClear,
}: BulkActionsBarProps) {
  const { t } = useTranslation(['admin', 'common'])
  if (selectedCount === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 100, x: '-50%' }}
      animate={{ opacity: 1, y: 0, x: '-50%' }}
      exit={{ opacity: 0, y: 100, x: '-50%' }}
      className="bg-foreground text-background fixed bottom-12 left-1/2 z-50 flex items-center gap-8 rounded-xl border border-white/10 px-8 py-4 shadow-lg"
    >
      <div className="flex items-center gap-4">
        <div className="bg-primary text-primary-foreground shadow-primary/20 flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold shadow-lg">
          {selectedCount}
        </div>
        <span className="text-[11px] font-bold tracking-[0.2em] text-white/60 uppercase">
          {t('admin:selectedItems')}
        </span>
      </div>
      <div className="h-8 w-px bg-white/10" />
      <div className="flex gap-3">
        <Button
          size="sm"
          onClick={() => onAction('active')}
          className="h-10 rounded-xl border-0 bg-emerald-500 px-6 text-[10px] font-bold tracking-widest text-white uppercase hover:bg-emerald-600"
        >
          {t('admin:approveAll')}
        </Button>
        <Button
          size="sm"
          onClick={() => onAction('rejected')}
          variant="destructive"
          className="h-10 rounded-xl border-0 px-6 text-[10px] font-bold tracking-widest uppercase"
        >
          {t('admin:rejectAll')}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={onClear}
          className="h-10 rounded-xl px-6 text-[10px] font-bold tracking-widest text-white/40 uppercase hover:bg-white/5 hover:text-white"
        >
          {t('admin:dismiss')}
        </Button>
      </div>
    </motion.div>
  )
}
