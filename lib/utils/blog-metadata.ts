import { Metadata } from 'next'
import { blogApi } from '@/lib/api'

type Props = {
    params: Promise<{ slug: string }>
}

export async function generateBlogMetadata(
    { params }: Props
): Promise<Metadata> {
    const { slug } = await params

    const { data: post } = await blogApi.getPostBySlug(slug)

    if (!post) {
        return {
            title: 'Post Not Found | Slovor Blog',
        }
    }

    const title = `${post.title} | Slovor Blog`
    const description = post.excerpt || `Read ${post.title} on Slovor Marketplace Blog.`
    const images = post.cover_image ? [post.cover_image] : ['/blog-default.jpg']
    const mainImage = images[0] || '/blog-default.jpg'

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: 'article',
            publishedTime: post.published_at || post.created_at,
            authors: [post.author?.display_name || 'Slovor Team'],
            images: [
                {
                    url: mainImage,
                    width: 1200,
                    height: 630,
                    alt: post.title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [mainImage],
        },
    }
}
