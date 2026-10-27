import { NextResponse } from "next/server";
import { CatalogService } from "@/server/services/catalog.service";

export async function GET() {
  try {
    const reviews = await CatalogService.getReviews();
    return NextResponse.json({ success: true, data: reviews });
  } catch {
    return NextResponse.json({ success: false, data: [] }, { status: 500 });
  }
}
