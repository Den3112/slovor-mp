import { Button } from '@/components/ui/button'
import { Loader2, ArrowRight, ArrowLeft, Edit3 } from 'lucide-react'
import { cn } from '@/lib/utils'

import type { TranslationKeys } from '@/lib/i18n/translations'

interface FormActionsProps {
    step: number
    showPreview: boolean
    isSubmitting: boolean
    t: TranslationKeys
    prevStep: () => void
    goToNextStep: () => void
    handleSubmit: () => void
    setViewMode: (mode: 'edit' | 'preview') => void
}

export function FormActions({
    step,
    showPreview,
    isSubmitting,
    t,
    prevStep,
    goToNextStep,
    handleSubmit,
    setViewMode,
}: FormActionsProps) {
    if (showPreview) {
        return (
            <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between border-t border-border/10 bg-background/90 p-4 backdrop-blur-xl md:relative md:mt-10 md:justify-between md:border-t md:border-white/10 md:bg-transparent md:p-0 md:pt-8">
                <div className="flex gap-3 w-full">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setViewMode('edit')}
                        className="flex-1 rounded-xl"
                    >
                        <Edit3 className="mr-2 h-4 w-4" />
                        {t.createListing.backToEdit}
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="flex-1 rounded-2xl bg-primary px-8 py-4 font-bold shadow-lg shadow-primary/20"
                    >
                        {isSubmitting ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            t.createListing.publish
                        )}
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between border-t border-border/10 bg-background/90 p-4 backdrop-blur-xl md:relative md:mt-10 md:justify-between md:border-t md:border-white/10 md:bg-transparent md:p-0 md:pt-8">
            {step > 1 ? (
                <Button
                    type="button"
                    variant="ghost"
                    onClick={prevStep}
                    className="hidden md:flex font-bold text-muted-foreground hover:text-white hover:bg-white/10 rounded-xl"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" /> {t.createListing.back}
                </Button>
            ) : <div className="hidden md:block" />}

            {/* Mobile Back (if step > 1) */}
            <Button
                type="button"
                variant="ghost"
                onClick={prevStep}
                className={cn("md:hidden font-bold text-muted-foreground rounded-xl", step === 1 && "invisible")}
            >
                {t.createListing.back}
            </Button>

            {step < 3 ? (
                <Button
                    type="button"
                    onClick={goToNextStep}
                    className="rounded-2xl px-8 py-6 md:py-4 font-bold shadow-lg shadow-primary/20 transition-transform active:scale-95"
                >
                    {t.createListing.nextStep} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            ) : (
                <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="min-w-[140px] rounded-2xl bg-primary px-8 py-6 md:py-4 font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-transform active:scale-95"
                >
                    {isSubmitting ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                        t.createListing.publish
                    )}
                </Button>
            )}
        </div>
    )
}
