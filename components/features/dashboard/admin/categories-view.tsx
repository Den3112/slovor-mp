'use client'

import React, { useState, useEffect, useMemo } from 'react'
import {
    Layers,
    Plus,
    Edit3,
    Trash2,
    Loader2
} from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import { categoriesApi, type Category } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { DataGrid, type Column } from '@/components/features/dashboard/shared/data-grid'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'

export function AdminCategoriesView() {
    const { t } = useTranslation(['common', 'admin'])
    const [categories, setCategories] = useState<Category[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')

    // Dialog states
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingCategory, setEditingCategory] = useState<Category | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Delete states
    const [deleteId, setDeleteId] = useState<string | null>(null)

    // Form states
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        icon: '',
        icon_name: '',
        color: '',
        order_index: 0
    })

    useEffect(() => {
        loadCategories()
    }, [])

    const loadCategories = async () => {
        setIsLoading(true)
        try {
            const { data } = await categoriesApi.getAll()
            if (data) setCategories(data)
        } catch (error) {
            toast.error('Failed to load categories')
        } finally {
            setIsLoading(false)
        }
    }

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
                order_index: category.order_index || 0
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
                order_index: 0
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
                const { error } = await categoriesApi.update(editingCategory.id, payload)
                if (error) throw new Error(error)
                toast.success('Category updated')
            } else {
                const { error } = await categoriesApi.create(payload)
                if (error) throw new Error(error)
                toast.success('Category created')
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
            toast.success('Category deleted')
            setCategories(prev => prev.filter(c => c.id !== deleteId))
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
        return categories.filter(c =>
            c.name.toLowerCase().includes(q) ||
            c.slug.toLowerCase().includes(q)
        )
    }, [categories, searchQuery])

    const columns: Column<Category>[] = [
        {
            key: 'name',
            header: t('admin:tableName'),
            sortable: true,
            className: "min-w-[200px]",
            cell: (row) => (
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary/5 border border-primary/10 text-primary">
                        {row.icon ? (
                            <span className="text-xl">{row.icon}</span>
                        ) : (
                            <Layers className="h-5 w-5" />
                        )}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-black tracking-tight text-foreground">{row.name}</span>
                        <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">{row.slug}</span>
                    </div>
                </div>
            )
        },
        {
            key: 'listing_count',
            header: t('admin:tableListings'),
            sortable: true,
            cell: (row) => (
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-muted/50 font-black text-[10px] uppercase tracking-widest border-border/40 px-3 py-1 rounded-lg">
                        {row.listing_count || 0}
                    </Badge>
                </div>
            )
        },
        {
            key: 'actions',
            header: '',
            className: "text-right",
            cell: (row) => (
                <div className="flex justify-end gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDialog(row)}
                        className="h-8 w-8 hover:bg-primary/10 hover:text-primary rounded-lg transition-all"
                    >
                        <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(row.id)}
                        className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive rounded-lg transition-all"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            )
        }
    ]

    return (
        <div className="space-y-8" data-testid="admin-categories-view">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-foreground uppercase flex items-center gap-3">
                        <Layers className="h-8 w-8 text-primary" />
                        {t('admin:categories') || 'Categories'}
                    </h1>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mt-1">
                        Manage marketplace taxonomy and structure
                    </p>
                </div>
                <Button
                    onClick={() => handleOpenDialog()}
                    className="rounded-xl h-11 px-6 font-black uppercase tracking-widest shadow-lg shadow-primary/20"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Category
                </Button>
            </div>

            {/* Content */}
            <DataGrid
                columns={columns}
                data={filteredCategories}
                isLoading={isLoading}
                onSearch={setSearchQuery}
                searchPlaceholder="Search categories..."
                emptyMessage="No categories found."
            />

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px] rounded-xl border-border bg-card shadow-lg">
                    <form onSubmit={handleSubmit}>
                        <DialogHeader>
                            <DialogTitle className="text-xl font-black uppercase tracking-tight">
                                {editingCategory ? 'Edit Category' : 'Create Category'}
                            </DialogTitle>
                            <DialogDescription className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
                                {editingCategory ? `Updating ${editingCategory.name}` : 'Define a new category for the marketplace'}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-6 py-6">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Name</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => {
                                        setFormData({
                                            ...formData,
                                            name: e.target.value,
                                            slug: editingCategory ? formData.slug : e.target.value.toLowerCase().replace(/\s+/g, '-')
                                        })
                                    }}
                                    className="rounded-xl border-border/60 bg-muted/20 focus:bg-background transition-all h-11 font-bold"
                                    placeholder="Electronics"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="slug" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Slug</Label>
                                <Input
                                    id="slug"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    className="rounded-xl border-border/60 bg-muted/20 focus:bg-background transition-all h-11 font-bold"
                                    placeholder="electronics"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="icon" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Icon (Emoji or Icon name)</Label>
                                <Input
                                    id="icon"
                                    value={formData.icon}
                                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                    className="rounded-xl border-border/60 bg-muted/20 focus:bg-background transition-all h-11 font-bold"
                                    placeholder="📱"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Description</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="rounded-xl border-border/60 bg-muted/20 focus:bg-background transition-all min-h-[100px] font-medium"
                                    placeholder="Phones, laptops, and gadgets..."
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsDialogOpen(false)}
                                className="rounded-xl h-11 px-6 font-black uppercase tracking-widest"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="rounded-xl h-11 px-6 font-black uppercase tracking-widest shadow-lg shadow-primary/20"
                            >
                                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                                {editingCategory ? 'Save Changes' : 'Create Category'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent className="rounded-xl border-border bg-card shadow-lg">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl font-black uppercase tracking-tight text-destructive">
                            Delete Category?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-sm font-medium text-muted-foreground">
                            This action cannot be undone. All listings in this category might become uncategorized.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-2">
                        <AlertDialogCancel className="rounded-xl h-10 px-6 font-black uppercase tracking-widest text-[10px]" disabled={isSubmitting}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={isSubmitting}
                            className="rounded-xl h-10 px-6 font-black uppercase tracking-widest text-[10px] bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-lg shadow-destructive/20 border-0"
                        >
                            {isSubmitting ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Delete Category'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
