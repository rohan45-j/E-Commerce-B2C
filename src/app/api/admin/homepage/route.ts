import { NextResponse } from "next/server";
import { MarketingService } from "@/server/services/marketing.service";

export async function GET() {
  try {
    const sections = await MarketingService.getHomepageSections();
    return NextResponse.json({ success: true, data: sections });
  } catch {
    return NextResponse.json({ success: false, data: [] }, { status: 500 });
  }
}
