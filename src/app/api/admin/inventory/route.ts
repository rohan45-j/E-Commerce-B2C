import { NextRequest, NextResponse } from "next/server";
import { CatalogService } from "@/server/services/catalog.service";

export async function GET(req: NextRequest) {
  try {
    const lowStock = req.nextUrl.searchParams.get("lowStock") === "true";
    const inventory = await CatalogService.getInventory(lowStock);
    return NextResponse.json({ success: true, data: inventory });
  } catch {
    return NextResponse.json({ success: false, data: [] }, { status: 500 });
  }
}
