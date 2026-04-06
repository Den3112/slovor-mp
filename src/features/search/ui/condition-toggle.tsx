import { Button } from '@/shared/ui/button'
import { useTranslation } from '@/shared/lib/i18n'
import { cn } from '@/shared/lib/utils'
import { ConditionToggleProps } from './types'

export function ConditionToggle({ value, onChange }: ConditionToggleProps) {
  const { t } = useTranslation(['filters', 'common'])

  return (
    <div className="space-y-3">
      <div className="bg-muted/20 border-border/60 flex rounded-xl border p-1">
        {[
          { value: '', label: t('common:all') || 'All' },
          { value: 'new', label: t('filters:new') },
          { value: 'used', label: t('filters:used') },
        ].map((c) => (
          <Button
            variant="ghost"
            key={c.value}
            onClick={() => onChange(c.value)}
            className={cn(
              'h-auto flex-1 rounded-xl py-2 text-[10px] font-bold tracking-widest uppercase transition-all',
              value === c.value
                ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
            )}
          >
            {c.label}
          </Button>
        ))}
      </div>
    </div>
  )
}
