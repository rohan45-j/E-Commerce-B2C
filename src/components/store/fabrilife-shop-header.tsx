"use client";

import * as React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Search,
  X,
  ShoppingBag,
  Shirt,
} from "lucide-react";
import { useCartStore } from "@/lib/cart-store";

interface GenderPill {
  id: string;
  label: string;
  icon: string;
  colorClass: string;
  activeClass: string;
}

const GENDER_PILLS: GenderPill[] = [
  {
    id: "men",
    label: "Men",
    icon: "👤",
    colorClass: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800",
    activeClass: "bg-[#04aeef] text-white border-[#04aeef] shadow-md shadow-[#04aeef]/25 hover:bg-[#0398d2]",
  },
  {
    id: "women",
    label: "Women",
    icon: "👩",
    colorClass: "bg-[#fdf2f4] text-[#e91e63] border-[#fbcfe8] hover:bg-[#fce7ed] dark:bg-pink-950/40 dark:text-pink-300 dark:border-pink-800",
    activeClass: "bg-[#e91e63] text-white border-[#e91e63] shadow-md shadow-[#e91e63]/25 hover:bg-[#d81b60]",
  },
  {
    id: "kids",
    label: "Kids",
    icon: "🧒",
    colorClass: "bg-[#f0fdf4] text-[#16a34a] border-[#bbf7d0] hover:bg-[#dcfce7] dark:bg-green-950/40 dark:text-green-300 dark:border-green-800",
    activeClass: "bg-[#16a34a] text-white border-[#16a34a] shadow-md shadow-[#16a34a]/25 hover:bg-[#15803d]",
  },
  {
    id: "teens",
    label: "Teens",
    icon: "👤",
    colorClass: "bg-[#faf5ff] text-[#9333ea] border-[#e9d5ff] hover:bg-[#f3e8ff] dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800",
    activeClass: "bg-[#9333ea] text-white border-[#9333ea] shadow-md shadow-[#9333ea]/25 hover:bg-[#7e22ce]",
  },
];

interface TagPill {
  id: string;
  label: string;
  count: number;
}

const SUB_TAG_PILLS: TagPill[] = [
  { id: "blank", label: "Blank", count: 51 },
  { id: "cut-stitch", label: "Cut & Stitch", count: 53 },
  { id: "cut-stitch-designer", label: "Cut & Stitch (Designer Edition)", count: 9 },
  { id: "drop-shoulder", label: "Drop Shoulder T-shirt", count: 31 },
  { id: "printed", label: "Printed", count: 149 },
  { id: "raglan", label: "Raglan", count: 14 },
  { id: "sports", label: "Sports", count: 62 },
  { id: "polo", label: "Polo Shirts", count: 85 },
  { id: "linen", label: "Linen Shirts", count: 24 },
];

