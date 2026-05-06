import Link from 'next/link';
import type { Product } from '@/types/product';
import { ArrowLeft, ShoppingCart } from 'lucide-react';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

interface PageProps {
  params: {
    id: string;
  };
}

async function getProduct(id: string): Promise<Product | null> {
  try {
    const res = await fetch(`https://dummyjson.com/products/${id}`, {
      cache: 'no-store',
    });

    if (!res.ok) return null;

    const p = await res.json();

    return {
      id: p.id,
      name: p.title,
      title: p.title,
      description: p.description ?? '',
      priceCents: Math.round((p.price ?? 0) * 100),
      image: p.thumbnail ?? p.image ?? '',
      category: p.category ?? 'General',
      subCategory: p.brand ?? '',
      keywords: p.tags ?? [],
      rating: p.rating ? { stars: p.rating, count: p.stock ?? 0 } : undefined,
    };
  } catch (error) {
    console.error('[EDGE] Error fetching product:', error);
    return null;
  }
}

export default async function EdgeProductPage({ params }: PageProps) {
  const product = await getProduct(params.id);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Link href="/edge/products" className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </Link>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-800">Product not found</p>
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
        <Link href="/edge/products" className="text-blue-600 hover:text-blue-800 mb-8 inline-flex items-center gap-2">
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
              <div className="inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold mb-4">
                EDGE
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

              <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <p className="text-sm text-purple-800">
                  <strong>Edge Rendered</strong>
                  <br />
                  This product was fetched and rendered at the edge (closest to your location).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}