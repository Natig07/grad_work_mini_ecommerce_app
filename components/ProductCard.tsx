'use client';

import type { Product } from '@/types/product';
import Link from 'next/link';
import { ArrowRight, Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  href?: string;
}

export function ProductCard({ product, href }: ProductCardProps) {
  const title = product.title || product.name || 'Untitled Product';
  const price = (product.priceCents || 0) / 100;

  const content = (
    <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(15,23,42,0.08)] border border-slate-200 h-full overflow-hidden transition hover:-translate-y-1 duration-300">
      <div className="relative h-56 overflow-hidden bg-slate-100">
        <img
          src={product.image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-x-0 bottom-0 bg-slate-950/70 px-3 py-2 text-xs text-slate-100">
          {product.category}
        </div>
      </div>

      <div className="p-5 flex flex-col h-full">
        <h3 className="text-base font-semibold text-slate-900 line-clamp-2">{title}</h3>
        <p className="text-sm text-slate-500 mt-2 line-clamp-2">{product.description}</p>

        <div className="mt-5 flex items-center justify-between gap-3">
          <div>
            <p className="text-2xl font-semibold text-slate-900">${price.toFixed(2)}</p>
          </div>
          {product.rating && (
            <div className="flex items-center gap-1 text-slate-500">
              <Star className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-semibold">{product.rating.stars.toFixed(1)}</span>
            </div>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between text-sm font-semibold text-cyan-600">
          <span>Inspect details</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );

  if (href) {
    return <Link href={href} className="group">{content}</Link>;
  }

  return content;
}
