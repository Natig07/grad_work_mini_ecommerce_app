export interface Product {
  id: string | number;
  name?: string;
  title?: string;
  description: string;
  priceCents: number;
  price?: number;
  image: string;
  category: string;
  subCategory?: string;
  keywords?: string[];
  rating?: {
    stars: number;
    count: number;
  };
  discount?: number;
  discountedPrice?: number;
}

export type ProductId = string | number;
