import { NextResponse } from "next/server";
import { MarketingService } from "@/server/services/marketing.service";

export async function GET() {
  try {
    const coupons = await MarketingService.getCoupons();
    return NextResponse.json({ success: true, data: coupons });
  } catch {
    return NextResponse.json({ success: false, data: [] }, { status: 500 });
  }
}
