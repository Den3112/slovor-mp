import {
  Home,
  Search,
  MessageSquare,
  User,
  PlusCircle,
  Car,
  Smartphone,
  House,
  Briefcase,
  Monitor,
  ShoppingBag,
  Bike,
  Gamepad2,
} from 'lucide-react'

export const NAVIGATION = {
  main: [
    { label: 'Domov', href: '/', icon: Home },
    { label: 'Hľadať', href: '/search', icon: Search },
    {
      label: 'Pridať inzerát',
      href: '/predaj',
      icon: PlusCircle,
      highlight: true,
    },
    { label: 'Správy', href: '/chat', icon: MessageSquare },
    { label: 'Profil', href: '/profile', icon: User },
  ],
  footer: [
    { label: 'O nás', href: '/o-nas' },
    { label: 'Podmienky', href: '/podmienky' },
    { label: 'Ochrana údajov', href: '/ochrana-udajov' },
    { label: 'Kontakt', href: '/kontakt' },
  ],
}

export const CATEGORIES = [
  { id: 'auto', label: 'Auto & Moto', icon: Car, color: '#3B82F6' },
  { id: 'elektro', label: 'Elektro', icon: Smartphone, color: '#6366F1' },
  {
    id: 'nehnutelnosti',
    label: 'Nehnuteľnosti',
    icon: House,
    color: '#F59E0B',
  },
  { id: 'praca', label: 'Práca', icon: Briefcase, color: '#10B981' },
  { id: 'pc', label: 'PC & Hry', icon: Monitor, color: '#8B5CF6' },
  { id: 'moda', label: 'Móda', icon: ShoppingBag, color: '#EC4899' },
  { id: 'sport', label: 'Šport', icon: Bike, color: '#06B6D4' },
  { id: 'hobby', label: 'Hobby', icon: Gamepad2, color: '#F97316' },
]

export const REGIONS = [
  { id: 'ba', label: 'Bratislavský kraj' },
  { id: 'tt', label: 'Trnavský kraj' },
  { id: 'tn', label: 'Trenčiansky kraj' },
  { id: 'nr', label: 'Nitriansky kraj' },
  { id: 'za', label: 'Žilinský kraj' },
  { id: 'bb', label: 'Banskobystrický kraj' },
  { id: 'po', label: 'Prešovský kraj' },
  { id: 'ke', label: 'Košický kraj' },
]
