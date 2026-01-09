import { Container } from '@/components/ui/container'
import { Sparkles, Clock, ArrowRight, User } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export const metadata = {
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
                <div className="mb-12 text-center">
                    <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-primary">Slovor Blog</span>
                    </div>
                    <h1 className="mb-4 text-4xl font-black tracking-tight lg:text-5xl">
                        Market Trends & News
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                        Expert insights, selling tips, and community stories to help you succeed on Slovor
                    </p>
                </div>

                {/* Featured Post */}
                <Link
                    href={`/blog/${featuredPost.slug}`}
                    className="group mb-12 block overflow-hidden rounded-3xl border border-border/50 bg-card transition-all hover:border-primary/30 hover:shadow-xl"
                >
                    <div className="grid gap-0 md:grid-cols-2">
                        <div className="relative aspect-[4/3] md:aspect-auto">
                            <Image
                                src={featuredPost.image}
                                alt={featuredPost.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute left-4 top-4">
                                <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
                                    Featured
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col justify-center p-8 md:p-12">
                            <span className={`mb-4 inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-medium ${categoryColors[featuredPost.category]}`}>
                                {featuredPost.category}
                            </span>
                            <h2 className="mb-4 text-2xl font-bold transition-colors group-hover:text-primary md:text-3xl">
                                {featuredPost.title}
                            </h2>
                            <p className="mb-6 text-muted-foreground">
                                {featuredPost.excerpt}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <User className="h-4 w-4" />
                                    {featuredPost.author}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    {featuredPost.readTime}
                                </span>
                            </div>
                        </div>
                    </div>
                </Link>

                {/* Post Grid */}
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {otherPosts.map((post) => (
                        <Link
                            key={post.id}
                            href={`/blog/${post.slug}`}
                            className="group overflow-hidden rounded-2xl border border-border/50 bg-card transition-all hover:border-primary/30 hover:shadow-lg"
                        >
                            <div className="relative aspect-[16/10] overflow-hidden">
                                <Image
                                    src={post.image}
                                    alt={post.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>
                            <div className="p-6">
                                <span className={`mb-3 inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${categoryColors[post.category]}`}>
                                    {post.category}
                                </span>
                                <h3 className="mb-3 text-lg font-bold transition-colors group-hover:text-primary">
                                    {post.title}
                                </h3>
                                <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                                    {post.excerpt}
                                </p>
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                    <span>{new Date(post.date).toLocaleDateString()}</span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {post.readTime}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Newsletter CTA */}
                <div className="mt-16 rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-8 text-center md:p-12">
                    <h2 className="mb-4 text-2xl font-bold md:text-3xl">
                        Stay Updated
                    </h2>
                    <p className="mx-auto mb-6 max-w-md text-muted-foreground">
                        Get the latest tips, trends, and news delivered to your inbox
                    </p>
                    <div className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="flex-1 rounded-xl border border-border bg-background px-4 py-3 focus:border-primary focus:outline-none"
                        />
                        <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-bold text-primary-foreground transition-colors hover:bg-primary/90">
                            Subscribe
                            <ArrowRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </Container>
        </div>
    )
}
