import { NextResponse } from "next/server";
import type { Product } from "@/types/product";

let cachedProducts: Product[] | null = null;

async function fetchExternalProducts(): Promise<Product[]> {
  try {
    const res = await fetch(
      "https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/products.json",
      { next: { revalidate: 3600 } },
    );

    if (!res.ok) throw new Error("Failed to fetch external products");

    const externalProducts = await res.json();
    const normalized = externalProducts.slice(0, 50).map((product: any) => ({
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
    return normalized;
  } catch (error) {
    console.error("Error fetching external products:", error);
    return [];
  }
}

export async function GET() {
  const startTime = Date.now();
  console.log("[API] Product fetch started at:", new Date().toISOString());

  // const delay = Math.floor(Math.random() * 300) + 500;
  await new Promise((resolve) => setTimeout(resolve, 100));

  if (!cachedProducts) {
    const externalProducts = await fetchExternalProducts();
    if (externalProducts.length > 0) {
      cachedProducts = externalProducts;
    }
  }

  const products = cachedProducts || [];

  const endTime = Date.now();
  console.log(`[API] Product fetch completed in ${endTime - startTime}ms`);

  return NextResponse.json(products);
}
