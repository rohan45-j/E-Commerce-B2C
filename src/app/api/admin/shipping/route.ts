import { NextResponse } from "next/server";
import { MarketingService } from "@/server/services/marketing.service";

export async function GET() {
  try {
    const zones = await MarketingService.getShippingZones();
    return NextResponse.json({ success: true, data: zones });
  } catch {
    return NextResponse.json({ success: false, data: [] }, { status: 500 });
  }
}
