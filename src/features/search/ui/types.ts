import { Category } from '@/shared/lib/types/database'

export interface CategorySelectProps {
  categories: Category[]
  value: string
  onChange: (value: string) => void
  locale: string
}

export interface LocationSelectProps {
  value: string
  onChange: (value: string) => void
}

export interface PriceRangeProps {
  min: string
  max: string
  onMinChange: (val: string) => void
  onMaxChange: (val: string) => void
}

export interface ConditionToggleProps {
  value: string
  onChange: (value: string) => void
}

export interface SortSelectProps {
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
}

export interface DynamicAttributesProps {
  category: string
  dynamicAttrs: Record<string, any>
  onAttrChange: (attrId: string, value: any) => void
  locale: string
}
