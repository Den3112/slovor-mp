import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface AuthHeaderProps {
    isRegistering: boolean
}

export function AuthHeader({ isRegistering }: AuthHeaderProps) {
    return (
        <>
            <Link
                href="/"
                className="mb-8 inline-flex items-center border-2 border-primary/20 bg-background/50 px-6 py-3 font-sans text-xs font-bold uppercase tracking-widest text-zinc-500 transition-all hover:border-primary hover:text-primary active:scale-95"
            >
                <ArrowLeft className="mr-3 h-4 w-4" /> Back to Home
            </Link>

            <div className="mb-10 text-center">
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center border-2 border-primary/20 bg-white/[0.03] text-primary shadow-xl shadow-primary/5">
                    <span className="text-3xl">⚡</span>
                </div>
                <h1 className="mb-3 font-heading text-4xl font-bold italic tracking-tight text-white">
                    {isRegistering ? 'Create Account' : 'Welcome Back'}
                </h1>
                <p className="font-sans text-sm font-medium tracking-wide text-zinc-500">
                    {isRegistering
                        ? 'Join the #1 marketplace in Slovakia'
                        : 'Sign in to manage your listings'}
                </p>
            </div>
        </>
    )
}
