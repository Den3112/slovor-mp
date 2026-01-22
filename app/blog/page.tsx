import type { Metadata } from 'next'
import { Container } from '@/components/ui/container'
import { Sparkles, Clock, ArrowRight, User } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'Blog - Slovor Marketplace',
    description: 'Market trends, tips, and news from Slovor Marketplace.',
}

// Static blog posts data (can be replaced with CMS later)
const blogPosts = [
    {
        id: '1',
        slug: 'how-to-sell-faster',
        title: 'How to Sell Your Items Faster on Slovor',
        excerpt: 'Learn the secrets to creating listings that attract buyers and close deals quickly. From photography tips to pricing strategies.',
        image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
        author: 'Slovor Team',
        date: '2026-01-08',
        readTime: '5 min read',
        category: 'Tips & Tricks',
    },
    {
        id: '2',
        slug: 'safe-transactions',
        title: 'Staying Safe: A Guide to Secure Transactions',
        excerpt: 'Protect yourself from scams with our comprehensive safety guide. Learn to identify red flags and conduct safe meetups.',
        image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800',
        author: 'Slovor Team',
        date: '2026-01-05',
        readTime: '7 min read',
        category: 'Safety',
    },
    {
        id: '3',
        slug: 'spring-trends-2026',
        title: 'What\'s Hot: Spring 2026 Marketplace Trends',
        excerpt: 'Discover the most in-demand items this spring. From vintage fashion to sustainable tech, here\'s what buyers are looking for.',
        image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800',
        author: 'Slovor Team',
        date: '2026-01-02',
        readTime: '4 min read',
        category: 'Trends',
    },
    {
        id: '4',
        slug: 'photography-guide',
        title: 'Product Photography 101: Take Better Listing Photos',
        excerpt: 'You don\'t need expensive equipment to take great photos. Learn simple techniques to make your items stand out.',
        image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800',
        author: 'Slovor Team',
        date: '2025-12-28',
        readTime: '6 min read',
        category: 'Tips & Tricks',
    },
    {
        id: '5',
        slug: 'pricing-strategy',
        title: 'The Art of Pricing: Finding the Sweet Spot',
        excerpt: 'Price too high and nobody buys. Price too low and you lose money. Here\'s how to find the perfect price for your items.',
        image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800',
        author: 'Slovor Team',
        date: '2025-12-20',
        readTime: '5 min read',
        category: 'Tips & Tricks',
    },
    {
        id: '6',
        slug: 'sustainable-shopping',
        title: 'The Rise of Sustainable Shopping in Slovakia',
        excerpt: 'Second-hand is no longer just about saving money. Explore how sustainable shopping is reshaping consumer habits.',
        image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800',
        author: 'Slovor Team',
        date: '2025-12-15',
        readTime: '8 min read',
        category: 'Trends',
    },
]

const categoryColors: Record<string, string> = {
    'Tips & Tricks': 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    'Safety': 'bg-green-500/10 text-green-600 dark:text-green-400',
    'Trends': 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
}

