import Image from 'next/image'
import { X, Loader2, Save, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { useTranslation } from '@/lib/i18n'
import { BlogPostFormProps } from './types'

export function BlogPostForm({
  post,
  isSubmitting,
  onSubmit,
  onCancel,
  onUpdateField,
}: BlogPostFormProps) {
  const { t } = useTranslation(['common', 'admin'])

  return (
    <div className="bg-card border-border animate-in fade-in zoom-in-95 space-y-6 rounded-xl border p-6 shadow-sm duration-300 md:p-8">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">
          {post.id ? t('admin:editPost') : t('admin:newPost')}
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="rounded-xl"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
              {t('admin:title')}
            </label>
            <Input
              value={post.title || ''}
              onChange={(e) => onUpdateField('title', e.target.value)}
              placeholder={t('admin:title')}
              className="h-11 rounded-xl"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
              {t('admin:inputSlug')}
            </label>
            <Input
              value={post.slug || ''}
              onChange={(e) => onUpdateField('slug', e.target.value)}
              placeholder={t('admin:slugPlaceholder')}
              className="h-11 rounded-xl"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
            {t('admin:excerpt')}
          </label>
          <Input
            value={post.excerpt || ''}
            onChange={(e) => onUpdateField('excerpt', e.target.value)}
            placeholder={t('admin:excerpt')}
            className="h-11 rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <label className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
            {t('admin:coverImageUrl')}
          </label>
          <div className="flex gap-2">
            <Input
              value={post.cover_image || ''}
              onChange={(e) => onUpdateField('cover_image', e.target.value)}
              placeholder={t('admin:imagePlaceholder')}
              className="h-11 rounded-xl"
            />
            <div className="bg-muted border-border/50 relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border">
              {post.cover_image ? (
                <Image
                  src={post.cover_image}
                  className="object-cover"
                  alt=""
                  fill
                  unoptimized
                />
              ) : (
                <ImageIcon className="text-muted-foreground/40 h-4 w-4" />
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
            {t('admin:contentMarkdown')}
          </label>
          <Textarea
            value={post.content || ''}
            onChange={(e) => onUpdateField('content', e.target.value)}
            placeholder={t('admin:contentMarkdown')}
            className="bg-muted/50 border-border/50 focus:border-primary/50 focus:ring-primary/10 min-h-[300px] w-full rounded-xl border p-4 font-mono text-sm transition-all outline-none focus:ring-4"
            required
          />
        </div>

        <div className="flex items-center gap-2 py-2">
          <Checkbox
            id="is_published"
            checked={post.is_published || false}
            onCheckedChange={(checked) =>
              onUpdateField('is_published', checked as boolean)
            }
            className="border-border h-4 w-4 rounded"
          />
          <label htmlFor="is_published" className="text-sm font-bold">
            {t('admin:publishImmediately')}
          </label>
        </div>

        <div className="border-border/40 flex justify-end gap-3 border-t pt-4">
          <Button
            variant="outline"
            type="button"
            onClick={onCancel}
            className="h-11 rounded-xl px-6 text-[10px] font-bold tracking-widest uppercase"
          >
            {t('common:cancel')}
          </Button>
          <Button
            disabled={isSubmitting}
            className="h-11 rounded-xl px-8 text-[10px] font-bold tracking-widest uppercase shadow-sm"
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {post.id ? t('admin:saveChanges') : t('admin:postCreated')}
          </Button>
        </div>
      </form>
    </div>
  )
}
