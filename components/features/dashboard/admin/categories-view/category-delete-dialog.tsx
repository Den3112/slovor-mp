import { Loader2 } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
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
import { CategoryDeleteDialogProps } from './types'

export function CategoryDeleteDialog({
  deleteId,
  onOpenChange,
  onDelete,
  isSubmitting,
}: CategoryDeleteDialogProps) {
  const { t } = useTranslation(['admin', 'common'])

  return (
    <AlertDialog open={!!deleteId} onOpenChange={onOpenChange}>
      <AlertDialogContent className="border-border bg-card rounded-xl shadow-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive text-xl font-bold tracking-tight uppercase">
            {t('admin:deleteCategoryTitle')}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground text-sm font-medium">
            {t('admin:confirmDeleteCategoryDesc')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel
            className="h-10 rounded-xl px-6 text-[10px] font-bold tracking-widest uppercase"
            disabled={isSubmitting}
          >
            {t('common:cancel')}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              onDelete()
            }}
            disabled={isSubmitting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-destructive/20 h-10 rounded-xl border-0 px-6 text-[10px] font-bold tracking-widest uppercase shadow-lg"
          >
            {isSubmitting ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              t('admin:deleteCategoryAction')
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
