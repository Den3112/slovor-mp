'use client'

import { useState } from 'react'
import { MapPin, ChevronDown, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n'

const CITIES = [
  'Bratislava',
  'Košice',
  'Prešov',
  'Žilina',
  'Nitra',
  'Banská Bystrica',
  'Trnava',
  'Martin',
]

export function LocationSwitcher() {
  const { t } = useTranslation('common')
  const [selectedCity, setSelectedCity] = useState('Bratislava')
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'bg-muted/20 hover:bg-muted/40 border-border/40 group flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-bold transition-all active:scale-95',
          isOpen && 'border-primary/50 bg-background shadow-lg'
        )}
      >
        <MapPin
          className={cn(
            'h-4 w-4 transition-colors',
            isOpen ? 'text-primary' : 'text-muted-foreground'
          )}
        />
        <span className="max-w-[100px] truncate">{selectedCity}</span>
        <ChevronDown
          className={cn(
            'h-3 w-3 transition-transform duration-300',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="border-border/40 bg-background/95 absolute top-full right-0 z-50 mt-2 min-w-[200px] gap-1 overflow-hidden rounded-2xl border p-2 shadow-2xl"
            >
              <div className="text-muted-foreground mb-2 px-3 py-1 text-[10px] font-bold tracking-widest uppercase">
                {t('common:location')}
              </div>
              <div className="space-y-1">
                {CITIES.map((city) => (
                  <button
                    key={city}
                    onClick={() => {
                      setSelectedCity(city)
                      setIsOpen(false)
                    }}
                    className={cn(
                      'flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      selectedCity === city
                        ? 'bg-primary/10 text-primary'
                        : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {city}
                    {selectedCity === city && <Check className="h-4 w-4" />}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
