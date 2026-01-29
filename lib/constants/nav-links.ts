import {
  Home,
  Search,
  Grid3X3,
  MessageSquare,
  User,
  PlusCircle,
  Car,
  Home as RealEstate,
  Briefcase,
  Smartphone,
  HelpCircle,
  ShieldCheck,
  FileText,
  Shirt,
  Armchair,
  Hammer,
  Bike,
  Heart,
  Dog,
  ShoppingBag
} from 'lucide-react'

export const NAV_LINKS = {
  main: [
    { href: '/', label: 'nav.home', icon: Home },
    { href: '/listings', label: 'nav.search', icon: Search },
    { href: '/categories', label: 'nav.categories', icon: Grid3X3 },
  ],
  categories: [
    {
      id: 'transport',
      href: '/categories/transport',
      label: 'cat.transport',
      icon: Car,
      color: 'bg-blue-500',
      popularSubcategories: ['cars', 'motorcycles', 'parts', 'trucks']
    },
    {
      id: 'real-estate',
      href: '/categories/real-estate',
      label: 'cat.realEstate',
      icon: RealEstate,
      color: 'bg-emerald-500',
      popularSubcategories: ['rent', 'sale', 'new-projects', 'commercial']
    },
    {
      id: 'electronics',
      href: '/categories/electronics',
      label: 'cat.electronics',
      icon: Smartphone,
      color: 'bg-purple-500',
      popularSubcategories: ['smartphones', 'computers', 'tv-audio', 'cameras']
    },
    {
      id: 'home-garden',
      href: '/categories/home-garden',
      label: 'cat.homeGarden',
      icon: Armchair,
      color: 'bg-orange-500',
      popularSubcategories: ['furniture', 'appliances', 'garden', 'tools']
    },
    {
      id: 'fashion',
      href: '/categories/fashion',
      label: 'cat.fashion',
      icon: Shirt,
      color: 'bg-pink-500',
      popularSubcategories: ['clothing', 'shoes', 'accessories', 'kids']
    },
    {
      id: 'jobs',
      href: '/categories/jobs',
      label: 'cat.jobs',
      icon: Briefcase,
      color: 'bg-indigo-500',
      popularSubcategories: ['vacancies', 'resumes']
    },
    {
      id: 'services',
      href: '/categories/services',
      label: 'cat.services',
      icon: Hammer,
      color: 'bg-cyan-500',
      popularSubcategories: ['beauty', 'repairs', 'it', 'tuition']
    },
    {
      id: 'hobby-sport',
      href: '/categories/hobby-sport',
      label: 'cat.hobbySport',
      icon: Bike,
      color: 'bg-red-500',
      popularSubcategories: ['sport', 'books', 'music', 'tickets']
    },
    {
      id: 'pets',
      href: '/categories/pets',
      label: 'cat.pets',
      icon: Dog,
      color: 'bg-amber-500',
      popularSubcategories: ['cats', 'dogs', 'birds']
    },
    {
      id: 'other',
      href: '/categories/other',
      label: 'cat.other',
      icon: ShoppingBag,
      color: 'bg-slate-500'
    }
  ],
  user: [
    { href: '/messages', label: 'nav.messages', icon: MessageSquare },
    { href: '/profile/favorites', label: 'nav.favorites', icon: Heart },
    { href: '/profile', label: 'nav.profile', icon: User },
  ],
  action: {
    post: { href: '/post', label: 'nav.postAd', icon: PlusCircle }
  },
  footer: [
    { href: '/help', label: 'footer.help', icon: HelpCircle },
    { href: '/legal', label: 'footer.legal', icon: ShieldCheck },
    { href: '/blog', label: 'footer.blog', icon: FileText },
  ]
}
