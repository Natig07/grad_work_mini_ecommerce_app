import { NextResponse } from "next/server";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const startTime = Date.now();
  const url = new URL(request.url);
  const productUrl = new URL("/api/products", url.origin);

  const res = await fetch(productUrl.toString(), {
    cache: "no-store",
  });

  if (!res.ok) {
    return NextResponse.json(
      { ttfb: null, productCount: 0, error: "Unable to fetch products" },
      { status: 502 },
    );
  }

  const products = await res.json();
  const ttfb = Date.now() - startTime;

  return NextResponse.json({
    ttfb,
    productCount: Array.isArray(products) ? products.length : 0,
    generatedAt: new Date().toISOString(),
  });
}
