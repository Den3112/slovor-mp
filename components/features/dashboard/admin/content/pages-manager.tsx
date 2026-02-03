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
    ExternalLink
} from 'lucide-react'
import { toast } from 'sonner'

import { useTranslation } from '@/lib/i18n'

export function PagesManager() {
    const { t, i18n } = useTranslation(['common', 'admin'])
    const [pages, setPages] = useState<StaticPage[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [editingPage, setEditingPage] = useState<Partial<StaticPage> | null>(null)
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
            content: ''
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
            let result;
            if (editingPage.id) {
                result = await pagesApi.update(editingPage.id, editingPage)
            } else {
                result = await pagesApi.create(editingPage)
            }

            if (result.error) throw new Error(result.error)

            toast.success(editingPage.id ? t('admin:pageUpdated') : t('admin:pageCreated'))
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

    const filteredPages = pages.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.slug.toLowerCase().includes(searchQuery.toLowerCase())
    )

    if (editingPage) {
        return (
            <div className="bg-card border border-border rounded-xl p-6 md:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-300 shadow-sm">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black italic">{editingPage.id ? t('admin:editPage') : t('admin:newPage')}</h3>
                    <Button variant="ghost" size="sm" onClick={handleCancel} className="rounded-xl">
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">{t('admin:pageTitle')}</label>
                            <Input
                                value={editingPage.title || ''}
                                onChange={e => setEditingPage({ ...editingPage, title: e.target.value })}
                                placeholder={t('admin:pageTitlePlaceholder')}
                                className="h-11 rounded-xl"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">{t('admin:urlSlug')}</label>
                            <Input
                                value={editingPage.slug || ''}
                                onChange={e => setEditingPage({ ...editingPage, slug: e.target.value })}
                                placeholder={t('admin:pageSlugPlaceholder')}
                                className="h-11 rounded-xl"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">{t('admin:pageContent')}</label>
                        <textarea
                            value={editingPage.content || ''}
                            onChange={e => setEditingPage({ ...editingPage, content: e.target.value })}
                            placeholder={t('admin:pageContent')}
                            className="w-full min-h-[400px] p-4 rounded-xl bg-muted/50 border border-border/50 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none transition-all font-mono text-sm leading-relaxed"
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-border/40">
                        <Button variant="outline" type="button" onClick={handleCancel} className="rounded-xl px-6 h-11 text-[10px] font-black uppercase tracking-widest">
                            {t('common:cancel')}
                        </Button>
                        <Button disabled={isSubmitting} className="rounded-xl px-8 h-11 font-black uppercase tracking-widest text-[10px] shadow-sm">
                            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
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
                <div className="relative group flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                        placeholder={t('admin:searchPages')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-12 h-11 rounded-xl bg-card border-border transition-all font-bold text-xs uppercase tracking-widest"
                    />
                </div>
                <Button onClick={handleCreate} className="rounded-xl font-black uppercase tracking-widest text-[10px] h-11 px-6">
                    <Plus className="mr-2 h-4 w-4" /> {t('admin:newPage')}
                </Button>
            </div>

            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-muted/10 border-b border-border/40">
                                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t('admin:tablePageName')}</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t('admin:inputSlug')}</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t('admin:tableLastUpdated')}</th>
                                <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t('admin:tableActions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center">
                                        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                                    </td>
                                </tr>
                            ) : filteredPages.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center">
                                        <p className="text-muted-foreground font-medium">{t('admin:noPagesFound')}</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredPages.map((page) => (
                                    <tr key={page.id} className="group hover:bg-muted/30 transition-colors">
                                        <td className="px-6 py-6 border-l-4 border-transparent group-hover:border-primary transition-all">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-primary/10 p-2 rounded-lg text-primary">
                                                    <Layout className="h-4 w-4" />
                                                </div>
                                                <span className="font-bold text-foreground">{page.title}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <code className="bg-muted px-2 py-1 rounded text-xs font-mono text-muted-foreground ring-1 ring-border/50">
                                                /{page.slug}
                                            </code>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-muted-foreground">
                                            {page.updated_at ? new Date(page.updated_at).toLocaleDateString(i18n.language) : t('admin:notAvailable')}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => window.open(`/${page.slug}`, '_blank')}
                                                    className="rounded-lg h-9 w-9 p-0 hover:bg-indigo-500/10 hover:text-indigo-500"
                                                >
                                                    <ExternalLink className="h-4 w-4" />
                                                </Button>
                                                <Button size="sm" variant="ghost" onClick={() => handleEdit(page)} className="rounded-lg h-9 w-9 p-0 hover:bg-primary/10 hover:text-primary">
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button size="sm" variant="ghost" onClick={() => handleDelete(page.id)} className="rounded-lg h-9 w-9 p-0 hover:bg-destructive/10 hover:text-destructive">
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
