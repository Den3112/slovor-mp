import Image from 'next/image'
import {
  Pencil,
  Trash2,
  Loader2,
  FileText,
  CheckCircle2,
  Clock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/i18n'
import { BlogPostsTableProps } from './types'

export function BlogPostsTable({
  posts,
  isLoading,
  onEdit,
  onDelete,
}: BlogPostsTableProps) {
  const { t, i18n } = useTranslation(['common', 'admin'])

  return (
    <div className="bg-card border-border overflow-hidden rounded-xl border shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-muted/10 border-border/40 border-b">
              <th className="text-muted-foreground px-6 py-4 text-left text-[10px] font-bold tracking-widest uppercase">
                {t('admin:tableArticle')}
              </th>
              <th className="text-muted-foreground px-6 py-4 text-left text-[10px] font-bold tracking-widest uppercase">
                {t('admin:tableStatus')}
              </th>
              <th className="text-muted-foreground px-6 py-4 text-left text-[10px] font-bold tracking-widest uppercase">
                {t('admin:tableDate')}
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
            ) : posts.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center">
                  <p className="text-muted-foreground font-medium">
                    {t('admin:noPostsFound')}
                  </p>
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr
                  key={post.id}
                  className="group hover:bg-muted/30 transition-colors"
                >
                  <td className="px-6 py-6 text-sm font-medium">
                    <div className="flex items-center gap-4">
                      <div className="bg-muted border-border/30 relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border">
                        {post.cover_image ? (
                          <Image
                            src={post.cover_image}
                            className="object-cover"
                            alt=""
                            fill
                          />
                        ) : (
                          <FileText className="text-muted-foreground/30 absolute top-1/2 left-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-foreground line-clamp-1 font-bold">
                          {post.title}
                        </p>
                        <p className="text-muted-foreground truncate font-mono text-xs">
                          {post.slug}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {post.is_published ? (
                      <span className="bg-success/10 text-success border-success/20 inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[9px] font-bold tracking-widest uppercase">
                        <CheckCircle2 className="h-3 w-3" />{' '}
                        {t('admin:published')}
                      </span>
                    ) : (
                      <span className="bg-muted/40 text-muted-foreground border-border/40 inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[9px] font-bold tracking-widest uppercase">
                        <Clock className="h-3 w-3" /> {t('admin:draft')}
                      </span>
                    )}
                  </td>
                  <td className="text-muted-foreground px-6 py-4 text-sm font-medium">
                    {new Date(post.created_at).toLocaleDateString(
                      i18n.language
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onEdit(post)}
                        className="hover:bg-primary/10 hover:text-primary h-9 w-9 rounded-xl p-0"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onDelete(post.id)}
                        className="hover:bg-destructive/10 hover:text-destructive h-9 w-9 rounded-xl p-0"
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
  )
}
