import Link from 'next/link'
import { ChevronDown, ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavLink {
    label: string
    href: string
}

interface NavGroup {
    title: string
    links: NavLink[]
}

interface FooterNavProps {
    navGroups: NavGroup[]
    openSection: number | null
    toggleSection: (index: number) => void
}

export function FooterNav({ navGroups, openSection, toggleSection }: FooterNavProps) {
    return (
        <div className="lg:col-span-8">
            {/* Mobile Accordion */}
            <div className="space-y-2 md:hidden">
                {navGroups.map((group, i) => (
                    <div key={i} className="border-b border-white/[0.05]">
                        <button
                            onClick={() => toggleSection(i)}
                            aria-expanded={openSection === i}
                            aria-controls={`footer-section-${i}`}
                            className="flex w-full items-center justify-between py-5 text-left"
                        >
                            <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-white/70">
                                {group.title}
                            </span>
                            <ChevronDown
                                className={cn(
                                    "h-5 w-5 text-zinc-600 transition-transform",
                                    openSection === i && "rotate-180"
                                )}
                            />
                        </button>
                        <div
                            className={cn(
                                "grid transition-all duration-300",
                                openSection === i
                                    ? "grid-rows-[1fr] pb-4"
                                    : "grid-rows-[0fr]"
                            )}
                        >
                            <div className="overflow-hidden">
                                <ul className="space-y-3">
                                    {group.links.map((link, j) => (
                                        <li key={j}>
                                            <Link
                                                href={link.href}
                                                className="block font-sans text-base font-medium text-zinc-500 transition-colors hover:text-white"
                                            >
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop Grid */}
            <div className="hidden grid-cols-3 gap-8 md:grid lg:gap-16">
                {navGroups.map((group, i) => (
                    <div key={i}>
                        <h4 className="mb-6 font-sans text-xs font-bold uppercase tracking-[0.2em] text-white opacity-40 lg:mb-10">
                            {group.title}
                        </h4>
                        <ul className="space-y-4 lg:space-y-6">
                            {group.links.map((link, j) => (
                                <li key={j}>
                                    <Link
                                        href={link.href}
                                        className="group flex items-center gap-2 font-sans text-base font-medium text-zinc-500 transition-all hover:text-white lg:text-lg"
                                    >
                                        <span className="transition-transform group-hover:translate-x-1">
                                            {link.label}
                                        </span>
                                        <ArrowUpRight className="h-4 w-4 -translate-y-1 text-primary opacity-0 transition-all group-hover:opacity-100" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    )
}
