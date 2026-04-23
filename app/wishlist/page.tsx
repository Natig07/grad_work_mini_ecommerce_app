'use client';

import { useWishlist } from '@/hooks/use-wishlist';
import { ProductCard } from '@/components/ProductCard';
import Link from 'next/link';
import { Heart } from 'lucide-react';

export default function WishlistPage() {
  const { items } = useWishlist();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Wishlist</h1>
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">Your wishlist is empty</p>
            <Link
              href="/csr/products"
              className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Wishlist</h1>
        <p className="text-gray-600 mb-8">{items.length} item(s) in your wishlist</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <ProductCard
              key={item.id}
              product={{
                id: item.productId,
                title: item.productName,
                name: item.productName,
                description: '',
                priceCents: item.productPriceCents,
                image: item.productImage,
                category: 'Wishlist',
              }}
              href={`/csr/products/${item.productId}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
