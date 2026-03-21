import type { Metadata } from 'next'
import { Container } from '@/components/ui/container'
import { Sparkles, Clock, User } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { blogApi } from '@/lib/api'

export const metadata: Metadata = {
  title: 'Blog - Slovor Marketplace',
  description: 'Market trends, tips, and news from Slovor Marketplace.',
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params

  if (process.env.SKIP_ENV_VALIDATION === '1') {
    return <div className="py-20 text-center">Building...</div>
  }

  const { data: blogPosts } = await blogApi.listPosts({ limit: 12 })

  const posts = blogPosts || []
  const featuredPost = posts[0]
  const otherPosts = posts.slice(1)

  if (posts.length === 0) {
    return (
      <div className="bg-background min-h-screen pt-32 pb-20">
        <Container>
          <div className="bg-card border-border mx-auto max-w-2xl rounded-xl border py-20 text-center shadow-sm">
            <div className="bg-muted border-border mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-xl border">
              <Sparkles className="text-muted-foreground/40 h-8 w-8" />
            </div>
            <h1 className="mb-4 text-4xl font-bold tracking-tight uppercase">
              Blog Coming Soon
            </h1>
            <p className="text-muted-foreground mx-auto max-w-md font-medium">
              Our team is working on exciting content. Check back later for
              expert tips and marketplace news.
            </p>
          </div>
        </Container>
      </div>
    )
  }

  return (
    <div className="bg-background min-h-screen pt-24 pb-20 md:pt-32">
      <Container>
        {/* Header */}
        <div className="animate-in fade-in slide-in-from-top-4 mb-16 text-center duration-700">
          <div className="bg-primary/10 border-primary/20 mx-auto mb-6 inline-flex items-center gap-2 rounded-xl border px-4 py-2">
            <Sparkles className="text-primary h-4 w-4" />
            <span className="text-primary text-[10px] font-bold tracking-widest uppercase">
              Slovor Insights
            </span>
          </div>
          <h1 className="mb-6 text-4xl font-bold tracking-tight uppercase lg:text-7xl">
            Market Trends & News
          </h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg font-medium">
            Expert insights, selling tips, and community stories to help you
            succeed in the Slovak marketplace.
          </p>
        </div>

        {/* Featured Post */}
        {featuredPost && (
          <Link
            href={`/${lang}/blog/${featuredPost.slug}`}
            className="group border-border bg-card hover:border-primary/50 hover:shadow-primary/5 mb-20 block overflow-hidden rounded-xl border shadow-sm transition-all duration-500 hover:shadow-xl"
          >
            <div className="grid gap-0 md:grid-cols-2">
              <div className="relative aspect-16/10 h-full min-h-[400px] overflow-hidden md:aspect-auto">
                {featuredPost.cover_image ? (
                  <Image
                    src={featuredPost.cover_image}
                    alt={featuredPost.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="bg-muted h-full w-full" />
                )}
                <div className="absolute top-6 left-6">
                  <span className="bg-primary text-primary-foreground rounded-xl px-4 py-1.5 text-[10px] font-bold tracking-widest uppercase">
                    Featured Store
                  </span>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-8 p-8 md:p-16">
                <span className="bg-primary/10 text-primary border-primary/20 inline-flex w-fit items-center rounded-xl border px-3 py-1 text-[10px] font-bold tracking-widest uppercase">
                  Expert Insight
                </span>
                <h2 className="group-hover:text-primary text-3xl leading-tight font-bold tracking-tight uppercase transition-colors md:text-5xl">
                  {featuredPost.title}
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed font-medium">
                  {featuredPost.excerpt}
                </p>
                <div className="border-border text-muted-foreground flex items-center gap-6 border-t pt-8 text-[11px] font-bold tracking-widest uppercase">
                  <span className="flex items-center gap-2">
                    <User className="text-primary h-4 w-4" />
                    {featuredPost.author?.display_name || 'Slovor Team'}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="text-primary h-4 w-4" />
                    {featuredPost.published_at
                      ? new Date(featuredPost.published_at).toLocaleDateString()
                      : new Date(featuredPost.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Post Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {otherPosts.map((post) => (
            <Link
              key={post.id}
              href={`/${lang}/blog/${post.slug}`}
              className="group border-border bg-card hover:border-primary/50 hover:shadow-primary/5 flex flex-col overflow-hidden rounded-xl border shadow-sm transition-all hover:shadow-xl"
            >
              <div className="relative aspect-video overflow-hidden">
                {post.cover_image ? (
                  <Image
                    src={post.cover_image}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="bg-muted h-full w-full" />
                )}
              </div>
              <div className="flex flex-1 flex-col p-8">
                <span className="bg-muted border-border text-muted-foreground group-hover:bg-primary/10 mb-4 inline-flex w-fit items-center rounded-xl border px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase transition-colors group-hover:block">
                  Article
                </span>
                <h3 className="group-hover:text-primary mb-4 line-clamp-2 text-xl leading-snug font-bold tracking-tight uppercase transition-colors">
                  {post.title}
                </h3>
                <p className="text-muted-foreground mb-8 line-clamp-2 flex-1 text-sm leading-relaxed font-medium">
                  {post.excerpt}
                </p>
                <div className="border-border text-muted-foreground flex items-center justify-between border-t pt-6 text-[11px] font-bold tracking-widest uppercase">
                  <span className="line-clamp-1 flex max-w-[120px] items-center gap-1.5">
                    <User className="text-primary h-3 w-3" />
                    {post.author?.display_name || 'Team'}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="text-primary h-3 w-3" />
                    {post.published_at
                      ? new Date(post.published_at).toLocaleDateString()
                      : new Date(post.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </div>
  )
}
