import { Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useTranslation } from '@/lib/i18n'
import { BlogManagerHeaderProps } from './types'

export function BlogManagerHeader({
  searchQuery,
  onSearchChange,
  onCreate,
}: BlogManagerHeaderProps) {
  const { t } = useTranslation(['common', 'admin'])

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="group relative max-w-md flex-1">
        <Search className="text-muted-foreground group-focus-within:text-primary absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 transition-colors" />
        <Input
          placeholder={t('admin:searchPosts')}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="bg-card border-border h-11 rounded-lg pl-12 text-xs font-bold tracking-widest uppercase transition-all"
        />
      </div>
      <Button
        onClick={onCreate}
        className="h-11 rounded-lg px-6 text-[10px] font-bold tracking-widest uppercase"
      >
        <Plus className="mr-2 h-4 w-4" /> {t('admin:newArticle')}
      </Button>
    </div>
  )
}
