// Category Icon Component
// Displays proper icon for each category based on slug

import { 
  Laptop, Car, Home, Shirt, TreePine, Dumbbell, Baby, Truck, Building, 
  Wrench, Dog, Palette, BookOpen, Music, Film, Sparkles, Gamepad2, 
  Armchair, Shovel, Hammer, Apple, Gem, Briefcase, Plane, Ticket, 
  Gift, Package
} from 'lucide-react'

interface CategoryIconProps {
  slug: string
  className?: string
}

export function CategoryIcon({ slug, className = 'w-6 h-6' }: CategoryIconProps) {
  const iconMap: Record<string, any> = {
    // Electronics (Elektronika)
    'electronics': Laptop,
    'elektronika': Laptop,
    'laptops': Laptop,
    'notebooky': Laptop,
    'phones': Laptop,
    'mobily': Laptop,
    
    // Fashion (Oblečenie)
    'fashion': Shirt,
    'oblecenie': Shirt,
    'women-fashion': Shirt,
    'damske-oblecenie': Shirt,
    'men-fashion': Shirt,
    'panske-oblecenie': Shirt,
    'clothing': Shirt,
    'shoes': Shirt,
    'obuv': Shirt,
    
    // Home & Garden (Dom a záhrada)
    'home-garden': Home,
    'dom-a-zahrada': Home,
    'furniture': Armchair,
    'nabytok': Armchair,
    'kitchen': Home,
    'kuchyna': Home,
    'garden': TreePine,
    'zahrada': TreePine,
    'garden-equipment': Shovel,
    'zahradna-technika': Shovel,
    
    // Sports (Šport)
    'sports': Dumbbell,
    'sport': Dumbbell,
    'sport-hobby': Dumbbell,
    'fitness': Dumbbell,
    'cycling': Dumbbell,
    'cyklistika': Dumbbell,
    'winter-sports': Dumbbell,
    
    // Kids & Baby (Detské potreby)
    'kids-baby': Baby,
    'kids-family': Baby,
    'pre-deti': Baby,
    'strollers': Baby,
    'kocariky': Baby,
    'clothes-kids': Baby,
    'toys': Gamepad2,
    'hracky': Gamepad2,
    'toys-games': Gamepad2,
    
    // Vehicles (Vozidlá)
    'vehicles': Car,
    'vozidla': Car,
    'cars': Car,
    'auta': Car,
    'motorcycles': Car,
    'motorky': Car,
    'autoparts': Wrench,
    
    // Real Estate (Nehnuteľnosti)
    'real-estate': Building,
    'nehnutelnosti': Building,
    'apartments': Building,
    'byty': Building,
    'houses': Home,
    'domy': Home,
    'land': Building,
    'pozemky': Building,
    'commercial': Building,
    
    // Services (Služby)
    'services': Wrench,
    'sluzby': Wrench,
    'jobs-services': Wrench,
    'transport-services': Truck,
    'preprava': Truck,
    'craftsmen': Hammer,
    'remeselnici': Hammer,
    'tutoring': BookOpen,
    'doucovanie': BookOpen,
    'tools-machinery': Hammer,
    'naradie-a-stroje': Hammer,
    
    // Pets (Zvieratá)
    'pets': Dog,
    'zvierata': Dog,
    'dogs': Dog,
    'psy': Dog,
    'cats': Dog,
    'macky': Dog,
    
    // Hobbies (Hobby)
    'hobbies': Palette,
    'hobby': Palette,
    
    // Books & Magazines (Knihy a časopisy)
    'books-magazines': BookOpen,
    'knihy-casopisy': BookOpen,
    'books': BookOpen,
    'knihy': BookOpen,
    'books-education': BookOpen,
    
    // Musical Instruments (Hudobné nástroje)
    'music-instruments': Music,
    'hudobne-nastroje': Music,
    'audio': Music,
    
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
    'praca': Briefcase,
    
    // Travel (Cestovanie)
    'travel': Plane,
    'cestovanie': Plane,
    
    // Tickets & Events (Vstupenky)
    'tickets-events': Ticket,
    'vstupenky': Ticket,
    
    // Gifts (Darčeky)
    'gifts': Gift,
    'darcеky': Gift,
    
    // Other (Ostatné)
    'other': Package,
    'ostatne': Package,
    'moda': Shirt,
    'cameras': Laptop,
    'fotoaparaty': Laptop,
  }

  const Icon = iconMap[slug] || Package
  return <Icon className={className} />
}
