import Link from 'next/link';
import { ShoppingCart, TrendingUp, Zap, Server, Clock } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            StoreFront
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Full-featured e-commerce demo showcasing modern rendering strategies
          </p>
          <p className="text-gray-500 mb-8">
            Compare CSR, SSR, and Edge rendering in a production-like application
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Link
            href="/csr/products"
            className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-8 border border-gray-200"
          >
            <div className="p-3 bg-yellow-100 rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform">
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Client-Side Rendering</h2>
            <p className="text-gray-600 mb-4">Data fetched in browser using React hooks</p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>✓ Fast on repeat visits</li>
              <li>✓ Full client interactivity</li>
              <li>✗ Slower first load</li>
            </ul>
          </Link>

          <Link
            href="/ssr/products"
            className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-8 border border-gray-200"
          >
            <div className="p-3 bg-green-100 rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform">
              <Server className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Server-Side Rendering</h2>
            <p className="text-gray-600 mb-4">Data fetched on server before HTML</p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>✓ Fast first load</li>
              <li>✓ Excellent SEO</li>
              <li>✗ Server overhead</li>
            </ul>
          </Link>

          <Link
            href="/edge/products"
            className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-8 border border-gray-200"
          >
            <div className="p-3 bg-blue-100 rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform">
              <Zap className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Edge Rendering</h2>
            <p className="text-gray-600 mb-4">Rendered closest to users globally</p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>✓ Fastest TTFB</li>
              <li>✓ Global distribution</li>
              <li>✓ Reduced latency</li>
            </ul>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Link
            href="/metrics"
            className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all p-6 border border-gray-200"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-purple-600">Performance Metrics</h3>
                <p className="text-sm text-gray-600">Compare rendering strategies</p>
              </div>
            </div>
          </Link>

          <Link
            href="/cart"
            className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all p-6 border border-gray-200"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-orange-600">Shopping Cart</h3>
                <p className="text-sm text-gray-600">View and manage items</p>
              </div>
            </div>
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex gap-3">
              <span className="text-blue-600 font-bold">✓</span>
              <div>
                <p className="font-semibold text-gray-900">Shopping Cart</p>
                <p className="text-sm text-gray-600">Add/remove items, persist across sessions</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-blue-600 font-bold">✓</span>
              <div>
                <p className="font-semibold text-gray-900">Wishlist</p>
                <p className="text-sm text-gray-600">Save favorite items for later</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-blue-600 font-bold">✓</span>
              <div>
                <p className="font-semibold text-gray-900">Search & Filter</p>
                <p className="text-sm text-gray-600">Find products by category and price</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-blue-600 font-bold">✓</span>
              <div>
                <p className="font-semibold text-gray-900">Authentication</p>
                <p className="text-sm text-gray-600">Secure sign up and login</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-blue-600 font-bold">✓</span>
              <div>
                <p className="font-semibold text-gray-900">Pagination</p>
                <p className="text-sm text-gray-600">Browse products efficiently</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-blue-600 font-bold">✓</span>
              <div>
                <p className="font-semibold text-gray-900">Responsive Design</p>
                <p className="text-sm text-gray-600">Works on all devices</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
