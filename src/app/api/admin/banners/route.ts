import { NextResponse } from "next/server";
import { MarketingService } from "@/server/services/marketing.service";

export async function GET() {
  try {
    const banners = await MarketingService.getBanners();
    return NextResponse.json({ success: true, data: banners });
  } catch {
    return NextResponse.json({ success: false, data: [] }, { status: 500 });
  }
}
