'use client'

import { Button } from '@/components/ui/button'
import { Loader2, Eye, EyeOff } from 'lucide-react'

interface AuthFormProps {
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
    loading: boolean
    googleLoading: boolean
    isRegistering: boolean
    showPassword: boolean
    setShowPassword: (show: boolean) => void
    setIsRegistering: (register: boolean) => void
}

export function AuthForm({
    onSubmit,
    loading,
    googleLoading,
    isRegistering,
    showPassword,
    setShowPassword,
    setIsRegistering,
}: AuthFormProps) {
    return (
        <>
            <form onSubmit={onSubmit} className="space-y-6">
                <div className="space-y-3">
                    <label className="ml-1 text-xs font-black uppercase tracking-[0.15em] text-indigo-500/80">
                        Email Address
                    </label>
                    <input
                        name="email"
                        type="email"
                        placeholder="name@example.com"
                        required
                        className="h-14 w-full rounded-2xl border border-border/40 bg-background/50 px-6 text-base text-foreground outline-none transition-all placeholder:text-muted-foreground/40 focus:border-indigo-500/50 focus:bg-background focus:ring-4 focus:ring-indigo-500/10 shadow-inner"
                    />
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <label className="ml-1 text-xs font-black uppercase tracking-[0.15em] text-indigo-500/80">
                            Password
                        </label>
                    </div>
                    <div className="relative">
                        <input
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            required
                            minLength={6}
                            className="h-14 w-full rounded-2xl border border-border/40 bg-background/50 px-6 pr-12 text-base text-foreground outline-none transition-all placeholder:text-muted-foreground/40 focus:border-indigo-500/50 focus:bg-background focus:ring-4 focus:ring-indigo-500/10 shadow-inner"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-indigo-500 transition-colors p-2"
                        >
                            {showPassword ? (
                                <EyeOff className="h-5 w-5" />
                            ) : (
                                <Eye className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                </div>

                <Button
                    type="submit"
                    className="mt-4 h-15 w-full rounded-2xl text-lg font-black shadow-xl shadow-indigo-500/20 transition-all hover:scale-[1.02] hover:shadow-indigo-500/40 active:scale-95"
                    disabled={loading || googleLoading}
                >
                    {loading ? (
                        <Loader2 className="h-6 w-6 animate-spin" />
                    ) : isRegistering ? (
                        'Create Account'
                    ) : (
                        'Sign In'
                    )}
                </Button>
            </form>

            <div className="mt-8 text-center text-sm">
                <span className="text-muted-foreground">
                    {isRegistering
                        ? 'Already have an account?'
                        : "Don't have an account?"}
                </span>{' '}
                <button
                    onClick={() => setIsRegistering(!isRegistering)}
                    className="font-bold text-primary hover:underline decoration-2 underline-offset-4"
                >
                    {isRegistering ? 'Sign In' : 'Sign Up'}
                </button>
            </div>
        </>
    )
}
