'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
import { verificationApi, type VerificationStatus } from '@/lib/api'
import { useTranslation } from '@/lib/i18n'
import {
    ShieldCheck,
    Mail,
    Phone,
    FileText,
    AlertCircle,
    CheckCircle2,
    ChevronRight,
    Loader2,
    Clock,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

export default function VerificationPage() {
    const { t } = useTranslation()
    const { user } = useAuth()
    const [status, setStatus] = useState<VerificationStatus | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        async function fetchStatus() {
            if (!user) return
            const { data } = await verificationApi.getStatus(user.id)
            if (data) setStatus(data)
            setIsLoading(false)
        }
        fetchStatus()
    }, [user])

    const handleSubmitDocs = async () => {
        if (!user) return
        setIsSubmitting(true)
        // Simplified Doc submission
        const { data } = await verificationApi.submitDocuments(user.id, ['mock-doc-url'])
        if (data) {
            // Refresh status
            const { data: newStatus } = await verificationApi.getStatus(user.id)
            if (newStatus) setStatus(newStatus)
        }
        setIsSubmitting(false)
    }

    if (isLoading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="text-primary h-8 w-8 animate-spin" />
            </div>
        )
    }

    const steps = [
        {
            id: 'email',
            title: t.verification.emailTitle,
            description: t.verification.emailDesc,
            icon: Mail,
            isVerified: status?.email,
            statusLabel: status?.email ? t.verification.verified : t.verification.notVerified,
            color: 'blue',
        },
        {
            id: 'phone',
            title: t.verification.phoneTitle,
            description: t.verification.phoneDesc,
            icon: Phone,
            isVerified: status?.phone,
            statusLabel: status?.phone ? t.verification.verified : t.verification.notVerified,
            color: 'emerald',
        },
        {
            id: 'documents',
            title: t.verification.idTitle,
            description: t.verification.idDesc,
            icon: FileText,
            isVerified: status?.documents === 'verified',
            isPending: status?.documents === 'pending',
            statusLabel:
                status?.documents === 'verified' ? t.verification.verified :
                    status?.documents === 'pending' ? t.verification.pending :
                        t.verification.notVerified,
            color: 'indigo',
        },
    ]

    return (
        <div className="space-y-8">
            {/* Premium Header */}
            <div className="from-background/80 via-background/60 to-background/40 group relative flex flex-col gap-4 overflow-hidden rounded-5xl border border-white/10 bg-linear-to-br p-6 shadow-2xl backdrop-blur-xl md:flex-row md:items-center md:justify-between md:p-10">
                <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-indigo-500/10 via-transparent to-transparent opacity-50 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative z-10">
                    <h1 className="font-heading text-foreground mb-2 text-4xl font-black tracking-tight md:text-5xl">
                        {t.verification.title}
                    </h1>
                    <p className="text-muted-foreground max-w-lg text-base leading-relaxed font-medium md:text-lg">
                        {t.verification.subtitle}
                    </p>
                </div>
                <div className="relative z-10">
                    <div className="bg-primary/10 flex h-20 w-20 items-center justify-center rounded-3xl text-primary shadow-2xl shadow-primary/20">
                        <ShieldCheck className="h-10 w-10" />
                    </div>
                </div>
            </div>

            {/* Verification Steps */}
            <div className="grid grid-cols-1 gap-6">
                {steps.map((step, index) => (
                    <motion.div
                        key={step.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={cn(
                            "group relative overflow-hidden rounded-4xl border p-6 transition-all md:p-8",
                            step.isVerified
                                ? "border-emerald-500/20 bg-emerald-500/2"
                                : "border-border/50 bg-card hover:border-primary/20 hover:shadow-xl"
                        )}
                    >
                        <div className="flex flex-col gap-6 md:flex-row md:items-center">
                            {/* Icon */}
                            <div className={cn(
                                "flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl shadow-inner transition-transform group-hover:scale-110",
                                step.isVerified ? "bg-emerald-500/10 text-emerald-500" : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                            )}>
                                <step.icon className="h-8 w-8" />
                            </div>

                            {/* Content */}
                            <div className="flex-1 space-y-1">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-xl font-bold text-foreground">{step.title}</h3>
                                    {step.isVerified && (
                                        <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-black tracking-widest text-emerald-500 uppercase">
                                            {t.verification.verified}
                                        </span>
                                    )}
                                    {step.isPending && (
                                        <span className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-black tracking-widest text-amber-500 uppercase">
                                            {t.verification.pending}
                                        </span>
                                    )}
                                </div>
                                <p className="text-muted-foreground text-sm font-medium leading-relaxed md:text-base">
                                    {step.description}
                                </p>
                            </div>

                            {/* Action */}
                            <div className="shrink-0">
                                {step.isVerified ? (
                                    <div className="flex items-center gap-2 text-emerald-500">
                                        <CheckCircle2 className="h-6 w-6" />
                                        <span className="font-bold">{t.verification.verified}</span>
                                    </div>
                                ) : step.isPending ? (
                                    <div className="flex items-center gap-2 text-amber-500">
                                        <Clock className="h-6 w-6" />
                                        <span className="font-bold">{t.verification.pending}</span>
                                    </div>
                                ) : (
                                    <Button
                                        onClick={step.id === 'documents' ? handleSubmitDocs : undefined}
                                        disabled={isSubmitting}
                                        className="rounded-2xl px-6 font-black uppercase tracking-widest"
                                    >
                                        {isSubmitting && step.id === 'documents' ? (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        ) : null}
                                        {t.verification.start}
                                        <ChevronRight className="ml-2 h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Info Card */}
            <div className="rounded-4xl border border-blue-500/20 bg-blue-500/2 p-6 md:p-8">
                <div className="flex gap-4">
                    <AlertCircle className="h-6 w-6 shrink-0 text-blue-500" />
                    <div className="space-y-2">
                        <h4 className="text-lg font-bold text-foreground">Why verify?</h4>
                        <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                            Verified accounts are 3x more likely to sell successfully. Buyers prefer profiles with a verified phone and identity badge as it ensures a safer marketplace experience.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
