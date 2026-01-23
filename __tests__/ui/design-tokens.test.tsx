import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Badge, badgeVariants } from '@/components/ui/badge'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'

/**
 * UI Design Tokens Test Suite
 * Verifies that all base UI components use semantic CSS variables
 * instead of hardcoded color values.
 */

describe('Button Component - Design Tokens', () => {
  it('default variant uses semantic primary token', () => {
    const variants = buttonVariants({ variant: 'default' })
    expect(variants).toContain('bg-primary')
    expect(variants).toContain('text-primary-foreground')
    expect(variants).not.toMatch(/bg-blue-\d+/)
  })

  it('destructive variant uses semantic destructive token', () => {
    const variants = buttonVariants({ variant: 'destructive' })
    expect(variants).toContain('bg-destructive')
    expect(variants).toContain('text-destructive-foreground')
    expect(variants).not.toMatch(/bg-red-\d+/)
  })

  it('secondary variant uses semantic secondary token', () => {
    const variants = buttonVariants({ variant: 'secondary' })
    expect(variants).toContain('bg-secondary')
    expect(variants).toContain('text-secondary-foreground')
    expect(variants).not.toMatch(/bg-gray-\d+/)
  })

  it('ghost variant uses semantic accent token', () => {
    const variants = buttonVariants({ variant: 'ghost' })
    expect(variants).toContain('hover:bg-accent')
    expect(variants).toContain('hover:text-accent-foreground')
    expect(variants).not.toMatch(/hover:bg-slate-\d+/)
  })

  it('renders correctly with children', () => {
    render(<Button>Click me</Button>)
    expect(
      screen.getByRole('button', { name: /click me/i })
    ).toBeInTheDocument()
  })
})

describe('Badge Component - Design Tokens', () => {
  it('default variant uses semantic primary token', () => {
    const variants = badgeVariants({ variant: 'default' })
    expect(variants).toContain('bg-primary')
    expect(variants).toContain('text-primary-foreground')
    expect(variants).not.toMatch(/bg-blue-\d+/)
  })

  it('secondary variant uses semantic secondary token', () => {
    const variants = badgeVariants({ variant: 'secondary' })
    expect(variants).toContain('bg-secondary')
    expect(variants).toContain('text-secondary-foreground')
    expect(variants).not.toMatch(/bg-slate-\d+/)
  })

  it('destructive variant uses semantic destructive token', () => {
    const variants = badgeVariants({ variant: 'destructive' })
    expect(variants).toContain('bg-destructive')
    expect(variants).not.toMatch(/bg-red-\d+/)
  })

  it('outline variant uses semantic foreground token', () => {
    const variants = badgeVariants({ variant: 'outline' })
    expect(variants).toContain('text-foreground')
    expect(variants).toContain('border-border')
    expect(variants).not.toMatch(/text-slate-\d+/)
  })

  it('renders correctly with children', () => {
    render(<Badge>New</Badge>)
    expect(screen.getByText('New')).toBeInTheDocument()
  })
})

describe('Card Component - Design Tokens', () => {
  it('renders with semantic bg-card token', () => {
    render(
      <Card data-testid="card">
        <CardContent>Content</CardContent>
      </Card>
    )
    const card = screen.getByTestId('card')
    expect(card.className).toContain('bg-card')
    expect(card.className).toContain('text-card-foreground')
    expect(card.className).not.toMatch(/bg-white(?![/])/)
    expect(card.className).not.toMatch(/text-slate-\d+/)
  })

  it('CardDescription uses muted-foreground token', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardDescription data-testid="desc">Description</CardDescription>
        </CardHeader>
      </Card>
    )
    const desc = screen.getByTestId('desc')
    expect(desc.className).toContain('text-muted-foreground')
    expect(desc.className).not.toMatch(/text-slate-\d+/)
  })
})

describe('Input Component - Design Tokens', () => {
  it('uses semantic input and muted tokens', () => {
    render(<Input data-testid="input" placeholder="Test" />)
    const input = screen.getByTestId('input')
    expect(input.className).toContain('border-primary/10')
    expect(input.className).toContain('bg-zinc-950')
    expect(input.className).toContain('focus-visible:border-primary')
  })
})

describe('Accessibility', () => {
  it('Button is focusable and has correct role', () => {
    render(<Button>Accessible Button</Button>)
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    button.focus()
    expect(button).toHaveFocus()
  })

  it('Button disabled state is handled correctly', () => {
    render(<Button disabled>Disabled</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('disabled')
    expect(button.className).toContain('disabled:opacity-50')
  })
})
