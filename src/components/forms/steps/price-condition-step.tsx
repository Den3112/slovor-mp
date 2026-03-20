'use client'

import { useFormContext } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const conditions = [
  { id: 'new', label: 'Nový', description: 'Úplne nový, nepoužitý tovar' },
  {
    id: 'like_new',
    label: 'Ako nový',
    description: 'Použitý párkrát, bez známok opotrebenia',
  },
  {
    id: 'used',
    label: 'Používaný',
    description: 'Viditeľné známky používania, plne funkčný',
  },
  {
    id: 'refurbished',
    label: 'Repasovaný',
    description: 'Profesionálne opravený a testovaný',
  },
]

export function PriceConditionStep() {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext()
  const selectedCondition = watch('condition')

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Cena a stav</h2>
        <p className="text-muted-foreground">
          Nastavte férovú cenu a úprimne opíšte stav tovaru.
        </p>
      </div>

      <div className="space-y-8">
        <div className="space-y-4">
          <Label
            htmlFor="price"
            className="text-muted-foreground text-sm font-bold tracking-widest uppercase"
          >
            Cena v Eurách (€)
          </Label>
          <div className="relative max-w-[200px]">
            <Input
              id="price"
              type="number"
              placeholder="0.00"
              {...register('price', { valueAsNumber: true })}
              className={cn(
                'h-16 rounded-2xl pr-10 pl-4 text-2xl font-bold',
                errors.price ? 'border-destructive' : ''
              )}
            />
            <span className="text-muted-foreground absolute top-1/2 right-4 -translate-y-1/2 text-xl font-bold">
              €
            </span>
          </div>
          {errors.price && (
            <p className="text-destructive text-xs font-medium">
              {errors.price.message as string}
            </p>
          )}
        </div>

        <div className="space-y-4">
          <Label className="text-muted-foreground text-sm font-bold tracking-widest uppercase">
            Stav tovaru
          </Label>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {conditions.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  setValue('condition', item.id, { shouldValidate: true })
                }
                className={cn(
                  'flex flex-col rounded-2xl border-2 p-4 text-left transition-all',
                  selectedCondition === item.id
                    ? 'border-primary bg-primary/5 shadow-md'
                    : 'border-muted-foreground/10 hover:border-primary/50'
                )}
              >
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-bold">{item.label}</span>
                  {selectedCondition === item.id && (
                    <Badge className="bg-primary text-primary-foreground h-5 text-[10px]">
                      Aktívny
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground text-xs">
                  {item.description}
                </p>
              </button>
            ))}
          </div>
          {errors.condition && (
            <p className="text-destructive text-xs font-medium">
              {errors.condition.message as string}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
