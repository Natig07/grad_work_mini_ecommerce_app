import { ProductGrid } from '@/components/ProductGrid';
import { PageHeader } from '@/components/PageHeader';
import type { Product } from '@/types/product';
import { filterProducts, paginateProducts, getUniqueCategories, type SortOption } from '@/lib/product-utils';
import { ProductFiltersServer } from '@/components/ProductFiltersServer';
import Link from 'next/link';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

async function getProducts(): Promise<{ products: Product[]; fetchDuration: number }> {
  const startTime = performance.now();

  const res = await fetch(
    'https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/products.json',
    { cache: 'no-store' }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch products');
  }

  const externalProducts = await res.json();
  const products: Product[] = externalProducts.slice(0, 50).map((product: any) => ({
    id: product.id,
    name: product.name,
    title: product.name,
    description: product.description,
    priceCents: product.priceCents,
    image: product.image,
    category: product.category,
    subCategory: product.subCategory,
    keywords: product.keywords,
    rating: product.rating,
  }));

  const fetchDuration = performance.now() - startTime;

  return { products, fetchDuration };
}

export default async function EdgeProductsPage({ searchParams }: PageProps) {
  const { products: allProducts, fetchDuration } = await getProducts();

  const search = typeof searchParams.search === 'string' ? searchParams.search : '';
  const category = typeof searchParams.category === 'string' ? searchParams.category : '';
  const sort = (typeof searchParams.sort === 'string' ? searchParams.sort : 'newest') as SortOption;
  const currentPage = parseInt(typeof searchParams.page === 'string' ? searchParams.page : '1', 10);
  const renderTime = new Date().toLocaleTimeString();

  const filtered = filterProducts(allProducts, {
    search,
    category,
    sort,
  });

  const { items: products, pages } = paginateProducts(filtered, currentPage, 12);
  const categories = getUniqueCategories(allProducts);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <PageHeader
          title="RenderLab Edge Lab"
          description="Edge runtime benchmark with live fetch timing from the closest network edge."
          badge="EDGE"
          badgeColor="bg-blue-100 text-blue-800"
        />

        <div className="grid gap-6 mb-10 lg:grid-cols-3">
          <div className="glass rounded-3xl p-6 border border-white/10">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500 mb-3">Edge latency</p>
            <p className="text-xs text-slate-400 mb-2">API response time</p>
            <p className="text-4xl font-semibold text-slate-900 mb-3">{fetchDuration.toFixed(0)} ms</p>
            <p className="text-sm text-slate-500">Measured in the edge runtime during the product dataset fetch.</p>
          </div>

          <div className="glass rounded-3xl p-6 border border-white/10">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500 mb-3">Response snapshot</p>
            <p className="text-4xl font-semibold text-slate-900 mb-3">{renderTime}</p>
            <p className="text-sm text-slate-500">Edge render timestamp captured during server generation.</p>
          </div>

          <div className="glass rounded-3xl p-6 border border-white/10">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500 mb-3">Dataset size</p>
            <p className="text-4xl font-semibold text-slate-900 mb-3">{allProducts.length}</p>
            <p className="text-sm text-slate-500">Total products delivered from the edge-rendered response.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          <aside>
            <ProductFiltersServer categories={categories} />
          </aside>

          <main>
            <div className="mb-4 text-gray-600">
              Showing {products.length} of {filtered.length} products {filtered.length !== allProducts.length && `(${allProducts.length} total)`}
            </div>

            <ProductGrid products={products} renderingType="edge" />

            {pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                {currentPage > 1 && (
                  <Link
                    href={`/edge/products?search=${encodeURIComponent(search)}&category=${encodeURIComponent(category)}&sort=${encodeURIComponent(sort)}&page=${currentPage - 1}`}
                    className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800"
                  >
                    Previous
                  </Link>
                )}
                <div className="text-gray-600">Page {currentPage} of {pages}</div>
                {currentPage < pages && (
                  <Link
                    href={`/edge/products?search=${encodeURIComponent(search)}&category=${encodeURIComponent(category)}&sort=${encodeURIComponent(sort)}&page=${currentPage + 1}`}
                    className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800"
                  >
                    Next
                  </Link>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}