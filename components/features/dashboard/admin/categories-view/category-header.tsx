import { Layers, Plus } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { CategoryHeaderProps } from './types'

export function CategoryHeader({ onAdd }: CategoryHeaderProps) {
  const { t } = useTranslation(['admin'])

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-foreground flex items-center gap-3 text-3xl font-bold tracking-tight uppercase">
          <Layers className="text-primary h-8 w-8" strokeWidth={2.5} />
          {t('admin:categories')}
        </h1>
        <p className="text-muted-foreground mt-1 text-[10px] font-bold tracking-[0.2em] uppercase">
          {t('admin:manageMarketplaceTaxonomy')}
        </p>
      </div>
      <Button
        onClick={onAdd}
        className="shadow-primary/20 h-11 rounded-lg px-6 font-bold tracking-widest uppercase shadow-lg"
      >
        <Plus className="mr-2 h-4 w-4" strokeWidth={2.5} />
        {t('admin:addCategory')}
      </Button>
    </div>
  )
}
