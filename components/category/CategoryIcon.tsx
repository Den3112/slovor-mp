
import {
    Car,
    Bike,
    Home,
    Smartphone,
    Shirt,
    Lamp,
    Trophy,
    Baby,
    Dog,
    Book,
    Music,
    Film,
    Sparkles,
    Gamepad2,
    Armchair,
    Flower2,
    Wrench,
    Utensils,
    Diamond,
    Briefcase,
    Palmtree,
    Ticket,
    Gift,
    Layers,
    LucideProps
} from 'lucide-react'

interface CategoryIconProps extends LucideProps {
    slug: string
}

export function CategoryIcon({ slug, ...props }: CategoryIconProps) {
    const iconMap: Record<string, any> = {
        'auto-moto': Car,
        'cars': Car,
        'motorcycles': Bike,
        'real-estate': Home,
        'apartments': Home,
        'houses': Home,
        'electronics': Smartphone,
        'phones': Smartphone,
        'laptops': Smartphone,
        'fashion': Shirt,
        'women-fashion': Shirt,
        'men-fashion': Shirt,
        'home-garden': Lamp,
        'furniture': Armchair,
        'garden': Flower2,
        'sport': Trophy,
        'cycling': Bike,
        'kids': Baby,
        'toys': Gamepad2,
        'pets': Dog,
        'books-education': Book,
        'music': Music,
        'movies': Film,
        'beauty-health': Sparkles,
        'tools': Wrench,
        'food': Utensils,
        'jewelry': Diamond,
        'business': Briefcase,
        'travel': Palmtree,
        'tickets': Ticket,
        'gifts': Gift,
    }

    const Icon = iconMap[slug] || Layers

    return <Icon {...props} />
}
