// Category Icon Mappings
// Principle #1: Keep components small by extracting large data structures
// Principle #3: Single source of truth for category-to-icon mappings

import type { LucideIcon } from 'lucide-react'
import {
  Laptop,
  Smartphone,
  Car,
  Home,
  Shirt,
  TreePine,
  Dumbbell,
  Baby,
  Truck,
  Building,
  Wrench,
  Dog,
  Palette,
  BookOpen,
  Music,
  Film,
  Sparkles,
  Gamepad2,
  Armchair,
  Shovel,
  Hammer,
  Gem,
  Briefcase,
  Plane,
  Ticket,
  Gift,
  Package,
  Layers,
  ShoppingBag,
  Bike,
} from 'lucide-react'

/**
 * Maps category slugs to Lucide icons
 * Used by: CategoryIcon, CategoryCard components
 * Supports: Slovak, Czech, English category slugs
 */
export const CATEGORY_ICON_MAP: Record<string, LucideIcon> = {
  // Electronics (Elektronika)
  electronics: Laptop,
  elektronika: Laptop,
  laptops: Laptop,
  notebooky: Laptop,
  phones: Smartphone,
  mobily: Smartphone,
  cameras: Laptop,
  fotoaparaty: Laptop,

  // Fashion (Oblečenie)
  fashion: Shirt,
  oblecenie: Shirt,
  'women-fashion': Shirt,
  'damske-oblecenie': Shirt,
  'men-fashion': Shirt,
  'panske-oblecenie': Shirt,
  clothing: Shirt,
  shoes: Shirt,
  obuv: Shirt,
  moda: Shirt,

  // Home & Garden (Dom a záhrada)
  'home-garden': Home,
  'dom-a-zahrada': Home,
  furniture: Armchair,
  nabytok: Armchair,
  kitchen: Home,
  kuchyna: Home,
  garden: TreePine,
  zahrada: TreePine,
  'garden-equipment': Shovel,
  'zahradna-technika': Shovel,

  // Sports (Šport)
  sports: Dumbbell,
  sport: Dumbbell,
  'sport-hobby': Dumbbell,
  fitness: Dumbbell,
  cycling: Bike,
  cyklistika: Bike,
  'winter-sports': Dumbbell,

  // Kids & Baby (Detské potreby)
  'kids-baby': Baby,
  'kids-family': Baby,
  'pre-deti': Baby,
  strollers: Baby,
  kocariky: Baby,
  'clothes-kids': Baby,
  toys: Gamepad2,
  hracky: Gamepad2,
  'toys-games': Gamepad2,

  // Vehicles (Vozidlá)
  vehicles: Car,
  vozidla: Car,
  cars: Car,
  auta: Car,
  motorcycles: Bike,
  motorky: Bike,
  autoparts: Wrench,

  // Real Estate (Nehnuteľnosti)
  'real-estate': Building,
  nehnutelnosti: Building,
  apartments: Building,
  byty: Building,
  houses: Home,
  domy: Home,
  land: Building,
  pozemky: Building,
  commercial: Building,

  // Services (Služby)
  services: Wrench,
  sluzby: Wrench,
  'jobs-services': Wrench,
  'transport-services': Truck,
  preprava: Truck,
  craftsmen: Hammer,
  remeselnici: Hammer,
  tutoring: BookOpen,
  doucovanie: BookOpen,
  'tools-machinery': Hammer,
  'naradie-a-stroje': Hammer,

  // Pets (Zvieratá)
  pets: Dog,
  zvierata: Dog,
  dogs: Dog,
  psy: Dog,
  cats: Dog,
  macky: Dog,

  // Hobbies (Hobby)
  hobbies: Palette,
  hobby: Palette,

  // Books & Magazines (Knihy a časopisy)
  'books-magazines': BookOpen,
  'knihy-casopisy': BookOpen,
  books: BookOpen,
  knihy: BookOpen,
  'books-education': BookOpen,

  // Musical Instruments (Hudobné nástroje)
  'music-instruments': Music,
  'hudobne-nastroje': Music,
  audio: Music,

  // Movies & Music (Filmy a hudba)
  'movies-music': Film,
  'filmy-hudba': Film,

  // Beauty & Health (Krása a zdravie)
  'beauty-health': Sparkles,
  'krasa-zdravie': Sparkles,

  // Jewelry & Watches (Šperky a hodinky)
  'jewelry-watches': Gem,
  'sperky-hodinky': Gem,

  // Business & Industrial (Biznis a priemysel)
  'business-industrial': Briefcase,
  'biznis-priemysel': Briefcase,
  praca: Briefcase,

  // Travel (Cestovanie)
  travel: Plane,
  cestovanie: Plane,

  // Tickets & Events (Vstupenky)
  'tickets-events': Ticket,
  vstupenky: Ticket,

  // Gifts (Darčeky)
  gifts: Gift,
  darčeky: Gift,

  // Other (Ostatné)
  other: Package,
  ostatne: Package,
} as const

/**
 * Premium CRM-style color schemes (Soft Tints & High Contrast)
 */
