'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import { Button } from '@/components/ui/button'
import { Phone, MessageSquare, Mail, MapPin, Calendar, Tag } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import { getLocalizedTitle, getLocalizedDescription } from '@/lib/utils/listing-i18n'
import type { Listing } from '@/lib/supabase/queries'

interface ListingDetailViewProps {
    listing: Listing
}

export function ListingDetailView({ listing }: ListingDetailViewProps) {
    const { t, locale } = useTranslation()
    const [activeImage, setActiveImage] = useState(0)

    // Get localized content
    const localizedTitle = getLocalizedTitle(listing, locale)
    const localizedDescription = getLocalizedDescription(listing, locale)

    // Dynamic locale check for category name
    const categoryName = (() => {
        if (!listing.category) return ''
        if (locale === 'sk') return listing.category.name_sk || listing.category.name
        if (locale === 'cs') return listing.category.name_cs || listing.category.name
        if (locale === 'en') return listing.category.name_en || listing.category.name
        return t.categories[listing.category.slug] || listing.category.name
    })()

    return (
        <div className="bg-gray-50/50 min-h-screen pb-20 overflow-x-hidden">
            <div className="container mx-auto px-4 py-12">
                <Breadcrumbs
                    items={[
                        { label: t.common.allListings, href: '/listings' },
                        ...(listing.category ? [{ label: categoryName, href: `/categories/${listing.category.slug}` }] : []),
                        { label: localizedTitle },
                    ]}
                />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-8">
                    {/* Main Content */}
                    <div className="lg:col-span-8 space-y-12">
                        {/* Image Gallery */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-[3rem] overflow-hidden shadow-2xl shadow-blue-900/5 group border border-gray-100">
                                {listing.images && listing.images[activeImage] ? (
                                    <div className="aspect-[16/10] relative">
                                        <Image
                                            src={listing.images[activeImage]}
                                            alt={localizedTitle}
                                            fill
                                            className="object-cover transition-all duration-700"
                                            priority
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                                    </div>
                                ) : (
                                    <div className="aspect-[16/10] flex items-center justify-center bg-gray-50">
                                        <span className="text-9xl opacity-10 grayscale">📷</span>
                                    </div>
                                )}
                            </div>

                            {/* Thumbnails */}
                            {listing.images && listing.images.length > 1 && (
                                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                                    {listing.images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setActiveImage(idx)}
                                            className={`relative w-24 h-24 rounded-2xl overflow-hidden border-4 transition-all flex-shrink-0 ${activeImage === idx ? 'border-blue-600 scale-105 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                        >
                                            <Image
                                                src={img}
                                                alt={`${localizedTitle} thumbnail ${idx + 1}`}
                                                fill
                                                className="object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Content Details */}
                        <div className="bg-white rounded-[3rem] p-10 md:p-16 shadow-xl shadow-blue-900/5 border border-gray-50">
                            <div className="flex flex-col gap-4 mb-10">
                                <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight tracking-tighter">
                                    {localizedTitle}
                                </h1>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-5xl font-black text-blue-600">
                                            {listing.price.toLocaleString()}
                                        </span>
                                        <span className="text-xl font-bold text-gray-400 uppercase tracking-widest">{listing.currency}</span>
                                    </div>
                                    <div className="h-1 flex-1 bg-gray-100 rounded-full"></div>
                                </div>
                            </div>

                            <div className="prose prose-blue max-w-none">
                                <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                                    <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
                                    {t.listing.description}
                                </h3>
                                <p className="text-lg text-gray-600 whitespace-pre-wrap leading-relaxed">
                                    {localizedDescription}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* Contact Card */}
                        <div className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-blue-600/10 border-4 border-blue-50 sticky top-32 overflow-hidden">
                            {/* Decorative background circle */}
                            <div className="absolute -right-20 -top-20 w-44 h-44 bg-blue-600/5 rounded-full blur-3xl"></div>

                            <h3 className="text-2xl font-black text-gray-900 mb-8 relative">{t.listing.contactSeller}</h3>

                            <div className="space-y-4 relative">
                                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-2xl py-8 font-black text-lg shadow-lg hover:shadow-blue-200 transition-all flex gap-3">
                                    <Phone className="w-6 h-6" /> {t.listing.callNow}
                                </Button>

                                <Button className="w-full bg-green-500 hover:bg-green-600 text-white rounded-2xl py-8 font-black text-lg shadow-lg hover:shadow-green-100 transition-all flex gap-3">
                                    <MessageSquare className="w-6 h-6" /> {t.listing.liveChat}
                                </Button>

                                <Button variant="outline" className="w-full border-2 border-gray-100 text-gray-500 hover:text-gray-900 rounded-2xl py-8 font-black text-lg transition-all flex gap-3">
                                    <Mail className="w-6 h-6" /> {t.listing.sendMessage}
                                </Button>
                            </div>

                            <p className="text-center text-[10px] uppercase font-black tracking-widest text-gray-300 mt-8">
                                {t.listing.responseTime}
                            </p>
                        </div>

                        {/* Metadata Card */}
                        <div className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-blue-900/5 border border-gray-50 space-y-8">
                            <h3 className="text-xl font-black text-gray-900 mb-2">{t.listing.itemDetails}</h3>

                            <div className="space-y-6">
                                {listing.location && (
                                    <div className="flex items-center gap-5">
                                        <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-blue-600">
                                            <MapPin className="w-7 h-7" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{t.listing.location}</p>
                                            <p className="font-bold text-gray-900">{listing.location}</p>
                                        </div>
                                    </div>
                                )}

                                {listing.category && (
                                    <div className="flex items-center gap-5">
                                        <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-blue-600">
                                            <Tag className="w-7 h-7" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{t.listing.category}</p>
                                            <Link
                                                href={`/categories/${listing.category.slug}`}
                                                className="font-bold text-blue-600 hover:text-blue-700 underline underline-offset-4 decoration-2"
                                            >
                                                {categoryName}
                                            </Link>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-blue-600">
                                        <Calendar className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{t.listing.postedOn}</p>
                                        <p className="font-bold text-gray-900">
                                            {new Date(listing.created_at).toLocaleDateString(locale, {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
