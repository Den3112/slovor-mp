import type { Metadata } from 'next'
import { Container } from '@/components/ui/container'
import { Sparkles, Clock, ArrowRight, User } from 'lucide-react'
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
      <div className="min-h-screen pt-32 pb-20">
        <Container>
          <div className="text-center py-20">
            <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="h-8 w-8 text-muted-foreground/40" />
            </div>
            <h1 className="mb-4 text-4xl font-black italic tracking-tight">Blog Coming Soon</h1>
            <p className="text-muted-foreground font-medium max-w-md mx-auto">
              Our team is working on exciting content. Check back later for expert tips and marketplace news.
            </p>
          </div>
        </Container>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-20 md:pt-32">
      <Container>
        {/* Header */}
        <div className="mb-12 text-center animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="bg-primary/10 mx-auto mb-4 inline-flex items-center gap-2 rounded-full px-4 py-2">
            <Sparkles className="text-primary h-4 w-4" />
            <span className="text-primary text-[10px] font-black uppercase tracking-widest">
              Slovor Insights
            </span>
          </div>
          <h1 className="mb-4 text-4xl font-black tracking-tight lg:text-6xl italic">
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
            className="group border-border/40 bg-card hover:border-primary/30 mb-20 block overflow-hidden rounded-5xl border transition-all hover:shadow-2xl animate-in fade-in slide-in-from-bottom-6 duration-1000"
          >
            <div className="grid gap-0 md:grid-cols-2">
              <div className="relative aspect-16/10 md:aspect-auto h-full min-h-[400px]">
                {featuredPost.cover_image ? (
                  <Image
                    src={featuredPost.cover_image}
                    alt={featuredPost.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-linear-to-br from-primary/10 to-violet-500/10" />
                )}
                <div className="absolute top-6 left-6">
                  <span className="bg-primary text-primary-foreground rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest shadow-lg">
                    Featured Store
                  </span>
                </div>
              </div>
              <div className="flex flex-col justify-center p-8 md:p-16">
                <span
                  className="mb-6 inline-flex w-fit items-center rounded-full bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-primary"
                >
                  Expert Insight
                </span>
                <h2 className="group-hover:text-primary mb-6 text-3xl font-black tracking-tight transition-colors md:text-5xl italic leading-tight">
                  {featuredPost.title}
                </h2>
                <p className="text-muted-foreground mb-8 text-lg font-medium leading-relaxed">
                  {featuredPost.excerpt}
                </p>
                <div className="text-muted-foreground flex items-center gap-6 text-sm font-bold">
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
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {otherPosts.map((post, idx) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              style={{ animationDelay: `${(idx + 1) * 100}ms` }}
              className="group border-border/40 bg-card/60 hover:border-primary/30 overflow-hidden rounded-4xl border transition-all hover:shadow-xl hover:-translate-y-2 animate-in fade-in slide-in-from-bottom-4 duration-700"
            >
              <div className="relative aspect-16/10 overflow-hidden">
                {post.cover_image ? (
                  <Image
                    src={post.cover_image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-linear-to-br from-primary/5 to-violet-500/5" />
                )}
              </div>
              <div className="p-8">
                <span
                  className="mb-4 inline-flex items-center rounded-full bg-muted px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors"
                >
                  Article
                </span>
                <h3 className="group-hover:text-primary mb-4 text-xl font-black tracking-tight transition-colors italic line-clamp-2 leading-snug">
                  {post.title}
                </h3>
                <p className="text-muted-foreground mb-6 line-clamp-2 text-sm font-medium leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="text-muted-foreground flex items-center justify-between text-[11px] font-black uppercase tracking-widest border-t border-border/50 pt-6">
                  <span className="flex items-center gap-1.5 line-clamp-1 max-w-[120px]">
                    <User className="h-3 w-3" />
                    {post.author?.display_name || 'Team'}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3 w-3" />
                    {post.published_at ? new Date(post.published_at).toLocaleDateString() : new Date(post.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Newsletter CTA */}
        <div className="from-primary/10 via-primary/5 mt-32 rounded-[3rem] border border-primary/20 bg-linear-to-br to-transparent p-12 text-center md:p-20 shadow-2xl overflow-hidden relative">
          <div className="absolute top-[-20%] left-[-10%] h-[60%] w-[40%] rounded-full bg-primary/20 blur-[120px]" />
          <h2 className="mb-6 text-3xl font-black italic tracking-tight md:text-5xl">Stay Ahead of the Market</h2>
          <p className="text-muted-foreground mx-auto mb-10 max-w-lg text-lg font-medium">
            Join 5,000+ sellers receiving our weekly digestible newsletter on trends and secure trading.
          </p>
          <div className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row relative z-10">
            <input
              type="email"
              placeholder="Enter your email"
              className="bg-background/60 border-border/50 focus:border-primary/50 flex-1 rounded-2xl border px-6 py-4 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-medium"
            />
            <button className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center gap-2 rounded-2xl px-8 py-4 font-black uppercase tracking-widest transition-all shadow-lg shadow-primary/20 active:scale-95">
              Join Now
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </Container>
    </div>
  )
}
