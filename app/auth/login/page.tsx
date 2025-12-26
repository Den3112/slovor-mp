'use client'

import { useState, Suspense } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Loader2, ArrowLeft } from 'lucide-react'

export default function LoginPage() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isRegistering, setIsRegistering] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const formData = new FormData(e.currentTarget)
        const email = formData.get('email') as string
        const password = formData.get('password') as string

        try {
            if (isRegistering) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                })
                if (error) throw error
                alert('Check your email for the confirmation link!')
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                })
                if (error) throw error
                router.push('/')
                router.refresh()
            }
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
            <Suspense fallback={<div className="text-center text-primary font-bold">Loading...</div>}>
                {/* Background Effects */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] bg-primary/20 rounded-full blur-[100px] animate-pulse" />
                    <div className="absolute bottom-[20%] left-[10%] w-[300px] h-[300px] bg-violet-600/20 rounded-full blur-[100px]" />
                </div>

                <div className="w-full max-w-md bg-card border border-border/50 p-8 rounded-3xl shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-500">
                    <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
                    </Link>

                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4">
                            <span className="text-2xl">⚡</span>
                        </div>
                        <h1 className="text-3xl font-black font-heading tracking-tight mb-2">
                            {isRegistering ? 'Create Account' : 'Welcome Back'}
                        </h1>
                        <p className="text-muted-foreground">
                            {isRegistering ? 'Join the #1 marketplace in Slovakia' : 'Sign in to manage your listings'}
                        </p>
                    </div>

                    {error && (
                        <div className="bg-destructive/10 text-destructive text-sm p-4 rounded-xl mb-6 font-medium border border-destructive/20 animate-in shake">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold ml-1 text-foreground/80">Email</label>
                            <input
                                name="email"
                                type="email"
                                placeholder="name@example.com"
                                required
                                className="w-full h-12 px-4 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-muted-foreground/50 text-foreground"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold ml-1 text-foreground/80">Password</label>
                            <input
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                required
                                minLength={6}
                                className="w-full h-12 px-4 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-muted-foreground/50 text-foreground"
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 rounded-xl text-lg font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all mt-4"
                            disabled={loading}
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : isRegistering ? (
                                'Create Account'
                            ) : (
                                'Sign In'
                            )}
                        </Button>
                    </form>

                    <div className="mt-8 text-center text-sm">
                        <span className="text-muted-foreground">
                            {isRegistering ? 'Already have an account?' : "Don't have an account?"}
                        </span>{' '}
                        <button
                            onClick={() => setIsRegistering(!isRegistering)}
                            className="text-primary font-bold hover:underline"
                        >
                            {isRegistering ? 'Sign In' : 'Sign Up'}
                        </button>
                    </div>
                </div>
            </Suspense>
        </div>
    )
}
