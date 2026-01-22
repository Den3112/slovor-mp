import { Button } from '@/components/ui/button'
import { Loader2, Eye, EyeOff } from 'lucide-react'

interface AuthFormProps {
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
    loading: boolean
    googleLoading: boolean
    isRegistering: boolean
    showPassword: boolean
    setShowPassword: (show: boolean) => void
    setIsRegistering: (reg: boolean) => void
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
                    <label className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                        Email Address
                    </label>
                    <input
                        name="email"
                        type="email"
                        placeholder="name@example.com"
                        required
                        className="h-16 w-full rounded-none border-2 border-primary/10 bg-white/[0.03] px-6 font-sans text-sm text-white outline-none transition-all placeholder:text-zinc-700 focus:border-primary focus:bg-white/[0.05]"
                    />
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <label className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
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
                            className="h-16 w-full rounded-none border-2 border-primary/10 bg-white/[0.03] px-6 pr-12 font-sans text-sm text-white outline-none transition-all placeholder:text-zinc-700 focus:border-primary focus:bg-white/[0.05]"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-6 top-1/2 -translate-y-1/2 p-2 text-zinc-600 transition-colors hover:text-white"
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
                    className="h-16 w-full rounded-none font-sans text-xs font-bold uppercase tracking-[0.2em] shadow-xl shadow-primary/10 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/20"
                    disabled={loading || googleLoading}
                >
                    {loading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                    ) : isRegistering ? (
                        'Create Account'
                    ) : (
                        'Sign In'
                    )}
                </Button>
            </form>

            <div className="mt-10 text-center">
                <span className="font-sans text-xs font-medium text-zinc-500">
                    {isRegistering
                        ? 'Already have an account?'
                        : "Don't have an account?"}
                </span>{' '}
                <button
                    onClick={() => setIsRegistering(!isRegistering)}
                    className="font-sans text-xs font-bold uppercase tracking-widest text-primary hover:text-white transition-colors"
                >
                    {isRegistering ? 'Sign In' : 'Sign Up'}
                </button>
            </div>
        </>
    )
}
