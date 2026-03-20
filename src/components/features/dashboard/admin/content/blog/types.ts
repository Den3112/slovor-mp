import { BlogPost } from '@/lib/api'

export interface BlogPostFormProps {
  post: Partial<BlogPost>
  isSubmitting: boolean
  onSubmit: (e: React.FormEvent) => Promise<void>
  onCancel: () => void
  onUpdateField: (field: keyof BlogPost, value: any) => void
}

export interface BlogPostsTableProps {
  posts: BlogPost[]
  isLoading: boolean
  onEdit: (post: BlogPost) => void
  onDelete: (id: string) => void
}

export interface BlogManagerHeaderProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  onCreate: () => void
}
