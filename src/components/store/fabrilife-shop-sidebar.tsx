"use client";

import * as React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Zap,
  Sparkles,
  Flame,
  Truck,
  Award,
  ChevronDown,
  ChevronRight,
  Layers,
} from "lucide-react";

interface SpecialOffer {
  id: string;
  label: string;
  icon: typeof Zap;
  color: string;
}

const SPECIAL_OFFERS: SpecialOffer[] = [
  { id: "mega-deal", label: "Mega Deal", icon: Zap, color: "text-amber-500 fill-amber-500" },
  { id: "new-arrival", label: "New Arrival", icon: Sparkles, color: "text-emerald-500" },
  { id: "top-selling", label: "Top Selling", icon: Flame, color: "text-orange-500 fill-orange-500" },
  { id: "free-delivery", label: "Free Delivery", icon: Truck, color: "text-blue-500" },
  { id: "merchandise", label: "Merchandise", icon: Award, color: "text-purple-500" },
];

interface CategoryItem {
  name: string;
  slug: string;
  count: number;
  subcategories?: {
    name: string;
    slug: string;
    count: number;
    tags?: { name: string; slug: string; count: number }[];
  }[];
}

const CATEGORIES_TREE: CategoryItem[] = [
  {
    name: "Mens",
    slug: "mens",
    count: 1357,
    subcategories: [
      {
        name: "Half Sleeve T-shirt",
        slug: "mens-tshirts",
        count: 368,
        tags: [
          { name: "Blank", slug: "blank", count: 51 },
          { name: "Cut & Stitch", slug: "cut-stitch", count: 53 },
          { name: "Cut & Stitch (Designer Edition)", slug: "cut-stitch-designer", count: 9 },
          { name: "Drop Shoulder T-shirt", slug: "drop-shoulder", count: 31 },
          { name: "Printed", slug: "printed", count: 149 },
          { name: "Raglan", slug: "raglan", count: 14 },
          { name: "Sports", slug: "sports", count: 62 },
        ],
      },
      { name: "Polo Shirts", slug: "mens-polo", count: 142 },
      { name: "Casual Shirts", slug: "mens-shirts", count: 98 },
      { name: "Festive Panjabi", slug: "mens-panjabi", count: 74 },
      { name: "Joggers & Trousers", slug: "mens-joggers", count: 85 },
    ],
  },
  {
    name: "Womens",
    slug: "womens",
    count: 842,
    subcategories: [
      { name: "Kurti & Tops", slug: "womens-kurtis", count: 210 },
      { name: "Salwar Kameez", slug: "womens-salwar-kameez", count: 165 },
      { name: "Pajamas & Pants", slug: "womens-pants", count: 94 },
    ],
  },
  {
    name: "Sports & Activewear",
    slug: "sports-activewear",
    count: 290,
    subcategories: [
      { name: "Football Club Jerseys", slug: "football-jerseys", count: 110 },
      { name: "Active Running Shorts", slug: "active-shorts", count: 65 },
      { name: "Gym Tracksuits", slug: "gym-tracksuits", count: 42 },
    ],
  },
  {
    name: "Kids & Teens",
    slug: "kids-teens",
    count: 420,
    subcategories: [
      { name: "Boys Graphic Tees", slug: "boys-tees", count: 130 },
      { name: "Girls Dress & Kurtis", slug: "girls-dresses", count: 115 },
    ],
  },
];

