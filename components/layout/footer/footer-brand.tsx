import Link from 'next/link'
import { Facebook, Instagram, Twitter } from 'lucide-react'

interface FooterBrandProps {
    description: string
}

export function FooterBrand({ description }: FooterBrandProps) {
    return (
        <div className="space-y-6 md:space-y-10 lg:col-span-4">
            <Link href="/" className="group inline-flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center border-2 border-primary bg-background text-xl font-bold text-primary shadow-xl transition-transform duration-500 group-hover:rotate-6 md:h-12 md:w-12 md:text-2xl">
                    S
                </div>
                <span className="font-heading text-2xl font-bold tracking-tighter text-white md:text-3xl">
                    Slovor
                    <span className="text-primary">.</span>
                </span>
            </Link>
            <p className="max-w-xs font-sans text-lg font-medium italic leading-relaxed text-zinc-500 md:max-w-sm md:text-xl">
                &ldquo;{description}&rdquo;
            </p>
            <div className="flex gap-3 md:gap-5">
                {[
                    { icon: <Facebook className="h-5 w-5 md:h-6 md:w-6" />, href: '#', label: 'Facebook' },
                    { icon: <Instagram className="h-5 w-5 md:h-6 md:w-6" />, href: '#', label: 'Instagram' },
                    { icon: <Twitter className="h-5 w-5 md:h-6 md:w-6" />, href: '#', label: 'Twitter' },
                ].map((social, i) => (
                    <a
                        key={i}
                        href={social.href}
                        aria-label={social.label}
                        className="flex h-12 w-12 transform items-center justify-center border-2 border-primary/10 bg-white/[0.03] text-zinc-500 shadow-xl transition-all hover:-translate-y-1 hover:border-primary hover:bg-primary/5 hover:text-white md:h-14 md:w-14"
                    >
                        {social.icon}
                    </a>
                ))}
            </div>
        </div>
    )
}