export default function BlogPage() {
    const featuredPost = blogPosts[0]
    const otherPosts = blogPosts.slice(1)

    if (!featuredPost) {
        return (
            <div className="min-h-screen pt-32 pb-20">
                <Container>
                    <div className="text-center">
                        <h1 className="text-4xl font-black mb-4">Blog Coming Soon</h1>
                        <p className="text-muted-foreground">Check back later for updates.</p>
                    </div>
                </Container>
            </div>
        )
    }

    return (
        <div className="min-h-screen pb-20 pt-24 md:pt-32">
            <Container>
                {/* Header */}
                <div className="mb-16 text-center">
                    <div className="mx-auto mb-6 inline-flex items-center gap-3 border-2 border-primary/20 bg-primary/10 px-6 py-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <span className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Slovor Blog</span>
                    </div>
                    <h1 className="mb-6 font-heading text-6xl font-black italic tracking-tighter text-white lg:text-8xl">
                        Market Trends & News
                    </h1>
                    <p className="mx-auto max-w-2xl font-sans text-lg font-medium tracking-wide text-zinc-500 leading-relaxed">
                        Expert insights, selling tips, and community stories to help you succeed on Slovor
                    </p>
                </div>

                {/* Featured Post */}
                <Link
                    href={`/blog/${featuredPost.slug}`}
                    className="group mb-16 block border-2 border-primary/10 bg-zinc-950 transition-all hover:border-primary hover:shadow-[20px_20px_0px_0px_rgba(0,0,0,0.5)]"
                >
                    <div className="grid gap-0 md:grid-cols-2">
                        <div className="relative aspect-[4/3] md:aspect-auto border-r-2 border-primary/10 overflow-hidden">
                            <Image
                                src={featuredPost.image}
                                alt={featuredPost.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute left-0 top-0">
                                <span className="border-b-2 border-r-2 border-primary/20 bg-primary px-4 py-2 font-sans text-[10px] font-bold uppercase tracking-widest text-white">
                                    Featured
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col justify-center p-8 md:p-16">
                            <span className={`mb-6 inline-flex w-fit border-2 px-3 py-1 font-sans text-[10px] font-bold uppercase tracking-widest ${categoryColors[featuredPost.category]}`}>
                                {featuredPost.category}
                            </span>
                            <h2 className="mb-6 font-heading text-4xl font-bold italic transition-colors group-hover:text-primary leading-tight text-white">
                                {featuredPost.title}
                            </h2>
                            <p className="mb-8 font-sans text-lg font-medium text-zinc-500 leading-relaxed">
                                {featuredPost.excerpt}
                            </p>
                            <div className="flex items-center gap-8 font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">
                                <span className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-primary" />
                                    {featuredPost.author}
                                </span>
                                <span className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-primary" />
                                    {featuredPost.readTime}
                                </span>
                            </div>
                        </div>
                    </div>
                </Link>

                {/* Post Grid */}
                <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
                    {otherPosts.map((post) => (
                        <Link
                            key={post.id}
                            href={`/blog/${post.slug}`}
                            className="group flex flex-col border-2 border-primary/10 bg-zinc-950 transition-all hover:border-primary hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,0.3)]"
                        >
                            <div className="relative aspect-[16/10] overflow-hidden border-b-2 border-primary/10">
                                <Image
                                    src={post.image}
                                    alt={post.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            </div>
                            <div className="flex flex-1 flex-col p-8">
                                <span className={`mb-4 inline-flex w-fit border-2 px-3 py-1 font-sans text-[10px] font-bold uppercase tracking-widest ${categoryColors[post.category]}`}>
                                    {post.category}
                                </span>
                                <h3 className="mb-4 font-heading text-2xl font-bold italic transition-colors group-hover:text-primary leading-tight text-white">
                                    {post.title}
                                </h3>
                                <p className="mb-8 line-clamp-3 font-sans text-sm font-medium text-zinc-500 leading-relaxed">
                                    {post.excerpt}
                                </p>
                                <div className="mt-auto flex items-center justify-between font-sans text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                                    <span>{new Date(post.date).toLocaleDateString()}</span>
                                    <span className="flex items-center gap-2">
                                        <Clock className="h-3 w-3 text-primary" />
                                        {post.readTime}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Newsletter CTA */}
                <div className="mt-24 border-2 border-primary/20 bg-zinc-950 p-12 md:p-20 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                    <div className="relative z-10 text-center">
                        <h2 className="mb-6 font-heading text-5xl font-black italic tracking-tight text-white md:text-6xl">
                            Stay Updated
                        </h2>
                        <p className="mx-auto mb-10 max-w-md font-sans font-medium tracking-wide text-zinc-500 leading-relaxed">
                            Get the latest tips, trends, and news delivered to your inbox
                        </p>
                        <div className="mx-auto flex max-w-lg flex-col gap-4 sm:flex-row">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 border-2 border-primary/20 bg-zinc-900 px-6 py-4 font-sans text-sm font-bold text-white outline-none focus:border-primary transition-all placeholder:text-zinc-700"
                            />
                            <button className="inline-flex items-center justify-center gap-3 bg-primary px-10 py-4 font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-white transition-all hover:bg-primary/90 hover:-translate-y-1 shadow-xl shadow-primary/20 active:translate-y-0">
                                Subscribe
                                <ArrowRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    )
}
