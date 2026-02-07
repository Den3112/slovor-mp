import { SlidersHorizontal, X } from 'lucide-react'
import { Drawer } from 'vaul'
import { Button } from '@/components/ui/button'
import { ListingFilters } from '../filters'
import { useTranslation } from '@/lib/i18n'
import { MobileFilterDrawerProps } from './types'

export function MobileFilterDrawer({
  categories,
  totalCount,
  isOpen,
  onOpenChange,
}: MobileFilterDrawerProps) {
  const { t } = useTranslation(['filters'])

  return (
    <div className="mb-6 lg:hidden">
      <Drawer.Root open={isOpen} onOpenChange={onOpenChange}>
        <Drawer.Trigger asChild>
          <button className="border-border bg-card flex w-full items-center justify-between rounded-lg border p-4 font-bold shadow-sm transition-all active:scale-[0.98]">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="text-primary h-5 w-5" />
              <span>{t('filters:title')}</span>
            </div>
            <div className="bg-primary/20 text-primary flex h-6 w-6 items-center justify-center rounded-lg text-xs font-bold">
              +
            </div>
          </button>
        </Drawer.Trigger>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 z-50 bg-black/60" />
          <Drawer.Content className="border-border bg-background fixed inset-x-0 bottom-0 z-50 mt-24 flex h-[85vh] flex-col rounded-t-xl border-t outline-none">
            <div className="bg-background border-border/40 shrink-0 rounded-t-xl border-b p-4">
              <div className="bg-border/60 mx-auto mb-6 h-1.5 w-12 shrink-0 rounded-lg" />
              <div className="flex items-center justify-between px-2">
                <Drawer.Title className="text-xl font-bold tracking-tight">
                  {t('filters:title')}
                </Drawer.Title>
                <Drawer.Close asChild>
                  <button className="text-muted-foreground -mr-2 p-2">
                    <X className="h-6 w-6" />
                  </button>
                </Drawer.Close>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <ListingFilters categories={categories} />
            </div>
            <div className="border-border/40 safe-bottom border-t p-4">
              <Button
                className="h-14 w-full rounded-lg text-lg font-bold"
                onClick={() => onOpenChange(false)}
              >
                {t('common:showResultCount', { count: totalCount }) ||
                  `Show ${totalCount} Listings`}
              </Button>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </div>
  )
}
