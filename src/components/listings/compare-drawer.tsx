'use client'

import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowRightLeft, Trash2, ChevronRight } from 'lucide-react'
import { useCompare } from '@/hooks/use-compare'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function CompareDrawer() {
  const { items, removeFromCompare, clearCompare } = useCompare()

  if (items.length === 0) return null

  return (
    <div className="fixed bottom-6 left-1/2 z-50 w-full max-w-4xl -translate-x-1/2 px-4">
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="bg-card/80 border-primary/20 flex items-center justify-between rounded-4xl border-2 p-4 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] backdrop-blur-2xl"
      >
        <div className="no-scrollbar flex flex-1 items-center space-x-4 overflow-x-auto">
          <div className="bg-primary text-primary-foreground shadow-primary/30 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-lg">
            <ArrowRightLeft className="h-6 w-6" />
          </div>

          <div className="flex -space-x-3">
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="group relative"
                >
                  <div className="border-card bg-muted h-14 w-14 overflow-hidden rounded-2xl border-4 shadow-md">
                    <Image
                      src={item.image || '/placeholders/listing.jpg'}
                      alt={`Image for item ${item.id}`}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                  <button
                    onClick={() => removeFromCompare(item.id)}
                    className="bg-destructive text-destructive-foreground absolute -top-1 -right-1 transform rounded-full p-1 opacity-0 transition-opacity group-hover:opacity-100 hover:scale-110 active:scale-90"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-bold">
              {items.length}{' '}
              {items.length === 1
                ? 'produkt'
                : items.length < 5
                  ? 'produkty'
                  : 'produktov'}{' '}
              na porovnanie
            </p>
            <p className="text-muted-foreground text-[10px] font-medium tracking-widest uppercase">
              Vyberte ďalšie pre detaily
            </p>
          </div>
        </div>

        <div className="ml-4 flex shrink-0 items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={clearCompare}
            className="text-muted-foreground hover:text-destructive h-11 rounded-2xl px-4"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Vymazať</span>
          </Button>

          <Button
            asChild
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/20 group h-11 transform rounded-2xl px-6 shadow-lg transition-transform active:scale-95"
          >
            <Link href="/porovnanie">
              <span className="font-bold">Porovnať</span>
              <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
