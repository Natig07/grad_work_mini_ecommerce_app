import { ProductGrid } from '@/components/ProductGrid';
import { PageHeader } from '@/components/PageHeader';
import type { Product } from '@/types/product';
import { filterProducts, paginateProducts, getUniqueCategories, type SortOption } from '@/lib/product-utils';
import Link from 'next/link';
import { ProductFiltersServer } from '@/components/ProductFiltersServer';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

async function getProducts(): Promise<Product[]> {
  console.log('[SSR] Server fetch started at:', new Date().toISOString());
  const startTime = Date.now();

  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/products`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch products');
  }

  const data = await res.json();
  const endTime = Date.now();
  console.log(`[SSR] Server fetch completed in ${endTime - startTime}ms`);

  return data;
}

export default async function SSRProductsPage({ searchParams }: PageProps) {
  const allProducts = await getProducts();

  const search = typeof searchParams.search === 'string' ? searchParams.search : '';
  const category = typeof searchParams.category === 'string' ? searchParams.category : '';
  const sort = (typeof searchParams.sort === 'string' ? searchParams.sort : 'newest') as SortOption;
  const currentPage = parseInt(typeof searchParams.page === 'string' ? searchParams.page : '1', 10);

  const filtered = filterProducts(allProducts, {
    search,
    category,
    sort,
  });

  const { items: products, pages } = paginateProducts(filtered, currentPage, 12);
  const categories = getUniqueCategories(allProducts);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <PageHeader
          title="Product Catalog - SSR"
          description="Server-Side Rendering - Data fetched on server before sending HTML"
          badge="SSR"
          badgeColor="bg-green-100 text-green-800"
        />

        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            <strong>Rendered on:</strong> Server (Node.js Runtime) at {new Date().toLocaleTimeString()}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-1">
            <ProductFiltersServer categories={categories} />
          </div>

          <div className="lg:col-span-3">
            <div className="mb-4 text-gray-600">
              Showing {products.length} of {filtered.length} products {filtered.length !== allProducts.length && `(${allProducts.length} total)`}
            </div>

            <ProductGrid products={products} renderingType="ssr" />

            {pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                {currentPage > 1 && (
                  <Link
                    href={`/ssr/products?search=${search}&category=${category}&sort=${sort}&page=${currentPage - 1}`}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Previous
                  </Link>
                )}
                <div className="text-gray-600">
                  Page {currentPage} of {pages}
                </div>
                {currentPage < pages && (
                  <Link
                    href={`/ssr/products?search=${search}&category=${category}&sort=${sort}&page=${currentPage + 1}`}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Next
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
