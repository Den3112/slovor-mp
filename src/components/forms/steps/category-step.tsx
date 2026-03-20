'use client'

import { useFormContext } from 'react-hook-form'
import { CATEGORIES } from '@/constants/navigation'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

export function CategoryStep() {
  const { setValue, watch } = useFormContext()
  const selectedCategory = watch('category')

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Čo predávate?</h2>
        <p className="text-muted-foreground">
          Vyberte kategóriu, ktorá najlepšie vystihuje váš tovar.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon
          const isSelected = selectedCategory === cat.id

          return (
            <motion.button
              key={cat.id}
              type="button"
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() =>
                setValue('category', cat.id, { shouldValidate: true })
              }
              className={cn(
                'group relative flex flex-col items-center justify-center rounded-2xl border-2 p-6 transition-all duration-300',
                isSelected
                  ? 'border-primary bg-primary/5 shadow-primary/10 shadow-lg'
                  : 'border-muted-foreground/10 hover:border-primary/50 hover:bg-muted/50'
              )}
            >
              <div
                className={cn(
                  'mb-3 flex h-12 w-12 items-center justify-center rounded-2xl transition-colors',
                  isSelected
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
                )}
              >
                <Icon className="h-6 w-6" />
              </div>
              <span
                className={cn(
                  'text-center text-xs font-bold tracking-widest uppercase',
                  isSelected
                    ? 'text-primary'
                    : 'text-muted-foreground group-hover:text-foreground'
                )}
              >
                {cat.label}
              </span>

              {isSelected && (
                <motion.div
                  layoutId="selected-cat"
                  className="bg-primary text-primary-foreground absolute -top-2 -right-2 rounded-full p-1.5 shadow-lg"
                >
                  <Check className="h-3 w-3" />
                </motion.div>
              )}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
