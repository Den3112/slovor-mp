import { notFound } from 'next/navigation'
import { blogApi } from '@/lib/api'
import { Container } from '@/components/ui/container'
import { Calendar, User, ChevronLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface BlogPostProps {
    params: Promise<{
        slug: string
        locale: string
    }>
}

import { generateBlogMetadata } from '@/lib/utils/blog-metadata'

export const generateMetadata = generateBlogMetadata

import { getTranslationServer } from '@/lib/i18n/server'

export default async function BlogPostPage({ params }: BlogPostProps) {
    const { slug, locale } = await params
    const { t } = await getTranslationServer(['common', 'blog'])

    // Fetch post from database
    const { data: post, error } = await blogApi.getPostBySlug(slug)

    // If post doesn't exist or is not published, return 404
    if (error || !post || !post.is_published) {
        notFound()
    }

    return (
        <main className="relative min-h-screen bg-background pb-24">
            {/* Header Section */}
            <div className="bg-muted border-b border-border pt-32 pb-16">
                <Container>
                    <Link href={`/${locale}/blog`} className="mb-8 inline-block">
                        <Button variant="outline" size="sm" className="rounded-xl font-bold border-border">
                            <ChevronLeft className="mr-2 h-4 w-4" /> {t('blog:backToBlog')}
                        </Button>
                    </Link>

                    <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="bg-primary/10 inline-flex items-center gap-2 rounded-xl border border-primary/20 px-3 py-1 text-[10px] font-bold tracking-widest text-primary uppercase">
                            {t('blog:marketInsight')}
                        </div>
                        <h1 className="font-heading text-4xl font-bold leading-[1.1] tracking-tight text-foreground md:text-7xl uppercase ">
                            {post.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-8 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                            {post.author && (
                                <div className="flex items-center gap-3">
                                    <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-border">
                                        {post.author.avatar_url ? (
                                            <Image src={post.author.avatar_url} alt={post.author.display_name || ''} fill sizes="40px" className="object-cover" />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-background">
                                                <User className="h-5 w-5 text-muted-foreground" />
                                            </div>
                                        )}
                                    </div>
                                    <span className="text-foreground">{post.author.display_name || 'Slovor Team'}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-primary" />
                                <span>
                                    {post.published_at ? new Date(post.published_at).toLocaleDateString() : new Date(post.created_at).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>
                </Container>
            </div>

            <Container className="mt-16">
                <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-12">
                    {/* Main Content */}
                    <div className="lg:col-span-8">
                        <article className="bg-card border border-border rounded-xl p-8 md:p-16 shadow-sm">
                            {post.cover_image && (
                                <div className="relative mb-12 aspect-video overflow-hidden rounded-xl border border-border shadow-sm">
                                    <Image
                                        src={post.cover_image}
                                        alt={post.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 850px"
                                        className="object-cover"
                                        priority
                                    />
                                </div>
                            )}

                            {post.excerpt && (
                                <div className="mb-12 border-l-4 border-primary bg-primary/5 p-8 rounded-xl">
                                    <p className="text-xl font-bold leading-relaxed  text-foreground">
                                        {post.excerpt}
                                    </p>
                                </div>
                            )}

                            <div
                                className="prose prose-zinc dark:prose-invert max-w-none
                                prose-headings:font-bold prose-headings: prose-headings:tracking-tight prose-headings:uppercase
                                prose-p:text-lg prose-p:leading-relaxed prose-p:font-medium
                                prose-strong:text-foreground prose-strong:font-bold
                                prose-a:text-primary hover:prose-a:underline
                                prose-img:rounded-xl prose-img:border prose-img:border-border"
                                dangerouslySetInnerHTML={{ __html: post.content }}
                            />
                        </article>
                    </div>

                    {/* Sidebar */}
                    <aside className="lg:col-span-4 space-y-6">
                        <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
                            <h3 className="text-xs font-bold uppercase tracking-[0.2em]  mb-6">{t('blog:shareArticle')}</h3>
                            <div className="flex gap-3">
                                <Button size="icon" variant="outline" className="h-12 w-12 rounded-xl border-border hover:bg-muted">
                                    <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>
                                </Button>
                                <Button size="icon" variant="outline" className="h-12 w-12 rounded-xl border-border hover:bg-muted">
                                    <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" /></svg>
                                </Button>
                            </div>
                        </div>

                        <div className="bg-primary rounded-xl p-10 text-primary-foreground text-center shadow-lg shadow-primary/10">
                            <h3 className="text-2xl font-bold  tracking-tight mb-4 uppercase">{t('blog:joinInsights')}</h3>
                            <p className="text-sm font-medium opacity-80 mb-8 leading-relaxed">{t('blog:subscribeDesc')}</p>
                            <Button className="w-full bg-white text-primary hover:bg-zinc-100 rounded-xl font-bold uppercase tracking-widest shadow-sm">{t('blog:subscribe')}</Button>
                        </div>
                    </aside>
                </div>
            </Container>
        </main>
    )
}
