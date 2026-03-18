'use client'

import { Filter, MapPin, Euro, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet'
import { SLOVAK_REGIONS, CONDITIONS } from '@/constants/search'
import { useListingsSearch } from '@/hooks/use-listings-search'

export function FilterSidebar() {
  const { filters, updateFilter, resetFilters } = useListingsSearch()

  const activeFiltersCount = [
    filters.category,
    filters.region,
    filters.city,
    filters.priceMin,
    filters.priceMax,
    filters.condition.length > 0,
  ].filter(Boolean).length

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Lokalita */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <MapPin className="text-primary h-4 w-4" />
          <h3 className="text-xs font-semibold tracking-wider uppercase">
            Lokalita
          </h3>
        </div>
        <div className="space-y-2">
          <select
            className="border-input bg-background focus:ring-primary/20 h-10 w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2"
            value={filters.region}
            onChange={(e) => updateFilter({ region: e.target.value })}
          >
            <option value="">Celé Slovensko</option>
            {SLOVAK_REGIONS.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Mesto (všetky)"
            className="border-input bg-background focus:ring-primary/20 h-10 w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2"
            value={filters.city}
            onChange={(e) => updateFilter({ city: e.target.value })}
          />
        </div>
      </div>

      {/* Cena */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Euro className="text-primary h-4 w-4" />
          <h3 className="text-xs font-semibold tracking-wider uppercase">
            Cena
          </h3>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="relative">
              <span className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2 text-xs">
                Od
              </span>
              <input
                type="number"
                className="border-input bg-background h-10 w-full rounded-md border pr-3 pl-10 text-sm outline-none"
                placeholder="0"
                value={filters.priceMin || ''}
                onChange={(e) =>
                  updateFilter({
                    priceMin: e.target.value ? parseInt(e.target.value) : null,
                  })
                }
              />
            </div>
            <div className="relative">
              <span className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2 text-xs">
                Do
              </span>
              <input
                type="number"
                className="border-input bg-background h-10 w-full rounded-md border pr-3 pl-10 text-sm outline-none"
                placeholder="∞"
                value={filters.priceMax || ''}
                onChange={(e) =>
                  updateFilter({
                    priceMax: e.target.value ? parseInt(e.target.value) : null,
                  })
                }
              />
            </div>
          </div>
          <Slider
            defaultValue={[0, 10000]}
            max={10000}
            step={100}
            value={[filters.priceMin || 0, filters.priceMax || 10000]}
            onValueChange={([min, max]) =>
              updateFilter({ priceMin: min, priceMax: max })
            }
          />
        </div>
      </div>

      {/* Stav */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Info className="text-primary h-4 w-4" />
          <h3 className="text-xs font-semibold tracking-wider uppercase">
            Stav produktu
          </h3>
        </div>
        <div className="grid grid-cols-1 gap-2">
          {CONDITIONS.map((condition) => (
            <div key={condition.id} className="flex items-center space-x-2">
              <Checkbox
                id={`cond-${condition.id}`}
                checked={filters.condition.includes(condition.id)}
                onCheckedChange={(checked) => {
                  const newConditions = checked
                    ? [...filters.condition, condition.id]
                    : filters.condition.filter((id) => id !== condition.id)
                  updateFilter({ condition: newConditions })
                }}
              />
              <Label
                htmlFor={`cond-${condition.id}`}
                className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {condition.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {activeFiltersCount > 0 && (
        <Button
          variant="outline"
          className="w-full rounded-full border-dashed"
          onClick={resetFilters}
        >
          Zrušiť všetky filtre
        </Button>
      )}
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="bg-card sticky top-24 hidden h-fit w-72 shrink-0 rounded-2xl border p-6 shadow-sm lg:block">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold">Filtre</h2>
          {activeFiltersCount > 0 && (
            <Badge
              variant="secondary"
              className="bg-primary/10 text-primary rounded-full border-none"
            >
              {activeFiltersCount}
            </Badge>
          )}
        </div>
        <FilterContent />
      </div>

      {/* Mobile Trigger/Sheet */}
      <div className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button className="h-12 space-x-2 rounded-full px-6 shadow-2xl">
              <Filter className="h-4 w-4" />
              <span>Filtrovanie</span>
              {activeFiltersCount > 0 && (
                <span className="text-primary flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent
            side="bottom"
            className="flex h-[85vh] flex-col overflow-hidden rounded-t-4xl p-0"
          >
            <SheetHeader className="border-b px-6 py-4">
              <SheetTitle className="text-left">Filtre</SheetTitle>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto p-6 pb-24">
              <FilterContent />
            </div>
            <SheetFooter className="bg-background border-t p-4">
              <Button
                className="h-12 w-full rounded-full"
                onClick={() =>
                  (
                    document.querySelector(
                      '[data-radix-collection-item]'
                    ) as any
                  )?.click()
                }
              >
                Zobraziť výsledky
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
