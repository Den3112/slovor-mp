// Category Icon Mappings
// Principle #1: Keep components small by extracting large data structures
// Principle #3: Single source of truth for category-to-icon mappings

import type { LucideIcon } from 'lucide-react'
import {
  Laptop,
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
  phones: Laptop,
  mobily: Laptop,
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
  cycling: Dumbbell,
  cyklistika: Dumbbell,
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
  motorcycles: Car,
  motorky: Car,
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
 * Default fallback icon for unknown categories
 */
export const DEFAULT_CATEGORY_ICON = Package

/**
 * Gets icon for category slug with fallback
 * @param slug - Category slug
 * @returns LucideIcon component
 */
export function getCategoryIcon(slug: string): LucideIcon {
  return CATEGORY_ICON_MAP[slug] || DEFAULT_CATEGORY_ICON
}
