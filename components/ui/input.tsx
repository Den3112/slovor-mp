import * as React from 'react'

import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  _dummy?: never // Added to avoid empty interface error in TS 5+
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'border-input bg-card flex h-12 w-full rounded-xl border px-4 py-3 text-[15px] transition-all',
          'ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-semibold',
          'placeholder:text-muted-foreground',
          'focus-visible:border-primary focus-visible:ring-primary/20 focus-visible:ring-2 focus-visible:outline-none',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }
