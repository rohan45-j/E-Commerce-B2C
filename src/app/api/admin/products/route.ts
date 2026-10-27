import { NextResponse } from "next/server";
import { CatalogService } from "@/server/services/catalog.service";

export async function GET() {
  try {
    const products = await CatalogService.getProducts();
    return NextResponse.json({ success: true, data: products });
  } catch {
    return NextResponse.json({ success: false, data: [] }, { status: 500 });
  }
}
