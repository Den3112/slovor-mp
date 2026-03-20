'use client'

import * as React from 'react'
import { Drawer as VaulDrawer } from 'vaul'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useMediaQuery } from '@/lib/hooks/use-media-query'
import { cn } from '@/lib/utils'

interface ResponsiveDialogProps {
  children: React.ReactNode
  trigger?: React.ReactNode
  title?: string
  description?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
  contentClassName?: string
}

export function ResponsiveDialog({
  children,
  trigger,
  title,
  description,
  open,
  onOpenChange,
  contentClassName,
}: ResponsiveDialogProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
        <DialogContent className={cn('sm:max-w-[425px]', contentClassName)}>
          <DialogHeader>
            {title && <DialogTitle>{title}</DialogTitle>}
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>
          <div className="py-4">{children}</div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <VaulDrawer.Root open={open} onOpenChange={onOpenChange}>
      {trigger && <VaulDrawer.Trigger asChild>{trigger}</VaulDrawer.Trigger>}
      <VaulDrawer.Portal>
        <VaulDrawer.Overlay className="fixed inset-0 z-50 bg-black/80" />
        <VaulDrawer.Content className="bg-background fixed inset-x-0 bottom-0 z-50 flex h-auto flex-col rounded-t-3xl border outline-hidden">
          <div className="bg-muted mx-auto mt-4 h-2 w-[100px] rounded-full" />
          <div className="p-6">
            <VaulDrawer.Title className="text-lg font-bold tracking-tight">
              {title}
            </VaulDrawer.Title>
            {description && (
              <VaulDrawer.Description className="text-muted-foreground mt-1 text-sm">
                {description}
              </VaulDrawer.Description>
            )}
            <div className="mt-8 pb-8">{children}</div>
          </div>
        </VaulDrawer.Content>
      </VaulDrawer.Portal>
    </VaulDrawer.Root>
  )
}
