import { NextResponse } from "next/server";
import { MarketingService } from "@/server/services/marketing.service";

export async function GET() {
  try {
    const pages = await MarketingService.getPages();
    return NextResponse.json({ success: true, data: pages });
  } catch {
    return NextResponse.json({ success: false, data: [] }, { status: 500 });
  }
}
