import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'
import { Input } from '@/shared/ui/input'
import { useTranslation } from '@/shared/lib/i18n'
import {
  CATEGORY_ATTRIBUTES,
  getAttributeLabel,
} from '@/shared/lib/constants/category-attributes'
import { DynamicAttributesProps } from './types'

export function DynamicAttributes({
  category,
  dynamicAttrs,
  onAttrChange,
  locale,
}: DynamicAttributesProps) {
  const { t } = useTranslation(['filters', 'common'])
  const currentCategoryAttributes = category
    ? CATEGORY_ATTRIBUTES[category]
    : []

  if (!currentCategoryAttributes || currentCategoryAttributes.length === 0)
    return null

  return (
    <>
      <div className="bg-border/40 my-2 h-px w-full" />
      <div className="space-y-6">
        {currentCategoryAttributes.map((attr) => (
          <div key={attr.id} className="space-y-3">
            <label className="text-muted-foreground/60 flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase">
              {getAttributeLabel(attr, locale)}
              {attr.unit && (
                <span className="lowercase opacity-60">({attr.unit})</span>
              )}
            </label>

            {attr.type === 'select' && (
              <Select
                value={dynamicAttrs[attr.id] || 'all'}
                onValueChange={(v) =>
                  onAttrChange(attr.id, v === 'all' ? '' : v)
                }
              >
                <SelectTrigger className="border-border/60 bg-muted/20 h-11 w-full rounded-xl font-bold">
                  <SelectValue placeholder={t('common:all')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('common:all')}</SelectItem>
                  {attr.options?.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label[locale] || opt.label['en']}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {attr.type === 'range' && (
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  value={dynamicAttrs[attr.id]?.min || ''}
                  onChange={(e) =>
                    onAttrChange(attr.id, {
                      ...dynamicAttrs[attr.id],
                      min: e.target.value,
                    })
                  }
                  placeholder={t('filters:min') || 'Min'}
                />
                <Input
                  type="number"
                  value={dynamicAttrs[attr.id]?.max || ''}
                  onChange={(e) =>
                    onAttrChange(attr.id, {
                      ...dynamicAttrs[attr.id],
                      max: e.target.value,
                    })
                  }
                  placeholder={t('filters:max') || 'Max'}
                />
              </div>
            )}

            {attr.type === 'text' && (
              <Input
                type="text"
                value={dynamicAttrs[attr.id] || ''}
                onChange={(e) => onAttrChange(attr.id, e.target.value)}
              />
            )}
          </div>
        ))}
      </div>
    </>
  )
}
