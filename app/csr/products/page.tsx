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
  const [fetchTime, setFetchTime] = useState<number>(0);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState<SortOption>('newest');
  const [page, setPage] = useState(1);

  useEffect(() => {
    console.log('[CSR] Component mounted, starting fetch at:', new Date().toISOString());
    const startTime = performance.now();

    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        const endTime = performance.now();
        const duration = endTime - startTime;
        setFetchTime(duration);
        console.log(`[CSR] Data fetched in ${duration.toFixed(2)}ms`);
        setAllProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('[CSR] Fetch error:', error);
        setLoading(false);
      });
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
      <div className="max-w-7xl mx-auto px-4 py-8">
        <PageHeader
          title="Product Catalog - CSR"
          description="Client-Side Rendering - Data fetched in browser using useEffect"
          badge="CSR"
          badgeColor="bg-yellow-100 text-yellow-800"
        />

        {fetchTime > 0 && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Fetch Time:</strong> {fetchTime.toFixed(2)}ms
            </p>
          </div>
        )}

        {loading ? (
          <ProductSkeletonGrid />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <ProductFilters
                categories={categories}
                onSearchChange={handleSearchChange}
                onCategoryChange={handleCategoryChange}
                onSortChange={handleSortChange}
                currentSearch={search}
                currentCategory={category}
                currentSort={sort}
              />
            </div>

            <div className="lg:col-span-3">
              <div className="mb-4 text-gray-600">
                Showing {products.length} of {filtered.length} products {filtered.length !== allProducts.length && `(${allProducts.length} total)`}
              </div>

              <ProductGrid products={products} renderingType="csr" />

              {pages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  {page > 1 && (
                    <button
                      onClick={() => setPage(page - 1)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Previous
                    </button>
                  )}
                  <div className="text-gray-600">
                    Page {page} of {pages}
                  </div>
                  {page < pages && (
                    <button
                      onClick={() => setPage(page + 1)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Next
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
