'use client'

import { useEffect, useState, useCallback } from 'react'
import { blogApi, type BlogPost } from '@/lib/api'
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
    FileText,
    CheckCircle2,
    Clock,
    Image as ImageIcon
} from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/components/providers/auth-provider'
import Image from 'next/image'

import { useTranslation } from '@/lib/i18n'

export function BlogManager() {
    const { t, i18n } = useTranslation('common')
    const { user } = useAuth()
    const [posts, setPosts] = useState<BlogPost[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [editingPost, setEditingPost] = useState<Partial<BlogPost> | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const loadPosts = useCallback(async () => {
        setIsLoading(true)
        const { data, error } = await blogApi.adminListPosts()
        if (data) setPosts(data)
        if (error) toast.error(t('admin.failedToLoadPosts'))
        setIsLoading(false)
    }, [t])

    useEffect(() => {
        loadPosts()
    }, [loadPosts])

    const handleEdit = (post: BlogPost) => {
        setEditingPost(post)
    }

    const handleCreate = () => {
        setEditingPost({
            title: '',
            slug: '',
            content: '',
            excerpt: '',
            is_published: false,
            author_id: user?.id
        })
    }

    const handleCancel = () => {
        setEditingPost(null)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editingPost || !user) return
        setIsSubmitting(true)

        try {
            const postData = {
                ...editingPost,
                author_id: editingPost.author_id || user.id,
                published_at: editingPost.is_published && !editingPost.published_at
                    ? new Date().toISOString()
                    : editingPost.published_at
            }

            let result;
            if (editingPost.id) {
                result = await blogApi.update(editingPost.id, postData)
            } else {
                result = await blogApi.create(postData)
            }

            if (result.error) throw new Error(result.error)

            toast.success(editingPost.id ? t('admin.postUpdated') : t('admin.postCreated'))
            setEditingPost(null)
            loadPosts()
        } catch (error: any) {
            toast.error(error.message || t('admin.failedToLoadPosts'))
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm(t('admin.confirmDeletePost'))) return

        const { error } = await blogApi.delete(id)
        if (!error) {
            toast.success(t('admin.postDeleted'))
            loadPosts()
        } else {
            toast.error(t('admin.failedToDeletePost'))
        }
    }

    const filteredPosts = posts.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.slug.toLowerCase().includes(searchQuery.toLowerCase())
    )

    if (editingPost) {
        return (
            <div className="bg-card border border-border rounded-xl p-6 md:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-300 shadow-sm">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black italic">{editingPost.id ? t('admin.editPost') : t('admin.newPost')}</h3>
                    <Button variant="ghost" size="sm" onClick={handleCancel} className="rounded-full">
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">{t('admin.title')}</label>
                            <Input
                                value={editingPost.title || ''}
                                onChange={e => setEditingPost({ ...editingPost, title: e.target.value })}
                                placeholder={t('admin.title')}
                                className="h-11 rounded-xl"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">{t('admin.inputSlug')}</label>
                            <Input
                                value={editingPost.slug || ''}
                                onChange={e => setEditingPost({ ...editingPost, slug: e.target.value })}
                                placeholder={t('admin.slugPlaceholder')}
                                className="h-11 rounded-xl"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">{t('admin.excerpt')}</label>
                        <Input
                            value={editingPost.excerpt || ''}
                            onChange={e => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                            placeholder={t('admin.excerpt')}
                            className="h-11 rounded-xl"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">{t('admin.coverImageUrl')}</label>
                        <div className="flex gap-2">
                            <Input
                                value={editingPost.cover_image || ''}
                                onChange={e => setEditingPost({ ...editingPost, cover_image: e.target.value })}
                                placeholder={t('admin.imagePlaceholder')}
                                className="h-11 rounded-xl"
                            />
                            <div className="h-11 w-11 shrink-0 bg-muted rounded-xl flex items-center justify-center border border-border/50">
                                {editingPost.cover_image ? (
                                    <Image
                                        src={editingPost.cover_image}
                                        className="object-cover rounded-xl"
                                        alt=""
                                        fill
                                        unoptimized
                                    />
                                ) : (
                                    <ImageIcon className="h-4 w-4 text-muted-foreground/40" />
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">{t('admin.contentMarkdown')}</label>
                        <textarea
                            value={editingPost.content || ''}
                            onChange={e => setEditingPost({ ...editingPost, content: e.target.value })}
                            placeholder={t('admin.contentMarkdown')}
                            className="w-full min-h-[300px] p-4 rounded-2xl bg-muted/50 border border-border/50 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none transition-all font-mono text-sm"
                            required
                        />
                    </div>

                    <div className="flex items-center gap-2 py-2">
                        <input
                            type="checkbox"
                            id="is_published"
                            checked={editingPost.is_published || false}
                            onChange={e => setEditingPost({ ...editingPost, is_published: e.target.checked })}
                            className="h-4 w-4 rounded border-border"
                        />
                        <label htmlFor="is_published" className="text-sm font-bold">{t('admin.publishImmediately')}</label>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-border/40">
                        <Button variant="outline" type="button" onClick={handleCancel} className="rounded-xl px-6 h-11 text-[10px] font-black uppercase tracking-widest">
                            {t('common:cancel')}
                        </Button>
                        <Button disabled={isSubmitting} className="rounded-xl px-8 h-11 font-black uppercase tracking-widest text-[10px] shadow-sm">
                            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                            {editingPost.id ? t('admin:saveChanges') : t('admin:postCreated')}
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
                        placeholder={t('admin:searchPosts')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-12 h-11 rounded-xl bg-card border-border transition-all font-bold text-xs uppercase tracking-widest"
                    />
                </div>
                <Button onClick={handleCreate} className="rounded-xl font-black uppercase tracking-widest text-[10px] h-11 px-6">
                    <Plus className="mr-2 h-4 w-4" /> {t('admin:newArticle')}
                </Button>
            </div>

            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-muted/10 border-b border-border/40">
                                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t('admin:tableArticle')}</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t('admin:tableStatus')}</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t('admin:tableDate')}</th>
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
                            ) : filteredPosts.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center">
                                        <p className="text-muted-foreground font-medium">{t('admin.noPostsFound')}</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredPosts.map((post) => (
                                    <tr key={post.id} className="group hover:bg-muted/30 transition-colors">
                                        <td className="px-6 py-6 font-medium text-sm">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 shrink-0 bg-muted rounded-xl overflow-hidden relative border border-border/30">
                                                    {post.cover_image ? (
                                                        <Image
                                                            src={post.cover_image}
                                                            className="object-cover"
                                                            alt=""
                                                            fill
                                                            unoptimized
                                                        />
                                                    ) : (
                                                        <FileText className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 text-muted-foreground/30" />
                                                    )}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="font-bold text-foreground line-clamp-1">{post.title}</p>
                                                    <p className="text-xs text-muted-foreground font-mono truncate">{post.slug}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {post.is_published ? (
                                                <span className="inline-flex items-center gap-1.5 rounded-md bg-success/10 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-success border border-success/20">
                                                    <CheckCircle2 className="h-3 w-3" /> {t('admin:published')}
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 rounded-md bg-muted/40 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-muted-foreground border border-border/40">
                                                    <Clock className="h-3 w-3" /> {t('admin:draft')}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-muted-foreground">
                                            {new Date(post.created_at).toLocaleDateString(i18n.language)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button size="sm" variant="ghost" onClick={() => handleEdit(post)} className="rounded-lg h-9 w-9 p-0 hover:bg-primary/10 hover:text-primary">
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button size="sm" variant="ghost" onClick={() => handleDelete(post.id)} className="rounded-lg h-9 w-9 p-0 hover:bg-destructive/10 hover:text-destructive">
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
