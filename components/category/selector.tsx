'use client'
// Category selector component
// Simple dropdown for selecting category

import { useState, useEffect } from 'react'
import type { Category } from '@/lib/types/database'
import { getMainCategories } from '@/lib/supabase/categories'
import { useTranslation } from '@/lib/i18n'
import { getCategoryName } from '@/lib/utils/category-helpers'

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
  const { t, locale } = useTranslation()

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
    return <div className="text-muted-foreground">{t.common.loading}</div>
  }

  if (error) {
    return <div className="text-destructive">{t.common.error}: {error}</div>
  }

  return (
    <div className="w-full">
      <label
        htmlFor="category"
        className="mb-2 block text-sm font-medium text-muted-foreground"
      >
        {t.listing.categoryLabel}
      </label>
      <select
        id="category"
        value={selectedCategoryId}
        onChange={(e) => onSelect(e.target.value)}
        className="w-full rounded-xl border border-input bg-muted/30 px-4 py-2 transition-all focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20"
      >
        <option value="">{t.common.selectCategory}</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.icon} {getCategoryName(category, locale, t)}
          </option>
        ))}
      </select>
    </div>
  )
}
