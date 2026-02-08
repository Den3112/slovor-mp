'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface VantageContextType {
    isCommandPaletteOpen: boolean
    setCommandPaletteOpen: (open: boolean) => void
}

const VantageContext = createContext<VantageContextType | undefined>(undefined)

export function VantageProvider({ children }: { children: React.ReactNode }) {
    const [isCommandPaletteOpen, setCommandPaletteOpen] = useState(false)

    // Global keyboard shortcut for Command Palette
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault()
                setCommandPaletteOpen((prev) => !prev)
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])

    return (
        <VantageContext.Provider
            value={{
                isCommandPaletteOpen,
                setCommandPaletteOpen,
            }}
        >
            {children}
        </VantageContext.Provider>
    )
}

export function useVantage() {
    const context = useContext(VantageContext)
    if (context === undefined) {
        throw new Error('useVantage must be used within a VantageProvider')
    }
    return context
}
