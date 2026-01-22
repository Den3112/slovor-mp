import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

import type { TranslationKeys } from '@/lib/i18n/translations'

interface FormHeaderProps {
    step: number
    showPreview: boolean
    t: TranslationKeys
    router: { push: (href: string) => void }
    prevStep: () => void
}

export function FormHeader({ step, showPreview, t, router, prevStep }: FormHeaderProps) {
    return (
        <>
            {/* Mobile Top Bar */}
            <div className="sticky top-0 z-50 flex w-full items-center justify-between border-b border-border/10 bg-background/80 px-4 py-3 backdrop-blur-xl md:hidden">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => step > 1 && !showPreview ? prevStep() : router.push('/')}
                    className="rounded-full"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div className="flex flex-col items-center">
                    <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        {showPreview ? t.createListing.preview : t.createListing.step.replace('{step}', step.toString())}
                    </span>
                    {!showPreview && (
                        <div className="flex gap-1 mt-1">
                            {[1, 2, 3].map(i => (
                                <div key={i} className={cn("h-1 w-8 rounded-full transition-colors", step >= i ? "bg-primary" : "bg-muted")} />
                            ))}
                        </div>
                    )}
                </div>
                <div className="w-10" />
            </div>

            {/* Header - Desktop Only */}
            <div className="mb-6 text-center hidden md:block">
                <h1 className="mb-2 font-heading text-3xl font-black tracking-tight text-white drop-shadow-sm">
                    {showPreview ? t.createListing.preview : t.createListing.title}
                </h1>
                <p className="text-muted-foreground">
                    {showPreview ? t.createListing.previewDescription : t.createListing.step.replace('{step}', step.toString())}
                </p>
            </div>
        </>
    )
}
