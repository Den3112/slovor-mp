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

export function VerificationView() {
    const { t } = useTranslation()
    const { user } = useAuth()
    const [status, setStatus] = useState<VerificationStatus | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showingUploadModal, setShowingUploadModal] = useState(false)
    const [selectedDocType, setSelectedDocType] = useState<'id_card' | 'passport' | 'drivers_license'>('id_card')

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
        // Simulated Doc submission with "real" URLs
        const { data, error } = await verificationApi.submitDocuments(user.id, [
            'https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?auto=format&fit=crop&q=80&w=1000',
            'https://images.unsplash.com/photo-1544391490-00aa9cb51720?auto=format&fit=crop&q=80&w=1000'
        ])

        if (data) {
            // Refresh status
            const { data: newStatus } = await verificationApi.getStatus(user.id)
            if (newStatus) setStatus(newStatus)
            setShowingUploadModal(false)
        } else if (error) {
            // handle error
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
            title: t('verification.emailTitle'),
            description: t('verification.emailDesc'),
            icon: Mail,
            isVerified: status?.email,
            statusLabel: status?.email ? t('verification.verified') : t('verification.notVerified'),
            color: 'blue',
        },
        {
            id: 'phone',
            title: t('verification.phoneTitle'),
            description: t('verification.phoneDesc'),
            icon: Phone,
            isVerified: status?.phone,
            statusLabel: status?.phone ? t('verification.verified') : t('verification.notVerified'),
            color: 'emerald',
        },
        {
            id: 'documents',
            title: t('verification.idTitle'),
            description: t('verification.idDesc'),
            icon: FileText,
            isVerified: status?.documents === 'verified',
            isPending: status?.documents === 'pending',
            isRejected: status?.documents === 'rejected',
            statusLabel:
                status?.documents === 'verified' ? t('verification.verified') :
                    status?.documents === 'pending' ? t('verification.pending') :
                        status?.documents === 'rejected' ? 'Rejected' :
                            t('verification.notVerified'),
            color: 'indigo',
        },
    ]

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Premium Header - Solid */}
            <div className="group relative flex flex-col gap-4 overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm md:flex-row md:items-center md:justify-between md:p-10">
                <div className="relative z-10 space-y-1">
                    <h1 className="text-3xl font-black uppercase tracking-tight text-foreground">
                        {t('verification.title')}
                    </h1>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                        {t('verification.subtitle')}
                    </p>
                </div>
                <div className="relative z-10">
                    <div className="bg-primary/10 flex h-20 w-20 items-center justify-center rounded-xl text-primary shadow-sm border border-primary/20">
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
                            "group relative overflow-hidden rounded-xl border p-6 transition-all md:p-8",
                            step.isVerified
                                ? "border-emerald-500/20 bg-emerald-500/5"
                                : step.isRejected
                                    ? "border-destructive/20 bg-destructive/5"
                                    : "border-border bg-card hover:border-primary/50"
                        )}
                    >
                        <div className="flex flex-col gap-6 md:flex-row md:items-center">
                            {/* Icon */}
                            <div className={cn(
                                "flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border transition-transform group-hover:scale-105",
                                step.isVerified ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                                    step.isRejected ? "bg-destructive/10 text-destructive border-destructive/20" :
                                        "bg-muted text-muted-foreground border-border group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/20"
                            )}>
                                <step.icon className="h-8 w-8" />
                            </div>

                            {/* Content */}
                            <div className="flex-1 space-y-1">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-xl font-bold text-foreground">{step.title}</h3>
                                    {step.isVerified && (
                                        <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-black tracking-widest text-emerald-500 uppercase">
                                            {t('verification.verified')}
                                        </span>
                                    )}
                                    {step.isPending && (
                                        <span className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-black tracking-widest text-amber-500 uppercase">
                                            {t('verification.pending')}
                                        </span>
                                    )}
                                    {step.isRejected && (
                                        <span className="flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-black tracking-widest text-destructive uppercase">
                                            Rejected
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
                                        <span className="font-bold">{t('verification.verified')}</span>
                                    </div>
                                ) : step.isPending ? (
                                    <div className="flex items-center gap-2 text-amber-500">
                                        <Clock className="h-6 w-6" />
                                        <span className="font-bold">{t('verification.pending')}</span>
                                    </div>
                                ) : step.isRejected ? (
                                    <Button
                                        onClick={() => setShowingUploadModal(true)}
                                        variant="destructive"
                                        className="rounded-xl px-6 font-black uppercase tracking-widest shadow-sm"
                                    >
                                        Try Again
                                        <ChevronRight className="ml-2 h-4 w-4" />
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={step.id === 'documents' ? () => setShowingUploadModal(true) : undefined}
                                        disabled={isSubmitting}
                                        className="rounded-xl px-6 font-black uppercase tracking-widest shadow-sm"
                                    >
                                        {t('verification.start')}
                                        <ChevronRight className="ml-2 h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Info Card */}
            <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-6 md:p-8">
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

            {/* Document Upload Simulation Modal */}
            {showingUploadModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-card w-full max-w-xl overflow-hidden rounded-xl shadow-none border border-border"
                    >
                        <div className="p-8 space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-black italic tracking-tight">Verify Identity</h2>
                                <Button variant="ghost" size="icon" onClick={() => setShowingUploadModal(false)} className="rounded-lg">
                                    <ChevronRight className="rotate-90" />
                                </Button>
                            </div>

                            <div className="space-y-4">
                                <p className="text-muted-foreground text-sm font-medium">Select the type of document you want to upload:</p>
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                    {['id_card', 'passport', 'drivers_license'].map((type) => (
                                        <button
                                            key={type}
                                            onClick={() => setSelectedDocType(type as any)}
                                            className={cn(
                                                "flex flex-col items-center gap-3 rounded-xl border-2 p-4 transition-all",
                                                selectedDocType === type
                                                    ? "bg-primary/10 border-primary text-primary"
                                                    : "bg-muted border-transparent text-muted-foreground hover:bg-muted/80"
                                            )}
                                        >
                                            <FileText className="h-6 w-6" />
                                            <span className="text-xs font-bold uppercase tracking-wider">{type.replace('_', ' ')}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-muted group relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border py-12 transition-colors hover:border-primary">
                                <div className="bg-background flex h-16 w-16 items-center justify-center rounded-xl border border-border group-hover:scale-105 transition-transform">
                                    <Loader2 className={cn("h-8 w-8 text-primary transition-all", isSubmitting ? "animate-spin" : "")} />
                                </div>
                                <div className="mt-4 text-center">
                                    <p className="text-sm font-bold">Drop your documents here</p>
                                    <p className="text-muted-foreground text-xs font-medium">JPEG, PNG or PDF up to 10MB</p>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button
                                    variant="outline"
                                    className="flex-1 rounded-xl h-12 font-bold uppercase tracking-widest text-xs"
                                    onClick={() => setShowingUploadModal(false)}
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="flex-1 rounded-xl h-12 font-black tracking-widest uppercase text-xs"
                                    onClick={handleSubmitDocs}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Submitting..." : "Submit for Review"}
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    )
}
