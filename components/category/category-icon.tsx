import {
  getCategoryIcon,
  getIconByName,
  getCategoryColors,
} from '@/lib/constants/category-icons'
import { cn } from '@/lib/utils'

interface CategoryIconProps {
  slug?: string
  iconName?: string | null
  iconEmoji?: string | null
  className?: string
  showBackground?: boolean
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

/**
 * Renders appropriate Category Icon with Premium Glassmorphism effect
 * Principle #2: Wow the user with aesthetics
 * Principle #3: Single source of truth for design tokens
 */
export function CategoryIcon({
  slug,
  iconName,
  iconEmoji,
  className,
  showBackground = true,
  size = 'md',
}: CategoryIconProps) {
  const colors = getCategoryColors(slug || 'default')

  // Size Configuration Map
  const sizeConfig = {
    xs: {
      container: 'h-8 w-8',
      icon: 'h-4 w-4',
      rounded: 'rounded-xl',
      pad: 'p-1.5',
    },
    sm: {
      container: 'h-10 w-10',
      icon: 'h-5 w-5',
      rounded: 'rounded-xl',
      pad: 'p-2',
    },
    md: {
      container: 'h-12 w-12',
      icon: 'h-6 w-6',
      rounded: 'rounded-xl',
      pad: 'p-2.5',
    },
    lg: {
      container: 'h-16 w-16',
      icon: 'h-8 w-8',
      rounded: 'rounded-2xl',
      pad: 'p-4',
    },
    xl: {
      container: 'h-24 w-24',
      icon: 'h-12 w-12',
      rounded: 'rounded-3xl',
      pad: 'p-6',
    },
  }

  const config = sizeConfig[size]

  const renderIcon = (customClass?: string) => {
    const finalIconClass = cn(config.icon, customClass)

    // 1. Priority: Explicit Icon Name (Case-Insensitive Lucide)
    if (iconName) {
      const LucideIcon = getIconByName(iconName)
      if (LucideIcon) return <LucideIcon className={finalIconClass} />
    }

    // 2. Fallback: Slug-based logic
    if (slug) {
      const FallbackIcon = getCategoryIcon(slug)
      return <FallbackIcon className={finalIconClass} />
    }

    // 3. Last Resort: Emoji (Now wrapped to match style)
    if (iconEmoji) {
      return (
        <span
          className={cn(
            'leading-none drop-shadow-sm filter',
            size === 'xs' || size === 'sm' ? 'text-sm' : 'text-lg',
            finalIconClass
          )}
        >
          {iconEmoji}
        </span>
      )
    }

    // Ultimate fallback
    const DefaultIcon = getCategoryIcon('default')
    return <DefaultIcon className={finalIconClass} />
  }

  if (!showBackground) {
    return renderIcon(className)
  }

  return (
    <div
      className={cn(
        'relative flex items-center justify-center transition-all duration-300',
        config.rounded,
        'border shadow-sm',
        config.container,
        colors,
        'hover:scale-105 hover:shadow-md active:scale-95',
        !slug && !iconName && 'opacity-50 grayscale',
        className // Allow external margin/offset overrides but NOT size
      )}
    >
      {/* Soft Inner Glow & Blur */}
      <div
        className={cn(
          'absolute inset-0 bg-white/40 backdrop-blur-md',
          config.rounded
        )}
      />

      {/* Icon Content */}
      <div
        className={cn(
          'relative z-10 flex items-center justify-center',
          config.pad
        )}
      >
        {renderIcon()}
      </div>
    </div>
  )
}
