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
  Plus,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

export function VerificationView() {
  const { t } = useTranslation(['common', 'verification'])
  const { user } = useAuth()
  const [status, setStatus] = useState<VerificationStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showingUploadModal, setShowingUploadModal] = useState(false)
  const [selectedDocType, setSelectedDocType] = useState<
    'id_card' | 'passport' | 'drivers_license'
  >('id_card')

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
      'https://images.unsplash.com/photo-1544391490-00aa9cb51720?auto=format&fit=crop&q=80&w=1000',
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
      title: t('verification:emailTitle'),
      description: t('verification:emailDesc'),
      icon: Mail,
      isVerified: status?.email,
      statusLabel: status?.email
        ? t('verification:verified')
        : t('verification:notVerified'),
      color: 'blue',
    },
    {
      id: 'phone',
      title: t('verification:phoneTitle'),
      description: t('verification:phoneDesc'),
      icon: Phone,
      isVerified: status?.phone,
      statusLabel: status?.phone
        ? t('verification:verified')
        : t('verification:notVerified'),
      color: 'emerald',
    },
    {
      id: 'documents',
      title: t('verification:idTitle'),
      description: t('verification:idDesc'),
      icon: FileText,
      isVerified: status?.documents === 'verified',
      isPending: status?.documents === 'pending',
      isRejected: status?.documents === 'rejected',
      statusLabel:
        status?.documents === 'verified'
          ? t('verification:verified')
          : status?.documents === 'pending'
            ? t('verification:pending')
            : status?.documents === 'rejected'
              ? t('verification:rejected')
              : t('verification:notVerified'),
      color: 'indigo',
    },
  ]

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 mx-auto max-w-5xl space-y-12 p-4 duration-700 md:p-8">
      {/* Premium Header - Floating Glass */}
      <div className="relative overflow-hidden rounded-[2.5rem] p-10">
        <div className="bg-primary/5 absolute inset-0 -z-10 blur-3xl" />
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div className="space-y-3">
            <h1 className="flex items-center gap-4 text-4xl font-black tracking-tighter uppercase sm:text-5xl">
              <div className="bg-primary/10 border-primary/20 shadow-primary/10 flex h-16 w-16 items-center justify-center rounded-2xl border shadow-xl">
                <ShieldCheck className="text-primary h-9 w-9" />
              </div>
              {t('verification:title')}
            </h1>
            <p className="text-muted-foreground/60 ml-[80px] text-xs font-black tracking-[0.3em] uppercase">
              {t('verification:subtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Verification Steps */}
      <div className="grid gap-6">
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div
              className={cn(
                'glass-panel group hover:bg-primary/2 relative border-none p-8 shadow-xl shadow-black/5 transition-all duration-500',
                step.isVerified && 'bg-emerald-500/3',
                step.isRejected && 'bg-destructive/3'
              )}
            >
              <div
                className={cn(
                  'absolute inset-y-0 left-0 w-1 transition-all duration-500',
                  step.isVerified
                    ? 'bg-emerald-500/40'
                    : step.isRejected
                      ? 'bg-destructive/40'
                      : 'bg-primary/0 group-hover:bg-primary/40'
                )}
              />

              <div className="flex flex-col gap-8 md:flex-row md:items-center">
                {/* Icon */}
                <div
                  className={cn(
                    'relative flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border shadow-2xl transition-transform duration-500 group-hover:scale-110',
                    step.isVerified
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 shadow-emerald-500/20'
                      : step.isRejected
                        ? 'bg-destructive/10 text-destructive border-destructive/20 shadow-destructive/20'
                        : 'group-hover:border-primary/30 group-hover:bg-primary/5 group-hover:text-primary group-hover:shadow-primary/20 border-white/10 bg-white/5 text-white shadow-black/20'
                  )}
                >
                  <step.icon className="h-10 w-10" />
                  {step.isVerified && (
                    <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 shadow-lg">
                      <CheckCircle2 className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-4">
                    <h3 className="text-foreground group-hover:text-primary text-3xl font-black tracking-tighter uppercase transition-colors">
                      {step.title}
                    </h3>
                    {step.isVerified && (
                      <Badge className="rounded-xl border-emerald-500/30 bg-emerald-500/20 px-2.5 py-1 text-[9px] font-black tracking-widest text-emerald-400 uppercase shadow-sm">
                        {t('verification:verified')}
                      </Badge>
                    )}
                    {step.isPending && (
                      <Badge className="animate-pulse rounded-xl border-amber-500/30 bg-amber-500/20 px-2.5 py-1 text-[9px] font-black tracking-widest text-amber-400 uppercase shadow-sm">
                        {t('verification:pending')}
                      </Badge>
                    )}
                    {step.isRejected && (
                      <Badge className="bg-destructive/20 text-destructive border-destructive/30 rounded-xl px-2.5 py-1 text-[9px] font-black tracking-widest uppercase shadow-sm">
                        {t('verification:rejected')}
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground/60 max-w-2xl text-[13px] leading-relaxed font-bold tracking-tight">
                    {step.description}
                  </p>
                </div>

                {/* Action */}
                <div className="shrink-0">
                  {step.isVerified ? (
                    <div className="flex items-center gap-3 rounded-2xl bg-emerald-500/10 px-6 py-3 text-emerald-400 shadow-lg shadow-emerald-500/5 transition-transform hover:scale-105">
                      <CheckCircle2 className="h-6 w-6" />
                      <span className="text-[11px] font-black tracking-[0.2em] uppercase">
                        {t('verification:verified')}
                      </span>
                    </div>
                  ) : step.isPending ? (
                    <div className="flex items-center gap-3 rounded-2xl bg-amber-500/10 px-6 py-3 text-amber-400 shadow-lg shadow-amber-500/5">
                      <Clock className="animate-spin-slow h-6 w-6" />
                      <span className="text-[11px] font-black tracking-[0.2em] uppercase">
                        {t('verification:pending')}
                      </span>
                    </div>
                  ) : step.isRejected ? (
                    <Button
                      onClick={() => setShowingUploadModal(true)}
                      variant="destructive"
                      className="h-14 rounded-2xl px-10 text-[11px] font-black tracking-[0.2em] uppercase shadow-2xl transition-all hover:scale-105 active:scale-95"
                    >
                      {t('common:tryAgain')}
                      <ChevronRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                  ) : (
                    <Button
                      onClick={
                        step.id === 'documents'
                          ? () => setShowingUploadModal(true)
                          : undefined
                      }
                      disabled={isSubmitting}
                      className="shadow-primary/20 h-14 rounded-2xl px-10 text-[11px] font-black tracking-[0.2em] uppercase shadow-2xl transition-all hover:scale-105 active:scale-95"
                    >
                      {t('verification:start')}
                      <ChevronRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Info Card - High End */}
      <div className="relative overflow-hidden rounded-[2.5rem] p-10">
        <div className="absolute inset-0 -z-10 bg-blue-500/5 backdrop-blur-3xl" />
        <div className="flex gap-8">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10 shadow-2xl shadow-blue-500/10">
            <AlertCircle className="h-9 w-9 text-blue-400" />
          </div>
          <div className="space-y-3">
            <h4 className="text-2xl font-black tracking-tighter uppercase sm:text-3xl">
              {t('verification:whyVerify')}
            </h4>
            <p className="text-muted-foreground/60 text-sm leading-relaxed font-bold tracking-tight">
              {t('verification:whyVerifyDesc')}
            </p>
          </div>
        </div>
      </div>

      {/* Document Upload Simulation Modal - Glassified */}
      {showingUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="glass-panel w-full max-w-xl overflow-hidden border-none p-10 shadow-[0_0_100px_rgba(0,0,0,0.5)]"
          >
            <div className="space-y-10">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-3xl font-black tracking-tighter uppercase">
                    {t('verification:idTitle')}
                  </h2>
                  <p className="text-muted-foreground/40 text-[10px] font-black tracking-widest uppercase">
                    {t('verification:secureUpload')}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowingUploadModal(false)}
                  className="h-12 w-12 rounded-xl bg-white/5 transition-transform hover:rotate-90"
                >
                  <Plus className="h-4 w-4 stroke-3" />
                </Button>
              </div>

              <div className="space-y-6">
                <span className="text-muted-foreground ml-1.5 text-[9px] font-black tracking-widest uppercase opacity-40">
                  {t('verification:selectDocType')}
                </span>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {['id_card', 'passport', 'drivers_license'].map((type) => (
                    <Button
                      key={type}
                      variant="outline"
                      onClick={() => setSelectedDocType(type as any)}
                      className={cn(
                        'flex h-auto flex-col items-center gap-4 rounded-2xl border-2 transition-all duration-500',
                        selectedDocType === type
                          ? 'border-primary bg-primary/10 text-primary shadow-primary/20 scale-105 shadow-2xl!'
                          : 'glass-panel hover:bg-primary/2 text-muted-foreground/40 hover:border-primary/30 hover:text-primary border-white/5 bg-white/2 p-6 transition-all duration-300'
                      )}
                    >
                      <FileText className="h-8 w-8" />
                      <span className="text-[10px] font-black tracking-widest uppercase">
                        {t(`verification:${type}`)}
                      </span>
                    </Button>
                  ))}
                </div>
              </div>

              <div className="group hover:border-primary/40 hover:bg-primary/2 relative flex flex-col items-center justify-center rounded-[2.5rem] border-2 border-dashed border-white/5 bg-white/2 py-16 transition-all duration-500">
                <div className="bg-background/50 flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 shadow-2xl transition-transform duration-700 group-hover:scale-110 group-hover:rotate-12">
                  <Loader2
                    className={cn(
                      'text-primary h-10 w-10 transition-all',
                      isSubmitting ? 'animate-spin' : 'opacity-20'
                    )}
                  />
                </div>
                <div className="mt-8 space-y-2 text-center">
                  <p className="group-hover:text-primary text-lg font-black tracking-tighter uppercase transition-colors">
                    {t('verification:dropDocs')}
                  </p>
                  <p className="text-muted-foreground/40 text-[10px] font-black tracking-[0.2rem] uppercase">
                    {t('verification:uploadFormats')}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  className="h-14 flex-1 rounded-2xl border-white/5 bg-white/5 text-[11px] font-black tracking-[0.2em] uppercase hover:bg-white/10"
                  onClick={() => setShowingUploadModal(false)}
                  disabled={isSubmitting}
                >
                  {t('common:cancel')}
                </Button>
                <Button
                  className="shadow-primary/20 h-14 flex-1 rounded-2xl text-[11px] font-black tracking-[0.2em] uppercase shadow-2xl transition-all hover:scale-105 active:scale-95"
                  onClick={handleSubmitDocs}
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? t('verification:submitting')
                    : t('verification:submitForReview')}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
