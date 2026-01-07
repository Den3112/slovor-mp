import { Container } from '@/components/ui/container'
import { Sparkles } from 'lucide-react'

export const metadata = {
    title: 'Blog - Slovor Marketplace',
    description: 'Market trends, tips, and news from Slovor Marketplace.',
}

export default function BlogPage() {
    return (
        <Container className="pt-32 pb-20">
            <div className="flex flex-col items-center justify-center text-center space-y-6 max-w-2xl mx-auto">
                <div className="rounded-full bg-primary/10 p-4 mb-4">
                    <Sparkles className="h-10 w-10 text-primary" />
                </div>
                <h1 className="text-4xl font-black tracking-tight lg:text-5xl">
                    Market Trends & News
                </h1>
                <p className="text-xl text-muted-foreground">
                    Expert insights, selling tips, and community stories coming soon.
                </p>
                <div className="p-8 rounded-2xl border border-dashed border-primary/20 bg-muted/30 w-full mt-8">
                    <p className="font-mono text-sm text-primary/70">Blog is currently under construction.</p>
                </div>
            </div>
        </Container>
    )
}
