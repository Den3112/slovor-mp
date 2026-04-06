import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'

describe('Select Component', () => {
  it('renders correctly and opens content', async () => {
    render(
      <Select>
        <SelectTrigger aria-label="fruit-select">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Fruit</SelectLabel>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectSeparator />
            <SelectItem value="banana">Banana</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    )

    const trigger = screen.getByLabelText('fruit-select')
    expect(trigger).toBeDefined()

    // Open select
    fireEvent.click(trigger)

    // Radix portals content, so it should be in the body now
    expect(await screen.findByText('Apple')).toBeDefined()
    expect(screen.getByText('Fruit')).toBeDefined()
  })
})
