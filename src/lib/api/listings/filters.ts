/**
 * Filtering options for listings
 */
export interface ListingFilterOptions {
  categoryId?: string
  categorySlug?: string
  search?: string
  limit?: number
  offset?: number
  page?: number
  priceMin?: number
  priceMax?: number
  condition?: 'new' | 'used'
  location?: string
  sort?: string
  isFeatured?: boolean
  attributes?: Record<string, any>
}

/**
 * Applies filters to listings query
 */
export function applyListingFilters(
  query: any,
  options?: ListingFilterOptions
) {
  if (!options) return query

  if (options.categoryId) {
    query = query.eq('category_id', options.categoryId)
  }

  if (options.categorySlug) {
    query = query.eq('category.slug', options.categorySlug)
  }

  if (options.search) {
    const s = options.search.trim()
    query = query.or(
      `title.ilike.%${s}%,description.ilike.%${s}%,title_sk.ilike.%${s}%,title_cs.ilike.%${s}%,title_en.ilike.%${s}%`
    )
  }

  if (options.priceMin !== undefined) {
    query = query.gte('price', options.priceMin)
  }

  if (options.priceMax !== undefined) {
    query = query.lte('price', options.priceMax)
  }

  if (options.condition) {
    query = query.eq('condition', options.condition)
  }

  if (options.location && options.location !== 'all') {
    query = query.ilike('location', `%${options.location}%`)
  }

  if (options.isFeatured !== undefined) {
    query = query.eq('is_highlighted', options.isFeatured)
  }

  // Handle dynamic attributes
  if (options.attributes) {
    Object.entries(options.attributes).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        // Handle range if value is object with min/max
        if (typeof value === 'object' && ('min' in value || 'max' in value)) {
          if (value.min !== undefined && value.min !== '') {
            query = query.gte(`attributes->>${key}`, value.min)
          }
          if (value.max !== undefined && value.max !== '') {
            query = query.lte(`attributes->>${key}`, value.max)
          }
        } else {
          query = query.eq(`attributes->>${key}`, value)
        }
      }
    })
  }

  return query
}

/**
 * Applies sorting to listings query
 */
export function applyListingSorting(query: any, sort?: string) {
  switch (sort) {
    case 'oldest':
      return query.order('created_at', { ascending: true })
    case 'price-low':
      return query.order('price', { ascending: true })
    case 'price-high':
      return query.order('price', { ascending: false })
    case 'views':
      return query.order('views_count', { ascending: false })
    case 'newest':
    default:
      return query.order('created_at', { ascending: false })
  }
}

/**
 * Applies pagination to listings query
 */
export function applyListingPagination(
  query: any,
  options?: { offset?: number; limit?: number; page?: number }
) {
  if (options?.offset !== undefined && options?.limit) {
    const from = options.offset
    const to = options.offset + options.limit - 1
    return query.range(from, to)
  }

  if (options?.page !== undefined && options?.limit) {
    const offset = (options.page - 1) * options.limit
    const from = offset
    const to = offset + options.limit - 1
    return query.range(from, to)
  }

  if (options?.limit) {
    return query.limit(options.limit)
  }

  return query
}