export function FabrilifeShopHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { openCart, getTotalItems } = useCartStore();

  const currentSearch = searchParams.get("q") || "";
  const currentGender = searchParams.get("gender") || "men"; // Defaults to 'men' like Fabrilife
  const currentTag = searchParams.get("tag") || "";
  const currentCategory = searchParams.get("category") || "";
  const currentOffer = searchParams.get("offer") || "";

  const [searchInput, setSearchInput] = React.useState(currentSearch);

  // Sync state with url params
  React.useEffect(() => {
    setSearchInput(currentSearch);
  }, [currentSearch]);

  const updateFilters = (newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ q: searchInput.trim() || null });
  };

  const handleGenderToggle = (genderId: string) => {
    if (currentGender === genderId) {
      updateFilters({ gender: null });
    } else {
      updateFilters({ gender: genderId });
    }
  };

  const handleTagToggle = (tagId: string) => {
    if (currentTag === tagId) {
      updateFilters({ tag: null });
    } else {
      updateFilters({ tag: tagId });
    }
  };

  const handleClearAll = () => {
    setSearchInput("");
    router.push(pathname, { scroll: false });
  };

  // Compute active chips
  const activeChips: { id: string; label: string; onRemove: () => void }[] = [];

  if (currentGender) {
    const genderItem = GENDER_PILLS.find((g) => g.id === currentGender);
    if (genderItem) {
      activeChips.push({
        id: `gender-${currentGender}`,
        label: `${genderItem.label}`,
        onRemove: () => updateFilters({ gender: null }),
      });
    }
  }

  if (currentCategory) {
    activeChips.push({
      id: `cat-${currentCategory}`,
      label: `Category: ${currentCategory.replace(/-/g, " ")}`,
      onRemove: () => updateFilters({ category: null }),
    });
  }

  if (currentTag) {
    const tagItem = SUB_TAG_PILLS.find((t) => t.id === currentTag);
    activeChips.push({
      id: `tag-${currentTag}`,
      label: tagItem ? tagItem.label : currentTag,
      onRemove: () => updateFilters({ tag: null }),
    });
  }

  if (currentOffer) {
    activeChips.push({
      id: `offer-${currentOffer}`,
      label: `Offer: ${currentOffer.replace(/-/g, " ")}`,
      onRemove: () => updateFilters({ offer: null }),
    });
  }

  if (currentSearch) {
    activeChips.push({
      id: `search-${currentSearch}`,
      label: `"${currentSearch}"`,
      onRemove: () => {
        setSearchInput("");
        updateFilters({ q: null });
      },
    });
  }

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const hasAnyFilters = activeChips.length > 0;
  const cartCount = mounted ? getTotalItems() : 0;

  return (
    <div className="relative bg-card border rounded-2xl p-4 sm:p-5 shadow-sm space-y-4 mb-8">
      {/* 1. Large Search Bar */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-4 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search a product (e.g. Polo, Drop Shoulder, Kurti...)"
            className="w-full h-12 pl-11 pr-24 rounded-xl border border-border/80 bg-background/50 hover:bg-background focus:bg-background focus:outline-none focus:ring-2 focus:ring-[#04aeef]/30 focus:border-[#04aeef] text-sm text-foreground placeholder:text-muted-foreground transition-all shadow-inner"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => {
                setSearchInput("");
                updateFilters({ q: null });
              }}
              className="absolute right-14 text-muted-foreground hover:text-foreground p-1"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            type="submit"
            className="absolute right-2 px-3 py-1.5 rounded-lg bg-[#04aeef] hover:bg-[#0398d2] text-white text-xs font-bold transition-all shadow-sm"
          >
            Search
          </button>
        </div>
      </form>

      {/* 2. Gender / Department Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        {GENDER_PILLS.map((pill) => {
          const isActive = currentGender === pill.id;
          return (
            <button
              key={pill.id}
              type="button"
              onClick={() => handleGenderToggle(pill.id)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-black border transition-all ${
                isActive ? pill.activeClass : pill.colorClass
              }`}
            >
              <span>{pill.icon}</span>
              <span>{pill.label}</span>
            </button>
          );
        })}
      </div>

      <div className="border-t border-border/60" />

      {/* 3. Subcategory / Tag Pills Strip (Scrollable) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {/* Leading Category Indicator Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 text-xs font-bold whitespace-nowrap flex-shrink-0 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800">
          <Shirt className="h-3.5 w-3.5 text-sky-600" />
          <span>Half Sleeve T-shirt:</span>
        </div>

        {SUB_TAG_PILLS.map((tag) => {
          const isActive = currentTag === tag.id;
          return (
            <button
              key={tag.id}
              type="button"
              onClick={() => handleTagToggle(tag.id)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all whitespace-nowrap flex-shrink-0 ${
                isActive
                  ? "bg-[#04aeef] text-white border-[#04aeef] font-bold shadow-sm shadow-[#04aeef]/25"
                  : "bg-muted/40 hover:bg-muted text-foreground border-border/80"
              }`}
            >
              <span>{tag.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive ? "bg-white/20 text-white font-bold" : "text-muted-foreground bg-muted"
                }`}
              >
                {tag.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 4. Active Applied Filter Chips (Breadcrumb chips) */}
      {hasAnyFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-dashed border-border/70 text-xs">
          <span className="text-muted-foreground font-semibold">Active Filters:</span>
          {activeChips.map((chip) => (
            <span
              key={chip.id}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-muted text-foreground border border-border text-xs font-semibold shadow-xs"
            >
              <span>{chip.label}</span>
              <button
                type="button"
                onClick={chip.onRemove}
                className="hover:text-red-500 hover:bg-red-50 rounded-sm p-0.5 transition-colors"
                aria-label={`Remove filter ${chip.label}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}

          <button
            type="button"
            onClick={handleClearAll}
            className="text-xs font-bold text-[#04aeef] hover:underline ml-2"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Floating Side Bag Button (Fabrilife Quick Bag Trigger) */}
      <button
        type="button"
        onClick={openCart}
        aria-label="Open Shopping Bag"
        className="absolute -right-3 top-1/2 -translate-y-1/2 hidden md:flex items-center justify-center h-12 w-12 rounded-xl bg-[#04aeef] hover:bg-[#0398d2] text-white shadow-xl shadow-[#04aeef]/30 hover:scale-105 transition-all z-10"
        title="View Shopping Bag"
      >
        <ShoppingBag className="h-5 w-5" />
        <span
          className={`absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-red-600 text-white text-[10px] font-black flex items-center justify-center shadow-md transition-all ${
            cartCount > 0
              ? "opacity-100 scale-100"
              : "opacity-0 scale-0 pointer-events-none"
          }`}
        >
          {cartCount}
        </span>
      </button>
    </div>
  );
}
