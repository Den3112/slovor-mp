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

export default async function BlogPage() {
  const { data: blogPosts } = await blogApi.listPosts({ limit: 12 })

  const posts = blogPosts || []
  const featuredPost = posts[0]
  const otherPosts = posts.slice(1)

  if (posts.length === 0) {
    return (
      <div className="min-h-screen bg-background pt-32 pb-20">
        <Container>
          <div className="text-center py-20 bg-card border border-border rounded-xl shadow-sm max-w-2xl mx-auto">
            <div className="bg-muted w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6 border border-border">
              <Sparkles className="h-8 w-8 text-muted-foreground/40" />
            </div>
            <h1 className="mb-4 text-4xl font-black italic tracking-tight uppercase">Blog Coming Soon</h1>
            <p className="text-muted-foreground font-medium max-w-md mx-auto">
              Our team is working on exciting content. Check back later for expert tips and marketplace news.
            </p>
          </div>
        </Container>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-20 md:pt-32">
      <Container>
        {/* Header */}
        <div className="mb-16 text-center animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="bg-primary/10 mx-auto mb-6 inline-flex items-center gap-2 rounded-xl border border-primary/20 px-4 py-2">
            <Sparkles className="text-primary h-4 w-4" />
            <span className="text-primary text-[10px] font-black uppercase tracking-widest">
              Slovor Insights
            </span>
          </div>
          <h1 className="mb-6 text-4xl font-black tracking-tight lg:text-7xl italic uppercase">
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
            href={`/blog/${featuredPost.slug}`}
            className="group block border border-border bg-card overflow-hidden rounded-xl transition-all hover:border-primary/50 shadow-sm hover:shadow-xl hover:shadow-primary/5 duration-500 mb-20"
          >
            <div className="grid gap-0 md:grid-cols-2">
              <div className="relative aspect-16/10 md:aspect-auto h-full min-h-[400px] overflow-hidden">
                {featuredPost.cover_image ? (
                  <Image
                    src={featuredPost.cover_image}
                    alt={featuredPost.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-muted" />
                )}
                <div className="absolute top-6 left-6">
                  <span className="bg-primary text-primary-foreground rounded-lg px-4 py-1.5 text-[10px] font-black uppercase tracking-widest">
                    Featured Store
                  </span>
                </div>
              </div>
              <div className="flex flex-col justify-center p-8 md:p-16 space-y-8">
                <span className="inline-flex w-fit items-center rounded-lg bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-primary border border-primary/20">
                  Expert Insight
                </span>
                <h2 className="text-3xl font-black tracking-tight transition-colors md:text-5xl italic uppercase leading-tight group-hover:text-primary">
                  {featuredPost.title}
                </h2>
                <p className="text-muted-foreground text-lg font-medium leading-relaxed">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center gap-6 border-t border-border pt-8 text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" />
                    {featuredPost.author?.display_name || 'Slovor Team'}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    {featuredPost.published_at ? new Date(featuredPost.published_at).toLocaleDateString() : new Date(featuredPost.created_at).toLocaleDateString()}
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
              href={`/blog/${post.slug}`}
              className="group flex flex-col border border-border bg-card overflow-hidden rounded-xl transition-all hover:border-primary/50 shadow-sm hover:shadow-xl hover:shadow-primary/5"
            >
              <div className="relative aspect-video overflow-hidden">
                {post.cover_image ? (
                  <Image
                    src={post.cover_image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-muted" />
                )}
              </div>
              <div className="flex-1 p-8 flex flex-col">
                <span className="mb-4 inline-flex w-fit items-center rounded-lg bg-muted border border-border px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:bg-primary/10 group-hover:block transition-colors">
                  Article
                </span>
                <h3 className="mb-4 text-xl font-black tracking-tight transition-colors italic uppercase line-clamp-2 leading-snug group-hover:text-primary">
                  {post.title}
                </h3>
                <p className="text-muted-foreground mb-8 line-clamp-2 text-sm font-medium leading-relaxed flex-1">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between border-t border-border pt-6 text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                  <span className="flex items-center gap-1.5 line-clamp-1 max-w-[120px]">
                    <User className="h-3 w-3 text-primary" />
                    {post.author?.display_name || 'Team'}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3 w-3 text-primary" />
                    {post.published_at ? new Date(post.published_at).toLocaleDateString() : new Date(post.created_at).toLocaleDateString()}
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
