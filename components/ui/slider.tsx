'use client'

import * as React from 'react'
import * as SliderPrimitive from '@radix-ui/react-slider'

import { cn } from '@/lib/utils'

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      'relative flex w-full touch-none items-center py-2 select-none',
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="bg-secondary relative h-2.5 w-full grow overflow-hidden rounded-full">
      <SliderPrimitive.Range className="bg-primary absolute h-full" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="border-primary bg-background ring-offset-background focus-visible:ring-ring relative block h-8 w-8 cursor-pointer rounded-full border-2 shadow-lg transition-all hover:scale-110 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none active:scale-95 disabled:pointer-events-none disabled:opacity-50">
      <div className="absolute -inset-2 md:inset-0" />
    </SliderPrimitive.Thumb>
    <SliderPrimitive.Thumb className="border-primary bg-background ring-offset-background focus-visible:ring-ring relative block h-8 w-8 cursor-pointer rounded-full border-2 shadow-lg transition-all hover:scale-110 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none active:scale-95 disabled:pointer-events-none disabled:opacity-50">
      <div className="absolute -inset-2 md:inset-0" />
    </SliderPrimitive.Thumb>
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