export const CATEGORY_COLOR_MAP: Record<string, string> = {
  // Indigo / Blue (Default Tech/Business)
  electronics:
    'bg-indigo-50/80 text-indigo-600 border-indigo-100/50 hover:bg-indigo-100',
  elektronika:
    'bg-indigo-50/80 text-indigo-600 border-indigo-100/50 hover:bg-indigo-100',
  laptops:
    'bg-indigo-50/80 text-indigo-600 border-indigo-100/50 hover:bg-indigo-100',
  phones:
    'bg-indigo-50/80 text-indigo-600 border-indigo-100/50 hover:bg-indigo-100',

  // Rose / Pink (Fashion/Beauty)
  fashion: 'bg-rose-50/80 text-rose-600 border-rose-100/50 hover:bg-rose-100',
  oblecenie: 'bg-rose-50/80 text-rose-600 border-rose-100/50 hover:bg-rose-100',
  moda: 'bg-rose-50/80 text-rose-600 border-rose-100/50 hover:bg-rose-100',
  'beauty-health':
    'bg-pink-50/80 text-pink-600 border-pink-100/50 hover:bg-pink-100',

  // Emerald / Green (Home/Nature)
  'home-garden':
    'bg-emerald-50/80 text-emerald-600 border-emerald-100/50 hover:bg-emerald-100',
  'dom-a-zahrada':
    'bg-emerald-50/80 text-emerald-600 border-emerald-100/50 hover:bg-emerald-100',
  garden:
    'bg-emerald-50/80 text-emerald-600 border-emerald-100/50 hover:bg-emerald-100',

  // Orange / Amber (Sports/Energy)
  sports:
    'bg-orange-50/80 text-orange-600 border-orange-100/50 hover:bg-orange-100',
  sport:
    'bg-orange-50/80 text-orange-600 border-orange-100/50 hover:bg-orange-100',

  // Sky / Blue (Travel/Vehicles)
  travel: 'bg-sky-50/80 text-sky-600 border-sky-100/50 hover:bg-sky-100',
  vehicles: 'bg-sky-50/80 text-sky-600 border-sky-100/50 hover:bg-sky-100',
  vozidla: 'bg-sky-50/80 text-sky-600 border-sky-100/50 hover:bg-sky-100',

  // Violet / Purple (Real Estate/Kids)
  'real-estate':
    'bg-violet-50/80 text-violet-600 border-violet-100/50 hover:bg-violet-100',
  nehnutelnosti:
    'bg-violet-50/80 text-violet-600 border-violet-100/50 hover:bg-violet-100',
  'kids-baby':
    'bg-violet-50/80 text-violet-600 border-violet-100/50 hover:bg-violet-100',

  // Amber / Yellow (Services/Jobs)
  services:
    'bg-amber-50/80 text-amber-600 border-amber-100/50 hover:bg-amber-100',
  sluzby:
    'bg-amber-50/80 text-amber-600 border-amber-100/50 hover:bg-amber-100',

  default:
    'bg-slate-50/80 text-slate-600 border-slate-100/50 hover:bg-slate-100',
} as const

export function getCategoryColors(slug: string): string {
  return (CATEGORY_COLOR_MAP as any)[slug] || CATEGORY_COLOR_MAP.default
}

/**
 * Default fallback icon for unknown categories
 */
export const DEFAULT_CATEGORY_ICON = Package

/**
 * List of available icon names for UI selection
 * These are keys from the CATEGORY_ICON_MAP or other valid Lucide icons
 */
export const AVAILABLE_ICON_NAMES = [
  'Laptop',
  'Smartphone',
  'Car',
  'Home',
  'Shirt',
  'TreePine',
  'Dumbbell',
  'Baby',
  'Truck',
  'Building',
  'Wrench',
  'Dog',
  'Palette',
  'BookOpen',
  'Music',
  'Film',
  'Sparkles',
  'Gamepad2',
  'Armchair',
  'Shovel',
  'Hammer',
  'Gem',
  'Briefcase',
  'Plane',
  'Ticket',
  'Gift',
  'Package',
  'Layers',
  'ShoppingBag',
  'Bike',
] as const

/**
 * Maps icon name strings to Lucide components
 * Useful for dynamic rendering from database values
 */
export const ICON_NAME_MAP: Record<string, LucideIcon> = {
  Laptop,
  Smartphone,
  Car,
  Home,
  Shirt,
  TreePine,
  Dumbbell,
  Baby,
  Truck,
  Building,
  Wrench,
  Dog,
  Palette,
  BookOpen,
  Music,
  Film,
  Sparkles,
  Gamepad2,
  Armchair,
  Shovel,
  Hammer,
  Gem,
  Briefcase,
  Plane,
  Ticket,
  Gift,
  Package,
  Layers,
  ShoppingBag,
  Bike,
}

/**
 * Case-insensitive map for icon names
 */
const CASE_INSENSITIVE_MAP = Object.entries(ICON_NAME_MAP).reduce(
  (acc, [name, icon]) => {
    acc[name.toLowerCase()] = icon
    return acc
  },
  {} as Record<string, LucideIcon>
)

/**
 * Gets icon for category slug or icon name with fallback
 * @param identifier - Category slug or Icon name (case-insensitive)
 * @returns LucideIcon component
 */
export function getCategoryIcon(identifier: string): LucideIcon {
  if (!identifier) return DEFAULT_CATEGORY_ICON

  // 1. Try slug map (exact match)
  if (CATEGORY_ICON_MAP[identifier]) return CATEGORY_ICON_MAP[identifier]

  // 2. Try case-insensitive icon name map
  const lowerIdentifier = identifier.toLowerCase()
  if (CASE_INSENSITIVE_MAP[lowerIdentifier])
    return CASE_INSENSITIVE_MAP[lowerIdentifier]

  // 3. Fallback
  return DEFAULT_CATEGORY_ICON
}

/**
 * Gets specific icon by name (case-insensitive)
 */
export function getIconByName(name: string): LucideIcon | null {
  if (!name) return null
  return CASE_INSENSITIVE_MAP[name.toLowerCase()] || null
}
