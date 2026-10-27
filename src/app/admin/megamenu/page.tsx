import { Metadata } from "next";
import { MarketingService } from "@/server/services/marketing.service";
import { parseMegaMenuData } from "@/lib/megamenu-config";
import { MegaMenuBuilder } from "@/components/admin/mega-menu-builder";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Mega Menu CMS | Admin Dashboard",
  description: "Configure dynamic navigation menu tabs, columns, sub-links, and new arrival showcase cards.",
};

export default async function AdminMegaMenuPage() {
  let megaMenuData = [];
  try {
    const settings = await MarketingService.getSiteSettings();
    megaMenuData = parseMegaMenuData(settings["site_mega_menu"]);
  } catch {
    megaMenuData = parseMegaMenuData(null);
  }

  return (
    <div className="space-y-6">
      <MegaMenuBuilder initialData={megaMenuData} />
    </div>
  );
}
