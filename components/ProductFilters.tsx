'use client';

import { Search, X } from 'lucide-react';
import { useState } from 'react';
import type { SortOption } from '@/lib/product-utils';

interface ProductFiltersProps {
  categories: string[];
  onSearchChange: (search: string) => void;
  onCategoryChange: (category: string) => void;
  onSortChange: (sort: SortOption) => void;
  currentSearch?: string;
  currentCategory?: string;
  currentSort?: SortOption;
}

export function ProductFilters({
  categories,
  onSearchChange,
  onCategoryChange,
  onSortChange,
  currentSearch = '',
  currentCategory = '',
  currentSort = 'newest',
}: ProductFiltersProps) {
  const [search, setSearch] = useState(currentSearch);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    onSearchChange(value);
  };

  const handleClearSearch = () => {
    setSearch('');
    onSearchChange('');
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">
          Search
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-10 py-2 border text-black border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {search && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">
          Category
        </label>
        <select
          value={currentCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full px-3 text-gray-700 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">
          Sort By
        </label>
        <select
          value={currentSort}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="w-full px-3 py-2 border text-gray-700 border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
        </select>
      </div>
    </div>
  );
}
