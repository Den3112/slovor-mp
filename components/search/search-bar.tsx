'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, Mic, X, History } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useListingsSearch } from '@/hooks/use-listings-search'
import { AnimatePresence, motion } from 'framer-motion'

export function SearchBar() {
  const { filters, updateFilter } = useListingsSearch()
  const [searchValue, setSearchValue] = useState(filters.query)
  const [isFocused, setIsFocused] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [isListening, setIsListening] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const saved = localStorage.getItem('slovor-recent-searches')
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    setSearchValue(filters.query)
  }, [filters.query])

  const saveSearch = (term: string) => {
    if (!term.trim()) return
    const updated = [term, ...recentSearches.filter((s) => s !== term)].slice(
      0,
      5
    )
    setRecentSearches(updated)
    localStorage.setItem('slovor-recent-searches', JSON.stringify(updated))
  }

  const handleSearch = (term: string) => {
    updateFilter({ query: term })
    saveSearch(term)
    setIsFocused(false)
  }

  const startVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Hlasové vyhľadávanie nie je vo vašom prehliadači podporované.')
      return
    }

    const recognition = new (window as any).webkitSpeechRecognition()
    recognition.lang = 'sk-SK'
    recognition.onstart = () => setIsListening(true)
    recognition.onend = () => setIsListening(false)
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setSearchValue(transcript)
      handleSearch(transcript)
    }
    recognition.start()
  }

  return (
    <div ref={containerRef} className="relative mx-auto w-full max-w-2xl">
      <div className="group relative">
        <Search className="text-muted-foreground group-focus-within:text-primary absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 transition-colors" />
        <Input
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchValue)}
          placeholder="Hľadať v inzerátoch..."
          className="border-muted-foreground/20 focus-visible:ring-primary/20 bg-background h-12 rounded-full pr-24 pl-12 shadow-sm transition-all"
        />
        <div className="absolute top-1/2 right-2 flex -translate-y-1/2 items-center space-x-1">
          {searchValue && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => {
                setSearchValue('')
                handleSearch('')
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              'h-8 w-8 rounded-full transition-colors',
              isListening
                ? 'text-primary bg-primary/10'
                : 'text-muted-foreground'
            )}
            onClick={startVoiceSearch}
          >
            {isListening ? (
              <Mic className="h-4 w-4 animate-pulse" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
          </Button>
          <Button
            className="ml-1 hidden h-8 rounded-full px-4 md:flex"
            onClick={() => handleSearch(searchValue)}
          >
            Hľadať
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {isFocused && recentSearches.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 5 }}
            exit={{ opacity: 0, y: 10 }}
            className="bg-background absolute top-full right-0 left-0 z-50 overflow-hidden rounded-2xl border p-2 shadow-xl"
          >
            <p className="text-muted-foreground px-3 py-2 text-[10px] font-bold tracking-wider uppercase">
              Nedávne hľadané výrazy
            </p>
            {recentSearches.map((term, i) => (
              <button
                key={i}
                className="hover:bg-muted flex w-full items-center space-x-3 rounded-xl px-3 py-2 text-left transition-colors"
                onClick={() => handleSearch(term)}
              >
                <History className="text-muted-foreground h-4 w-4" />
                <span>{term}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
