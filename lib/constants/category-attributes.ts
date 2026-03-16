/**
 * Definitions for category-specific attributes and their filter types
 */

export type AttributeType = 'number' | 'select' | 'text' | 'range'

export interface AttributeDefinition {
  id: string
  label: Record<string, string> // Localization map: { en: 'Mileage', sk: 'Počet kilometrov' }
  type: AttributeType
  options?: { label: Record<string, string>; value: string }[] // For 'select' type
  unit?: string // e.g., 'km', 'm²', 'rooms'
}

export const CATEGORY_ATTRIBUTES: Record<string, AttributeDefinition[]> = {
  transport: [
    {
      id: 'mileage',
      label: { en: 'Mileage', sk: 'Počet kilometrov' },
      type: 'range',
      unit: 'km',
    },
    {
      id: 'year',
      label: { en: 'Year', sk: 'Rok výroby' },
      type: 'range',
    },
    {
      id: 'fuel',
      label: { en: 'Fuel Type', sk: 'Palivo' },
      type: 'select',
      options: [
        { label: { en: 'Petrol', sk: 'Benzín' }, value: 'petrol' },
        { label: { en: 'Diesel', sk: 'Nafta' }, value: 'diesel' },
        { label: { en: 'Electric', sk: 'Elektro' }, value: 'electric' },
        { label: { en: 'Hybrid', sk: 'Hybrid' }, value: 'hybrid' },
      ],
    },
  ],
  'real-estate': [
    {
      id: 'area',
      label: { en: 'Area', sk: 'Plocha' },
      type: 'range',
      unit: 'm²',
    },
    {
      id: 'rooms',
      label: { en: 'Rooms', sk: 'Izby' },
      type: 'select',
      options: [
        { label: { en: '1', sk: '1' }, value: '1' },
        { label: { en: '2', sk: '2' }, value: '2' },
        { label: { en: '3', sk: '3' }, value: '3' },
        { label: { en: '4+', sk: '4+' }, value: '4+' },
      ],
    },
  ],
  electronics: [
    {
      id: 'brand',
      label: { en: 'Brand', sk: 'Značka' },
      type: 'text',
    },
  ],
}

/**
 * Helper to get localized label for an attribute
 */
export function getAttributeLabel(
  attr: AttributeDefinition,
  locale: string = 'en'
): string {
  return attr.label[locale] || attr.label['en'] || ''
}
