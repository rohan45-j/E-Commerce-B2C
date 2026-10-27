import { NextResponse } from "next/server";
import { CatalogService } from "@/server/services/catalog.service";

export async function GET() {
  try {
    const brands = await CatalogService.getBrands();
    return NextResponse.json({ success: true, data: brands });
  } catch {
    return NextResponse.json({ success: false, data: [] }, { status: 500 });
  }
}
