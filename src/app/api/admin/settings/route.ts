import { NextResponse } from "next/server";
import { MarketingService } from "@/server/services/marketing.service";

export async function GET() {
  try {
    const settings = await MarketingService.getSiteSettings();
    return NextResponse.json({ success: true, data: settings });
  } catch {
    return NextResponse.json({ success: false, data: {} }, { status: 500 });
  }
}
