'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Layers, Edit3, Trash2 } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import { categoriesApi, type Category } from '@/lib/api'
import { Button } from '@/components/ui/button'
import {
  DataGrid,
  type Column,
} from '@/components/features/dashboard/shared/data-grid'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { StatsCard } from '@/components/features/dashboard/shared/stats-card'

import {
  CategoryHeader,
  CategoryFormDialog,
  CategoryDeleteDialog,
  CategoryFormData,
} from './sub-components'

import { CategoryIcon } from '@/components/category/category-icon'

export function AdminCategoriesView() {
  const namespaces = useMemo(() => ['common', 'admin'], [])
  const { t } = useTranslation(namespaces)
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const loadingRef = React.useRef(false)
  const tRef = React.useRef(t)

  // Keep tRef in sync
  useEffect(() => {
    tRef.current = t
  }, [t])

  // Dialog states
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Delete states
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // Form states
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    slug: '',
    description: '',
    icon: '',
    icon_name: '',
    color: '',
    order_index: 0,
  })

  const loadCategories = useCallback(async () => {
    if (loadingRef.current) return
    loadingRef.current = true
    setIsLoading(true)

    try {
      const { data, error } = await categoriesApi.getAll()
      if (error) {
        console.error('API Error details:', error)
        throw new Error(
          typeof error === 'string' ? error : JSON.stringify(error)
        )
      }
      if (data) {
        setCategories(data)
      }
    } catch (error: any) {
      console.error('Failed to load categories:', error)
      toast.error(tRef.current('admin:failedToLoadCategories'))
    } finally {
      setIsLoading(false)
      loadingRef.current = false
    }
  }, []) // TRULY STABLE

  useEffect(() => {
    loadCategories()
  }, [loadCategories])

  const handleOpenDialog = (category: Category | null = null) => {
    if (category) {
      setEditingCategory(category)
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description || '',
        icon: category.icon || '',
        icon_name: category.icon_name || '',
        color: category.color || '',
        order_index: category.order_index || 0,
      })
    } else {
      setEditingCategory(null)
      setFormData({
        name: '',
        slug: '',
        description: '',
        icon: '',
        icon_name: '',
        color: '',
        order_index: 0,
      })
    }
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    const payload = {
      ...formData,
      description: formData.description || null,
      icon: formData.icon || null,
      icon_name: formData.icon_name || null,
      color: formData.color || null,
    }

    try {
      if (editingCategory) {
        const { error } = await categoriesApi.update(
          editingCategory.id,
          payload
        )
        if (error) throw new Error(error)
        toast.success(t('admin:categoryUpdated'))
      } else {
        const { error } = await categoriesApi.create(payload)
        if (error) throw new Error(error)
        toast.success(t('admin:categoryCreated'))
      }
      setIsDialogOpen(false)
      loadCategories()
    } catch (error) {
      toast.error((error as Error).message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setIsSubmitting(true)
    try {
      const { error } = await categoriesApi.delete(deleteId)
      if (error) throw new Error(error)
      toast.success(t('admin:categoryDeleted'))
      setCategories((prev) => prev.filter((c) => c.id !== deleteId))
    } catch (error) {
      toast.error((error as Error).message)
    } finally {
      setIsSubmitting(false)
      setDeleteId(null)
    }
  }

  const filteredCategories = useMemo(() => {
    if (!searchQuery) return categories
    const q = searchQuery.toLowerCase()
    return categories.filter(
      (c) =>
        c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q)
    )
  }, [categories, searchQuery])

  const stats = useMemo(() => {
    const total = categories.length
    const active = categories.filter((c) => (c.listing_count || 0) > 0).length
    const empty = total - active
    return { total, active, empty }
  }, [categories])

  const columns: Column<Category>[] = useMemo(
    () => [
      {
        key: 'name',
        header: t('admin:tableName'),
        sortable: true,
        className: 'min-w-[200px]',
        cell: (row) => (
          <div className="flex items-center gap-3">
            <CategoryIcon
              slug={row.slug}
              iconName={row.icon_name}
              iconEmoji={row.icon}
              showBackground={false}
              className="h-5 w-5"
            />
            <div className="flex flex-col">
              <span className="text-foreground text-sm font-bold tracking-tight">
                {row.name}
              </span>
              <span className="text-muted-foreground/40 text-[10px] font-bold tracking-widest uppercase">
                {row.slug}
              </span>
            </div>
          </div>
        ),
      },
      {
        key: 'listing_count',
        header: t('admin:tableListings'),
        sortable: true,
        cell: (row) => (
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="bg-muted/50 border-border/40 rounded-xl px-3 py-1 text-[10px] font-bold tracking-widest uppercase"
            >
              {row.listing_count || 0}
            </Badge>
          </div>
        ),
      },
      {
        key: 'actions',
        header: '',
        className: 'text-right',
        cell: (row) => (
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleOpenDialog(row)}
              className="hover:bg-primary/10 hover:text-primary h-8 w-8 rounded-xl transition-all"
            >
              <Edit3 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDeleteId(row.id)}
              className="hover:bg-destructive/10 hover:text-destructive h-8 w-8 rounded-xl transition-all"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ],
    [t]
  )

  return (
    <div className="space-y-8" data-testid="admin-categories-view">
      <CategoryHeader onAdd={() => handleOpenDialog()} />

      {/* Summary Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatsCard
          label={t('admin:statTotalCategories')}
          value={stats.total}
          icon={Layers}
        />
        <StatsCard
          label={t('admin:statActiveCategories')}
          value={stats.active}
          icon={Edit3}
          className="border-success/20"
        />
        <StatsCard
          label={t('admin:statEmptyCategories')}
          value={stats.empty}
          icon={Trash2}
          className="border-destructive/20"
        />
      </div>

      <DataGrid
        columns={columns}
        data={filteredCategories}
        isLoading={isLoading}
        onSearch={setSearchQuery}
        searchPlaceholder={t('admin:searchCategoriesPlaceholder')}
        emptyMessage={t('admin:emptyCategoriesMessage')}
      />

      <CategoryFormDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editingCategory={editingCategory}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />

      <CategoryDeleteDialog
        deleteId={deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onDelete={handleDelete}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}
