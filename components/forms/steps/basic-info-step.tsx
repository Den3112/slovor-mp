'use client'

import { useFormContext } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

export function BasicInfoStep() {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Základné údaje</h2>
        <p className="text-muted-foreground">
          Pútavý názov a podrobný popis prilákajú viac kupujúcich.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label
            htmlFor="title"
            className="text-muted-foreground text-sm font-bold tracking-widest uppercase"
          >
            Názov inzerátu
          </Label>
          <Input
            id="title"
            placeholder="Napr. iPhone 15 Pro, 256GB, Titanium"
            {...register('title')}
            className={errors.title ? 'border-destructive' : ''}
          />
          {errors.title && (
            <p className="text-destructive text-xs font-medium">
              {errors.title.message as string}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="description"
            className="text-muted-foreground text-sm font-bold tracking-widest uppercase"
          >
            Popis tovaru
          </Label>
          <Textarea
            id="description"
            rows={8}
            placeholder="Opíšte váš tovar, jeho výhody, dôvod predaja a pod."
            {...register('description')}
            className={errors.description ? 'border-destructive' : ''}
          />
          {errors.description && (
            <p className="text-destructive text-xs font-medium">
              {errors.description.message as string}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
