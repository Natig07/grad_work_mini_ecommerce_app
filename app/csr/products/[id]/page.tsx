'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Loader } from '@/components/Loader';
import type { Product } from '@/types/product';
import { ArrowLeft, ShoppingCart } from 'lucide-react';

interface PageProps {
  params: {
    id: string;
  };
}

export default function CSRProductPage({ params }: PageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        console.log('[CSR] Product fetch started at:', new Date().toISOString());
        const startTime = Date.now();

        const res = await fetch('/api/products');
        if (!res.ok) throw new Error('Failed to fetch products');

        const products = await res.json();
        const found = products.find((p: Product) => String(p.id) === params.id);

        if (!found) throw new Error('Product not found');

        setProduct(found);
        const endTime = Date.now();
        console.log(`[CSR] Product fetch completed in ${endTime - startTime}ms`);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Link href="/csr/products" className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </Link>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-800">Error: {error || 'Product not found'}</p>
          </div>
        </div>
      </div>
    );
  }

  const title = product.title || product.name || 'Product';
  const price = (product.priceCents || 0) / 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/csr/products" className="text-blue-600 hover:text-blue-800 mb-8 inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </Link>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="md:grid md:grid-cols-2 gap-8 p-8">
            <div>
              <img
                src={product.image}
                alt={title}
                className="w-full h-96 object-cover rounded-lg"
                loading="eager"
              />
            </div>

            <div>
              <div className="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold mb-4">
                CSR
              </div>
              <div className="text-sm text-gray-500 mb-2">{product.category}</div>
              <h1 className="text-4xl font-bold mb-4 text-gray-900">{title}</h1>

              <div className="mb-6">
                <div className="text-4xl font-bold text-gray-900">
                  ${price.toFixed(2)}
                </div>
                {product.rating && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-lg">★ {product.rating.stars.toFixed(1)}</span>
                    <span className="text-gray-500">Rating</span>
                  </div>
                )}
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Description</h3>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>

              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors">
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>

              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Client-Side Rendered (CSR)</strong>
                  <br />
                  This product was fetched in the browser after the page loaded.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
