'use client'

import { useState, useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronRight,
  ChevronLeft,
  Save,
  Loader2,
  CheckCircle2,
} from 'lucide-react'
import { createListingSchema } from '@/lib/validations/listing'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import { trackEvent } from '@/lib/utils/analytics'

// Step Components
import { CategoryStep } from './steps/category-step'
import { BasicInfoStep } from './steps/basic-info-step'
import { PriceConditionStep } from './steps/price-condition-step'
import { ImagesStep } from './steps/images-step'
import { LocationStep } from './steps/location-step'
import { PreviewStep } from './steps/preview-step'

const steps = [
  { id: 'category', title: 'Kategória' },
  { id: 'info', title: 'Základné info' },
  { id: 'price', title: 'Cena a stav' },
  { id: 'images', title: 'Fotografie' },
  { id: 'location', title: 'Lokalita' },
  { id: 'preview', title: 'Náhľad' },
]

export function CreateListingForm() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const methods = useForm({
    resolver: zodResolver(createListingSchema),
    mode: 'onChange',
    defaultValues: {
      is_premium: false,
      images: [],
    } as any,
  })

  // Track start of creation
  useEffect(() => {
    trackEvent('listing_creation_start')
  }, [])

  // Draft Persistence
  useEffect(() => {
    const draft = localStorage.getItem('listing_draft')
    if (draft) {
      const data = JSON.parse(draft)
      methods.reset(data)
      toast.info('Obnovili sme váš rozpísaný inzerát')
    }
  }, [methods])

  useEffect(() => {
    const subscription = methods.watch((value) => {
      localStorage.setItem('listing_draft', JSON.stringify(value))
    })
    return () => subscription.unsubscribe()
  }, [methods])

  const nextStep = async () => {
    const fields = getFieldsForStep(currentStep)
    const isValid = await methods.trigger(fields as any)
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const getFieldsForStep = (step: number) => {
    switch (step) {
      case 0:
        return ['category']
      case 1:
        return ['title', 'description']
      case 2:
        return ['price', 'condition']
      case 4:
        return ['location_region', 'location_city', 'location_zip']
      default:
        return []
    }
  }

  const onSubmit = async (data: any) => {
    setIsSubmitting(true)
    try {
      // API Call will go here
      console.log('Submitting data:', data)
      await new Promise((resolve) => setTimeout(resolve, 2000))
      trackEvent('listing_creation_success', { category: data.category })
      toast.success('Inzerát bol úspešne pridaný!')
      localStorage.removeItem('listing_draft')
    } catch (error) {
      toast.error('Nepodarilo sa uložiť inzerát')
    } finally {
      setIsSubmitting(false)
    }
  }

  const progress = ((currentStep + 1) / steps.length) * 100

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12">
      <div className="mb-12 space-y-4">
        <div className="text-muted-foreground flex items-center justify-between text-sm font-bold tracking-widest uppercase">
          <span>
            Krok {currentStep + 1} z {steps.length}
          </span>
          <span>{steps[currentStep]?.title}</span>
        </div>
        <Progress value={progress} className="h-2 rounded-full" />
      </div>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="bg-card/30 min-h-[400px] rounded-4xl border p-8 shadow-2xl backdrop-blur-xl"
            >
              {currentStep === 0 && <CategoryStep />}
              {currentStep === 1 && <BasicInfoStep />}
              {currentStep === 2 && <PriceConditionStep />}
              {currentStep === 3 && <ImagesStep />}
              {currentStep === 4 && <LocationStep />}
              {currentStep === 5 && <PreviewStep />}
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-between pt-6">
            <Button
              type="button"
              variant="ghost"
              onClick={prevStep}
              disabled={currentStep === 0 || isSubmitting}
              className="h-12 rounded-2xl px-6 font-bold"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Späť
            </Button>

            <div className="flex items-center space-x-4">
              <Button
                type="button"
                variant="outline"
                className="hidden h-12 rounded-2xl px-6 font-bold md:flex"
                onClick={() => toast.success('Rozpísaný inzerát uložený')}
              >
                <Save className="mr-2 h-4 w-4" />
                Uložiť koncept
              </Button>

              {currentStep === steps.length - 1 ? (
                <Button
                  disabled={isSubmitting}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/20 h-12 w-full transform rounded-2xl px-8 font-bold shadow-lg transition-all active:scale-95 md:w-auto"
                >
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                  )}
                  Zverejniť inzerát
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/20 h-12 w-full transform rounded-2xl px-8 font-bold shadow-lg transition-all active:scale-95 md:w-auto"
                >
                  Pokračovať
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}
