export function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('sk-SK', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatPrice(amount: number, currency = 'EUR') {
  // Use appropriate locale for specific currencies
  const localeMap: Record<string, string> = {
    RUB: 'ru-RU',
    EUR: 'sk-SK',
    USD: 'en-US',
    GBP: 'en-GB',
    CZK: 'cs-CZ',
    PLN: 'pl-PL',
    UAH: 'uk-UA',
  }

  return new Intl.NumberFormat(localeMap[currency] || 'en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}
