import { ProductCard } from './ProductCard';
import type { Product } from '@/types/product';

interface ProductGridProps {
  products: Product[];
  renderingType?: 'csr' | 'edge';
}

export function ProductGrid({ products, renderingType = 'csr' }: ProductGridProps) {
  const getProductHref = (id: string | number) => {
    switch (renderingType) {
      case 'csr':
        return `/csr/products/${id}`;
      case 'edge':
      default:
        return `/edge/products/${id}`;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} href={getProductHref(product.id)} />
      ))}
    </div>
  );
}
