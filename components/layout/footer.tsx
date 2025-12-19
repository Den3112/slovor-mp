import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t bg-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-lg font-bold text-blue-600 mb-3">🏪 Slovor</h3>
            <p className="text-sm text-gray-600">
              Modern marketplace for buying and selling goods and services.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-600 hover:text-blue-600">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/listings" className="text-gray-600 hover:text-blue-600">
                  All Listings
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">Categories</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/categories/electronics" className="text-gray-600 hover:text-blue-600">
                  Electronics
                </Link>
              </li>
              <li>
                <Link href="/categories/vehicles" className="text-gray-600 hover:text-blue-600">
                  Vehicles
                </Link>
              </li>
              <li>
                <Link href="/categories/real-estate" className="text-gray-600 hover:text-blue-600">
                  Real Estate
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-6 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Slovor Marketplace. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
