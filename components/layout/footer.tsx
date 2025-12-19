export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Slovor. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
