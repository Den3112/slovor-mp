'use client'

import { useEffect, useState, useCallback } from 'react'
import { pagesApi, type StaticPage } from '@/lib/api'
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
  Layout,
  ExternalLink,
} from 'lucide-react'
import { toast } from 'sonner'

import { useTranslation } from '@/lib/i18n'

export function PagesManager() {
  const { t, i18n } = useTranslation(['common', 'admin'])
  const [pages, setPages] = useState<StaticPage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [editingPage, setEditingPage] = useState<Partial<StaticPage> | null>(
    null
  )
  const [isSubmitting, setIsSubmitting] = useState(false)

  const loadPages = useCallback(async () => {
    setIsLoading(true)
    const { data, error } = await pagesApi.getAll()
    if (data) setPages(data)
    if (error) toast.error(t('admin:failedToLoadPages'))
    setIsLoading(false)
  }, [t])

  useEffect(() => {
    loadPages()
  }, [loadPages])

  const handleEdit = (page: StaticPage) => {
    setEditingPage(page)
  }

  const handleCreate = () => {
    setEditingPage({
      title: '',
      slug: '',
      content: '',
    })
  }

  const handleCancel = () => {
    setEditingPage(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingPage) return
    setIsSubmitting(true)

    try {
      let result
      if (editingPage.id) {
        result = await pagesApi.update(editingPage.id, editingPage)
      } else {
        result = await pagesApi.create(editingPage)
      }

      if (result.error) throw new Error(result.error)

      toast.success(
        editingPage.id ? t('admin:pageUpdated') : t('admin:pageCreated')
      )
      setEditingPage(null)
      loadPages()
    } catch (error: any) {
      toast.error(error.message || t('admin:failedToLoadPages'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm(t('admin:confirmDeletePage'))) return

    const { error } = await pagesApi.delete(id)
    if (!error) {
      toast.success(t('admin:pageDeleted'))
      loadPages()
    } else {
      toast.error(t('admin:failedToDeletePage'))
    }
  }

  const filteredPages = pages.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (editingPage) {
    return (
      <div className="bg-card border-border animate-in fade-in zoom-in-95 space-y-6 rounded-lg border p-6 shadow-sm duration-300 md:p-8">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold">
            {editingPage.id ? t('admin:editPage') : t('admin:newPage')}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="rounded-lg"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
                {t('admin:pageTitle')}
              </label>
              <Input
                value={editingPage.title || ''}
                onChange={(e) =>
                  setEditingPage({ ...editingPage, title: e.target.value })
                }
                placeholder={t('admin:pageTitlePlaceholder')}
                className="h-11 rounded-lg"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
                {t('admin:urlSlug')}
              </label>
              <Input
                value={editingPage.slug || ''}
                onChange={(e) =>
                  setEditingPage({ ...editingPage, slug: e.target.value })
                }
                placeholder={t('admin:pageSlugPlaceholder')}
                className="h-11 rounded-lg"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
              {t('admin:pageContent')}
            </label>
            <textarea
              value={editingPage.content || ''}
              onChange={(e) =>
                setEditingPage({ ...editingPage, content: e.target.value })
              }
              placeholder={t('admin:pageContent')}
              className="bg-muted/50 border-border/50 focus:border-primary/50 focus:ring-primary/10 min-h-[400px] w-full rounded-lg border p-4 font-mono text-sm leading-relaxed transition-all outline-none focus:ring-4"
              required
            />
          </div>

          <div className="border-border/40 flex justify-end gap-3 border-t pt-4">
            <Button
              variant="outline"
              type="button"
              onClick={handleCancel}
              className="h-11 rounded-lg px-6 text-[10px] font-bold tracking-widest uppercase"
            >
              {t('common:cancel')}
            </Button>
            <Button
              disabled={isSubmitting}
              className="h-11 rounded-lg px-8 text-[10px] font-bold tracking-widest uppercase shadow-sm"
            >
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              {editingPage.id ? t('admin:pageUpdated') : t('admin:pageCreated')}
            </Button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="group relative max-w-md flex-1">
          <Search className="text-muted-foreground group-focus-within:text-primary absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 transition-colors" />
          <Input
            placeholder={t('admin:searchPages')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-card border-border h-11 rounded-lg pl-12 text-xs font-bold tracking-widest uppercase transition-all"
          />
        </div>
        <Button
          onClick={handleCreate}
          className="h-11 rounded-lg px-6 text-[10px] font-bold tracking-widest uppercase"
        >
          <Plus className="mr-2 h-4 w-4" /> {t('admin:newPage')}
        </Button>
      </div>

      <div className="bg-card border-border overflow-hidden rounded-lg border shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted/10 border-border/40 border-b">
                <th className="text-muted-foreground px-6 py-4 text-left text-[10px] font-bold tracking-widest uppercase">
                  {t('admin:tablePageName')}
                </th>
                <th className="text-muted-foreground px-6 py-4 text-left text-[10px] font-bold tracking-widest uppercase">
                  {t('admin:inputSlug')}
                </th>
                <th className="text-muted-foreground px-6 py-4 text-left text-[10px] font-bold tracking-widest uppercase">
                  {t('admin:tableLastUpdated')}
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
              ) : filteredPages.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <p className="text-muted-foreground font-medium">
                      {t('admin:noPagesFound')}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredPages.map((page) => (
                  <tr
                    key={page.id}
                    className="group hover:bg-muted/30 transition-colors"
                  >
                    <td className="group-hover:border-primary border-l-4 border-transparent px-6 py-6 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 text-primary rounded-lg p-2">
                          <Layout className="h-4 w-4" />
                        </div>
                        <span className="text-foreground font-bold">
                          {page.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <code className="bg-muted text-muted-foreground ring-border/50 rounded px-2 py-1 font-mono text-xs ring-1">
                        /{page.slug}
                      </code>
                    </td>
                    <td className="text-muted-foreground px-6 py-4 text-sm font-medium">
                      {page.updated_at
                        ? new Date(page.updated_at).toLocaleDateString(
                            i18n.language
                          )
                        : t('admin:notAvailable')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => window.open(`/${page.slug}`, '_blank')}
                          className="h-9 w-9 rounded-lg p-0 hover:bg-indigo-500/10 hover:text-indigo-500"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(page)}
                          className="hover:bg-primary/10 hover:text-primary h-9 w-9 rounded-lg p-0"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(page.id)}
                          className="hover:bg-destructive/10 hover:text-destructive h-9 w-9 rounded-lg p-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
