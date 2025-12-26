'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { categoriesApi, listingsApi } from '@/lib/supabase/queries'
import type { Category } from '@/lib/types/database'
import { Button } from '@/components/ui/button'
import { Loader2, Upload, AlertCircle, ArrowRight, ArrowLeft, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

export function CreateListingForm() {
    const { user, isLoading: authLoading } = useAuth()
    const router = useRouter()

    // Form State
    const [step, setStep] = useState(1)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [categories, setCategories] = useState<Category[]>([])

    // Data State
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        currency: 'EUR',
        category_id: '',
        condition: 'new' as 'new' | 'used',
        location: '',
        images: [] as string[]
    })

    // Fetch Categories
    useEffect(() => {
        categoriesApi.getAll().then(res => {
            if (res.data) setCategories(res.data)
        })
    }, [])

    // Auth Check
    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/auth/login')
        }
    }, [user, authLoading, router])

    if (authLoading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin w-10 h-10 text-primary" /></div>

    const updateField = <K extends keyof typeof formData>(field: K, value: typeof formData[K]) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const nextStep = () => setStep(prev => prev + 1)
    const prevStep = () => setStep(prev => prev - 1)

    const handleSubmit = async () => {
        if (!formData.title || !formData.price || !formData.category_id) {
            setError('Please fill in all required fields')
            return
        }

        setIsSubmitting(true)
        setError(null)

        try {
            const res = await listingsApi.create({
                ...formData,
                price: parseFloat(formData.price),
                user_id: user?.id ?? '',
                status: 'active'
            })

            if (res.error || !res.data) throw new Error(res.error || 'Failed to create listing')

            // Success
            router.push(`/listings/${res.data.id}`)
            router.refresh()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unexpected error occurred')
            setIsSubmitting(false)
        }
    }

    // Handlers for "Mock" Image Upload
    const addMockImage = () => {
        const mockImages = [
            'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=400&q=80',
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80',
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80',
            'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=400&q=80'
        ]
        const randomImage = (mockImages[Math.floor(Math.random() * mockImages.length)] ?? mockImages[0]) as string
        updateField('images', [...formData.images, randomImage])
    }

    return (
        <div className="max-w-3xl mx-auto bg-card border border-border/50 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            {/* Progress Bar */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-muted">
                <div className="h-full bg-primary transition-all duration-500 ease-out" style={{ width: `${(step / 3) * 100}%` }} />
            </div>

            <div className="mb-8 text-center animate-in fade-in slide-in-from-top-4">
                <h1 className="text-3xl font-black font-heading mb-2">Create New Listing</h1>
                <p className="text-muted-foreground">Step {step} of 3</p>
            </div>

            {error && (
                <div className="bg-destructive/10 text-destructive p-4 rounded-xl mb-6 flex items-center gap-2 font-medium">
                    <AlertCircle className="w-5 h-5" /> {error}
                </div>
            )}

            <div className="space-y-8 min-h-[400px]">
                {step === 1 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
                        <div>
                            <label className="block text-sm font-bold mb-2">Category</label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {categories.map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => updateField('category_id', cat.id)}
                                        className={cn(
                                            "p-4 rounded-xl border-2 text-left transition-all hover:scale-[1.02]",
                                            formData.category_id === cat.id
                                                ? "border-primary bg-primary/5 text-primary"
                                                : "border-border/50 bg-muted/20 hover:border-primary/50"
                                        )}
                                    >
                                        <span className="text-2xl mb-1 block">{cat.icon}</span>
                                        <span className="font-bold text-sm">{cat.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-2">Condition</label>
                            <div className="flex gap-4">
                                {(['new', 'used'] as const).map(c => (
                                    <button
                                        key={c}
                                        type="button"
                                        onClick={() => updateField('condition', c)}
                                        className={cn(
                                            "flex-1 py-3 px-6 rounded-xl border-2 font-bold capitalize transition-all",
                                            formData.condition === c
                                                ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                                : "border-border/50 bg-transparent text-muted-foreground hover:bg-muted"
                                        )}
                                    >
                                        {c}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
                        <div className="space-y-1">
                            <label className="text-sm font-bold">Title</label>
                            <input
                                value={formData.title}
                                onChange={e => updateField('title', e.target.value)}
                                className="w-full h-14 px-4 rounded-xl bg-muted/30 border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none text-lg font-medium transition-all"
                                placeholder="What are you selling?"
                            />
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-1 space-y-1">
                                <label className="text-sm font-bold">Price</label>
                                <input
                                    type="number"
                                    value={formData.price}
                                    onChange={e => updateField('price', e.target.value)}
                                    className="w-full h-14 px-4 rounded-xl bg-muted/30 border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none text-lg font-medium transition-all"
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="w-1/3 space-y-1">
                                <label className="text-sm font-bold">Currency</label>
                                <div className="h-14 px-4 rounded-xl bg-muted/30 border border-border flex items-center font-bold text-muted-foreground">
                                    EUR (€)
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-bold">Description</label>
                            <textarea
                                value={formData.description}
                                onChange={e => updateField('description', e.target.value)}
                                className="w-full h-32 p-4 rounded-xl bg-muted/30 border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all resize-none"
                                placeholder="Tell buyers more about your item..."
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-bold">Location</label>
                            <input
                                value={formData.location}
                                onChange={e => updateField('location', e.target.value)}
                                className="w-full h-12 px-4 rounded-xl bg-muted/30 border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none"
                                placeholder="City, District"
                            />
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
                        <div className="border-2 border-dashed border-border rounded-2xl p-8 text-center hover:bg-muted/30 transition-colors">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                                <Upload className="w-8 h-8" />
                            </div>
                            <h3 className="font-bold text-lg mb-2">Upload Photos</h3>
                            <p className="text-muted-foreground text-sm mb-6 max-w-xs mx-auto">
                                Drag and drop your photos here, or click the button below to browse.
                            </p>

                            <div className="flex justify-center gap-3">
                                <Button onClick={addMockImage} type="button" variant="outline" className="border-primary/50 text-primary hover:bg-primary/5">
                                    <ImageIcon className="w-4 h-4 mr-2" />
                                    Add Mock Image
                                </Button>
                                <input
                                    type="text"
                                    placeholder="Or paste Image URL"
                                    className="h-10 px-3 rounded-lg border bg-background text-sm w-48"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            updateField('images', [...formData.images, e.currentTarget.value]);
                                            e.currentTarget.value = '';
                                        }
                                    }}
                                />
                            </div>
                        </div>

                        {/* Image Preview Grid */}
                        {formData.images.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {formData.images.map((img, idx) => (
                                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group shadow-md border border-border/50">
                                        <Image src={img} alt="preview" fill className="object-cover" unoptimized />
                                        <button
                                            onClick={() => updateField('images', formData.images.filter((_, i) => i !== idx))}
                                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <AlertCircle className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-border">
                {step > 1 ? (
                    <Button type="button" variant="ghost" onClick={prevStep} className="font-bold text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back
                    </Button>
                ) : (
                    <div /> // Spacer
                )}

                {step < 3 ? (
                    <Button type="button" onClick={nextStep} disabled={step === 1 && !formData.category_id} className="rounded-xl px-8 font-bold shadow-lg shadow-primary/20">
                        Next Step <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                ) : (
                    <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="rounded-xl px-8 font-bold shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 min-w-[140px]"
                    >
                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Publish Listing'}
                    </Button>
                )}
            </div>
        </div>
    )
}
