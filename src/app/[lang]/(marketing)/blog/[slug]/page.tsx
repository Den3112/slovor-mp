import { notFound } from 'next/navigation'
import { blogApi } from '@/lib/api'
import { Container } from '@/components/ui/container'
import { Calendar, User, ChevronLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { sanitizeHtml } from '@/lib/utils/sanitize'
import { generateBlogMetadata } from '@/lib/utils/blog-metadata'
import { getTranslationServer } from '@/lib/i18n/server'
import { BlogNewsletter } from '@/components/blog/blog-newsletter'

interface BlogPostProps {
  params: Promise<{
    slug: string
    lang: string
  }>
}

export const generateMetadata = generateBlogMetadata

export async function generateStaticParams() {
  if (process.env.SKIP_ENV_VALIDATION === '1') {
    return []
  }
  const { data: posts } = await blogApi.listPosts({ limit: 10, offset: 0 })
  if (!posts) return []

  const languages = ['en', 'sk', 'cs']

  return languages.flatMap((lang) =>
    posts.map((post) => ({
      slug: post.slug,
      lang: lang,
    }))
  )
}

export default async function BlogPostPage({ params }: BlogPostProps) {
  const { slug, lang } = await params

  if (process.env.SKIP_ENV_VALIDATION === '1') {
    return <div className="py-20 text-center">Building...</div>
  }

  const { t } = await getTranslationServer(['common', 'blog'])

  // Fetch post from database
  const { data: post, error } = await blogApi.getPostBySlug(slug)

  // If post doesn't exist or is not published, return 404
  if (error || !post || !post.is_published) {
    notFound()
  }

  return (
    <main className="bg-background relative min-h-screen pb-24">
      {/* Header Section */}
      <div className="bg-muted border-border border-b pt-32 pb-16">
        <Container>
          <Link href={`/${lang}/blog`} className="mb-8 inline-block">
            <Button
              variant="outline"
              size="sm"
              className="border-border rounded-xl font-bold"
            >
              <ChevronLeft className="mr-2 h-4 w-4" /> {t('blog:backToBlog')}
            </Button>
          </Link>

          <div className="animate-in fade-in slide-in-from-bottom-4 max-w-4xl space-y-8 duration-700">
            <div className="bg-primary/10 border-primary/20 text-primary inline-flex items-center gap-2 rounded-xl border px-3 py-1 text-[10px] font-bold tracking-widest uppercase">
              {t('blog:marketInsight')}
            </div>
            <h1 className="font-heading text-foreground text-4xl leading-[1.1] font-bold tracking-tight uppercase md:text-7xl">
              {post.title}
            </h1>

            <div className="text-muted-foreground flex flex-wrap items-center gap-8 text-[11px] font-bold tracking-[0.2em] uppercase">
              {post.author && (
                <div className="flex items-center gap-3">
                  <div className="border-border relative h-10 w-10 overflow-hidden rounded-xl border">
                    {post.author.avatar_url ? (
                      <Image
                        src={post.author.avatar_url}
                        alt={post.author.display_name || ''}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="bg-background flex h-full w-full items-center justify-center">
                        <User className="text-muted-foreground h-5 w-5" />
                      </div>
                    )}
                  </div>
                  <span className="text-foreground">
                    {post.author.display_name || 'Slovor Team'}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="text-primary h-4 w-4" />
                <span>
                  {post.published_at
                    ? new Date(post.published_at).toLocaleDateString()
                    : new Date(post.created_at).toLocaleDateString()}
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
            <article className="bg-card border-border rounded-xl border p-8 shadow-sm md:p-16">
              {post.cover_image && (
                <div className="border-border relative mb-12 aspect-video overflow-hidden rounded-xl border shadow-sm">
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
                <div className="border-primary bg-primary/5 mb-12 rounded-xl border-l-4 p-8">
                  <p className="text-foreground text-xl leading-relaxed font-bold">
                    {post.excerpt}
                  </p>
                </div>
              )}

              <div
                className="prose prose-zinc dark:prose-invert prose-headings:font-bold prose-headings: prose-headings:tracking-tight prose-headings:uppercase prose-p:text-lg prose-p:leading-relaxed prose-p:font-medium prose-strong:text-foreground prose-strong:font-bold prose-a:text-primary hover:prose-a:underline prose-img:rounded-xl prose-img:border prose-img:border-border max-w-none"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }}
              />
            </article>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6 lg:col-span-4">
            <div className="bg-card border-border rounded-xl border p-8 shadow-sm">
              <h3 className="mb-6 text-xs font-bold tracking-[0.2em] uppercase">
                {t('blog:shareArticle')}
              </h3>
              <div className="flex gap-3">
                <Button
                  size="icon"
                  variant="outline"
                  className="border-border hover:bg-muted h-12 w-12 rounded-xl"
                  onClick={() =>
                    window.open(
                      `https://twitter.com/intent/tweet?url=${encodeURIComponent(`https://slovor.sk/${lang}/blog/${slug}`)}&text=${encodeURIComponent(post.title)}`,
                      '_blank',
                      'noopener'
                    )
                  }
                  aria-label="Share on Twitter"
                >
                  <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  className="border-border hover:bg-muted h-12 w-12 rounded-xl"
                  onClick={() =>
                    window.open(
                      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://slovor.sk/${lang}/blog/${slug}`)}`,
                      '_blank',
                      'noopener'
                    )
                  }
                  aria-label="Share on Facebook"
                >
                  <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                  </svg>
                </Button>
              </div>
            </div>

            <BlogNewsletter
              title={t('blog:joinInsights')}
              description={t('blog:subscribeDesc')}
              buttonText={t('blog:subscribe')}
              errorMsg={t('common:error.invalidEmail')}
              successMsg={t('blog:subscribeSuccess')}
            />
          </aside>
        </div>
      </Container>
    </main>
  )
}
