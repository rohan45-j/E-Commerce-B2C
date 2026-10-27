import * as React from "react";
import { StoreHeader } from "@/components/store/store-header";
import { StoreFooter } from "@/components/store/store-footer";
import { MiniCartDrawer } from "@/components/store/mini-cart-drawer";
import { MobileBottomNav } from "@/components/store/mobile-bottom-nav";
import { prisma } from "@/lib/prisma";
import { MarketingService } from "@/server/services/marketing.service";

import { parseMegaMenuData } from "@/lib/megamenu-config";

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let categories: { id: string; name: string; slug: string }[] = [];
  let siteLogo = "";
  let siteName = "KinaKati";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let megaMenuData: any = undefined;

  try {
    const [dbCategories, settings] = await Promise.all([
      prisma.category.findMany({
        where: { isActive: true, parentId: null },
        select: { id: true, name: true, slug: true },
        orderBy: { displayOrder: "asc" },
        take: 8,
      }),
      MarketingService.getSiteSettings(),
    ]);
    categories = dbCategories;
    siteLogo = settings["site_logo"] || "";
    siteName = settings["site_name"] || "KinaKati";
    megaMenuData = parseMegaMenuData(settings["site_mega_menu"]);
  } catch {
    // Fallback when DB is not ready during builds
    categories = [
      { id: "1", name: "Men", slug: "mens-fashion" },
      { id: "2", name: "Women", slug: "womens-fashion" },
      { id: "3", name: "Teens", slug: "teens-fashion" },
      { id: "4", name: "Kids", slug: "kids-fashion" },
      { id: "5", name: "Sports", slug: "sports-activewear" },
    ];
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground pb-16 md:pb-0">
      <StoreHeader
        categories={categories}
        siteLogo={siteLogo}
        siteName={siteName}
        megaMenuData={megaMenuData}
      />
      <MiniCartDrawer />
      <main className="flex-1">{children}</main>
      <StoreFooter siteLogo={siteLogo} siteName={siteName} />
      <MobileBottomNav />
    </div>
  );
}
