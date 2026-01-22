import { Mail } from 'lucide-react'

import type { TranslationKeys } from '@/lib/i18n/translations'

interface FooterNewsletterProps {
    t: TranslationKeys
}

export function FooterNewsletter({ t }: FooterNewsletterProps) {
    return (
        <div className="group mb-12 flex flex-col items-center justify-between gap-10 border-2 border-primary/10 bg-background p-5 transition-all duration-700 hover:border-primary/30 md:mb-24 md:p-12 lg:mb-32 lg:flex-row lg:p-16">
            <div className="w-full text-center lg:max-w-md lg:text-left">
                <h3 className="mb-4 font-heading text-2xl font-bold tracking-tight text-white md:mb-6 md:text-3xl lg:text-4xl">
                    {t.footer.newsletterTitle}
                </h3>
                <p className="font-sans text-base font-medium text-zinc-500 md:text-lg">
                    {t.footer.newsletterSubtitle}
                </p>
            </div>
            <div className="flex w-full flex-col gap-3 lg:max-w-lg lg:flex-row lg:gap-4">
                <div className="group/input relative flex-1">
                    <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-600 transition-colors group-focus-within/input:text-primary" />
                    <input
                        type="email"
                        placeholder={t.footer.newsletterPlaceholder}
                        className="w-full border-2 border-primary/10 bg-zinc-950 py-5 pl-12 pr-4 font-sans text-base font-bold text-white transition-all placeholder:text-zinc-700 focus:border-primary focus:outline-none"
                    />
                </div>
                <button className="h-16 w-full shrink-0 bg-primary px-8 text-base font-bold text-white shadow-xl transition-all hover:bg-primary/90 active:scale-[0.98] lg:w-auto lg:px-12">
                    {t.footer.subscribe}
                </button>
            </div>
        </div>
    )
}
