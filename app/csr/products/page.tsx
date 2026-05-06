'use client';

import { useEffect, useState } from 'react';
import { ProductGrid } from '@/components/ProductGrid';
import { ProductSkeletonGrid } from '@/components/ProductSkeleton';
import { PageHeader } from '@/components/PageHeader';
import type { Product } from '@/types/product';
import { filterProducts, paginateProducts, getUniqueCategories, type SortOption } from '@/lib/product-utils';
import { ProductFilters } from '@/components/ProductFilters';

export default function CSRProductsPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchTime, setFetchTime] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState<SortOption>('newest');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const controller = new AbortController();
    const startTime = performance.now();

    fetch('/api/products', { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load the product dataset');
        return res.json();
      })
      .then((data: Product[]) => {
        setAllProducts(data);
        setFetchTime(performance.now() - startTime);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Unable to load product data.');
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  const filtered = filterProducts(allProducts, {
    search,
    category,
    sort,
  });

  const { items: products, pages } = paginateProducts(filtered, page, 12);
  const categories = getUniqueCategories(allProducts);

  const handleSearchChange = (newSearch: string) => {
    setSearch(newSearch);
    setPage(1);
  };

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    setPage(1);
  };

  const handleSortChange = (newSort: SortOption) => {
    setSort(newSort);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <PageHeader
          title="RenderLab CSR Lab"
          description="Client-side rendering benchmark with live browser fetch timing and dynamic dataset delivery."
          badge="CSR"
          badgeColor="bg-yellow-100 text-yellow-800"
        />

        <div className="grid gap-6 mb-10 lg:grid-cols-3">
          <div className="glass rounded-3xl p-6 border border-white/10">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500 mb-3">Captured metric</p>
            <p className="text-xs text-slate-400 mb-2">Browser fetch latency</p>
            <p className="text-4xl font-semibold text-slate-900 mb-3">{fetchTime !== null ? `${fetchTime.toFixed(0)} ms` : 'Measuring...'}</p>
            <p className="text-sm text-slate-500">Measured from the time the browser began the request until the API response returned.</p>
          </div>

          <div className="glass rounded-3xl p-6 border border-white/10">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500 mb-3">Dataset status</p>
            <p className="text-xs text-slate-400 mb-2">Products loaded</p>
            <p className="text-4xl font-semibold text-slate-900 mb-3">{allProducts.length}</p>
            <p className="text-sm text-slate-500">Total products retrieved after hydration.</p>
          </div>

          <div className="glass rounded-3xl p-6 border border-white/10">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500 mb-3">Render mode</p>
            <p className="text-xs text-slate-400 mb-2">Reactive execution</p>
            <p className="text-4xl font-semibold text-slate-900 mb-3">Client</p>
            <p className="text-sm text-slate-500">Data is fetched and rendered after the page hydrates in the browser.</p>
          </div>
        </div>

        {error ? (
          <div className="rounded-3xl bg-red-50 border border-red-200 p-6 text-red-700 mb-8">
            <p className="font-semibold">Data load error</p>
            <p>{error}</p>
          </div>
        ) : null}

        {loading ? (
          <ProductSkeletonGrid />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
            <aside>
              <ProductFilters
                categories={categories}
                onSearchChange={handleSearchChange}
                onCategoryChange={handleCategoryChange}
                onSortChange={handleSortChange}
                currentSearch={search}
                currentCategory={category}
                currentSort={sort}
              />
            </aside>

            <section>
              <div className="mb-4 text-gray-600">
                Showing {products.length} of {filtered.length} products {filtered.length !== allProducts.length && `(${allProducts.length} total)`}
              </div>

              <ProductGrid products={products} renderingType="csr" />

              {pages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  {page > 1 && (
                    <button
                      onClick={() => setPage(page - 1)}
                      className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800"
                    >
                      Previous
                    </button>
                  )}
                  <div className="text-gray-600">Page {page} of {pages}</div>
                  {page < pages && (
                    <button
                      onClick={() => setPage(page + 1)}
                      className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800"
                    >
                      Next
                    </button>
                  )}
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