export function FabrilifeShopSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get("category") || "";
  const currentOffer = searchParams.get("offer") || "";
  const currentTag = searchParams.get("tag") || "";
  const currentGender = searchParams.get("gender") || "";

  const [expandedCats, setExpandedCats] = React.useState<Record<string, boolean>>({
    mens: true,
    womens: false,
    "sports-activewear": false,
  });

  const toggleCategoryExpand = (slug: string) => {
    setExpandedCats((prev) => ({ ...prev, [slug]: !prev[slug] }));
  };

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === null || value === "") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const clearAllCategories = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("category");
    params.delete("tag");
    params.delete("gender");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <aside className="space-y-6">
      {/* 1. Special Offers Section (Red Heading matching Fabrilife) */}
      <div className="bg-card border rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
        <h3 className="text-sm font-black text-red-600 dark:text-red-400 uppercase tracking-wider flex items-center gap-1.5">
          <span>Special Offers</span>
        </h3>

        <div className="space-y-1">
          {SPECIAL_OFFERS.map((offer) => {
            const Icon = offer.icon;
            const isActive = currentOffer === offer.id;
            return (
              <button
                key={offer.id}
                type="button"
                onClick={() => updateParam("offer", isActive ? null : offer.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all text-left ${
                  isActive
                    ? "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-300 ring-1 ring-red-500/30"
                    : "text-foreground/80 hover:text-foreground hover:bg-muted"
                }`}
              >
                <Icon className={`h-4 w-4 ${offer.color}`} />
                <span>{offer.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Categories Hierarchy Tree */}
      <div className="bg-card border rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-[#04aeef]" />
            <h3 className="text-sm font-black text-foreground">Categories</h3>
          </div>
          {(currentCategory || currentTag || currentGender) && (
            <button
              type="button"
              onClick={clearAllCategories}
              className="text-xs font-bold text-red-500 hover:underline"
            >
              Clear
            </button>
          )}
        </div>

        <div className="space-y-2 text-xs">
          {CATEGORIES_TREE.map((cat) => {
            const isExpanded = Boolean(expandedCats[cat.slug]);
            const isSelected = currentCategory === cat.slug;

            return (
              <div key={cat.slug} className="space-y-1">
                <div
                  className={`flex items-center justify-between p-2 rounded-xl transition-all cursor-pointer ${
                    isSelected
                      ? "bg-sky-50 text-sky-800 font-bold dark:bg-sky-950/40 dark:text-sky-300"
                      : "hover:bg-muted text-foreground"
                  }`}
                  onClick={() => toggleCategoryExpand(cat.slug)}
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      updateParam("category", isSelected ? null : cat.slug);
                    }}
                    className="flex-1 text-left font-bold"
                  >
                    {cat.name}
                  </button>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                      {cat.count}
                    </span>
                    {isExpanded ? (
                      <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                    )}
                  </div>
                </div>

                {/* Subcategories */}
                {isExpanded && cat.subcategories && (
                  <div className="pl-3 pr-1 py-1 space-y-1 border-l-2 border-border/80 ml-3">
                    {cat.subcategories.map((sub) => {
                      const isSubSelected = currentCategory === sub.slug;
                      return (
                        <div key={sub.slug} className="space-y-1">
                          <button
                            type="button"
                            onClick={() =>
                              updateParam("category", isSubSelected ? null : sub.slug)
                            }
                            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors ${
                              isSubSelected
                                ? "bg-[#04aeef]/10 text-[#04aeef] font-bold"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                            }`}
                          >
                            <span className="truncate">{sub.name}</span>
                            <span className="text-[10px] opacity-70">({sub.count})</span>
                          </button>

                          {/* Sub tags if present and active */}
                          {sub.tags && (
                            <div className="pl-3 space-y-0.5">
                              {sub.tags.map((tg) => {
                                const isTagActive = currentTag === tg.slug;
                                return (
                                  <button
                                    key={tg.slug}
                                    type="button"
                                    onClick={() =>
                                      updateParam("tag", isTagActive ? null : tg.slug)
                                    }
                                    className={`w-full flex items-center justify-between py-1 px-2 rounded-md text-[11px] ${
                                      isTagActive
                                        ? "text-[#04aeef] font-bold bg-[#04aeef]/10"
                                        : "text-muted-foreground hover:text-foreground"
                                    }`}
                                  >
                                    <span className="truncate">{tg.name}</span>
                                    <span className="text-[9px] opacity-70">{tg.count}</span>
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
