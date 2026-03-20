'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

interface BlogNewsletterProps {
  title: string
  description: string
  buttonText: string
  errorMsg?: string
  successMsg?: string
}

export function BlogNewsletter({
  title,
  description,
  buttonText,
  errorMsg = 'Please enter a valid email.',
  successMsg = 'Successfully subscribed!',
}: BlogNewsletterProps) {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubscribe = async () => {
    // Simple validation
    if (!email || !email.includes('@')) {
      toast.error(errorMsg)
      return
    }

    setIsSubmitting(true)
    try {
      // Simulation of API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success(successMsg)
      setEmail('')
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-primary text-primary-foreground shadow-primary/10 rounded-xl p-10 text-center shadow-lg">
      <h3 className="mb-4 text-2xl font-bold tracking-tight uppercase">
        {title}
      </h3>
      <p className="mb-8 text-sm leading-relaxed font-medium opacity-80">
        {description}
      </p>
      <div className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="w-full rounded-xl border-none bg-white/10 px-4 py-3 text-sm font-medium text-white outline-none placeholder:text-white/40 focus:ring-2 focus:ring-white/20"
        />
        <Button
          disabled={isSubmitting}
          onClick={handleSubscribe}
          className="text-primary w-full rounded-xl bg-white font-bold tracking-widest uppercase shadow-sm hover:bg-zinc-100"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            buttonText
          )}
        </Button>
      </div>
    </div>
  )
}
