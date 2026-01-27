import { notFound } from 'next/navigation'
import { blogApi } from '@/lib/api'
import { Container } from '@/components/ui/container'
import { Calendar, User, ChevronLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface BlogPostProps {
    params: {
        slug: string
    }
}

import { generateBlogMetadata } from '@/lib/utils/blog-metadata'

export const generateMetadata = generateBlogMetadata

export default async function BlogPostPage({ params }: BlogPostProps) {
    const { slug } = params

    // Fetch post from database
    const { data: post, error } = await blogApi.getPostBySlug(slug)

    // If post doesn't exist or is not published, return 404
    if (error || !post || !post.is_published) {
        notFound()
    }

    return (
        <main className="relative min-h-screen pb-24">
            {/* Hero Section with Cover Image */}
            <div className="relative h-[50vh] min-h-[400px] w-full">
                {post.cover_image ? (
                    <Image
                        src={post.cover_image}
                        alt={post.title}
                        fill
                        className="object-cover"
                        priority
                    />
                ) : (
                    <div className="h-full w-full bg-linear-to-br from-primary/10 to-violet-500/10" />
                )}
                <div className="absolute inset-0 bg-linear-to-t from-background via-background/40 to-transparent" />

                <Container className="relative h-full">
                    <div className="flex h-full flex-col justify-end pb-12">
                        <Link href="/blog">
                            <Button variant="ghost" className="mb-6 rounded-full bg-background/20 text-white backdrop-blur-md hover:bg-background/40">
                                <ChevronLeft className="mr-2 h-4 w-4" /> Back to Blog
                            </Button>
                        </Link>

                        <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-6 duration-1000">
                            <div className="bg-primary/20 mb-6 inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-black tracking-widest text-primary-foreground uppercase backdrop-blur-md">
                                Published in News
                            </div>
                            <h1 className="font-heading text-4xl font-black leading-[1.1] tracking-tight text-foreground md:text-6xl">
                                {post.title}
                            </h1>

                            <div className="mt-8 flex flex-wrap items-center gap-6 text-muted-foreground">
                                {post.author && (
                                    <div className="flex items-center gap-2">
                                        <div className="relative h-8 w-8 overflow-hidden rounded-full border border-white/20">
                                            {post.author.avatar_url ? (
                                                <Image src={post.author.avatar_url} alt={post.author.display_name || ''} fill className="object-cover" />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center bg-primary/20">
                                                    <User className="h-4 w-4" />
                                                </div>
                                            )}
                                        </div>
                                        <span className="text-sm font-bold">{post.author.display_name || 'Slovor Team'}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    <span className="text-sm font-bold">
                                        {post.published_at ? new Date(post.published_at).toLocaleDateString() : new Date(post.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </div>

            <Container className="mt-12">
                <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 lg:grid-cols-4">
                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <article className="shadow-premium border-border/40 bg-card/40 rounded-5xl border p-8 backdrop-blur-sm md:p-12">
                            {post.excerpt && (
                                <p className="mb-12 border-l-4 border-primary pl-6 text-xl font-medium leading-relaxed italic text-muted-foreground">
                                    {post.excerpt}
                                </p>
                            )}

                            <div
                                className="prose prose-zinc dark:prose-invert max-w-none
                                prose-headings:font-black prose-headings:italic prose-headings:tracking-tight
                                prose-p:text-lg prose-p:leading-relaxed prose-p:text-zinc-600 dark:prose-p:text-zinc-400
                                prose-strong:text-foreground prose-a:text-primary hover:prose-a:underline
                                prose-img:rounded-3xl prose-img:shadow-2xl"
                                dangerouslySetInnerHTML={{ __html: post.content }}
                            />
                        </article>
                    </div>

                    {/* Sidebar */}
                    <aside className="space-y-8">
                        <div className="border-border/50 bg-card/60 space-y-4 rounded-3xl border p-6 backdrop-blur-md">
                            <h3 className="text-sm font-black uppercase tracking-widest italic">Share Article</h3>
                            <div className="flex gap-2">
                                <Button size="icon" variant="outline" className="h-10 w-10 rounded-xl">
                                    <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>
                                </Button>
                                <Button size="icon" variant="outline" className="h-10 w-10 rounded-xl">
                                    <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" /></svg>
                                </Button>
                                <Button size="icon" variant="outline" className="h-10 w-10 rounded-xl">
                                    <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" /></svg>
                                </Button>
                            </div>
                        </div>

                        <div className="bg-primary/5 space-y-4 rounded-3xl p-6 text-center ring-1 ring-primary/20">
                            <h3 className="text-xl font-black italic tracking-tight">Enjoyed this?</h3>
                            <p className="text-sm font-medium text-muted-foreground">Subscribe to our monthly newsletter for the best tips on selling and buying in Slovakia.</p>
                            <Button className="w-full rounded-xl font-black uppercase tracking-widest shadow-lg shadow-primary/20">Subscribe</Button>
                        </div>
                    </aside>
                </div>
            </Container>
        </main>
    )
}
