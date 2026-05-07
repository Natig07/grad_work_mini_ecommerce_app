import { NextResponse } from "next/server";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET() {
  const startTime = performance.now();

  const res = await fetch("https://dummyjson.com/products?limit=50", {
    cache: "no-store",
  });

  const ttfb = performance.now() - startTime;

  if (!res.ok) {
    return NextResponse.json(
      { ttfb: null, productCount: 0, error: "Unable to fetch products" },
      { status: 502 },
    );
  }

  const json = await res.json();
  const totalDuration = performance.now() - startTime;

  return NextResponse.json({
    ttfb: Math.round(ttfb),
    totalDuration: Math.round(totalDuration),
    productCount: Array.isArray(json.products) ? json.products.length : 0,
    generatedAt: new Date().toISOString(),
  });
}
