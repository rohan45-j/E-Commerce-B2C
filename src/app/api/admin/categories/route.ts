import { NextResponse } from "next/server";
import { CatalogService } from "@/server/services/catalog.service";

export async function GET() {
  try {
    const categories = await CatalogService.getCategories();
    return NextResponse.json({ success: true, data: categories });
  } catch {
    return NextResponse.json({ success: false, data: [] }, { status: 500 });
  }
}
