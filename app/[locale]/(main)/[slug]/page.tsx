import { notFound } from 'next/navigation'
import { pagesApi } from '@/lib/api'
import { Container } from '@/components/ui/container'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import { FileText, Clock } from 'lucide-react'

interface StaticPageProps {
    params: {
        slug: string
    }
}

export default async function PublicStaticPage({ params }: StaticPageProps) {
    const { slug } = params

    // Fetch page from database
    const { data: page, error } = await pagesApi.getBySlug(slug)

    // If page doesn't exist in DB, return 404
    // Note: Next.js will prioritize existing folders (like /about, /terms) over this dynamic route
    if (error || !page) {
        notFound()
    }

    return (
        <main className="relative min-h-screen overflow-hidden pb-24">
            {/* Background Decor */}
            <div className="absolute top-0 left-1/2 -z-10 h-full w-full -translate-x-1/2 opacity-30">
                <div className="bg-primary/20 absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full blur-[120px]" />
                <div className="absolute right-[-10%] bottom-[-10%] h-[40%] w-[40%] rounded-full bg-violet-500/10 blur-[120px]" />
            </div>

            <Container className="pt-32 md:pt-40">
                <div className="mx-auto max-w-4xl">
                    <div className="mb-8 flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-700">
                        <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-xl">
                            <FileText className="text-primary h-6 w-6" />
                        </div>
                        <div className="flex-1">
                            <Breadcrumbs
                                items={[{ label: page.title }]}
                            />
                            <h1 className="font-heading text-foreground text-4xl font-black tracking-tight italic md:text-5xl">
                                {page.title}
                            </h1>
                            {page.updated_at && (
                                <div className="text-muted-foreground mt-1 flex items-center gap-2 text-sm font-bold">
                                    <Clock className="h-4 w-4" />
                                    Updated: {new Date(page.updated_at).toLocaleDateString()}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="shadow-premium border-border/50 bg-card max-w-none rounded-xl border p-8 md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
                        {/*
                            Content rendering:
                            Since we use premium design, we ensure the content is styled.
                            In a real app, we'd use react-markdown here.
                            For now, we render as HTML-safe if it's trusted (it's from admin).
                        */}
                        <div
                            className="prose prose-zinc dark:prose-invert max-w-none
                            prose-headings:font-black prose-headings:italic prose-headings:tracking-tight
                            prose-p:text-lg prose-p:leading-relaxed prose-p:text-zinc-600 dark:prose-p:text-zinc-400
                            prose-strong:text-foreground prose-a:text-primary hover:prose-a:underline"
                            dangerouslySetInnerHTML={{ __html: page.content }}
                        />
                    </div>
                </div>
            </Container>
        </main>
    )
}
