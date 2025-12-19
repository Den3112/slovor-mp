'use client'
// Category selector component
// Simple dropdown for selecting category

import { useState, useEffect } from 'react'
import type { Category } from '@/lib/types/database'
import { getMainCategories } from '@/lib/supabase/categories'

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

  useEffect(() => {
    loadCategories()
  }, [])

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

  if (loading) {
    return <div className="text-gray-500">Loading categories...</div>
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>
  }

  return (
    <div className="w-full">
      <label
        htmlFor="category"
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        Category
      </label>
      <select
        id="category"
        value={selectedCategoryId}
        onChange={(e) => onSelect(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="">Select a category</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.icon} {category.name}
          </option>
        ))}
      </select>
    </div>
  )
}
