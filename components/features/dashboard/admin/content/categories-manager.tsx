'use client'

import { useEffect, useState, useCallback } from 'react'
import { categoriesApi, type Category } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Pencil, Trash2, Loader2, Save, X, Search, FolderOpen } from 'lucide-react'
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
        color: ''
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
            color: category.color || ''
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

    const filteredCategories = categories.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.slug.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="relative group flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                        placeholder={t('admin:searchCategories')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-12 h-11 rounded-xl bg-card border-border transition-all font-bold text-xs uppercase tracking-widest"
                    />
                </div>
                <Button
                    onClick={() => {
                        setEditingId('new')
                        setFormData({
                            name: '', slug: '',
                            name_sk: '', name_cs: '', name_en: '',
                            icon_name: '', order_index: categories.length,
                            description: '', icon: '', color: ''
                        })
                    }}
                    className="rounded-xl font-bold uppercase tracking-widest text-[10px] h-11 px-6"
                >
                    <Plus className="mr-2 h-4 w-4" /> {t('admin:addCategory')}
                </Button>
            </div>

            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-muted/10 border-b border-border/40">
                                <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t('admin:tableListing')} / {t('admin:inputSlug')}</th>
                                <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t('admin:tableTranslations')}</th>
                                <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t('admin:tableIconOrder')}</th>
                                <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t('admin:tableActions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center">
                                        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                                    </td>
                                </tr>
                            ) : filteredCategories.length === 0 && editingId !== 'new' ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center">
                                        <p className="text-muted-foreground font-medium">{t('admin:noCategoriesFound')}</p>
                                    </td>
                                </tr>
                            ) : (
                                <>
                                    {editingId === 'new' && (
                                        <tr className="bg-primary/5">
                                            <td className="px-6 py-4">
                                                <div className="space-y-2">
                                                    <Input size={30} value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder={t('admin:inputName')} className="h-9 text-sm rounded-lg" />
                                                    <Input value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} placeholder={t('admin:inputSlug')} className="h-9 text-sm rounded-lg" />
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="grid grid-cols-1 gap-2">
                                                    <Input value={formData.name_sk} onChange={e => setFormData({ ...formData, name_sk: e.target.value })} placeholder="SK" className="h-8 text-xs rounded-lg" />
                                                    <Input value={formData.name_cs} onChange={e => setFormData({ ...formData, name_cs: e.target.value })} placeholder="CS" className="h-8 text-xs rounded-lg" />
                                                    <Input value={formData.name_en} onChange={e => setFormData({ ...formData, name_en: e.target.value })} placeholder="EN" className="h-8 text-xs rounded-lg" />
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    <Input value={formData.icon_name} onChange={e => setFormData({ ...formData, icon_name: e.target.value })} placeholder={t('admin:icon')} className="h-9 text-sm rounded-lg" />
                                                    <Input type="number" value={formData.order_index} onChange={e => setFormData({ ...formData, order_index: parseInt(e.target.value) })} className="h-9 text-sm rounded-lg w-20" />
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button size="sm" onClick={handleSubmit} disabled={isSubmitting} className="rounded-lg h-9 w-9 p-0">
                                                        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                                    </Button>
                                                    <Button size="sm" variant="ghost" onClick={handleCancel} className="rounded-lg h-9 w-9 p-0">
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                    {filteredCategories.map((category) => (
                                        <tr key={category.id} className="group hover:bg-muted/30 transition-colors">
                                            <td className="px-6 py-4">
                                                {editingId === category.id ? (
                                                    <div className="space-y-2 max-w-[200px]">
                                                        <Input
                                                            value={formData.name}
                                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                            placeholder={t('admin:displayName')}
                                                            className="h-9 text-sm rounded-lg"
                                                        />
                                                        <Input
                                                            value={formData.slug}
                                                            onChange={e => setFormData({ ...formData, slug: e.target.value })}
                                                            placeholder={t('admin:inputSlug')}
                                                            className="h-9 text-sm rounded-lg"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <p className="font-bold text-foreground">{category.name}</p>
                                                        <p className="text-xs font-mono text-muted-foreground">{category.slug}</p>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                {editingId === category.id ? (
                                                    <div className="grid grid-cols-1 gap-2 max-w-[200px]">
                                                        <Input value={formData.name_sk} onChange={e => setFormData({ ...formData, name_sk: e.target.value })} placeholder="SK" className="h-8 text-xs rounded-lg" />
                                                        <Input value={formData.name_cs} onChange={e => setFormData({ ...formData, name_cs: e.target.value })} placeholder="CS" className="h-8 text-xs rounded-lg" />
                                                        <Input value={formData.name_en} onChange={e => setFormData({ ...formData, name_en: e.target.value })} placeholder="EN" className="h-8 text-xs rounded-lg" />
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-wrap gap-1.5">
                                                        <span className="bg-muted/40 text-muted-foreground border border-border/40 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">{category.name_sk || 'SK'}</span>
                                                        <span className="bg-muted/40 text-muted-foreground border border-border/40 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">{category.name_cs || 'CS'}</span>
                                                        <span className="bg-muted/40 text-muted-foreground border border-border/40 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">{category.name_en || 'EN'}</span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                {editingId === category.id ? (
                                                    <div className="flex gap-2 max-w-[150px]">
                                                        <Input value={formData.icon_name} onChange={e => setFormData({ ...formData, icon_name: e.target.value })} placeholder={t('admin:icon')} className="h-9 text-sm rounded-lg" />
                                                        <Input type="number" value={formData.order_index} onChange={e => setFormData({ ...formData, order_index: parseInt(e.target.value) })} className="h-9 text-sm rounded-lg w-20" />
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2">
                                                        <div className="bg-primary/10 p-2 rounded-lg text-primary">
                                                            <FolderOpen className="h-4 w-4" />
                                                        </div>
                                                        <span className="text-xs font-bold text-muted-foreground">{t('admin:tableOrder')}: {category.order_index}</span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    {editingId === category.id ? (
                                                        <>
                                                            <Button size="sm" onClick={handleSubmit} disabled={isSubmitting} className="rounded-lg h-9 w-9 p-0">
                                                                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                                            </Button>
                                                            <Button size="sm" variant="ghost" onClick={handleCancel} className="rounded-lg h-9 w-9 p-0">
                                                                <X className="h-4 w-4" />
                                                            </Button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Button size="sm" variant="ghost" onClick={() => handleEdit(category)} className="rounded-lg h-9 w-9 p-0 hover:bg-primary/10 hover:text-primary">
                                                                <Pencil className="h-4 w-4" />
                                                            </Button>
                                                            <Button size="sm" variant="ghost" onClick={() => handleDelete(category.id)} className="rounded-lg h-9 w-9 p-0 hover:bg-destructive/10 hover:text-destructive">
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
