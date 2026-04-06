'use client'

import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/shared/lib/utils'
import { useTranslation } from '@/shared/lib/i18n'

interface LogoProps {
  locale?: string
  className?: string
  showText?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'white'
}

export function Logo({
  locale,
  className,
  showText = true,
  size = 'md',
  variant = 'default',
}: LogoProps) {
  const { t } = useTranslation('common')
  const href = locale ? `/${locale}` : '/'

  const sizes = {
    sm: {
      box: 'h-8 w-8',
      text: 'text-lg',
      icon: 'text-base',
    },
    md: {
      box: 'h-9 w-9 md:h-11 md:w-11',
      text: 'text-xl md:text-3xl',
      icon: 'text-lg md:text-2xl',
    },
    lg: {
      box: 'h-12 w-12 md:h-16 md:w-16',
      text: 'text-2xl md:text-4xl',
      icon: 'text-xl md:text-3xl',
    },
  }

  const currentSize = sizes[size]

  return (
    <Link
      href={href}
      className={cn(
        'group relative z-10 flex items-center gap-2 md:gap-3',
        className
      )}
      data-testid="logo"
      aria-label={t('common:aria.logo')}
    >
      <div
        className={cn(
          'relative overflow-hidden rounded-xl transition-transform duration-500 group-hover:scale-105',
          currentSize.box
        )}
      >
        <Image
          src="/logo.png"
          alt="Slovor Logo"
          fill
          sizes="(max-width: 768px) 36px, 44px"
          className="object-contain"
          priority
        />
      </div>
      {showText && (
        <span
          className={cn(
            'font-heading flex items-baseline font-bold tracking-tighter transition-colors',
            variant === 'white'
              ? 'text-white'
              : 'text-foreground group-hover:text-primary',
            currentSize.text
          )}
        >
          Slovor
          <span className="text-primary group-hover:animate-bounce-subtle">
            .
          </span>
        </span>
      )}
    </Link>
  )
}
