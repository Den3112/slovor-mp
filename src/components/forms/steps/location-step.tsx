'use client'

import { useFormContext } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { REGIONS } from '@/constants/navigation'
import { MapPin } from 'lucide-react'

export function LocationStep() {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext()
  const selectedRegion = watch('location_region')

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Kde sa tovar nachádza?</h2>
        <p className="text-muted-foreground">
          Kupujúci často filtrujú podľa lokality kvôli osobnému odberu.
        </p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-muted-foreground text-sm font-bold tracking-widest uppercase">
              Kraj
            </Label>
            <Select
              onValueChange={(val) =>
                setValue('location_region', val, { shouldValidate: true })
              }
              value={selectedRegion}
            >
              <SelectTrigger className="h-12 rounded-xl">
                <SelectValue placeholder="Vyberte kraj" />
              </SelectTrigger>
              <SelectContent>
                {REGIONS.map((region) => (
                  <SelectItem key={region.id} value={region.id}>
                    {region.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.location_region && (
              <p className="text-destructive text-xs font-medium">
                {errors.location_region.message as string}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground text-sm font-bold tracking-widest uppercase">
              Mesto / Obec
            </Label>
            <div className="relative">
              <MapPin className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                placeholder="Napr. Bratislava"
                className="h-12 rounded-xl pl-10"
                {...register('location_city')}
              />
            </div>
            {errors.location_city && (
              <p className="text-destructive text-xs font-medium">
                {errors.location_city.message as string}
              </p>
            )}
          </div>
        </div>

        <div className="max-w-[150px] space-y-2">
          <Label className="text-muted-foreground text-sm font-bold tracking-widest uppercase">
            PSČ
          </Label>
          <Input
            placeholder="811 01"
            className="h-12 rounded-xl"
            {...register('location_zip')}
          />
          {errors.location_zip && (
            <p className="text-destructive text-xs font-medium">
              {errors.location_zip.message as string}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
