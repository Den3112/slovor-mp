export type Locale = 'en' | 'sk' | 'cs'

export interface Translations {
    common: {
        search: string
        searchPlaceholder: string
        categories: string
        subcategories: string
        allListings: string
        home: string
        login: string
        register: string
        postAd: string
        postAdFree: string
        viewAll: string
        listings: string
        found: string
        loading: string
        error: string
        tryAgain: string
    }
    home: {
        heroTitle: string
        heroSubtitle: string
        searchPlaceholder: string
        popularSearches: string
        categoriesTitle: string
        featuredListings: string
        ctaTitle: string
        ctaSubtitle: string
    }
    trust: {
        secure: string
        fast: string
        free: string
        local: string
    }
    footer: {
        about: string
        contact: string
        terms: string
        privacy: string
        faq: string
        social: string
        rights: string
        quickLinks: string
        information: string
        description: string
        copyright: string
    }
    filters: {
        title: string
        priceRange: string
        apply: string
        clear: string
        sortBy: string
        newest: string
        oldest: string
        priceLow: string
        priceHigh: string
    }
    categories: Record<string, string>
}
