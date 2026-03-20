import { Users } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'

export function UsersHeader() {
  const { t } = useTranslation('common')

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-foreground flex items-center gap-3 text-3xl font-bold tracking-tight uppercase">
          <Users className="text-primary h-8 w-8" />
          {t('admin:userManagement')}
        </h1>
        <p className="text-muted-foreground mt-1 text-[10px] font-bold tracking-[0.2em] uppercase">
          {t('admin:manageMembersTrust')}
        </p>
      </div>
    </div>
  )
}
