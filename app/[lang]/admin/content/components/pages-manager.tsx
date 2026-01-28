'use client'

import { useEffect, useState } from 'react'
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

export function PagesManager() {
    const [pages, setPages] = useState<StaticPage[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [editingPage, setEditingPage] = useState<Partial<StaticPage> | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        loadPages()
    }, [])

    async function loadPages() {
        setIsLoading(true)
        const { data, error } = await pagesApi.getAll()
        if (data) setPages(data)
        if (error) toast.error('Failed to load pages')
        setIsLoading(false)
    }

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

            toast.success(editingPage.id ? 'Page updated' : 'Page created')
            setEditingPage(null)
            loadPages()
        } catch (error: any) {
            toast.error(error.message || 'Operation failed')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this page? This will make the URL unavailable.')) return

        const { error } = await pagesApi.delete(id)
        if (!error) {
            toast.success('Page deleted')
            loadPages()
        } else {
            toast.error('Failed to delete page')
        }
    }

    const filteredPages = pages.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.slug.toLowerCase().includes(searchQuery.toLowerCase())
    )

    if (editingPage) {
        return (
            <div className="bg-card border border-border/50 rounded-3xl p-6 md:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-300 shadow-2xl">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black italic">{editingPage.id ? 'Edit Page' : 'New Page'}</h3>
                    <Button variant="ghost" size="sm" onClick={handleCancel} className="rounded-full">
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Page Title</label>
                            <Input
                                value={editingPage.title || ''}
                                onChange={e => setEditingPage({ ...editingPage, title: e.target.value })}
                                placeholder="e.g. Terms of Service"
                                className="h-11 rounded-xl"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Url Slug</label>
                            <Input
                                value={editingPage.slug || ''}
                                onChange={e => setEditingPage({ ...editingPage, slug: e.target.value })}
                                placeholder="e.g. terms-of-service"
                                className="h-11 rounded-xl"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Page Content (HTML/Markdown supported)</label>
                        <textarea
                            value={editingPage.content || ''}
                            onChange={e => setEditingPage({ ...editingPage, content: e.target.value })}
                            placeholder="Write page content here..."
                            className="w-full min-h-[400px] p-4 rounded-2xl bg-muted/50 border border-border/50 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none transition-all font-mono text-sm leading-relaxed"
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
                        <Button variant="outline" type="button" onClick={handleCancel} className="rounded-xl px-6">
                            Cancel
                        </Button>
                        <Button disabled={isSubmitting} className="rounded-xl px-8 font-black uppercase tracking-widest shadow-lg shadow-primary/20">
                            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                            {editingPage.id ? 'Save Changes' : 'Create Page'}
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
                        placeholder="Search pages..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-12 h-11 rounded-2xl bg-card/50 border-border/50 focus:bg-card transition-all"
                    />
                </div>
                <Button onClick={handleCreate} className="rounded-xl font-bold">
                    <Plus className="mr-2 h-4 w-4" /> New Page
                </Button>
            </div>

            <div className="bg-card/50 border border-border/50 rounded-3xl overflow-hidden backdrop-blur-sm shadow-xl shadow-black/5">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-muted/30 border-b border-border/50">
                                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">Page Name</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">Slug</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">Last Updated</th>
                                <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest text-muted-foreground">Actions</th>
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
                                        <p className="text-muted-foreground font-medium">No pages found.</p>
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
                                            {page.updated_at ? new Date(page.updated_at).toLocaleDateString() : 'N/A'}
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
