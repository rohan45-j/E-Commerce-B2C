import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { MarketingService } from "@/server/services/marketing.service";
import { DEFAULT_MEGA_MENU_DATA, parseMegaMenuData } from "@/lib/megamenu-config";

export async function GET() {
  try {
    const settings = await MarketingService.getSiteSettings();
    const data = parseMegaMenuData(settings["site_mega_menu"]);
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ success: true, data: DEFAULT_MEGA_MENU_DATA });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    const userRole = (session?.user as { role?: string })?.role;
    if (!session || (userRole !== "ADMIN" && userRole !== "STAFF")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    if (!Array.isArray(body)) {
      return NextResponse.json({ error: "Invalid data format. Expected an array of menu items." }, { status: 400 });
    }

    await MarketingService.updateSiteSettings({
      site_mega_menu: JSON.stringify(body),
    });

    return NextResponse.json({ success: true, message: "Mega menu saved successfully!" });
  } catch (error) {
    console.error("Mega menu update error:", error);
    return NextResponse.json({ error: "Failed to update mega menu" }, { status: 500 });
  }
}
