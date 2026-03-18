'use client'

import { useFormContext } from 'react-hook-form'
import { CATEGORIES, REGIONS } from '@/constants/navigation'
import { Badge } from '@/components/ui/badge'
import { MapPin, Tag, Info, Camera } from 'lucide-react'
import Image from 'next/image'

export function PreviewStep() {
  const { watch } = useFormContext()
  const data = watch()

  const categoryLabel =
    CATEGORIES.find((c) => c.id === data.category)?.label || data.category
  const regionLabel =
    REGIONS.find((r) => r.id === data.location_region)?.label ||
    data.location_region

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Skontrolujte si inzerát</h2>
        <p className="text-muted-foreground">
          Takto bude váš inzerát vyzerať pre ostatných užívateľov.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <div className="bg-muted group relative aspect-4/3 overflow-hidden rounded-2xl">
            {data.images && data.images.length > 0 ? (
              <Image
                src={URL.createObjectURL(data.images[0])}
                alt="Preview"
                fill
                className="object-cover"
              />
            ) : (
              <div className="text-muted-foreground flex h-full flex-col items-center justify-center">
                <Camera className="mb-2 h-12 w-12 opacity-20" />
                <span className="text-sm font-medium">
                  Žiadne nahrané fotky
                </span>
              </div>
            )}
            <div className="absolute top-4 left-4">
              <Badge className="bg-primary font-bold text-white">
                {categoryLabel}
              </Badge>
            </div>
          </div>

          <div className="no-scrollbar flex gap-2 overflow-x-auto pb-2">
            {data.images?.slice(1).map((img: File, i: number) => (
              <div
                key={i}
                className="border-border relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border"
              >
                <Image
                  src={URL.createObjectURL(img)}
                  alt={`Preview ${i}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl leading-tight font-bold">
              {data.title || 'Názov vášho inzerátu'}
            </h1>
            <div className="text-primary text-4xl font-extrabold">
              {data.price ? `${data.price} €` : 'Cena nebola zadaná'}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted/50 flex items-center gap-3 rounded-2xl p-4">
              <Tag className="text-primary h-5 w-5" />
              <div>
                <p className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
                  Stav
                </p>
                <p className="text-sm font-bold">
                  {data.condition || 'Nezadaný'}
                </p>
              </div>
            </div>
            <div className="bg-muted/50 flex items-center gap-3 rounded-2xl p-4">
              <MapPin className="text-primary h-5 w-5" />
              <div>
                <p className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
                  Lokalita
                </p>
                <p className="text-sm font-bold">
                  {data.location_city || 'Nezadaná'}, {regionLabel}
                </p>
              </div>
            </div>
          </div>

          <div className="border-muted-foreground/10 bg-muted/20 rounded-2xl border-2 border-dashed p-6">
            <div className="text-muted-foreground mb-3 flex items-center gap-2">
              <Info className="h-4 w-4" />
              <span className="text-xs font-bold tracking-widest uppercase">
                Popis
              </span>
            </div>
            <p className="text-foreground/80 line-clamp-6 text-sm whitespace-pre-wrap italic">
              {data.description || 'Váš popis sa zobrazí tu...'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
