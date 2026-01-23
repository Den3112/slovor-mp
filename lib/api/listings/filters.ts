import type { ListingFilterOptions } from '../listings'

/**
 * Applies filters to listings query
 */
export function applyListingFilters(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    query = query.eq('featured', options.isFeatured)
  }

  return query
}

/**
 * Applies sorting to listings query
 */
export function applyListingSorting(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: any,
  sort?: string
) {
  switch (sort) {
    case 'oldest':
      return query.order('created_at', { ascending: true })
    case 'price-low':
      return query.order('price', { ascending: true })
    case 'price-high':
      return query.order('price', { ascending: false })
    case 'views':
      return query.order('views', { ascending: false })
    case 'newest':
    default:
      return query.order('created_at', { ascending: false })
  }
}

/**
 * Applies pagination to listings query
 */
export function applyListingPagination(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
