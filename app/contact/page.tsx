import { Mail, MapPin, Phone } from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Contact Us</h1>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Email</h3>
              <p className="text-gray-600">info@slovor.sk</p>
              <p className="text-gray-600">support@slovor.sk</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Phone className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Phone</h3>
              <p className="text-gray-600">+421 2 123 456 78</p>
              <p className="text-sm text-gray-500">Mon-Fri: 9:00 - 17:00</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <MapPin className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Office</h3>
              <p className="text-gray-600">
                Slovor Marketplace s.r.o.<br />
                Námestie slobody 1<br />
                811 06 Bratislava
              </p>
            </div>
          </div>
        </div>

        <form className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <h2 className="text-xl font-bold mb-4">Send us a message</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          </div>

          <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium">
            Send Message
          </button>
        </form>
      </div>
    </div>
  )
}
