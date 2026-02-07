'use client'
// Category selector component
// Simple dropdown for selecting category

import { useState, useEffect } from 'react'
import type { Category } from '@/lib/types/database'
import { getMainCategories } from '@/lib/supabase/categories'
import { useTranslation } from '@/lib/i18n'
import { getLocalizedCategoryName } from '@/lib/utils/category-i18n'

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
    return <div className="text-muted-foreground">{t('loading')}</div>
  }

  if (error) {
    return (
      <div className="text-destructive">
        {t('error')}: {error}
      </div>
    )
  }

  return (
    <div className="w-full">
      <label
        htmlFor="category"
        className="text-muted-foreground mb-2 block text-sm font-medium"
      >
        {t('categoryLabel')}
      </label>
      <select
        id="category"
        value={selectedCategoryId}
        onChange={(e) => onSelect(e.target.value)}
        className="border-input bg-muted/30 focus:border-primary/50 focus:ring-primary/20 w-full rounded-lg border px-4 py-2 transition-all focus:ring-1 focus:outline-none"
      >
        <option value="">{t('selectCategory')}</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {getLocalizedCategoryName(category, locale, t)}
          </option>
        ))}
      </select>
    </div>
  )
}
