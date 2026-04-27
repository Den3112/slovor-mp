'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronLeft, Send, Loader2 } from 'lucide-react'
import { useTranslation } from '@/shared/lib/i18n'
import { supportApi } from '@/shared/lib/api'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Textarea } from '@/shared/ui/textarea'
import { Label } from '@/shared/ui/label'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/shared/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'
import { toast } from 'sonner'
import { supabase } from '@/shared/lib/supabase/client'

export default function CreateTicketPage({
  params: { lang },
}: {
  params: { lang: string }
}) {
  const { t } = useTranslation(['common', 'dashboard', 'admin'])
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    subject: '',
    category: 'general',
    priority: 'medium',
    message: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.subject.trim() || !formData.message.trim()) return

    setIsSubmitting(true)
    try {
      const { error } = await supportApi.createTicket({
        subject: formData.subject,
        message: formData.message,
        category: formData.category as any,
        priority: formData.priority as any,
        user_id: '', // API handles this from auth
      }, supabase)

      if (error) throw new Error(error)

      toast.success(t('dashboard:ticketCreated'))
      router.push(`/${lang}/dashboard/support`)
      router.refresh()
    } catch (error) {
      toast.error(t('dashboard:ticketCreateError'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4 md:p-8">
      <div className="mb-8 flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-xl">
          <Link href={`/${lang}/dashboard/support`}>
            <ChevronLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {t('dashboard:createTicket')}
          </h1>
          <p className="text-muted-foreground mt-1 text-xs tracking-widest uppercase">
            {t('dashboard:createTicketDesc')}
          </p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="border-border/40 relative overflow-hidden shadow-sm">
          <div className="from-primary/50 absolute top-0 left-0 h-1 w-full bg-gradient-to-r to-indigo-500/50" />
          <CardHeader>
            <CardTitle>{t('dashboard:ticketDetails')}</CardTitle>
            <CardDescription>
              {t('dashboard:ticketDetailsDesc')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label>{t('dashboard:subject')}</Label>
                <Input
                  placeholder={t('dashboard:subjectPlaceholder')}
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  className="bg-muted/30 border-border/40 focus:border-primary/50"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t('dashboard:category')}</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(val: string) =>
                      setFormData({ ...formData, category: val })
                    }
                  >
                    <SelectTrigger className="bg-muted/30 border-border/40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">
                        {t('admin:categoryGeneral') || 'General'}
                      </SelectItem>
                      <SelectItem value="billing">
                        {t('admin:categoryBilling') || 'Billing'}
                      </SelectItem>
                      <SelectItem value="technical">
                        {t('admin:categoryTechnical') || 'Technical'}
                      </SelectItem>
                      <SelectItem value="safety">
                        {t('admin:categorySafety') || 'Safety'}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{t('dashboard:priority')}</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(val: string) =>
                      setFormData({ ...formData, priority: val })
                    }
                  >
                    <SelectTrigger className="bg-muted/30 border-border/40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">
                        {t('admin:priorityLow') || 'Low'}
                      </SelectItem>
                      <SelectItem value="medium">
                        {t('admin:priorityMedium') || 'Medium'}
                      </SelectItem>
                      <SelectItem value="high">
                        {t('admin:priorityHigh') || 'High'}
                      </SelectItem>
                      <SelectItem value="urgent">
                        {t('admin:priorityUrgent') || 'Urgent'}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>{t('dashboard:message')}</Label>
                <Textarea
                  placeholder={t('dashboard:messagePlaceholder')}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="bg-muted/30 border-border/40 focus:border-primary/50 min-h-[150px] resize-none text-sm leading-relaxed font-medium"
                  required
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-11 min-w-[140px] rounded-xl font-bold tracking-widest uppercase"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      {t('dashboard:submitTicket')}
                      <Send className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
