import Image from 'next/image';
import { Pencil, Trash2, Loader2, FileText, CheckCircle2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/lib/i18n';
import { BlogPostsTableProps } from './types';

export function BlogPostsTable({
    posts,
    isLoading,
    onEdit,
    onDelete,
}: BlogPostsTableProps) {
    const { t, i18n } = useTranslation(['common', 'admin']);

    return (
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-muted/10 border-b border-border/40">
                            <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t('admin:tableArticle')}</th>
                            <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t('admin:tableStatus')}</th>
                            <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t('admin:tableDate')}</th>
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
                        ) : posts.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center">
                                    <p className="text-muted-foreground font-medium">{t('admin:noPostsFound')}</p>
                                </td>
                            </tr>
                        ) : (
                            posts.map((post) => (
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
                                            <span className="inline-flex items-center gap-1.5 rounded-md bg-success/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-success border border-success/20">
                                                <CheckCircle2 className="h-3 w-3" /> {t('admin:published')}
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 rounded-md bg-muted/40 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-muted-foreground border border-border/40">
                                                <Clock className="h-3 w-3" /> {t('admin:draft')}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-muted-foreground">
                                        {new Date(post.created_at).toLocaleDateString(i18n.language)}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button size="sm" variant="ghost" onClick={() => onEdit(post)} className="rounded-lg h-9 w-9 p-0 hover:bg-primary/10 hover:text-primary">
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button size="sm" variant="ghost" onClick={() => onDelete(post.id)} className="rounded-lg h-9 w-9 p-0 hover:bg-destructive/10 hover:text-destructive">
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
    );
}
