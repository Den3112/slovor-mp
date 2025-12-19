'use client'
// Category Selector - Simple dropdown for choosing category
// Following Principles: Minimal, Clear, No magic

import { useState, useEffect } from 'react'
import type { Category } from '@/lib/types/database'
import { getMainCategories, getCategoryWithSubcategories } from '@/lib/supabase/categories'

interface CategorySelectorProps {
  onSelect: (categoryId: string, subcategoryId?: string) => void
  selectedCategoryId?: string
  selectedSubcategoryId?: string
}

export function CategorySelector({
  onSelect,
  selectedCategoryId,
  selectedSubcategoryId
}: CategorySelectorProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [subcategories, setSubcategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load main categories on mount
  useEffect(() => {
    loadCategories()
  }, [])

  // Load subcategories when category selected
  useEffect(() => {
    if (selectedCategoryId) {
      loadSubcategories(selectedCategoryId)
    } else {
      setSubcategories([])
    }
  }, [selectedCategoryId])

  async function loadCategories() {
    setLoading(true)
    const result = await getMainCategories()
    if (result.error) {
      setError(result.error)
    } else {
      setCategories(result.data)
    }
    setLoading(false)
  }

  async function loadSubcategories(categoryId: string) {
    const category = categories.find((c) => c.id === categoryId)
    if (!category) return

    const result = await getCategoryWithSubcategories(category.slug)
    if (result.error) {
      setError(result.error)
    } else {
      setSubcategories(result.data.subcategories || [])
    }
  }

  function handleCategoryChange(categoryId: string) {
    onSelect(categoryId)
  }

  function handleSubcategoryChange(subcategoryId: string) {
    if (selectedCategoryId) {
      onSelect(selectedCategoryId, subcategoryId)
    }
  }

  if (loading) {
    return <div className="text-gray-500">Loading categories...</div>
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>
  }

  return (
    <div className="space-y-4">
      {/* Main Category */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Category *
        </label>
        <select
          value={selectedCategoryId || ''}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Select category...</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.icon} {category.name_sk}
            </option>
          ))}
        </select>
      </div>

      {/* Subcategory (shown only if category selected) */}
      {subcategories.length > 0 && (
        <div>
          <label className="block text-sm font-medium mb-2">
            Subcategory
          </label>
          <select
            value={selectedSubcategoryId || ''}
            onChange={(e) => handleSubcategoryChange(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select subcategory...</option>
            {subcategories.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name_sk}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  )
}
