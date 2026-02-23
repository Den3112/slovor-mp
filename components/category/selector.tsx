'use client'

import { useState, useEffect } from 'react'
import type { Category } from '@/lib/types/database'
import { getMainCategories } from '@/lib/supabase/categories'
import { useTranslation } from '@/lib/i18n'
import { getLocalizedCategoryName } from '@/lib/utils/category-i18n'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CategoryIcon } from '@/components/category/category-icon'

interface CategorySelectorProps {
  onSelect: (categoryId: string) => void
  selectedCategoryId?: string
}

export function CategorySelector({
  onSelect,
  selectedCategoryId = '',
}: CategorySelectorProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { t, i18n } = useTranslation('common')
  const locale = i18n.language

  useEffect(() => {
    loadCategories()
  }, [])

  async function loadCategories() {
    setLoading(true)
    const result = await getMainCategories()

    if (result.error) {
      setError(result.error)
    } else if (result.data) {
      setCategories(result.data)
    }

    setLoading(false)
  }

  if (loading) {
    return (
      <div className="border-border bg-muted/20 h-11 w-full animate-pulse rounded-xl border" />
    )
  }

  if (error) {
    return (
      <div className="text-destructive p-2 text-xs font-bold">
        {t('error')}: {error}
      </div>
    )
  }

  return (
    <div className="w-full space-y-2">
      <label
        htmlFor="category"
        className="text-muted-foreground block text-xs font-bold tracking-widest uppercase"
      >
        {t('categoryLabel')}
      </label>
      <Select value={selectedCategoryId} onValueChange={onSelect}>
        <SelectTrigger className="border-border/60 bg-muted/20 h-11 w-full rounded-xl font-bold">
          <SelectValue placeholder={t('selectCategory')} />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              <div className="flex items-center gap-2">
                <CategoryIcon
                  slug={category.slug}
                  showBackground={false}
                  size="sm"
                />
                <span>{getLocalizedCategoryName(category, locale, t)}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
