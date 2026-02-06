'use client'

import { useEffect, useState, useCallback } from 'react'
import { blogApi, type BlogPost } from '@/lib/api'
import { toast } from 'sonner'
import { useAuth } from '@/components/providers/auth-provider'
import { useTranslation } from '@/lib/i18n'

import {
    BlogPostForm,
    BlogPostsTable,
    BlogManagerHeader
} from './blog/index'

export function BlogManager() {
    const { t } = useTranslation('common')
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
        if (error) toast.error(t('admin:failedToLoadPosts'))
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

    const handleUpdateField = (field: keyof BlogPost, value: any) => {
        if (!editingPost) return
        setEditingPost({ ...editingPost, [field]: value })
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
                result = await blogApi.update(editingPost.id, postData as any)
            } else {
                result = await blogApi.create(postData as any)
            }

            if (result.error) throw new Error(result.error)

            toast.success(editingPost.id ? t('admin:postUpdated') : t('admin:postCreated'))
            setEditingPost(null)
            loadPosts()
        } catch (error: any) {
            toast.error(error.message || t('admin:failedToLoadPosts'))
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm(t('admin:confirmDeletePost'))) return

        const { error } = await blogApi.delete(id)
        if (!error) {
            toast.success(t('admin:postDeleted'))
            loadPosts()
        } else {
            toast.error(t('admin:failedToDeletePost'))
        }
    }

    const filteredPosts = posts.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.slug.toLowerCase().includes(searchQuery.toLowerCase())
    )

    if (editingPost) {
        return (
            <BlogPostForm
                post={editingPost}
                isSubmitting={isSubmitting}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                onUpdateField={handleUpdateField}
            />
        )
    }

    return (
        <div className="space-y-6">
            <BlogManagerHeader
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onCreate={handleCreate}
            />
            <BlogPostsTable
                posts={filteredPosts}
                isLoading={isLoading}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </div>
    )
}
