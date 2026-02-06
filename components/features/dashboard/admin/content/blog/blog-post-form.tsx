import Image from 'next/image';
import { X, Loader2, Save, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslation } from '@/lib/i18n';
import { BlogPostFormProps } from './types';

export function BlogPostForm({
    post,
    isSubmitting,
    onSubmit,
    onCancel,
    onUpdateField,
}: BlogPostFormProps) {
    const { t } = useTranslation(['common', 'admin']);

    return (
        <div className="bg-card border border-border rounded-xl p-6 md:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-300 shadow-sm">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold ">{post.id ? t('admin:editPost') : t('admin:newPost')}</h3>
                <Button variant="ghost" size="sm" onClick={onCancel} className="rounded-xl">
                    <X className="h-4 w-4" />
                </Button>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t('admin:title')}</label>
                        <Input
                            value={post.title || ''}
                            onChange={e => onUpdateField('title', e.target.value)}
                            placeholder={t('admin:title')}
                            className="h-11 rounded-xl"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t('admin:inputSlug')}</label>
                        <Input
                            value={post.slug || ''}
                            onChange={e => onUpdateField('slug', e.target.value)}
                            placeholder={t('admin:slugPlaceholder')}
                            className="h-11 rounded-xl"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t('admin:excerpt')}</label>
                    <Input
                        value={post.excerpt || ''}
                        onChange={e => onUpdateField('excerpt', e.target.value)}
                        placeholder={t('admin:excerpt')}
                        className="h-11 rounded-xl"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t('admin:coverImageUrl')}</label>
                    <div className="flex gap-2">
                        <Input
                            value={post.cover_image || ''}
                            onChange={e => onUpdateField('cover_image', e.target.value)}
                            placeholder={t('admin:imagePlaceholder')}
                            className="h-11 rounded-xl"
                        />
                        <div className="h-11 w-11 shrink-0 bg-muted rounded-xl flex items-center justify-center border border-border/50 relative overflow-hidden">
                            {post.cover_image ? (
                                <Image
                                    src={post.cover_image}
                                    className="object-cover"
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
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t('admin:contentMarkdown')}</label>
                    <textarea
                        value={post.content || ''}
                        onChange={e => onUpdateField('content', e.target.value)}
                        placeholder={t('admin:contentMarkdown')}
                        className="w-full min-h-[300px] p-4 rounded-xl bg-muted/50 border border-border/50 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none transition-all font-mono text-sm"
                        required
                    />
                </div>

                <div className="flex items-center gap-2 py-2">
                    <input
                        type="checkbox"
                        id="is_published"
                        checked={post.is_published || false}
                        onChange={e => onUpdateField('is_published', e.target.checked)}
                        className="h-4 w-4 rounded border-border"
                    />
                    <label htmlFor="is_published" className="text-sm font-bold">{t('admin:publishImmediately')}</label>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-border/40">
                    <Button variant="outline" type="button" onClick={onCancel} className="rounded-xl px-6 h-11 text-[10px] font-bold uppercase tracking-widest">
                        {t('common:cancel')}
                    </Button>
                    <Button disabled={isSubmitting} className="rounded-xl px-8 h-11 font-bold uppercase tracking-widest text-[10px] shadow-sm">
                        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                        {post.id ? t('admin:saveChanges') : t('admin:postCreated')}
                    </Button>
                </div>
            </form>
        </div>
    );
}
