'use client';

import type { Product } from '@/types/product';
import Link from 'next/link';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { useWishlist } from '@/hooks/use-wishlist';

interface ProductCardProps {
  product: Product;
  href?: string;
}

export function ProductCard({ product, href }: ProductCardProps) {
  const title = product.title || product.name || 'Untitled Product';
  const price = (product.priceCents || 0) / 100;
  const { addItem } = useCart();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(String(product.id));

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(
      String(product.id),
      title,
      product.image,
      product.priceCents,
      1
    );
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(String(product.id));
    } else {
      addToWishlist(
        String(product.id),
        title,
        product.image,
        product.priceCents
      );
    }
  };

  const content = (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col overflow-hidden border border-gray-100">
      <div className="relative h-56 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        <img
          src={product.image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          loading="lazy"
        />
        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110"
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              inWishlist
                ? 'fill-red-500 text-red-500'
                : 'text-gray-400 hover:text-red-500'
            }`}
          />
        </button>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
          {product.category}
        </div>
        <h3 className="text-sm font-semibold text-gray-900 mt-2 line-clamp-2 flex-grow">
          {title}
        </h3>
        <p className="text-xs text-gray-600 mt-1 line-clamp-1">{product.description}</p>
        <div className="flex items-center justify-between mt-4">
          <div className="text-lg font-bold text-gray-900">${price.toFixed(2)}</div>
          {product.rating && (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-semibold text-gray-700">
                {product.rating.stars.toFixed(1)}
              </span>
            </div>
          )}
        </div>
        <button
          onClick={handleAddToCart}
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 text-sm"
        >
          <ShoppingCart className="w-4 h-4" />
          Add to Cart
        </button>
      </div>
    </div>
  );

  if (href) {
    return <Link href={href} className="group">{content}</Link>;
  }

  return content;
}
