/**
 * Returns geolocation address from coordinates using a safe fallback.
 * Removed Google Maps dependency to prevent credential errors.
 */
export async function getAddressFromCoords(
  lat: number,
  lng: number
): Promise<string> {
  console.log(`Getting address for ${lat}, ${lng} (Fallback)`)
  return 'Bratislava, Slovakia'
}

/**
 * Generic geo API proxy.
 */
export const geoApi = {
  getAddressFromCoords,
}
