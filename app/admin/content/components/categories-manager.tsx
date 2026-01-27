'use client'

import { useEffect, useState } from 'react'
import { categoriesApi, type Category } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Pencil, Trash2, Loader2, Save, X, Search, FolderOpen } from 'lucide-react'
import { toast } from 'sonner'

export function CategoriesManager() {
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

    useEffect(() => {
        loadCategories()
    }, [])

    async function loadCategories() {
        setIsLoading(true)
        const { data, error } = await categoriesApi.getAll()
        if (data) setCategories(data)
        if (error) toast.error('Failed to load categories')
        setIsLoading(false)
    }

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
                    toast.success('Category created')
                } else {
                    const { error } = await categoriesApi.update(editingId, formData)
                    if (error) throw new Error(error)
                    toast.success('Category updated')
                }
                setEditingId(null)
                loadCategories()
            }
        } catch (error: any) {
            toast.error(error.message || 'Operation failed')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure? This might affect listings in this category.')) return

        const { error } = await categoriesApi.delete(id)
        if (!error) {
            toast.success('Category deleted')
            loadCategories()
        } else {
            toast.error('Failed to delete category')
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
                        placeholder="Search categories..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-12 h-11 rounded-2xl bg-card/50 border-border/50 focus:bg-card transition-all"
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
                    className="rounded-xl font-bold"
                >
                    <Plus className="mr-2 h-4 w-4" /> Add Category
                </Button>
            </div>

            <div className="bg-card/50 border border-border/50 rounded-3xl overflow-hidden backdrop-blur-sm shadow-xl shadow-black/5">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-muted/30 border-b border-border/50">
                                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">Name / Slug</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">Translations</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">Icon / Order</th>
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
                            ) : filteredCategories.length === 0 && editingId !== 'new' ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center">
                                        <p className="text-muted-foreground font-medium">No categories found.</p>
                                    </td>
                                </tr>
                            ) : (
                                <>
                                    {editingId === 'new' && (
                                        <tr className="bg-primary/5">
                                            <td className="px-6 py-4">
                                                <div className="space-y-2">
                                                    <Input size={30} value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Name" className="h-9 text-sm rounded-lg" />
                                                    <Input value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} placeholder="slug" className="h-9 text-sm rounded-lg" />
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
                                                    <Input value={formData.icon_name} onChange={e => setFormData({ ...formData, icon_name: e.target.value })} placeholder="Icon" className="h-9 text-sm rounded-lg" />
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
                                                            placeholder="Display Name"
                                                            className="h-9 text-sm rounded-lg"
                                                        />
                                                        <Input
                                                            value={formData.slug}
                                                            onChange={e => setFormData({ ...formData, slug: e.target.value })}
                                                            placeholder="Slug"
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
                                                    <div className="flex flex-wrap gap-2">
                                                        <span className="bg-muted px-2 py-0.5 rounded text-[10px] font-bold">{category.name_sk || 'SK'}</span>
                                                        <span className="bg-muted px-2 py-0.5 rounded text-[10px] font-bold">{category.name_cs || 'CS'}</span>
                                                        <span className="bg-muted px-2 py-0.5 rounded text-[10px] font-bold">{category.name_en || 'EN'}</span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                {editingId === category.id ? (
                                                    <div className="flex gap-2 max-w-[150px]">
                                                        <Input value={formData.icon_name} onChange={e => setFormData({ ...formData, icon_name: e.target.value })} placeholder="Icon" className="h-9 text-sm rounded-lg" />
                                                        <Input type="number" value={formData.order_index} onChange={e => setFormData({ ...formData, order_index: parseInt(e.target.value) })} className="h-9 text-sm rounded-lg w-20" />
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2">
                                                        <div className="bg-primary/10 p-2 rounded-lg text-primary">
                                                            <FolderOpen className="h-4 w-4" />
                                                        </div>
                                                        <span className="text-xs font-bold text-muted-foreground">Order: {category.order_index}</span>
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
