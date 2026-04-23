'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ProductFilters } from './ProductFilters';
import type { SortOption } from '@/lib/product-utils';

interface ProductFiltersServerProps {
  categories: string[];
}

export function ProductFiltersServer({ categories }: ProductFiltersServerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get('search') || '';
  const currentCategory = searchParams.get('category') || '';
  const currentSort = (searchParams.get('sort') || 'newest') as SortOption;

  const handleSearchChange = (search: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (search) {
      params.set('search', search);
    } else {
      params.delete('search');
    }
    params.set('page', '1');
    router.push(`?${params.toString()}`);
  };

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (category) {
      params.set('category', category);
    } else {
      params.delete('category');
    }
    params.set('page', '1');
    router.push(`?${params.toString()}`);
  };

  const handleSortChange = (sort: SortOption) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', sort);
    params.set('page', '1');
    router.push(`?${params.toString()}`);
  };

  return (
    <ProductFilters
      categories={categories}
      onSearchChange={handleSearchChange}
      onCategoryChange={handleCategoryChange}
      onSortChange={handleSortChange}
      currentSearch={currentSearch}
      currentCategory={currentCategory}
      currentSort={currentSort}
    />
  );
}
