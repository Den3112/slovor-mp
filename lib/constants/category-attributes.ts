/**
 * Definitions for category-specific attributes and their filter types
 */

export type AttributeType = 'number' | 'select' | 'text' | 'range'

export interface AttributeDefinition {
    id: string
    label: Record<string, string> // Localization map: { en: 'Mileage', sk: 'Počet kilometrov', ru: 'Пробег' }
    type: AttributeType
    options?: { label: Record<string, string>; value: string }[] // For 'select' type
    unit?: string // e.g., 'km', 'm²', 'rooms'
}

export const CATEGORY_ATTRIBUTES: Record<string, AttributeDefinition[]> = {
    transport: [
        {
            id: 'mileage',
            label: { en: 'Mileage', sk: 'Počet kilometrov', ru: 'Пробег' },
            type: 'range',
            unit: 'km',
        },
        {
            id: 'year',
            label: { en: 'Year', sk: 'Rok výroby', ru: 'Год выпуска' },
            type: 'range',
        },
        {
            id: 'fuel',
            label: { en: 'Fuel Type', sk: 'Palivo', ru: 'Тип топлива' },
            type: 'select',
            options: [
                { label: { en: 'Petrol', sk: 'Benzín', ru: 'Бензин' }, value: 'petrol' },
                { label: { en: 'Diesel', sk: 'Nafta', ru: 'Дизель' }, value: 'diesel' },
                { label: { en: 'Electric', sk: 'Elektro', ru: 'Электро' }, value: 'electric' },
                { label: { en: 'Hybrid', sk: 'Hybrid', ru: 'Гибрид' }, value: 'hybrid' },
            ],
        },
    ],
    'real-estate': [
        {
            id: 'area',
            label: { en: 'Area', sk: 'Plocha', ru: 'Площадь' },
            type: 'range',
            unit: 'm²',
        },
        {
            id: 'rooms',
            label: { en: 'Rooms', sk: 'Izby', ru: 'Комнат' },
            type: 'select',
            options: [
                { label: { en: '1', sk: '1', ru: '1' }, value: '1' },
                { label: { en: '2', sk: '2', ru: '2' }, value: '2' },
                { label: { en: '3', sk: '3', ru: '3' }, value: '3' },
                { label: { en: '4+', sk: '4+', ru: '4+' }, value: '4+' },
            ],
        },
    ],
    electronics: [
        {
            id: 'brand',
            label: { en: 'Brand', sk: 'Značka', ru: 'Бренд' },
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
