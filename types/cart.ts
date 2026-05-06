export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  productPriceCents: number;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  totalCents: number;
  itemCount: number;
}
