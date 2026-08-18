import { NextRequest, NextResponse } from "next/server";
import { listStorefrontProducts } from "@/lib/data";

export async function GET(request: NextRequest) {
  const search = request.nextUrl.searchParams.get("search") || undefined;
  const category = request.nextUrl.searchParams.get("category") || undefined;
  const products = await listStorefrontProducts({ search, category });
  return NextResponse.json({ products: products.slice(0, 12) });
}
