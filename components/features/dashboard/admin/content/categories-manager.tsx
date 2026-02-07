'use client'

import { useEffect, useState, useCallback } from 'react'
import { categoriesApi, type Category } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Save,
  X,
  Search,
  FolderOpen,
} from 'lucide-react'
import { toast } from 'sonner'

import { useTranslation } from '@/lib/i18n'

export function CategoriesManager() {
  const { t } = useTranslation('common')
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    name_sk: '',
    name_cs: '',
    name_en: '',
    icon_name: '',
    order_index: 0,
    description: '',
    icon: '',
    color: '',
  })

  const loadCategories = useCallback(async () => {
    setIsLoading(true)
    const { data, error } = await categoriesApi.getAll()
    if (data) setCategories(data)
    if (error) toast.error(t('admin:failedToLoadCategories'))
    setIsLoading(false)
  }, [t])

  useEffect(() => {
    loadCategories()
  }, [loadCategories])

  const handleEdit = (category: Category) => {
    setEditingId(category.id)
    setFormData({
      name: category.name || '',
      slug: category.slug || '',
      name_sk: category.name_sk || '',
      name_cs: category.name_cs || '',
      name_en: category.name_en || '',
      icon_name: category.icon_name || '',
      order_index: category.order_index || 0,
      description: category.description || '',
      icon: category.icon || '',
      color: category.color || '',
    })
  }

  const handleCancel = () => {
    setEditingId(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (editingId) {
        if (editingId === 'new') {
          const { error } = await categoriesApi.create(formData)
          if (error) throw new Error(error)
          toast.success(t('admin:categoryCreated'))
        } else {
          const { error } = await categoriesApi.update(editingId, formData)
          if (error) throw new Error(error)
          toast.success(t('admin:categoryUpdated'))
        }
        setEditingId(null)
        loadCategories()
      }
    } catch (error: any) {
      toast.error(error.message || t('admin:failedToDeleteCategory'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm(t('admin:confirmDeleteCategory'))) return

    const { error } = await categoriesApi.delete(id)
    if (!error) {
      toast.success(t('admin:categoryDeleted'))
      loadCategories()
    } else {
      toast.error(t('admin:failedToDeleteCategory'))
    }
  }

  const filteredCategories = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.slug.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="group relative max-w-md flex-1">
          <Search className="text-muted-foreground group-focus-within:text-primary absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 transition-colors" />
          <Input
            placeholder={t('admin:searchCategories')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-card border-border h-11 rounded-lg pl-12 text-xs font-bold tracking-widest uppercase transition-all"
          />
        </div>
        <Button
          onClick={() => {
            setEditingId('new')
            setFormData({
              name: '',
              slug: '',
              name_sk: '',
              name_cs: '',
              name_en: '',
              icon_name: '',
              order_index: categories.length,
              description: '',
              icon: '',
              color: '',
            })
          }}
          className="h-11 rounded-lg px-6 text-[10px] font-bold tracking-widest uppercase"
        >
          <Plus className="mr-2 h-4 w-4" /> {t('admin:addCategory')}
        </Button>
      </div>

      <div className="bg-card border-border overflow-hidden rounded-lg border shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted/10 border-border/40 border-b">
                <th className="text-muted-foreground px-6 py-4 text-left text-[10px] font-bold tracking-widest uppercase">
                  {t('admin:tableListing')} / {t('admin:inputSlug')}
                </th>
                <th className="text-muted-foreground px-6 py-4 text-left text-[10px] font-bold tracking-widest uppercase">
                  {t('admin:tableTranslations')}
                </th>
                <th className="text-muted-foreground px-6 py-4 text-left text-[10px] font-bold tracking-widest uppercase">
                  {t('admin:tableIconOrder')}
                </th>
                <th className="text-muted-foreground px-6 py-4 text-right text-[10px] font-bold tracking-widest uppercase">
                  {t('admin:tableActions')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-border/50 divide-y">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <Loader2 className="text-primary mx-auto h-8 w-8 animate-spin" />
                  </td>
                </tr>
              ) : filteredCategories.length === 0 && editingId !== 'new' ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <p className="text-muted-foreground font-medium">
                      {t('admin:noCategoriesFound')}
                    </p>
                  </td>
                </tr>
              ) : (
                <>
                  {editingId === 'new' && (
                    <tr className="bg-primary/5">
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <Input
                            size={30}
                            value={formData.name}
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                            placeholder={t('admin:inputName')}
                            className="h-9 rounded-lg text-sm"
                          />
                          <Input
                            value={formData.slug}
                            onChange={(e) =>
                              setFormData({ ...formData, slug: e.target.value })
                            }
                            placeholder={t('admin:inputSlug')}
                            className="h-9 rounded-lg text-sm"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="grid grid-cols-1 gap-2">
                          <Input
                            value={formData.name_sk}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                name_sk: e.target.value,
                              })
                            }
                            placeholder="SK"
                            className="h-8 rounded-lg text-xs"
                          />
                          <Input
                            value={formData.name_cs}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                name_cs: e.target.value,
                              })
                            }
                            placeholder="CS"
                            className="h-8 rounded-lg text-xs"
                          />
                          <Input
                            value={formData.name_en}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                name_en: e.target.value,
                              })
                            }
                            placeholder="EN"
                            className="h-8 rounded-lg text-xs"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Input
                            value={formData.icon_name}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                icon_name: e.target.value,
                              })
                            }
                            placeholder={t('admin:icon')}
                            className="h-9 rounded-lg text-sm"
                          />
                          <Input
                            type="number"
                            value={formData.order_index}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                order_index: parseInt(e.target.value),
                              })
                            }
                            className="h-9 w-20 rounded-lg text-sm"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="h-9 w-9 rounded-lg p-0"
                          >
                            {isSubmitting ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Save className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={handleCancel}
                            className="h-9 w-9 rounded-lg p-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )}
                  {filteredCategories.map((category) => (
                    <tr
                      key={category.id}
                      className="group hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        {editingId === category.id ? (
                          <div className="max-w-[200px] space-y-2">
                            <Input
                              value={formData.name}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  name: e.target.value,
                                })
                              }
                              placeholder={t('admin:displayName')}
                              className="h-9 rounded-lg text-sm"
                            />
                            <Input
                              value={formData.slug}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  slug: e.target.value,
                                })
                              }
                              placeholder={t('admin:inputSlug')}
                              className="h-9 rounded-lg text-sm"
                            />
                          </div>
                        ) : (
                          <div>
                            <p className="text-foreground font-bold">
                              {category.name}
                            </p>
                            <p className="text-muted-foreground font-mono text-xs">
                              {category.slug}
                            </p>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {editingId === category.id ? (
                          <div className="grid max-w-[200px] grid-cols-1 gap-2">
                            <Input
                              value={formData.name_sk}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  name_sk: e.target.value,
                                })
                              }
                              placeholder="SK"
                              className="h-8 rounded-lg text-xs"
                            />
                            <Input
                              value={formData.name_cs}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  name_cs: e.target.value,
                                })
                              }
                              placeholder="CS"
                              className="h-8 rounded-lg text-xs"
                            />
                            <Input
                              value={formData.name_en}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  name_en: e.target.value,
                                })
                              }
                              placeholder="EN"
                              className="h-8 rounded-lg text-xs"
                            />
                          </div>
                        ) : (
                          <div className="flex flex-wrap gap-1.5">
                            <span className="bg-muted/40 text-muted-foreground border-border/40 rounded border px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase">
                              {category.name_sk || 'SK'}
                            </span>
                            <span className="bg-muted/40 text-muted-foreground border-border/40 rounded border px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase">
                              {category.name_cs || 'CS'}
                            </span>
                            <span className="bg-muted/40 text-muted-foreground border-border/40 rounded border px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase">
                              {category.name_en || 'EN'}
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {editingId === category.id ? (
                          <div className="flex max-w-[150px] gap-2">
                            <Input
                              value={formData.icon_name}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  icon_name: e.target.value,
                                })
                              }
                              placeholder={t('admin:icon')}
                              className="h-9 rounded-lg text-sm"
                            />
                            <Input
                              type="number"
                              value={formData.order_index}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  order_index: parseInt(e.target.value),
                                })
                              }
                              className="h-9 w-20 rounded-lg text-sm"
                            />
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <div className="bg-primary/10 text-primary rounded-lg p-2">
                              <FolderOpen className="h-4 w-4" />
                            </div>
                            <span className="text-muted-foreground text-xs font-bold">
                              {t('admin:tableOrder')}: {category.order_index}
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          {editingId === category.id ? (
                            <>
                              <Button
                                size="sm"
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="h-9 w-9 rounded-lg p-0"
                              >
                                {isSubmitting ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Save className="h-4 w-4" />
                                )}
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={handleCancel}
                                className="h-9 w-9 rounded-lg p-0"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEdit(category)}
                                className="hover:bg-primary/10 hover:text-primary h-9 w-9 rounded-lg p-0"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDelete(category.id)}
                                className="hover:bg-destructive/10 hover:text-destructive h-9 w-9 rounded-lg p-0"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
