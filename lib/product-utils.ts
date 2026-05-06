import type { Product } from '@/types/product';

export type SortOption = 'rating' | 'price-asc' | 'price-desc' | 'newest';

export interface FilterOptions {
  search?: string;
  category?: string;
  sort?: SortOption;
  page?: number;
  pageSize?: number;
}

export function filterProducts(
  products: Product[],
  options: FilterOptions
): Product[] {
  let filtered = [...products];

  if (options.search) {
    const searchLower = options.search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        (p.title || p.name || '').toLowerCase().includes(searchLower) ||
        (p.description || '').toLowerCase().includes(searchLower)
    );
  }

  if (options.category) {
    filtered = filtered.filter((p) => p.category === options.category);
  }

  if (options.sort) {
    filtered = filtered.sort((a, b) => {
      switch (options.sort) {
        case 'price-asc':
          return a.priceCents - b.priceCents;
        case 'price-desc':
          return b.priceCents - a.priceCents;
        case 'rating':
          return (b.rating?.stars || 0) - (a.rating?.stars || 0);
        case 'newest':
        default:
          return 0;
      }
    });
  }

  return filtered;
}

export function paginateProducts(
  products: Product[],
  page: number = 1,
  pageSize: number = 12
): { items: Product[]; total: number; pages: number } {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return {
    items: products.slice(start, end),
    total: products.length,
    pages: Math.ceil(products.length / pageSize),
  };
}

export function getUniqueCategories(products: Product[]): string[] {
  const categories = new Set(products.map((p) => p.category));
  return Array.from(categories).sort();
}
